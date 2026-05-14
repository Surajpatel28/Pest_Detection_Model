from __future__ import annotations

import io
import logging

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError
from starlette.concurrency import run_in_threadpool

from app.config import get_settings
from app.model_service import PestModelService
from app.schemas import (
    ChatRequest,
    ChatResponse,
    HealthResponse,
    InferenceResponse,
    TreatmentRequest,
    TreatmentResponse,
)
from app.treatment_service import TreatmentService

logger = logging.getLogger("uvicorn.error")
settings = get_settings()
model_service = PestModelService(model_path=settings.model_path)
treatment_service = TreatmentService(settings=settings)

app = FastAPI(title=settings.app_name, version=settings.app_version)
app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.allowed_origins),
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse, tags=["System"])
def health_check() -> HealthResponse:
    return HealthResponse(
        status="ok",
        model=model_service.model_name,
        treatment_provider=treatment_service.provider_name,
    )


@app.post("/api/v1/inference", response_model=InferenceResponse, tags=["Inference"])
async def run_inference(file: UploadFile = File(...)) -> InferenceResponse:
    logger.info(
        "Inference request received: filename=%s content_type=%s",
        file.filename,
        file.content_type,
    )

    if file.content_type not in {"image/jpeg", "image/jpg", "image/png"}:
        raise HTTPException(status_code=415, detail="Only JPG, JPEG, and PNG files are supported.")

    image_bytes = await file.read()
    logger.info("Inference upload size bytes=%d", len(image_bytes))
    if len(image_bytes) > settings.max_upload_bytes:
        raise HTTPException(status_code=413, detail="Image size should be less than 5MB.")

    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except UnidentifiedImageError as exc:
        raise HTTPException(status_code=400, detail="Invalid image file.") from exc

    prediction = model_service.predict(image)
    logger.info("Model raw prediction: pest=%s confidence=%.6f", prediction.pest, prediction.confidence)
    confidence_pct = round(prediction.confidence * 100, 1)
    logger.info("Inference confidence: pest=%s confidence=%.1f%%", prediction.pest, confidence_pct)

    return InferenceResponse(
        pest=prediction.pest,
        confidence=confidence_pct,
    )


@app.post("/api/v1/treatment", response_model=TreatmentResponse, tags=["Treatment"])
async def generate_treatment(payload: TreatmentRequest) -> TreatmentResponse:
    logger.info(
        "Treatment request received: pest=%s confidence=%.1f%%",
        payload.pest,
        payload.confidence,
    )
    try:
        treatment_markdown, chat_session_id = await run_in_threadpool(
            treatment_service.generate_treatment,
            payload.pest,
            payload.confidence,
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    logger.info("Treatment markdown response: %s", treatment_markdown)

    return TreatmentResponse(
        treatment=treatment_markdown,
        chat_session_id=chat_session_id,
    )


@app.post("/api/v1/chat", response_model=ChatResponse, tags=["Chat"])
async def continue_chat(payload: ChatRequest) -> ChatResponse:
    logger.info("Chat request received: session_id=%s", payload.session_id)
    try:
        assistant_message, messages = await run_in_threadpool(
            treatment_service.chat,
            payload.session_id,
            payload.message,
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return ChatResponse(
        session_id=payload.session_id,
        assistant_message=assistant_message,
        messages=messages,
    )
