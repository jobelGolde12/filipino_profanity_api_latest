# Features Documentation

## Overview

The Filipino Profanity API provides a comprehensive platform for managing and detecting profanity words in Filipino and regional dialects.

## Core Features

### 1. API Endpoints

#### Health Check (`GET /api/health`)
- Monitor API health status
- Database connectivity check
- Uptime tracking
- Word count verification

#### Profanity Fetching (`GET /api/profanity`)
- Filter by language type (Filipino, Regional, All)
- Search for specific words
- **Paginated responses** with page/limit parameters
- Returns structured JSON response

#### Profanity Detection (`POST /api/check`)
- Real-time text analysis
- Identifies profanity matches
- Returns found words with metadata

#### Batch Text Checking (`POST /api/check/batch`)
- Check multiple texts in a single request
- Up to 10 texts per request
- Individual results for each text
- Summary of texts with profanity

#### Text Masking (`POST /api/mask`)
- Mask profanity words with custom characters
- Partial masking (keep first letter visible)
- Full masking options
- Detailed match information

#### Statistics (`GET /api/stats`)
- Word count by language
- Word count by severity
- Word count by region
- Percentage breakdowns

### 2. Rate Limiting

Built-in rate limiting per IP address:

| Endpoint | Limit | Window |
|----------|-------|--------|
| GET /api/profanity | 60 requests | 1 minute |
| GET /api/stats | 60 requests | 1 minute |
| GET /api/health | No limit | N/A |
| POST /api/check | 30 requests | 1 minute |
| POST /api/mask | 30 requests | 1 minute |
| POST /api/check/batch | 20 requests | 1 minute |

Rate limit headers:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`
- `Retry-After` (on 429 responses)

### 3. User Interface Components

#### Dashboard Stats
- Total word count display
- Language distribution breakdown
- Visual severity distribution chart

#### API Tester
- Interactive API testing panel
- Type selection dropdown
- Word search functionality
- Real-time response viewer
- JSON syntax highlighting
- Request history

#### Documentation Page
- Complete API reference
- Code examples in JavaScript, Python, cURL
- Interactive navigation
- Rate limiting documentation

#### JSON Viewer
- VS Code-style syntax highlighting
- Copy to clipboard functionality
- Collapsible/expandable sections
- Color-coded output:
  - Keys: Blue
  - Strings: Green
  - Numbers: Orange
  - Null: Yellow

#### GitHub Integration Card
- Repository link
- Star and fork counts
- Quick access to source code

### 4. Design System

#### Editorial Design
- Premium, minimal aesthetic
- Typography-first approach
- Spacious layout
- Warm color palette

#### Responsive Design
- Mobile-first approach
- Breakpoints for tablet and desktop
- Touch-friendly interactions

### 5. Data Features

#### JSON Fallback
- Works without database connection
- Automatic fallback on database errors
- Bundled profanity word data

#### Database Support
- Turso (libSQL) integration
- Distributed SQLite at the edge
- Automatic table creation

## Technology Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 16+ |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Database | Turso (libSQL) |
| API | Next.js Route Handlers |
| Language | TypeScript |

## Performance Optimizations

- Server-side rendering where applicable
- Client-side state management with React hooks
- Optimized bundle size
- Rate limiting to prevent abuse
- Paginated responses for large datasets

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
