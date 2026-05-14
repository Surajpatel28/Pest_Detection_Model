from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import numpy as np
from PIL import Image

try:
    from ultralytics import YOLO
except ImportError:  # pragma: no cover - exercised in runtime environment
    YOLO = None


@dataclass(frozen=True)
class Prediction:
    pest: str
    confidence: float


class YoloModelRunner:
    def __init__(self, model_path: str) -> None:
        if YOLO is None:
            raise ImportError("ultralytics is not installed. Install backend requirements first.")

        self._model = YOLO(model_path)
        self._class_names: dict[int, str] = self._extract_class_names()
        self.model_name = f"yolo:{Path(model_path).name}"

    def _extract_class_names(self) -> dict[int, str]:
        names = getattr(self._model.model, "names", None) or getattr(self._model, "names", None)
        if isinstance(names, dict):
            return {int(k): str(v) for k, v in names.items()}
        if isinstance(names, (list, tuple)):
            return {idx: str(name) for idx, name in enumerate(names)}
        return {}

    def predict(self, image: Image.Image) -> Prediction:
        image_array = np.asarray(image.convert("RGB"))
        results = self._model.predict(source=image_array, verbose=False)
        if not results:
            return Prediction(pest="Healthy", confidence=0.0)

        result = results[0]
        if getattr(result, "probs", None) is not None:
            class_id = int(result.probs.top1)
            confidence = float(result.probs.top1conf)
            class_name = self._class_names.get(class_id, str(class_id))
            return Prediction(pest=class_name, confidence=confidence)

        if getattr(result, "boxes", None) is not None and len(result.boxes) > 0:
            confidences = result.boxes.conf
            class_ids = result.boxes.cls
            best_idx = int(confidences.argmax().item())
            confidence = float(confidences[best_idx].item())
            class_id = int(class_ids[best_idx].item())
            class_name = self._class_names.get(class_id, str(class_id))
            return Prediction(pest=class_name, confidence=confidence)

        return Prediction(pest="Healthy", confidence=0.0)


class PestModelService:
    def __init__(self, model_path: str | None = None) -> None:
        self.model_path = model_path
        self._runner = self._load_model_runner(model_path)

    @property
    def model_name(self) -> str:
        return self._runner.model_name

    def _load_model_runner(self, model_path: str | None) -> YoloModelRunner:
        if not model_path:
            raise ValueError(
                "No model weight file configured. Set PEST_MODEL_PATH or place best.pt/last.pt in backend/model_weights."
            )

        path = Path(model_path)
        if not path.exists():
            raise FileNotFoundError(f"Configured model file does not exist: {model_path}")
        if not path.is_file():
            raise ValueError(f"Configured model path is not a file: {model_path}")

        return YoloModelRunner(str(path))

    def predict(self, image: Image.Image) -> Prediction:
        return self._runner.predict(image)
