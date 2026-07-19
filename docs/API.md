# API Documentation

## Base URL

```
http://localhost:3000/api
```

## Rate Limiting

All API endpoints (except `/api/health`) are rate-limited per IP address:

| Endpoint | Limit | Window |
|----------|-------|--------|
| `GET /api/profanity` | 60 requests | 1 minute |
| `GET /api/stats` | 60 requests | 1 minute |
| `GET /api/health` | No limit | N/A |
| `POST /api/check` | 30 requests | 1 minute |
| `POST /api/mask` | 30 requests | 1 minute |
| `POST /api/check/batch` | 20 requests | 1 minute |
| `GET /api/variants` | 60 requests | 1 minute |
| `GET /api/variants/lookup` | 30 requests | 1 minute |
| `POST /api/variants/lookup` | 30 requests | 1 minute |

Rate limit headers are included in every response:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Unix timestamp when window resets
- `Retry-After`: Seconds to wait (only on 429)

## Endpoints

### GET /api/health

Check API health status and database connectivity.

**Example Request:**

```bash
curl http://localhost:3000/api/health
```

**Response (200 OK):**

```json
{
  "status": "ok",
  "timestamp": "2025-01-19T12:00:00.000Z",
  "uptime": 3600.5,
  "database": {
    "connected": true,
    "wordCount": 310
  },
  "version": "1.0.0",
  "responseTime": "12ms"
}
```

**Response (503 Degraded):**

```json
{
  "status": "degraded",
  "database": {
    "connected": false,
    "wordCount": 0
  }
}
```

---

### GET /api/profanity

Fetch profanity words with optional filtering and pagination.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | string | No | Filter by language: `filipino`, `regional`, `all` (default: `all`) |
| word | string | No | Search for specific word |
| page | integer | No | Page number (default: 1) |
| limit | integer | No | Items per page (default: 50, max: 200) |

**Example Requests:**

```bash
# Fetch all profanity words (first page)
curl http://localhost:3000/api/profanity

# Fetch with pagination
curl "http://localhost:3000/api/profanity?page=1&limit=25"

# Fetch only Filipino profanity
curl http://localhost:3000/api/profanity?type=filipino

# Fetch only regional profanity
curl http://localhost:3000/api/profanity?type=regional

# Search for a specific word
curl "http://localhost:3000/api/profanity?word=gago"
```

**Response:**

```json
{
  "success": true,
  "type": "all",
  "count": 50,
  "source": "database",
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 310,
    "totalPages": 7,
    "hasNext": true,
    "hasPrev": false
  },
  "data": [
    {
      "word": "abnormal",
      "language": "filipino",
      "region": null,
      "severity": "medium"
    },
    {
      "word": "agbaliw",
      "language": "regional",
      "region": "visayan",
      "severity": "medium"
    }
  ]
}
```

---

### POST /api/check

Check if a text contains profanity.

**Request Body:**

```json
{
  "text": "Sample text to check"
}
```

**Example Request:**

```bash
curl -X POST http://localhost:3000/api/check \
  -H "Content-Type: application/json" \
  -d '{"text": "This text contains gago"}'
```

**Response:**

```json
{
  "success": true,
  "hasProfanity": true,
  "count": 1,
  "data": [
    {
      "word": "gago",
      "language": "filipino",
      "region": null,
      "severity": "medium"
    }
  ]
}
```

---

### POST /api/check/batch

Check multiple texts for profanity in a single request.

**Request Body:**

```json
{
  "texts": [
    "First text to check",
    "Second text to check",
    "Third text to check"
  ]
}
```

**Limits:**
- Maximum 10 texts per request
- Each text must not exceed 5,000 characters

**Example Request:**

```bash
curl -X POST http://localhost:3000/api/check/batch \
  -H "Content-Type: application/json" \
  -d '{"texts": ["Hello world", "You are gago"]}'
```

**Response:**

```json
{
  "success": true,
  "totalTexts": 2,
  "textsWithProfanity": 1,
  "results": [
    {
      "text": "Hello world",
      "hasProfanity": false,
      "count": 0,
      "data": []
    },
    {
      "text": "You are gago",
      "hasProfanity": true,
      "count": 1,
      "data": [
        {
          "word": "gago",
          "language": "filipino",
          "region": null,
          "severity": "medium"
        }
      ]
    }
  ]
}
```

---

### POST /api/mask

Mask profanity words in text with asterisks or custom characters.

**Request Body:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| text | string | required | Text to mask (max 10,000 characters) |
| maskChar | string | * | Single character to use for masking |
| partial | boolean | true | Keep first letter visible (e.g., g***) |

