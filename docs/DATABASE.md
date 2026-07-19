# Database Documentation

## Schema

The profanity table is designed to store profanity words with language and regional information.

```sql
CREATE TABLE profanity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  word TEXT NOT NULL,
  language TEXT NOT NULL,
  region TEXT,
  severity TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Fields

| Field      | Type    | Description                           |
|------------|---------|---------------------------------------|
| id         | INTEGER | Primary key, auto-incrementing        |
| word       | TEXT    | The profanity word (required)         |
| language   | TEXT    | Language category: `filipino` or `regional` |
| region     | TEXT    | Regional dialect (e.g., `visayan`)    |
| severity   | TEXT    | Severity level: `low`, `medium`, `high` |
| created_at | DATETIME | Timestamp when word was added        |

## Word Variants Table

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

### Fields

| Field        | Type    | Description                                    |
|--------------|---------|------------------------------------------------|
| id           | INTEGER | Primary key, auto-incrementing                 |
| profanity_id | INTEGER | Foreign key to `profanity.id`                  |
| word         | TEXT    | Original profanity word (lowercase)            |
| variant      | TEXT    | Leetspeak variant (lowercase)                  |
| created_at   | DATETIME | Timestamp when variant was added              |

### Indexes

| Index Name                          | Column        |
|-------------------------------------|---------------|
| idx_word_variants_word              | word          |
| idx_word_variants_variant           | variant       |
| idx_word_variants_profanity_id      | profanity_id  |

## Seeding Process

### Profanity Words

The seed script (`scripts/seed.ts`) populates the database with profanity words from JSON files:

1. `api/pure_filipino.json` - Filipino profanity words
2. `api/regional.json` - Regional dialect profanity words

### Running the Seed Script

```bash
npx tsx scripts/seed.ts
```

### Variant Data

The variant seed script (`scripts/seed-variants.ts`) populates the `word_variants` table from `docs/leetspeak/filipino_variants.json`.

### Running the Variant Seed Script

```bash
npx tsx scripts/seed-variants.ts
```

### Seed Script Logic

1. Creates the `profanity` table if it doesn't exist
2. Checks if data already exists (prevents duplicate seeding)
3. Inserts all Filipino profanity words with `language = 'filipino'`
4. Inserts all regional profanity words with `language = 'regional'`

## Migration Guide

### Adding New Words

1. Add words to the appropriate JSON file:
   - `api/pure_filipino.json` for Filipino words
   - `api/regional.json` for regional words

2. Re-run the seed script:
   ```bash
   npx tsx scripts/seed.ts
   ```

### Manual Insert

```sql
INSERT INTO profanity (word, language, region, severity) 
VALUES ('new-word', 'filipino', NULL, 'medium');
```

### Query Examples

```sql
-- Get all Filipino profanity
SELECT * FROM profanity WHERE language = 'filipino';

-- Get all regional profanity from Visayas
SELECT * FROM profanity WHERE language = 'regional' AND region = 'visayan';

-- Search for a specific word
SELECT * FROM profanity WHERE word LIKE '%gago%';

-- Get all variants for a specific word
SELECT wv.variant, wv.word
FROM word_variants wv
WHERE wv.word = 'gago';

-- Check if text contains any variant (example: 'g4g0')
SELECT wv.word, wv.variant
FROM word_variants wv
WHERE 'g4g0' LIKE '%' || wv.variant || '%';

-- Get variant counts per word
SELECT wv.word, COUNT(*) as variant_count
FROM word_variants wv
GROUP BY wv.word
ORDER BY variant_count DESC;

-- Get total variant statistics
SELECT
  COUNT(DISTINCT word) as total_words,
  COUNT(*) as total_variants
FROM word_variants;
```

## Fallback Behavior

If the database connection fails or the table doesn't exist, the API automatically falls back to serving data from the JSON files. This ensures the API remains functional even without database configuration.
