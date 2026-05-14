from __future__ import annotations

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = Field(examples=["ok"])
    model: str = Field(examples=["yolo:best.pt"])
    treatment_provider: str = Field(examples=["llm:llama-3.1-8b-instant"])


class InferenceResponse(BaseModel):
    pest: str = Field(examples=["Aphids"])
    confidence: float = Field(ge=0.0, le=100.0, examples=[95.8])


class TreatmentRequest(BaseModel):
    pest: str = Field(examples=["brown plant hopper"])
    confidence: float = Field(ge=0.0, le=100.0, examples=[56.4])


class TreatmentResponse(BaseModel):
    treatment: str = Field(
        examples=[
            "### Recommended Treatment for brown plant hopper\n- Use yellow sticky traps for early monitoring.\n- Apply neem oil at recommended label dose."
        ]
    )
    chat_session_id: str = Field(examples=["chat_123abc"])


class ChatRequest(BaseModel):
    session_id: str = Field(examples=["chat_123abc"])
    message: str = Field(examples=["Is neem oil enough for early-stage infestation?"])


class ChatMessage(BaseModel):
    role: str = Field(examples=["user"])
    content: str


class ChatResponse(BaseModel):
    session_id: str
    assistant_message: str
    messages: list[ChatMessage]
