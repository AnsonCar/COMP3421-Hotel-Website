# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Build, Lint, Test Commands
- No linting or code formatting tools configured.
- E2E tests with Cypress: Run from root (`npx cypress open` or `npx cypress run`); specific specs (`npx cypress run --spec "cypress/e2e/search.cy.ts"`); config in `cypress/cypress.config.ts` with baseUrl `http://hostels.localhost`.
- Frontend dev server: `cd frontend && ./start-dev.sh` (Python HTTP server on port 8000).
- Backend dev: `cd backend && npm run dev` (Hono on port 3000).

## Code Style
- Backend TypeScript: Imports use `.js` extensions for `.ts` files (ESM `"type": "module"`).
- Strict TypeScript: Enabled in `backend/tsconfig.json`.
- Error handling: Generic 500 'Internal Server Error' responses.

## Non-Obvious Patterns
- Env vars: Loaded from `backend/envs/.env.local` (local) or `.env` (prod); `DATABASE_URL` auto-constructed from `POSTGRES_*` if unset.
- Frontend API calls: Hardcoded `http://localhost:3000`.
- Hotel images: Hardcoded Unsplash URLs by star rating in controllers.
- Avg rating: Computed from reviews in `hotelController.getHotelDetails`.