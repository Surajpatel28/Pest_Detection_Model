# 🐛 Pest Detection Backend API

![Python](https://img.shields.io/badge/Python-3.9%2B-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688)
![YOLO](https://img.shields.io/badge/YOLO-Ultralytics-orange)
![LangChain](https://img.shields.io/badge/LangChain-Integration-green)

Robust FastAPI backend designed for real-time agricultural pest detection and AI-driven treatment recommendations. It seamlessly integrates a computer vision model (YOLO via Ultralytics) for image classification and leverages Large Language Models (LLM) powered by Groq/LangChain for dynamic treatment retrieval and follow-up conversation.

---

## 🚀 Features

- **ML Inference Engine:** Real-time pest image classification using optimized Ultralytics weights.
- **AI Treatment Generation:** Context-aware, LLM-generated treatment recommendations via Groq.
- **RAG/Web Search Integration:** Enhances AI recommendations using Tavily web search.
- **Follow-up Chat:** Stateful conversational agent keeping history for query refinement.
- **CORS Validated:** Secure cross-origin requests bounded by strict allowed origins.

---

## 📂 Structure

```text
backend/
├── app/
│   ├── main.py              # Application entry point & route definitions
│   ├── config.py            # Environment tracking and settings validation
│   ├── schemas.py           # Pydantic models for request & response
│   ├── model_service.py     # YOLO inference wrapper
│   ├── treatment_service.py # Langchain orchestration & logic
│   └── treatments.py        # Static fallbacks and basic configurations
├── model_weights/           # Model artifacts directory
│   ├── best.pt              # Preferred YOLO checkpoint (loaded by default)
│   └── last.pt              # Fallback YOLO checkpoint
├── requirements.txt         # Project dependencies
└── README.md                # You are here
```

---

## 🛠️ Installation & Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration:**
   Copy the example environment defaults:
   ```bash
   touch .env
   ```
   Add your keys in `.env` (see the Environment Variables section below).

5. **Start the Development Server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

---

## ⚙️ Environment Variables

The backend automatically loads a `.env` file if present in the `backend/` directory.

| Variable | Default | Description |
| :--- | :--- | :--- |
| `ALLOWED_ORIGINS` | `http://localhost:5173` | Comma-separated list of allowed frontend origins for CORS. |
| `PEST_MODEL_PATH` | _auto-detected_ | Explicit path to model. Auto-scans `model_weights/best.pt`. |
| `GROQ_API_KEY` | _required for LLM_ | Groq API key for dynamic treatment generation (`LLM_API_KEY` also works). |
| `LLM_MODEL` | `llama-3.1-8b-instant` | The base generative model to utilize. |
| `LLM_TIMEOUT_SECONDS`| `20` | Timeout threshold for Langchain/LLM interactions. |
| `LLM_REQUIRED` | `false` | If `true`, strict checks enforce LLM replies; otherwise falls back gracefully. |
| `TAVILY_API_KEY` | _optional_ | Tavily Search key to inject live data into AI context. |
| `CHAT_MAX_TURNS` | `18` | Max retained conversation iterations before memory prune. |

---

## 📡 API Reference

#### 1. System Health
- **GET** `/health`
- **Response:**
  ```json
  {
    "status": "ok",
    "model": "yolo:best.pt",
    "treatment_provider": "llm:llama-3.1-8b-instant"
  }
  ```

#### 2. Image Inference
- **POST** `/api/v1/inference`
- **Body:** `multipart/form-data` with a `file` field containing a JPG/PNG (Max 5MB).
- **Response:**
  ```json
  {
    "pest": "Aphids",
    "confidence": 95.8
  }
  ```

#### 3. AI Treatment Advice
- **POST** `/api/v1/treatment`
- **Body Context (JSON):**
  ```json
  {
    "pest": "Aphids",
    "confidence": 95.8
  }
  ```
- **Response:**
  ```json
  {
    "treatment": "### Recommended Treatment...\n- Neem oil...",
    "chat_session_id": "chat_123abc"
  }
  ```

#### 4. Chat Conversational Agent
- **POST** `/api/v1/chat`
- **Body Context (JSON):**
  ```json
  {
    "session_id": "chat_123abc",
    "message": "Is it safe to use this on tomatoes?"
  }
  ```
- **Response:** Returns an assistant message keeping conversational state.

---

## 🧠 Model Weights Integration

Place your Ultralytics/PyTorch compatible `.pt` weights inside `backend/model_weights/`. Simply ensure `best.pt` exists; no environment tweaks are necessary as the `config.py` intelligently falls back sequentially to `best.pt` then `last.pt`.
