# Finturf Takehome

Monorepo with a FastAPI backend, React frontend, and PostgreSQL database.

```
finturf-takehome/
├── docker-compose.yml
├── server/          # FastAPI + SQLAlchemy
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py
│       ├── config.py
│       ├── database.py
│       ├── models.py
│       └── routers/
└── frontend/        # React + Vite + TypeScript
    ├── Dockerfile        # production (nginx)
    ├── Dockerfile.dev    # development (Vite dev server + HMR)
    ├── nginx.conf
    └── src/
```

## Running with Docker (recommended)

**Prerequisites:** Docker and Docker Compose installed.

```bash
docker compose up --build
```

| Service  | URL                         |
| -------- | --------------------------- |
| Frontend | http://localhost:3000       |
| API      | http://localhost:8000       |
| API docs | http://localhost:8000/docs  |
| Postgres | localhost:5432              |

Both the frontend (Vite HMR) and backend (uvicorn `--reload`) support hot reloading — editing any file in `server/` or `frontend/src/` will reflect in the container immediately.

To stop and remove containers:

```bash
docker compose down
```

To also remove the database volume:

```bash
docker compose down -v
```

## Running locally (without Docker)

### Backend

Requires Python 3.11+ and a running PostgreSQL instance.

```bash
cd server
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Set your database URL
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app

uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000. Interactive docs at http://localhost:8000/docs.

### Frontend

Requires Node 20+.

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at http://localhost:5173 and will proxy `/api` requests to the backend.

## API Endpoints

| Method | Path            | Description       |
| ------ | --------------- | ----------------- |
| GET    | /health         | Health check      |
| GET    | /items/         | List all items    |
| POST   | /items/         | Create an item    |
| GET    | /items/{id}     | Get item by ID    |
| DELETE | /items/{id}     | Delete an item    |
