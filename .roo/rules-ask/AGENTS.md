# Project Documentation Rules (Non-Obvious Only)

- MVC-like structure: `view/` (Hono routers), `controller/` (business logic), `db/` (schema/queries)
- Frontend data files (`frontend/data/`) appear unused and may be legacy
- Hotel images use hardcoded Unsplash URLs based on star rating
- Average rating calculated from reviews in `getHotelDetails` controller