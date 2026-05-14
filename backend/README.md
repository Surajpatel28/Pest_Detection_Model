# Pest Detection Backend API

FastAPI backend for image inference and pest treatment recommendations.

## Quick Start

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # add your GROQ_API_KEY once
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Endpoints

- `GET /health` - API health and active model name
- `POST /api/v1/inference` - multipart upload (`file`) returning:
  - `pest` (string)
  - `confidence` (0-100 float)
- `POST /api/v1/treatment` - JSON payload (`pest`, `confidence`) returning:
  - `treatment` (markdown string with suggested steps)
  - `chat_session_id` (use this for follow-up chat)
- `POST /api/v1/chat` - JSON payload (`session_id`, `message`) returning:
  - `assistant_message`
  - `messages` (recent capped conversation history)

## Environment Variables

- `ALLOWED_ORIGINS` - comma-separated frontend origins (default: `http://localhost:5173`)
- `PEST_MODEL_PATH` - optional explicit weights path. If not set, API auto-loads `backend/model_weights/best.pt` (fallback `last.pt`).
- `GROQ_API_KEY` - Groq API key for treatment generation (preferred; `LLM_API_KEY` also supported)
- `LLM_MODEL` - default model for non-web LLM operations
- `TAVILY_API_KEY` - Tavily API key for web retrieval
- `TAVILY_API_URL` - Tavily search endpoint (default: `https://api.tavily.com/search`)
- `TAVILY_MAX_RESULTS` - max Tavily hits per retrieval call (default: `5`)
- `LLM_TIMEOUT_SECONDS` - LLM API timeout in seconds (default: `20`)
- `LLM_REQUIRED` - set `true` to fail inference when LLM treatment call fails; otherwise static fallback is used
- `CHAT_MAX_TURNS` - max preserved chat turns before summarizing older turns (default: `18`)
- `CHAT_SUMMARY_CHARS` - max summary size used to keep context token-safe (default: `4000`)

The backend auto-loads `backend/.env`, so you only set the key once.
