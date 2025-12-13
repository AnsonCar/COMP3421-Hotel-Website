# AGENTS.md

## Non-Obvious Coding Patterns
- Backend imports: Use `.js` extensions for `.ts` files (ESM `"type": "module"`).
- Env vars: Load from `backend/envs/.env.local` (local) or `.env` (prod); `DATABASE_URL` auto-constructed from `POSTGRES_*` if unset.
- Search: Fuzzy matching in `hotelController.searchHotels` using PostgreSQL `pg_trgm`.
- Bookings: Hard delete on cancellation (no soft delete table).
- Images: Hardcoded Unsplash URLs by star rating in `hotelController`.
- Ratings: Avg computed from reviews in `hotelController.getHotelDetails`.