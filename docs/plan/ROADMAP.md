# Filipino Profanity API — Implementation Roadmap

## Current State Summary

| Layer | Status |
|-------|--------|
| API | 3 endpoints: fetch words, check text, report bugs |
| Database | Turso (libSQL) with `profanity` + `reports` tables |
| Frontend | Landing page with dashboard, API tester, docs, bug form |
| Data | 310 words (110 Filipino + 200 Regional) |
| Testing | None |
| CI/CD | None |
| Auth | Basic admin auth hardcoded (security risk) |

---

## Phase 1: Critical Fixes & Security (Priority: URGENT)

### 1.1 Move Hardcoded Credentials to Environment Variables
- **File**: `app/api/reports/admin/route.ts`
- **Issue**: Admin email and password are hardcoded in source code
- **Action**: Move `ADMIN_EMAIL` and `ADMIN_PASS` to `.env`, add validation
- **Effort**: 30 min

### 1.2 Add Environment Validation
- **File**: Create `lib/env.ts`
- **Action**: Validate required env vars at startup (TURSO_DATABASE_URL, etc.)
- **Effort**: 1 hour

### 1.3 Add Health Check Endpoint
- **File**: Create `app/api/health/route.ts`
- **Action**: Return DB connection status, word count, uptime
- **Use case**: Monitoring, uptime checks, deployment verification
- **Effort**: 1 hour

---

## Phase 2: API Enhancements

