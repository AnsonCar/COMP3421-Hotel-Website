# AGENTS.md

## Non-Obvious Documentation Patterns
- Legacy data: Frontend relies on static CSV files in `frontend/data/` (e.g., new_york_hotels.csv for hotel data).
- Images: Uses random local images from `frontend/images/`; no image storage in DB.
- API integration: Frontend JS hardcodes `http://localhost:3000` for backend calls.