**Example Request:**

```bash
curl -X POST http://localhost:3000/api/mask \
  -H "Content-Type: application/json" \
  -d '{"text": "You are a gago", "maskChar": "*", "partial": true}'
```

**Response:**

```json
{
  "success": true,
  "original": "You are a gago",
  "masked": "You are a g***",
  "matchCount": 1,
  "matches": ["gago"],
  "details": [
    {
      "word": "gago",
      "start": 10,
      "end": 14,
      "original": "gago",
      "masked": "g***"
    }
  ]
}
```

**Partial vs Full Masking:**

```json
// Partial masking (default): gago → g***
{"text": "gago", "partial": true}

// Full masking: gago → ****
{"text": "gago", "partial": false}
```

---

### GET /api/stats

Get statistics about the profanity word database.

**Example Request:**

```bash
curl http://localhost:3000/api/stats
```

**Response:**

```json
{
  "success": true,
  "total": 310,
  "byLanguage": {
    "filipino": {
      "count": 110,
      "percentage": 35
    },
    "regional": {
      "count": 200,
      "percentage": 65
    }
  },
  "bySeverity": {
    "low": 0,
    "medium": 310,
    "high": 0
  },
  "byRegion": {
    "none": 110,
    "visayan": 200
  },
  "source": "database"
}
```

---

---

### GET /api/variants

Fetch leetspeak variants for profanity words.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| word | string | No | Filter by exact word |
| search | string | No | Search words by partial match |
| page | integer | No | Page number (default: 1) |
| limit | integer | No | Items per page (default: 50, max: 200) |

**Example Request:**

```bash
# Fetch all words with variants
curl http://localhost:3000/api/variants

# Fetch variants for a specific word
curl "http://localhost:3000/api/variants?word=gago"

# Search for words matching a pattern
curl "http://localhost:3000/api/variants?search=gag"
```

**Response:**

```json
{
  "success": true,
  "count": 1,
  "source": "database",
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 109,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  },
  "data": [
    {
      "word": "gago",
      "variants": [
        "6460",
        "6490",
        "g4g0",
        "g4go",
        "g@g0",
        "g@go",
        "gag0"
      ]
    }
  ]
}
```

---

### GET /api/variants/lookup

Check if text contains any known leetspeak variants.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| text | string | Yes | Text to check (max 10,000 chars) |

**Example Request:**

```bash
curl "http://localhost:3000/api/variants/lookup?text=g4g0+ka+talaga"
```

**Response:**

```json
{
  "success": true,
  "hasMatch": true,
  "matchCount": 1,
  "data": [
    {
      "variant": "g4g0",
      "word": "gago",
      "position": 0
    }
  ],
  "source": "database"
}
```

---

### POST /api/variants/lookup

Check if text contains any known leetspeak variants (POST method).

**Request Body:**

```json
{
  "text": "g4g0 ka talaga"
}
```

**Response:**

```json
{
  "success": true,
  "hasMatch": true,
  "matchCount": 1,
  "data": [
    {
      "variant": "g4g0",
      "word": "gago",
      "position": 0
    }
  ],
  "source": "database"
}
```

---

## Error Responses

```json
{
  "success": false,
  "error": "Invalid type parameter. Use: filipino, regional, or all"
}
```

## Code Examples

### JavaScript (Fetch)

```javascript
async function getData() {
  try {
    const response = await fetch("http://localhost:3000/api/profanity?type=all");
    if (!response.ok) {
      throw new Error("HTTP error! Status: " + response.status);
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
getData();
```

### Python

```python
import requests

try:
    response = requests.get("http://localhost:3000/api/profanity?type=all")
    response.raise_for_status()
    data = response.json()
    print(data)
except requests.exceptions.RequestException as e:
    print("Error fetching data:", e)
```

### cURL Examples

```bash
# Health check
curl http://localhost:3000/api/health

# Fetch all words
curl http://localhost:3000/api/profanity

# Check text for profanity
curl -X POST http://localhost:3000/api/check \
  -H "Content-Type: application/json" \
  -d '{"text": "test text"}'

# Batch check
curl -X POST http://localhost:3000/api/check/batch \
  -H "Content-Type: application/json" \
  -d '{"texts": ["text1", "text2"]}'

# Mask profanity
curl -X POST http://localhost:3000/api/mask \
  -H "Content-Type: application/json" \
  -d '{"text": "You are gago"}'

# Get statistics
curl http://localhost:3000/api/stats
```
