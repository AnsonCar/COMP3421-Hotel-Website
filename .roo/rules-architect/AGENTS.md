# AGENTS.md

## Non-Obvious Architecture Patterns
- Database: CHECK constraints on ratings (1-5); hard delete for bookings (no soft delete).
- Auth: JWT from Hono request context; no session storage.
- Frontend: Hardcoded backend URLs (`http://localhost:3000`); static CSV data in `frontend/data/`.