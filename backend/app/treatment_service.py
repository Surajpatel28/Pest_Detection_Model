from __future__ import annotations

import json
import logging
import re
import uuid
from dataclasses import dataclass, field
from typing import Any
from urllib import error, request

from groq import APIConnectionError, APIStatusError, APITimeoutError, RateLimitError
from langchain_core.messages import AIMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq

from app.config import Settings
from app.schemas import ChatMessage
from app.treatments import get_treatment_for_pest

logger = logging.getLogger("uvicorn.error")

SCOPE_HINT = (
    "I can help only with pest/treatment questions for this case. "
    "Please ask about affected crops, treatment steps, safety, monitoring, timing, application, or prevention."
)

WEB_REQUIRED_TERMS = {
    "eco",
    "environment",
    "organic",
    "pesticide",
    "chemical",
    "approved",
    "regulation",
    "safe",
    "toxicity",
    "residue",
    "latest",
    "recent",
    "recommendation",
    "dose",
    "dosage",
    "spray",
}


@dataclass
class _Turn:
    role: str
    content: str


@dataclass
class _ChatSession:
    pest: str
    confidence: float
    summary: str = ""
    turns: list[_Turn] = field(default_factory=list)


class TreatmentService:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._enabled = bool(settings.llm_api_key)
        self._sessions: dict[str, _ChatSession] = {}
        self._llm = self._build_llm() if self._enabled else None

    @property
    def provider_name(self) -> str:
        if self._enabled:
            return f"llm:{self._settings.llm_model}"
        return "static-fallback"

    def generate_treatment(self, pest: str, confidence: float) -> tuple[str, str]:
        if not self._enabled:
            if self._settings.llm_required:
                raise RuntimeError("LLM_API_KEY is required but missing.")
            markdown = self._fallback_markdown(pest)
            session_id = self._create_session(pest, confidence, markdown)
            return markdown, session_id

        query = f"Eco-friendly treatment plan and low-toxicity pesticide options for {pest}"
        web_context = self._maybe_fetch_web_context(query)

        try:
            markdown = self._invoke_treatment_llm(pest, confidence, web_context)
            if not markdown.strip():
                raise ValueError("LLM returned empty markdown.")
            logger.info("LLM treatment generated for pest=%s", pest)
            session_id = self._create_session(pest, confidence, markdown)
            return markdown, session_id
        except (APIConnectionError, APIStatusError, APITimeoutError, RateLimitError, TimeoutError, ValueError) as exc:
            if self._settings.llm_required:
                raise RuntimeError(f"LLM treatment generation failed: {exc}") from exc
            logger.warning("LLM failed; using fallback for pest=%s reason=%s", pest, exc)
            markdown = self._fallback_markdown(pest)
            session_id = self._create_session(pest, confidence, markdown)
            return markdown, session_id

    def chat(self, session_id: str, user_message: str) -> tuple[str, list[ChatMessage]]:
        session = self._sessions.get(session_id)
        if session is None:
            raise RuntimeError("Invalid chat session. Regenerate treatment and try again.")

        message = user_message.strip()
        if not message:
            raise RuntimeError("Message cannot be empty.")

        if not self._is_in_scope(message, session.pest):
            self._append_turn(session, "user", message)
            self._append_turn(session, "assistant", SCOPE_HINT)
            return SCOPE_HINT, self._format_messages(session)

        if not self._enabled:
            reply = (
                "Live chat is unavailable because LLM is disabled. "
                "Please enable GROQ_API_KEY to continue treatment discussion."
            )
            self._append_turn(session, "user", message)
            self._append_turn(session, "assistant", reply)
            return reply, self._format_messages(session)

        web_query = f"{session.pest} {message}"
        web_context = self._maybe_fetch_web_context(web_query)

        try:
            self._append_turn(session, "user", message)
            reply = self._invoke_chat_llm(session, web_context)
            if not reply.strip():
                raise ValueError("Empty chat reply from LLM.")
            self._append_turn(session, "assistant", reply)
            return reply, self._format_messages(session)
        except (APIConnectionError, APIStatusError, APITimeoutError, RateLimitError, TimeoutError, ValueError) as exc:
            if self._settings.llm_required:
                raise RuntimeError(f"LLM chat failed: {exc}") from exc
            fallback = (
                "I could not reach live guidance right now. "
                "Please retry your treatment question in a moment."
            )
            self._append_turn(session, "assistant", fallback)
            logger.warning("LLM chat failed session=%s reason=%s", session_id, exc)
            return fallback, self._format_messages(session)

    def _invoke_treatment_llm(self, pest: str, confidence: float, web_context: str) -> str:
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "You are an expert agronomist creating eco-friendly pest treatment plans.\n"
                    "Return Markdown only (no JSON, no code fences) using this exact structure:\n"
                    "### Recommended Treatment for <pest>\n"
                    "- Step 1\n"
                    "- Step 2\n"
                    "- Step 3\n\n"
                    "Hard rules:\n"
                    "1) Exactly 3 bullet points.\n"
                    "2) Mention eco-friendly/least-harmful options first.\n"
                    "3) Include one practical pesticide option only if necessary and keep it low-risk.\n"
                    "4) No banned chemicals, no unsafe dosages, no unrelated advice.\n"
                    "5) Use the web context only when provided and relevant; otherwise rely on stable agronomy best practices.",
                ),
                (
                    "human",
                    "Detected pest class: {pest}\n"
                    "Model confidence: {confidence}%\n"
                    "Web context:\n{web_context}\n\n"
                    "Generate treatment plan now.",
                ),
            ]
        )
        content = self._invoke_llm(
            prompt,
            {"pest": pest, "confidence": f"{confidence:.1f}", "web_context": web_context or "No web context provided."},
        )
        cleaned = self._strip_code_fences(content).strip()
        return self._ensure_markdown_structure(pest, cleaned)

    def _invoke_chat_llm(self, session: _ChatSession, web_context: str) -> str:
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "You are a focused agronomy assistant for a single active case. "
                    "Answer ONLY about this pest and treatment. If user asks unrelated topics, refuse briefly.\n\n"
                    "Provide concise Markdown answers with practical, eco-friendly guidance.\n"
                    "Prefer monitoring and biological/cultural controls first; mention pesticide only when needed and low-risk.\n"
                    "Do not invent dosage if uncertain. Use provided web context only if relevant.",
                ),
                (
                    "human",
                    "Case pest: {pest}\n"
                    "Case confidence: {confidence}%\n"
                    "Case summary: {summary}\n"
                    "Recent conversation:\n{recent_history}\n\n"
                    "Web context:\n{web_context}\n\n"
                    "Now respond to the latest user message with actionable treatment help only.",
                ),
            ]
        )
        return self._invoke_llm(
            prompt,
            {
                "pest": session.pest,
                "confidence": f"{session.confidence:.1f}",
                "summary": session.summary or "No prior summary.",
                "recent_history": self._history_for_prompt(session),
                "web_context": web_context or "No web context provided.",
            },
        ).strip()

    def _invoke_llm(self, prompt: ChatPromptTemplate, values: dict[str, str]) -> str:
        if self._llm is None:
            raise ValueError("LLM not initialized.")
        prompt_value = prompt.format_prompt(**values)
        messages = prompt_value.to_messages()
        logger.info(
            "LLM request: model=%s timeout=%ss messages=%s",
            self._settings.llm_model,
            self._settings.llm_timeout_seconds,
            self._serialize_messages(messages),
        )
        llm_response = self._llm.invoke(messages)
        if not isinstance(llm_response, AIMessage):
            raise ValueError("Unexpected LLM response type.")
        logger.info(
            "LLM raw response: content=%s tool_calls=%s additional_kwargs=%s response_metadata=%s",
            llm_response.content,
            llm_response.tool_calls,
            llm_response.additional_kwargs,
            llm_response.response_metadata,
        )
        return self._coerce_content_to_text(llm_response.content)

    def _build_llm(self) -> ChatGroq:
        return ChatGroq(
            groq_api_key=self._settings.llm_api_key,
            model=self._settings.llm_model,
            temperature=0.2,
            timeout=self._settings.llm_timeout_seconds,
            max_tokens=500,
        )

    def _maybe_fetch_web_context(self, query: str) -> str:
        if not self._settings.tavily_api_key:
            return ""
        if not self._needs_web_context(query):
            logger.info("Skipping Tavily web search for query=%s", query)
            return ""
        return self._fetch_tavily_context(query)

    def _fetch_tavily_context(self, query: str) -> str:
        payload = {
            "api_key": self._settings.tavily_api_key,
            "query": query,
            "max_results": self._settings.tavily_max_results,
            "search_depth": "basic",
            "include_answer": True,
            "include_raw_content": False,
        }
        logger.info("Tavily request: url=%s payload=%s", self._settings.tavily_api_url, payload)
        req = request.Request(
            self._settings.tavily_api_url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        try:
            with request.urlopen(req, timeout=self._settings.llm_timeout_seconds) as response:  # nosec B310
                body = response.read().decode("utf-8")
        except (error.HTTPError, error.URLError, TimeoutError) as exc:
            logger.warning("Tavily request failed: %s", exc)
            return ""

        logger.info("Tavily raw response: %s", body)
        try:
            result = json.loads(body)
        except json.JSONDecodeError:
            return ""

        answer = str(result.get("answer", "")).strip()
        snippets: list[str] = []
        for item in result.get("results", [])[: self._settings.tavily_max_results]:
            title = str(item.get("title", "")).strip()
            content = str(item.get("content", "")).strip()
            url = str(item.get("url", "")).strip()
            snippet = " | ".join(part for part in [title, content, url] if part)
            if snippet:
                snippets.append(f"- {snippet}")
        context_lines = []
        if answer:
            context_lines.append(f"Summary: {answer}")
        if snippets:
            context_lines.append("Sources:")
            context_lines.extend(snippets)
        return "\n".join(context_lines)

    def _needs_web_context(self, query: str) -> bool:
        q = query.lower()
        return any(term in q for term in WEB_REQUIRED_TERMS)

    def _create_session(self, pest: str, confidence: float, treatment_markdown: str) -> str:
        session_id = f"chat_{uuid.uuid4().hex[:12]}"
        summary = f"Initial treatment generated for {pest} at confidence {confidence:.1f}%."
        self._sessions[session_id] = _ChatSession(
            pest=pest,
            confidence=confidence,
            summary=summary,
            turns=[_Turn(role="assistant", content=treatment_markdown)],
        )
        return session_id

    def _append_turn(self, session: _ChatSession, role: str, content: str) -> None:
        session.turns.append(_Turn(role=role, content=content))
        while len(session.turns) > self._settings.chat_max_turns:
            removed = session.turns.pop(0)
            session.summary = (session.summary + f"\n- {removed.role}: {removed.content[:220]}").strip()
            if len(session.summary) > self._settings.chat_summary_chars:
                session.summary = session.summary[-self._settings.chat_summary_chars :]

    def _history_for_prompt(self, session: _ChatSession) -> str:
        return "\n".join(f"{turn.role}: {turn.content}" for turn in session.turns[-10:])

    def _format_messages(self, session: _ChatSession) -> list[ChatMessage]:
        return [ChatMessage(role=turn.role, content=turn.content) for turn in session.turns[-30:]]

    def _fallback_markdown(self, pest: str) -> str:
        steps = get_treatment_for_pest(pest)
        lines = [f"### Recommended Treatment for {pest}", ""]
        lines.extend(f"- {step}" for step in steps[:3])
        return "\n".join(lines)

    def _ensure_markdown_structure(self, pest: str, text: str) -> str:
        if not text:
            raise ValueError("Empty markdown response.")
        if re.search(r"^\s*[\-\*]\s+", text, flags=re.MULTILINE):
            return text if text.lstrip().startswith("### ") else f"### Recommended Treatment for {pest}\n\n{text}"
        lines = [re.sub(r"^\d+[.)]\s*", "", ln.strip()) for ln in text.splitlines() if ln.strip()]
        if not lines:
            raise ValueError("No usable treatment lines in LLM markdown.")
        return f"### Recommended Treatment for {pest}\n\n" + "\n".join(f"- {line}" for line in lines[:3])

    def _is_in_scope(self, text: str, pest: str) -> bool:
        query = text.lower()
        pest_tokens = [token for token in re.split(r"[^a-z0-9]+", pest.lower()) if token]
        scope_keywords = {
            "pest",
            "treatment",
            "spray",
            "neem",
            "monitor",
            "dose",
            "dosage",
            "eco",
            "environment",
            "chemical",
            "biological",
            "ipm",
            "field",
            "crop",
            "control",
            "timing",
            "safety",
            "application",
            "prevent",
            "infestation",
            "affected",
            "majorly",
            "hindi",
            "crop",
            "crops",
            "which crop",
            "what crop",
            "फसल",
            "फसलें",
            "कौन सी फसल",
            "कीट",
            "उपचार",
            "इलाज",
            "छिड़काव",
            "सुरक्षा",
            "निगरानी",
            "रोकथाम",
            "खुराक",
            "मात्रा",
            "समय",
            "पर्यावरण",
            "जैविक",
        }
        unrelated_keywords = {
            "python",
            "javascript",
            "java code",
            "sql query",
            "leetcode",
            "resume",
            "cover letter",
            "movie",
            "song",
            "crypto price",
            "stock market",
            "travel itinerary",
        }

        if any(token in query for token in pest_tokens):
            return True
        if any(keyword in query for keyword in scope_keywords):
            return True
        if any(keyword in query for keyword in unrelated_keywords):
            return False

        # Default-allow ambiguous follow-ups so user phrasing doesn't get blocked.
        return True

    def _strip_code_fences(self, text: str) -> str:
        stripped = text.strip()
        if stripped.startswith("```") and stripped.endswith("```"):
            stripped = re.sub(r"^```[a-zA-Z0-9_-]*\n?", "", stripped)
            stripped = re.sub(r"\n?```$", "", stripped)
        return stripped

    def _coerce_content_to_text(self, content: Any) -> str:
        if isinstance(content, str):
            return content
        if isinstance(content, list):
            parts: list[str] = []
            for part in content:
                if isinstance(part, dict):
                    text = part.get("text")
                    if text:
                        parts.append(str(text))
                else:
                    parts.append(str(part))
            return "\n".join(parts)
        raise ValueError("Unexpected LLM content type.")

    def _serialize_messages(self, messages: list[Any]) -> list[dict[str, str]]:
        serialized: list[dict[str, str]] = []
        for message in messages:
            role = getattr(message, "type", message.__class__.__name__)
            content = getattr(message, "content", "")
            serialized.append({"role": str(role), "content": str(content)})
        return serialized
