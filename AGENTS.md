# Repository Guidelines

## Project Structure & Modules
- Python CLI: `mem8/` (entry: `mem8/cli.py`, Typer app in `mem8/cli_typer.py`).
- Python tests: `tests/` (pytest), config in `pytest.ini`.
- Backend API (FastAPI): `backend/src/mem8_api/` with routers, models, schemas.
- Frontend (Next.js + TypeScript): `frontend/`.
- Templates and example configs: `mem8/templates/`, `example-configs/`.
- Dev tooling: `Makefile`, `pyproject.toml`, `backend/pyproject.toml`, scripts in `scripts/`.

## Build, Test, and Dev Commands
- Python setup: `uv sync --extra dev` (installs dev deps). Use `uv run` to execute tools.
- Run tests: `make test` or `uv run pytest`; coverage: `make test-cov` (HTML in `htmlcov/`).
- Lint/format (root): `make lint`, `make format` (black, isort, mypy). Build: `make build`.

Quick Make targets
- Backend: `make backend-install-dev`, `make backend-dev` (FastAPI on `:8000`).
- Frontend: `make frontend-install`, `make frontend-dev` (Next.js on `:22211`).
- Docker stack: `make compose-up`, `make compose-down`, `make compose-logs`.

## Coding Style & Naming
- Python: 4-space indent, line length 88 (black). Import order via isort (profile=black). Type-check with mypy (root) and ruff (backend).
- Naming: modules/files `snake_case.py`, classes `PascalCase`, functions/vars `snake_case`.
- Frontend TypeScript: ESLint configured; React components `PascalCase` in `components/`, utility files `camelCase` or `kebab-case` as per existing patterns.

## Testing Guidelines
- Framework: pytest. Patterns per `pytest.ini`: files `test_*.py` or `*_test.py`; classes `Test*`; functions `test_*`.
- Markers: `unit`, `integration`, `cli`, `templates`, `slow`, `network` (see `pytest.ini`).
- Run subsets: `uv run pytest -m unit -k name_fragment`.
- Keep tests close to public behavior (CLI commands, API routes). Prefer fast, deterministic tests; use markers for slower/network cases.

## Commit & Pull Request Guidelines
- Conventional commits enforced by release tooling. Allowed types: `feat`, `fix`, `perf`, `refactor`, `docs`, `style`, `test`, `build`, `ci`, `chore`.
  - Example: `feat(cli): add search scope filters`.
- PRs should include:
  - Clear description, linked issues (e.g., `Closes #123`).
  - Screenshots or clips for frontend changes.
  - Test updates/coverage notes and local run steps (`make test`, `npm run dev`).

## Security & Configuration
- Do not commit secrets. Copy examples: `cp .env.dev.example .env.dev` and `cp .env.prod.example .env.prod` (PowerShell: `Copy-Item ...`).
- Docker Compose vars (see `docker-compose.yml`): `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `DATABASE_URL`, `REDIS_URL`, `BACKEND_PORT`, `FRONTEND_PORT`, `NEXT_PUBLIC_API_URL`, `SECRET_KEY`, `NODE_ENV`.
- Backend local dev runs at `http://127.0.0.1:8000`; set `NEXT_PUBLIC_API_URL` accordingly for the frontend.
