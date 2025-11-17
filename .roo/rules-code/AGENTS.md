# Project Coding Rules (Non-Obvious Only)

- Backend TypeScript imports must use `.js` extensions for `.ts` files due to ESM (`"type": "module"`)
- Environment variables loaded from `backend/envs/.env.local` for local, `backend/envs/.env` for production
- `DATABASE_URL` auto-constructed from `POSTGRES_*` vars if not provided directly