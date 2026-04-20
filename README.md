# SportsApp - Mobile Marketplace (OLX-style for Sports Equipment)

Production-grade starter for a mobile-only SaaS product:
- React Native (Expo) mobile client
- Node.js + Express backend API
- Supabase Postgres + RLS migration baseline

## Repository Structure

- `apps/mobile` - React Native app (buy/sell UX, chat, profile)
- `apps/api` - Node.js backend with secure REST API
- `infra/supabase` - SQL migrations and RLS policies
- `packages/config` - shared TypeScript config
- `docs` - delivery phases and architecture notes

## Local Setup

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies:
   - `npm install`
3. Apply database migrations to Supabase (requires `DATABASE_URL` in `.env` — use the **URI** from Supabase → *Project Settings* → *Database*, including `?sslmode=require`):
   - `npm run db:migrate`
4. Start API:
   - `npm run dev:api`
5. Start mobile app:
   - `npm run dev:mobile`

## API Endpoints (v1)

- `GET /api/v1/health`
- `GET /api/v1/listings` (supports `search`, `city`, `condition`, `minPrice`, `maxPrice`, `limit`, `offset`)
- `GET /api/v1/listings/:id`
- `POST /api/v1/listings` (requires `x-user-id` for now)

## Test API

- `npm run test --workspace @sportsapp/api`

## Production Readiness Decisions Included

- Helmet, CORS, rate limiting, structured request logging
- Input validation with Zod
- Error boundary middleware and normalized error payloads
- Supabase RLS-first schema design
- Clean module layering for scalability

## Next Immediate Implementation

Follow `docs/phases.md` for Phase 1 work items.
