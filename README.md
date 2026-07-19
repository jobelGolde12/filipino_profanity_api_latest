# Filipino Profanity API

A free REST API for detecting Filipino and regional profanity words, with 310 words across two language categories.

## Features

- **310 profanity words** (110 Filipino + 200 Regional)
- **Real-time text detection** with profanity matching
- **Text masking** with partial/full masking options
- **Batch checking** for multiple texts at once
- **Rate limiting** to prevent abuse
- **Health monitoring** endpoint
- **Statistics API** for word counts by language/region
- **JSON fallback** when database is unavailable

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## API Endpoints

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Fetch Profanity Words
```bash
# All words
curl http://localhost:3000/api/profanity

# With pagination
curl "http://localhost:3000/api/profanity?page=1&limit=25"

# Filter by language
curl http://localhost:3000/api/profanity?type=filipino
```

### Check Text for Profanity
```bash
curl -X POST http://localhost:3000/api/check \
  -H "Content-Type: application/json" \
  -d '{"text": "Your text here"}'
```

### Batch Check Multiple Texts
```bash
curl -X POST http://localhost:3000/api/check/batch \
  -H "Content-Type: application/json" \
  -d '{"texts": ["text1", "text2", "text3"]}'
```

### Mask Profanity Words
```bash
curl -X POST http://localhost:3000/api/mask \
  -H "Content-Type: application/json" \
  -d '{"text": "You are a gago", "partial": true}'
```

### Get Statistics
```bash
curl http://localhost:3000/api/stats
```

## Documentation

Visit [http://localhost:3000/docs](http://localhost:3000/docs) for complete API documentation.

## Rate Limiting

All endpoints (except `/api/health`) are rate-limited per IP:

| Endpoint | Limit | Window |
|----------|-------|--------|
| GET /api/profanity | 60 | 1 min |
| GET /api/stats | 60 | 1 min |
| POST /api/check | 30 | 1 min |
| POST /api/mask | 30 | 1 min |
| POST /api/check/batch | 20 | 1 min |

## Database Setup (Optional)

For production use with Turso database:

1. Create a Turso account at [turso.tech](https://turso.tech)
2. Create a database and get credentials
3. Update `.env` file:
   ```
   TURSO_DATABASE_URL=libsql://your-db.turso.io
   TURSO_AUTH_TOKEN=your-token
   ```
4. Seed the database:
   ```bash
   npx tsx scripts/seed.ts
   ```

Without database configuration, the API automatically uses JSON fallback.

## Tech Stack

- **Framework**: Next.js 16+
- **Styling**: Tailwind CSS v4
- **Database**: Turso (libSQL)
- **Language**: TypeScript
- **Icons**: Lucide React

## License

MIT
