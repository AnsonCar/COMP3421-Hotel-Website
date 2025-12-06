# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack hotel reservation website for luxury NYC hotels (4-star+) built as a COMP3421 final project by 2 students. The platform focuses exclusively on premium accommodations with a complete booking workflow including user authentication, hotel search, reservations, and reviews.

## Technology Stack

**Backend:**
- Hono.js web framework with TypeScript
- PostgreSQL database with Drizzle ORM
- JWT authentication with bcryptjs
- ESM modules with tsx for development

**Frontend:**
- Vanilla HTML/CSS/JavaScript (no frameworks)
- Python HTTP server for development
- Nginx in production

**Testing:**
- Cypress v15.7.1 for E2E testing
- No unit testing framework configured

**Infrastructure:**
- Docker with docker-compose
- Traefik v3.2 reverse proxy
- Multi-container deployment

## Development Commands

### Backend Development
```bash
cd backend
npm run dev          # Start development server with hot reload (port 3000)
npm run build        # Compile TypeScript
npm run start        # Production server
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Apply database migrations
npm run db:testdata  # Seed test data
```

### Frontend Development
```bash
cd frontend
./start-dev.sh       # Python HTTP server on port 8080
# Or directly: python3 -m http.server 8080
```

### Testing
```bash
cd cypress
npm i                # Install dependencies
npm run test         # Run E2E tests
npm run cy:open      # Open Cypress test runner
```

### Production Deployment
```bash
docker compose up -d --build --force-recreate
```

## Architecture

### Backend Structure (MVC Pattern)
- `src/controller/` - Business logic (user, hotel, booking, review, contact)
- `src/view/` - Route handlers for API endpoints
- `src/db/schema.ts` - Database schema with Drizzle ORM
- `src/types/` - TypeScript type definitions
- `src/env.ts` - Environment configuration

### Database Schema
Core tables: `users`, `hotels`, `reviews`, `bookings`, `contacts`
Key relationships: Hotels ← Bookings → Users ← Reviews
Constraints: Rating validations (1-5), booking date logic, guest counts

### API Routes
- `/auth/*` - User authentication (login, signup, password reset)
- `/api/*` - Core application endpoints (hotels, bookings, reviews, contact)
- CORS enabled for all origins in development

### Frontend Pages
- Home, Hotel Lists, Hotel Details, Booking/Checkout
- User Dashboard, Login/Create Account, Forgot Password
- Contact/Support with responsive design

## Configuration Files

### Environment
- Backend: Uses `src/env.ts` for environment variables
- Production: Environment loaded from `backend/envs/.env`
- Database: PostgreSQL connection via DATABASE_URL or POSTGRES_* variables

### Testing Configuration
- Cypress configured for `http://hostels.localhost` (production domain)
- Test patterns: `cypress/e2e/**/*.cy.{js,jsx,ts,tsx}`
- Default viewport: 1280x720 with extended timeouts

### Docker Setup
- Multi-container: Frontend, Backend, Database, Reverse Proxy
- Traefik handles routing to `hostels.localhost`
- Persistent database volumes
- Environment-specific configurations

## Key Development Notes

- Backend uses ESM modules requiring `.js` extensions for imports
- No root package.json - each component manages dependencies separately
- Frontend hardcoded to `localhost:3000` for API calls in development
- Comprehensive authentication system with JWT tokens
- Rich feature set including search, filtering, reviews, and booking management
- Database includes test data seeding functionality
- CORS allows all origins suitable for development