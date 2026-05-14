from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv


@dataclass(frozen=True)
class Settings:
    app_name: str = "Pest Detection API"
    app_version: str = "1.0.0"
    max_upload_bytes: int = 5 * 1024 * 1024
    model_path: str | None = None
    allowed_origins: tuple[str, ...] = ("http://localhost:5173",)
    llm_api_key: str | None = None
    llm_model: str = "llama-3.1-8b-instant"
    llm_timeout_seconds: int = 20
    llm_required: bool = False
    tavily_api_key: str | None = None
    tavily_api_url: str = "https://api.tavily.com/search"
    tavily_max_results: int = 5
    chat_max_turns: int = 18
    chat_summary_chars: int = 4000


def get_settings() -> Settings:
    load_dotenv(Path(__file__).resolve().parents[1] / ".env")

    default_best = Path(__file__).resolve().parents[1] / "model_weights" / "best.pt"
    default_last = Path(__file__).resolve().parents[1] / "model_weights" / "last.pt"
    model_path = os.getenv("PEST_MODEL_PATH")
    if not model_path:
        if default_best.exists():
            model_path = str(default_best)
        elif default_last.exists():
            model_path = str(default_last)

    origins_raw = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
    origins = tuple(origin.strip() for origin in origins_raw.split(",") if origin.strip())
    return Settings(
        model_path=model_path,
        allowed_origins=origins or ("http://localhost:5173",),
        llm_api_key=os.getenv("GROQ_API_KEY") or os.getenv("LLM_API_KEY"),
        llm_model=os.getenv("LLM_MODEL", "llama-3.1-8b-instant"),
        llm_timeout_seconds=int(os.getenv("LLM_TIMEOUT_SECONDS", "20")),
        llm_required=os.getenv("LLM_REQUIRED", "false").lower() == "true",
        tavily_api_key=os.getenv("TAVILY_API_KEY"),
        tavily_api_url=os.getenv("TAVILY_API_URL", "https://api.tavily.com/search"),
        tavily_max_results=int(os.getenv("TAVILY_MAX_RESULTS", "5")),
        chat_max_turns=int(os.getenv("CHAT_MAX_TURNS", "18")),
        chat_summary_chars=int(os.getenv("CHAT_SUMMARY_CHARS", "4000")),
    )
