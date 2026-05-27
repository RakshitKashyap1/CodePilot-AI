# CodePilot AI

Automated AI-powered code review platform. Submit code snippets or GitHub pull requests for instant AI-driven analysis covering security, performance, code quality, and bug detection.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind v4, shadcn/ui |
| Backend | Django 6.0, Django REST Framework, Celery |
| Database | SQLite (dev) / PostgreSQL (prod) |
| AI Providers | Google Gemini / Hugging Face Inference API |
| Async Tasks | Celery + Redis |

## Quick Start

### 1. Prerequisites

- Python 3.13+
- Node.js 20+
- Redis (for Celery / async reviews)

### 2. Backend Setup

```bash
# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your keys (see Configuration section)

# Apply database migrations
python manage.py migrate

# Start the dev server
python manage.py runserver
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`, backend on `http://localhost:8000`.

### 4. Redis (for AI Reviews)

```bash
# Windows (using WSL or Docker)
docker run -d -p 6379:6379 redis:7-alpine

# Start the Celery worker
python -m celery -A config worker -l info
```

### 5. Docker (full stack)

```bash
docker-compose up
```

This starts Django (port 8000), Next.js (port 3000), PostgreSQL (port 5434), Redis (6379), and a Celery worker.

## Configuration

### Required

| Variable | Description |
|---|---|
| `SECRET_KEY` | Django secret key (already generated in `.env`) |
| `HF_API_TOKEN` | Hugging Face API token (for `AI_PROVIDER=huggingface`) |

### AI Provider

Set `AI_PROVIDER` to `huggingface` (default) or `gemini`.

**Hugging Face:**
```env
AI_PROVIDER=huggingface
HF_API_TOKEN=hf_your_token_here
HF_MODEL=Qwen/Qwen2.5-Coder-7B-Instruct
```

**Gemini:**
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key_here
```

### Optional

| Variable | Default | Purpose |
|---|---|---|
| `GITHUB_CLIENT_ID` | — | GitHub OAuth integration |
| `GITHUB_CLIENT_SECRET` | — | GitHub OAuth integration |
| `GOOGLE_OAUTH2_CLIENT_ID` | — | Google SSO login |
| `GOOGLE_OAUTH2_CLIENT_SECRET` | — | Google SSO login |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000` | Frontend URL for CORS |
| `ALLOWED_HOSTS` | `127.0.0.1,localhost` | Django allowed hosts |

## Project Structure

```
├── apps/                    # Django apps
│   ├── users/               # Auth & profiles
│   ├── reviews/             # Code review management
│   ├── analytics/           # Dashboard metrics
│   └── github_integration/  # GitHub OAuth & webhooks
├── config/                  # Django project settings
├── services/                # Business logic
│   ├── ai_client.py         # Gemini / HuggingFace clients
│   ├── review_service.py    # Review orchestration
│   ├── github_service.py    # GitHub API wrapper
│   └── prompt_templates.py  # AI prompt definitions
├── frontend/                # Next.js application
│   ├── src/app/             # App Router pages
│   ├── src/components/      # UI & shared components
│   ├── src/features/        # Feature-based modules
│   ├── src/store/           # Zustand state management
│   └── src/lib/             # API client & utilities
├── middleware/               # Custom middleware (extendable)
├── utils/                   # Shared utilities
├── docker-compose.yml       # Multi-service orchestration
└── Dockerfile               # Backend image
```

## Testing

```bash
# Backend (Django)
python manage.py test

# Frontend unit (Vitest)
cd frontend && npm run test

# Frontend E2E (Playwright)
cd frontend && npm run test:e2e
```

## API Docs

When running, visit:
- Swagger: `http://localhost:8000/api/docs/`
- ReDoc: `http://localhost:8000/api/redoc/`
- OpenAPI schema: `http://localhost:8000/api/schema/`
