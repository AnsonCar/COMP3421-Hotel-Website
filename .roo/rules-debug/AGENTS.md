# Project Debug Rules (Non-Obvious Only)

- Environment files: Use `backend/envs/.env.local` for local debugging, not `.env`
- Database URL constructed from `POSTGRES_*` vars if `DATABASE_URL` not set
- Required env vars: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `JWT_SECRET`
- Testing only via Cypress e2e, no unit tests available