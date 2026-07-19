# Variants API Documentation

## Overview

The Variants API provides leetspeak variant detection for Filipino profanity words. It enables detection of intentionally obfuscated words that use character substitutions (e.g., `g4g0` for `gago`) to bypass moderation systems.

## Database Schema

### `word_variants` Table

```sql
CREATE TABLE word_variants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profanity_id INTEGER NOT NULL,
  word TEXT NOT NULL,
  variant TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (profanity_id) REFERENCES profanity(id) ON DELETE CASCADE
);
```

| Field         | Type    | Description                                    |
|---------------|---------|------------------------------------------------|
| id            | INTEGER | Primary key, auto-incrementing                 |
| profanity_id  | INTEGER | Foreign key to `profanity.id`                  |
| word          | TEXT    | Original profanity word (lowercase)            |
| variant       | TEXT    | Leetspeak variant (lowercase)                  |
| created_at    | DATETIME | Timestamp when variant was added              |

### Indexes

- `idx_word_variants_word` — on `word` column
- `idx_word_variants_variant` — on `variant` column
- `idx_word_variants_profanity_id` — on `profanity_id` column

## Seeding

### Running the Seed Script

```bash
npx tsx scripts/seed-variants.ts
```

### What It Does

1. Creates the `word_variants` table if it doesn't exist
2. Creates indexes for efficient querying
3. Reads variants from `docs/leetspeak/filipino_variants.json`
4. Looks up each word's `profanity_id` from the `profanity` table
5. Inserts all variants using batch operations

### Re-seeding

The script is idempotent. If variants already exist, it drops and re-seeds them.

## API Endpoints

### GET /api/variants

List all profanity words with their leetspeak variants.

**Query Parameters:**

| Parameter | Type   | Required | Description                                              |
|-----------|--------|----------|----------------------------------------------------------|
| word      | string | No       | Filter by exact word (e.g., `gago`)                      |
| search    | string | No       | Search words by partial match (e.g., `gag`)              |
| page      | number | No       | Page number (default: 1)                                 |
| limit     | number | No       | Items per page (default: 50, max: 200)                   |

**Example Requests:**

```bash
# Fetch all words with variants
curl http://localhost:3000/api/variants

# Fetch variants for a specific word
curl "http://localhost:3000/api/variants?word=gago"

# Search for words matching a pattern
curl "http://localhost:3000/api/variants?search=gag"

# Paginated request
curl "http://localhost:3000/api/variants?page=1&limit=25"
```

**Response:**

```json
{
  "success": true,
  "count": 50,
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
        "gag0",
        "gaaago",
        "gaago",
        "ggo",
        "ggago"
      ]
    }
  ]
}
```

---

### GET /api/variants/lookup

Check if a text contains any known leetspeak variants.

**Query Parameters:**

| Parameter | Type   | Required | Description                          |
|-----------|--------|----------|--------------------------------------|
| text      | string | Yes      | Text to check (max 10,000 chars)     |

**Example Request:**

```bash
# GET request
curl "http://localhost:3000/api/variants/lookup?text=g4g0+ka+talaga"

# POST request
curl -X POST http://localhost:3000/api/variants/lookup \
  -H "Content-Type: application/json" \
  -d '{"text": "g4g0 ka talaga"}'
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

**No Match Response:**

```json
{
  "success": true,
  "hasMatch": false,
  "matchCount": 0,
  "data": [],
  "source": "database"
}
```

---

### Updated Endpoints

#### GET /api/health

Now includes `variantCount` in the database status:

```json
{
  "status": "ok",
  "database": {
    "connected": true,
    "wordCount": 310,
    "variantCount": 8196
  }
}
```

#### GET /api/stats

Now includes a `variants` section:

```json
{
  "success": true,
  "total": 310,
  "variants": {
    "totalWords": 109,
    "totalVariants": 8196
  },
  "source": "database"
}
```

---

## Rate Limiting

| Endpoint               | Limit | Window   |
|------------------------|-------|----------|
| `GET /api/variants`    | 60    | 1 minute |
| `GET /api/variants/lookup` | 30 | 1 minute |
| `POST /api/variants/lookup` | 30 | 1 minute |

Rate limit headers are included in every response:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`
- `Retry-After` (only on 429)

---

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Text query parameter is required"
}
```

### 429 Rate Limited

```json
{
  "success": false,
  "error": "Rate limit exceeded. Please try again later."
}
```

### 500 Server Error

```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Fallback Behavior

If the database connection fails, all endpoints fall back to reading from `docs/leetspeak/filipino_variants.json`. The `source` field in the response indicates whether data came from the database or JSON fallback.

---

## Usage Examples

### Check Text for Leetspeak Bypass

```javascript
async function checkForVariants(text) {
  const response = await fetch(
    `http://localhost:3000/api/variants/lookup?text=${encodeURIComponent(text)}`
  );
  const data = await response.json();

  if (data.hasMatch) {
    console.log("Profanity detected via leetspeak:");
    for (const match of data.data) {
      console.log(`  "${match.variant}" → "${match.word}" at position ${match.position}`);
    }
  }

  return data;
}

checkForVariants("g4g0 ka talaga");
```

### Get All Variants for a Word

```javascript
async function getWordVariants(word) {
  const response = await fetch(
    `http://localhost:3000/api/variants?word=${word}`
  );
  const data = await response.json();

  if (data.data.length > 0) {
    return data.data[0].variants;
  }
  return [];
}

getWordVariants("gago").then(console.log);
// ["6460", "6490", "g4g0", "g4go", "g@g0", "g@go", "gag0", ...]
```

### Python

```python
import requests

# Check text for leetspeak variants
response = requests.get(
    "http://localhost:3000/api/variants/lookup",
    params={"text": "g4g0 ka talaga"}
)
data = response.json()

if data["hasMatch"]:
    for match in data["data"]:
        print(f'  "{match["variant"]}" → "{match["word"]}"')
```

---

## Data Source

Variants are generated from `docs/leetspeak/filipino_variants.json` using the variant generation script (`scripts/generate-variants.ts`).

### Variant Generation Rules

- **Character substitutions**: a→4/@, b→8, e→3, g→6/9, i→1/!, l→1/|, o→0, s→5/$, t→7, z→2
- **Partial replacement**: 1-3 characters substituted at a time
- **Repeated characters**: 2-3 occurrences (e.g., `gaaago`)
- **Vowel omission**: Only when word remains recognizable
- **Case variants**: Mixed casing (e.g., `GaGo`, `GAGO`)
- **Separator variants**: Dots, underscores, hyphens (e.g., `g.a.g.o`)
- **Hyphen variants**: For multi-word profanity (e.g., `gago_ka`, `gago ka`)

### Quality Rules

All generated variants must be:
- Recognizable by humans
- Likely to appear online
- Commonly used to bypass profanity filters
- Not random or gibberish
