# AGENTS.md

## Non-Obvious Debugging Patterns
- Env vars: Use `backend/envs/.env.local` for local debugging; `DATABASE_URL` auto-constructed from `POSTGRES_*`.
- Cypress tests: baseUrl `http://hostels.localhost`; extend timeouts for slow API responses.
- Backend dev: Run `cd backend && npm run dev` (Hono on port 3000); watch for generic 500 errors.