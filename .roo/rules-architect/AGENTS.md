# Project Architecture Rules (Non-Obvious Only)

- MVC-like structure separates concerns: view (routers), controller (logic), db (schema)
- Database constraints use CHECK clauses for rating validation (1-5) and date logic
- CORS allows all origins (`*`) for development
- Drizzle migrations stored in `backend/drizzle/` directory
- Docker setup: nginx frontend (port 80), Hono backend (port 3000), PostgreSQL (port 5432)