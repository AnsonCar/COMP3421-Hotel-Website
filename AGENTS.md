# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Environment Setup
- Environment variables loaded from `backend/envs/.env.local` for local development, `backend/envs/.env` for production
- `DATABASE_URL` constructed from individual `POSTGRES_*` variables if not provided directly
- Required env vars: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `JWT_SECRET`

## Code Patterns
- Backend uses ESM (`"type": "module"`), so TypeScript imports use `.js` extensions for `.ts` files
- Frontend JavaScript uses hardcoded `localhost:3000` URLs for API calls
- CORS middleware allows all origins (`*`) for development
- Hotel images sourced from hardcoded Unsplash URLs based on star rating
- Average hotel rating calculated from reviews in `getHotelDetails` controller

## Architecture
- MVC-like structure: `view/` (Hono routers), `controller/` (business logic), `db/` (schema/queries)
- Drizzle ORM with PostgreSQL, migrations in `backend/drizzle/`
- Database constraints use CHECK clauses for rating validation (1-5) and date logic
- No unit tests; only e2e testing with Cypress

## Development Notes
- No linting or code formatting tools configured
- Frontend data files (`frontend/data/`) appear unused and may be legacy
- Docker setup uses nginx for frontend (port 80), Hono backend (port 3000), PostgreSQL (port 5432)