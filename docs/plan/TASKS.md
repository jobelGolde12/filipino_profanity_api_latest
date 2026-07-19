# Implementation Tasks — Quick Reference

## P0: Critical (Do First)

- [ ] Move hardcoded admin credentials to `.env` (`app/api/reports/admin/route.ts`)
- [ ] Add environment variable validation (`lib/env.ts`)
- [ ] Add health check endpoint (`GET /api/health`)

## P1: Core API (This Week)

- [ ] Add rate limiting middleware (`lib/rate-limit.ts`)
- [ ] Add pagination to `GET /api/profanity` (page, limit params)
- [ ] Add text masking endpoint (`POST /api/mask`)
- [ ] Set up Vitest testing framework
- [ ] Write unit tests for `lib/` utilities
- [ ] Write integration tests for API routes

## P2: Data Quality (Next Week)

- [ ] Add batch text checking (`POST /api/check/batch`)
- [ ] Add statistics endpoint (`GET /api/stats`)
- [ ] Classify all 310 words by severity (low/medium/high)
- [ ] Add word categories table and tags
- [ ] Seed category data

## P3: Frontend & DX (This Month)

- [ ] Build word browser page (`/browse`)
- [ ] Build changelog page (`/changelog`)
- [ ] Add SEO meta tags (OpenGraph, JSON-LD)
- [ ] Add `sitemap.xml` and `robots.txt`
- [ ] Add Docker support (`Dockerfile`, `docker-compose.yml`)
- [ ] Add CI/CD pipeline (`.github/workflows/ci.yml`)

## P4: Community (Next Month)

- [ ] Add API usage analytics table
- [ ] Add word submission table and API
- [ ] Build word submission form (`/submit`)
- [ ] Enhance API docs page with interactive explorer
- [ ] Add OpenAPI specification (`public/openapi.json`)

## P5: Advanced (Future)

- [ ] Implement API key system
- [ ] Add word variants/synonyms detection
- [ ] Add context-aware detection (confidence scores)
- [ ] Add webhook support
- [ ] Create SDK libraries (JS, Python, PHP)