### 2.1 Add Rate Limiting
- **File**: Create `lib/rate-limit.ts`
- **Action**: Implement in-memory rate limiter (sliding window)
- **Default**: 60 requests/minute per IP
- **Headers**: Include `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- **Effort**: 2 hours

### 2.2 Add Pagination to `/api/profanity`
- **Query params**: `page` (default 1), `limit` (default 50, max 200)
- **Response**: Add `pagination: { page, limit, total, totalPages }`
- **Backward compatible**: Omit pagination params = return all (current behavior)
- **Effort**: 2 hours

### 2.3 Add Text Masking/Censoring Endpoint
- **Endpoint**: `POST /api/mask`
- **Request**: `{ "text": "...", "maskChar": "*", "partial": true }`
- **Response**: `{ "success": true, "original": "...", "masked": "You are a ****", "matches": [...] }`
- **Use case**: Content moderation, chat filtering
- **Effort**: 3 hours

### 2.4 Add Batch Text Checking
- **Endpoint**: `POST /api/check/batch`
- **Request**: `{ "texts": ["text1", "text2", ...] }`
- **Response**: `{ "results": [{ "text": "...", "hasProfanity": true, "count": 1, "data": [...] }] }`
- **Use case**: Moderating multiple comments at once
- **Effort**: 2 hours

### 2.5 Add Word Statistics Endpoint
- **Endpoint**: `GET /api/stats`
- **Response**: `{ "total": 310, "byLanguage": {...}, "bySeverity": {...}, "byRegion": {...} }`
- **Use case**: Dashboard data, analytics
- **Effort**: 1 hour

---

## Phase 3: Database Improvements

### 3.1 Add Proper Severity Levels
- **Current**: All 310 words have `severity: "medium"`
- **Action**: Manually classify words into `low`, `medium`, `high` categories
- **Add**: Meaning description per severity level
- **Effort**: 4 hours (manual + script)

### 3.2 Add Word Categories/Tags
- **New table**: `word_categories` (id, name, description)
- **New table**: `word_tags` (word_id, category_id)
- **Categories**: insult, slur, profanity, vulgar, mild
- **Effort**: 3 hours

### 3.3 Add API Usage Analytics Table
- **New table**: `api_usage` (id, endpoint, ip_hash, timestamp, response_time, status_code)
- **Action**: Log every API request for analytics
- **Use case**: Usage dashboard, rate limit tracking, popular endpoints
- **Effort**: 3 hours

### 3.4 Add Word Submission Table
- **New table**: `word_submissions` (id, word, language, region, severity, submitted_by, status, created_at)
- **Action**: Allow community word submissions via API
- **Status workflow**: pending → approved/rejected
- **Effort**: 4 hours

---

## Phase 4: Frontend Additions

### 4.1 Word Browser Page
- **Route**: `/browse`
- **Features**: Search, filter by language/severity/region, paginated table
- **Action**: Click word to see details, example sentences
- **Effort**: 4 hours

### 4.2 Changelog Page
- **Route**: `/changelog`
- **Content**: Version history, new words added, API changes
- **Format**: Reverse chronological markdown
- **Effort**: 2 hours

### 4.3 Word Submission Form
- **Route**: `/submit`
- **Form**: Word, language, region, severity, context/example
- **Action**: POST to `/api/submit-word`
- **Effort**: 3 hours

### 4.4 Improved API Documentation Page
- **Route**: `/docs` (enhance existing)
- **Add**: Interactive examples, copy-as-cURL, response previews
- **Add**: OpenAPI/Swagger-style endpoint explorer
- **Effort**: 4 hours

### 4.5 SEO & Meta Tags
- **Add**: OpenGraph tags, Twitter cards, JSON-LD structured data
- **Add**: `sitemap.xml` and `robots.txt`
- **Add**: Dynamic meta descriptions per page
- **Effort**: 2 hours

---

## Phase 5: Developer Experience

### 5.1 Add Testing Framework
- **Install**: Vitest
- **Tests**: Unit tests for `lib/`, API route integration tests
- **Coverage target**: 80% for lib/, 100% for API routes
- **Effort**: 6 hours

### 5.2 Add Docker Support
- **Files**: `Dockerfile`, `docker-compose.yml`
- **Use case**: Self-hosting, consistent dev environment
- **Effort**: 2 hours

### 5.3 Add CI/CD Pipeline
- **File**: `.github/workflows/ci.yml`
- **Steps**: Lint → Type check → Test → Build
- **Effort**: 2 hours

### 5.4 Add OpenAPI Specification
- **File**: `public/openapi.json`
- **Action**: Define all endpoints with request/response schemas
- **Use case**: Auto-generate SDKs, Postman collection
- **Effort**: 3 hours

---

## Phase 6: Advanced Features

### 6.1 API Key System
- **New table**: `api_keys` (id, key_hash, user_email, plan, rate_limit, created_at, expires_at)
- **Endpoint**: `POST /api/keys` (generate), `DELETE /api/keys/:id` (revoke)
- **Auth**: Bearer token in `Authorization` header
- **Plans**: free (60 req/min), pro (600 req/min), enterprise (custom)
- **Effort**: 6 hours

### 6.2 Word Variants/Synonyms Detection
- **Action**: Add `variants` column to profanity table (JSON array)
- **Example**: `gago` → `["g@go", "g a g o", "gag0"]`
- **Detection**: Leet-speak normalization, character substitution
- **Effort**: 5 hours

### 6.3 Context-Aware Detection
- **Action**: Return confidence score based on word context
- **Example**: "puta red" (tomato) vs "puta ka" (profanity)
- **Approach**: Bigram/trigram analysis, surrounding word matching
- **Effort**: 8 hours

### 6.4 Webhook Support
- **New table**: `webhooks` (id, url, events, secret, active)
- **Events**: `word.added`, `report.submitted`, `report.resolved`
- **Action**: POST to webhook URL on event
- **Effort**: 4 hours

### 6.5 SDK Libraries
- **Languages**: JavaScript/TypeScript, Python, PHP
- **Package names**: `@filipino-profanity/api-client`, `filipino-profanity-python`
- **Auto-generate** from OpenAPI spec
- **Effort**: 4 hours per language

---

## Implementation Priority Matrix

| Priority | Items | Effort | Impact |
|----------|-------|--------|--------|
| P0 (Do First) | 1.1, 1.2, 1.3 | 2.5 hrs | Security, reliability |
| P1 (This Week) | 2.1, 2.2, 2.3, 5.1 | 13 hrs | Core API quality |
| P2 (Next Week) | 2.4, 2.5, 3.1, 3.2 | 12 hrs | Data quality |
| P3 (This Month) | 4.1, 4.2, 4.5, 5.2, 5.3 | 12 hrs | DX & frontend |
| P4 (Next Month) | 3.3, 3.4, 4.3, 4.4, 5.4 | 16 hrs | Community features |
| P5 (Future) | 6.1-6.5 | 27 hrs | Advanced features |

---

## Quick Wins (< 2 hours each)

1. **Health check endpoint** — simple, high value
2. **Rate limiting** — prevents abuse
3. **Environment validation** — catches config issues early
4. **SEO meta tags** — improves discoverability
5. **Changelog page** — builds trust with users
6. **Docker support** — eases deployment

---

## Recommended Next Steps

1. **Immediate** (today): Fix hardcoded credentials (1.1)
2. **This session**: Add health check (1.3), rate limiting (2.1)
3. **Next session**: Add pagination (2.2), masking endpoint (2.3)
4. **This week**: Testing framework (5.1), word browser (4.1)
5. **This month**: API keys (6.1), proper severity levels (3.1)

---

## Technical Debt

| Issue | Location | Severity |
|-------|----------|----------|
| Hardcoded admin credentials | `app/api/reports/admin/route.ts:4-5` | Critical |
| No error boundary | Global | High |
| No request validation (Zod) | All API routes | Medium |
| No CORS configuration | `next.config.ts` | Medium |
| No request logging | All API routes | Low |
| `let tableReady` pattern | `app/api/reports/route.ts:4` | Low |
