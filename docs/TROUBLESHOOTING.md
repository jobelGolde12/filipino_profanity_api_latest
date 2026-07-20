# Troubleshooting Guide

This guide covers common issues you may encounter when using the Filipino Profanity API, along with solutions and workarounds.

---

## Table of Contents

1. [Slow Response Times](#1-slow-response-times)
2. [Rate Limiting Issues](#2-rate-limiting-issues)
3. [Timeout Errors](#3-timeout-errors)
4. [Text Check Not Detecting Words](#4-text-check-not-detecting-words)
5. [Batch Request Failures](#5-batch-request-failures)
6. [Database vs JSON Fallback](#6-database-vs-json-fallback)
7. [Memory and Payload Size Issues](#7-memory-and-payload-size-issues)
8. [CORS Issues](#8-cors-issues)
9. [Leetspeak Detection Issues](#9-leetspeak-detection-issues)
10. [Tracking Loop / Slow Admin Requests](#10-tracking-loop--slow-admin-requests)

---

## 1. Slow Response Times

### Symptom
API requests take several seconds to complete, especially for `/api/check` and `/api/mask`.

### Root Cause
The text checking algorithm uses **O(n × m)** complexity where:
- `n` = number of profanity words in the database (315+ base words)
- `m` = length of the input text

Each word is checked against the text using `String.includes()`, and for each match, an additional database query is made to fetch word details (N+1 query problem).

### Affected Endpoints
| Endpoint | Impact Level |
|----------|--------------|
| `GET /api/check` | High - scans all 315+ words per request |
| `POST /api/check/batch` | Critical - scans all words × number of texts |
| `POST /api/mask` | High - regex matching for all words |
| `GET /api/variants/lookup` | High - loads all 8,000+ variants |

### Solutions

**For Users:**
1. **Use shorter texts** - Keep input under 500 characters when possible
2. **Use the base words endpoint** (`/api/profanity/base`) to check against a smaller word list
3. **Batch wisely** - Send fewer texts per batch request
4. **Cache results** - Store API responses locally for repeated checks

**Example: Optimize your request**
```javascript
// Instead of checking a long paragraph at once
const longText = "Very long text with many sentences...".repeat(100);

// Break it into smaller chunks
const chunks = splitText(longText, 500);
const results = await Promise.all(
  chunks.map(chunk => fetch(`/api/check?text=${encodeURIComponent(chunk)}`))
);
```

---

## 2. Rate Limiting Issues

### Symptom
```json
{
  "success": false,
  "error": "Rate limit exceeded. Please try again later."
}
```
HTTP Status: `429`

### Rate Limits by Endpoint

| Endpoint | Limit | Window |
|----------|-------|--------|
| `GET /api/profanity` | 60 requests | 1 minute |
| `GET /api/profanity/base` | 60 requests | 1 minute |
| `GET /api/check` | **No limit** | - |
| `POST /api/check` | **No limit** | - |
| `GET /api/check/batch` | N/A (POST only) | - |
| `POST /api/check/batch` | 20 requests | 1 minute |
| `POST /api/mask` | 30 requests | 1 minute |
| `GET /api/variants` | 60 requests | 1 minute |
| `GET /api/variants/lookup` | 30 requests | 1 minute |
| `POST /api/variants/lookup` | 30 requests | 1 minute |

### Important Notes

1. **In-Memory Rate Limiting**: Rate limits are tracked in server memory. On serverless platforms (Vercel), limits reset on cold starts.

2. **Per-IP Tracking**: Limits are applied per IP address. If you're behind a corporate proxy, multiple users may share the same IP.

3. **Headers**: Check these response headers to monitor your usage:
   ```
   X-RateLimit-Limit: 60
   X-RateLimit-Remaining: 45
   X-RateLimit-Reset: 1705658460
   ```

### Solutions

1. **Implement client-side throttling**
   ```javascript
   async function throttledCheck(text, delayMs = 1000) {
     const result = await fetch(`/api/check?text=${encodeURIComponent(text)}`);
     if (result.status === 429) {
       await new Promise(r => setTimeout(r, delayMs));
       return throttledCheck(text, delayMs * 2); // Exponential backoff
     }
     return result.json();
   }
   ```

2. **Use batch endpoint** - Check multiple texts in one request instead of multiple single requests

3. **Cache responses** - Store results locally to avoid repeated API calls

---

## 3. Timeout Errors

### Symptom
Request fails with a timeout or connection error.

### Common Causes
- Serverless function timeout (typically 10-60 seconds on Vercel)
- Very long input text
- High server load

### Solutions

1. **Reduce input size**
   ```bash
   # Instead of this (may timeout):
   curl -X POST https://api.example.com/api/check/batch \
     -d '{"texts": ["text1", "text2", ..., "text10"]}'

   # Do this (smaller batches):
   curl -X POST https://api.example.com/api/check/batch \
     -d '{"texts": ["text1", "text2", "text3"]}'
   ```

2. **Use streaming for large volumes**
   ```javascript
   async function checkLargeVolume(texts) {
     const results = [];
     for (const batch of chunk(texts, 3)) {
       const result = await fetch('/api/check/batch', {
         method: 'POST',
         body: JSON.stringify({ texts: batch })
       });
       results.push(await result.json());
       await new Promise(r => setTimeout(r, 1100)); // Wait for rate limit reset
     }
     return results;
   }
   ```

---

## 4. Text Check Not Detecting Words

### Symptom
Known profanity words are not being detected in the input text.

### Common Causes

1. **Case Sensitivity** - The API normalizes text to lowercase, but check for encoding issues
2. **Special Characters** - Words with accents or special characters may not match
3. **Leetspeak** - Use `/api/variants/lookup` for obfuscated text like `g4g0`

### Solutions

```javascript
// For standard text
const result = await fetch('/api/check', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'Your text here' })
});

// For leetspeak/obfuscated text
const variantResult = await fetch('/api/variants/lookup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'g4g0 k4 t4l4g4' })
});

// Combine both for comprehensive detection
const [standardCheck, variantCheck] = await Promise.all([
  result.json(),
  variantResult.json()
]);

const allProfanity = [
  ...standardCheck.data,
  ...variantCheck.data.map(d => ({ word: d.word, variant: d.variant }))
];
```

---

## 5. Batch Request Failures

### Symptom
Batch requests fail with validation errors.

### Common Errors

| Error Message | Cause | Solution |
|---------------|-------|----------|
| `texts parameter is required and must be an array` | Missing or wrong format | Send `{"texts": [...]}` |
| `texts array cannot be empty` | Empty array | Send at least one text |
| `Maximum 10 texts allowed per batch request` | Too many texts | Split into multiple requests |
| `All items in texts array must be strings` | Non-string items | Ensure all items are strings |
| `Each text must not exceed 5,000 characters` | Text too long | Shorten each text |

### Correct Request Format

```javascript
// Correct
const response = await fetch('/api/check/batch', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    texts: [
      "First text to check",
      "Second text to check"
    ]
  })
});

// Response
{
  "success": true,
  "totalTexts": 2,
  "textsWithProfanity": 1,
  "results": [...]
}
```

---

## 6. Database vs JSON Fallback

### How It Works

The API uses a two-tier data source:

1. **Primary**: Turso database (if configured)
2. **Fallback**: JSON files in the repository

### Checking Your Data Source

Look at the `source` field in API responses:
```json
{
  "success": true,
  "source": "database",  // or "json"
  ...
}
```

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| `source: "json"` when expecting database | Database not configured | Set up Turso credentials in `.env` |
| Missing words | JSON files not synced | Re-seed database with `npx tsx scripts/seed.ts` |
| Variants not loading | word_variants table empty | Run `npx tsx scripts/seed-variants.ts` |

---

## 7. Memory and Payload Size Issues

### Response Size Limits

| Endpoint | Max Response Size |
|----------|-------------------|
| `GET /api/profanity` | ~500KB (all words with variants) |
| `GET /api/profanity/base` | ~50KB (base words only) |
| `POST /api/check/batch` | ~100KB (10 texts) |

### Input Size Limits

| Endpoint | Max Input |
|----------|-----------|
| `POST /api/mask` | 10,000 characters |
| `GET /api/variants/lookup` | 10,000 characters |
| `POST /api/check/batch` | 5,000 characters per text |
| `GET /api/check` | No explicit limit (but impacts performance) |

### Solutions

```javascript
// Check text length before sending
function validateAndCheck(text) {
  if (text.length > 10000) {
    throw new Error('Text too long. Maximum 10,000 characters.');
  }
  return fetch('/api/check', {
    method: 'POST',
    body: JSON.stringify({ text })
  });
}

// For large texts, split into chunks
function splitAndCheck(text, chunkSize = 5000) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return Promise.all(chunks.map(chunk => checkText(chunk)));
}
```

---

## 8. CORS Issues

### Symptom
Browser console shows:
```
Access to fetch blocked by CORS policy
```

### Solution

The API is designed for server-side usage. For browser-based applications:

1. **Use a proxy server** - Route requests through your backend
2. **Use the Vercel deployment** - The production URL has CORS configured

```javascript
// Server-side (Node.js)
const response = await fetch('https://filipino-profanity-api-latest.vercel.app/api/check', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'test' })
});
```

---

## 9. Leetspeak Detection Issues

### Symptom
Obfuscated text like `g4g0` or `b0b0` not being detected.

### Solutions

1. **Use the correct endpoint**
   ```bash
   # For leetspeak detection
   GET /api/variants/lookup?text=g4g0+ka+talaga

   # NOT this endpoint (only checks base words)
   GET /api/check?text=g4g0+ka+talaga
   ```

2. **Combine both endpoints for full coverage**
   ```javascript
   async function comprehensiveCheck(text) {
     const [standard, leetspeak] = await Promise.all([
       fetch(`/api/check?text=${encodeURIComponent(text)}`),
       fetch(`/api/variants/lookup?text=${encodeURIComponent(text)}`)
     ]);
     
     return {
       standard: await standard.json(),
       leetspeak: await leetspeak.json()
     };
   }
   ```

---

## 10. Tracking Loop / Slow Admin Requests

### Symptom
Server logs show repeated slow requests to `/api/admin/track`:
```
POST /api/admin/track 200 in 44s
POST /api/admin/track 200 in 44s
POST /api/admin/track 200 in 2.6s
```

### Root Cause
The middleware was tracking ALL `/api/*` requests, including `/api/admin/track` itself. This created an **infinite recursive loop**:

1. User makes request to `/api/profanity`
2. Middleware calls `fetch('/api/admin/track')` to log the request
3. That track request matches `/api/*`, so middleware tries to track IT
4. Middleware calls `fetch('/api/admin/track')` again
5. Loop repeats until server timeout (44+ seconds)

### The Fix

The middleware must exclude tracking endpoints from being tracked:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Exclude admin/track to prevent infinite loop
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/admin/")) {
    // ... track the request
  }

  return NextResponse.next();
}
```

### Best Practices for Tracking Middleware

1. **Always exclude the tracking endpoint itself** from interception
2. **Use fire-and-forget** - Don't await the tracking promise
3. **Set short timeouts** - Prevent tracking failures from blocking requests
4. **Monitor for loops** - Watch for unusually high request counts to tracking endpoints

```typescript
// Good: Fire and forget with exclusion
if (pathname.startsWith("/api/") && !pathname.startsWith("/api/admin/")) {
  fetch(trackUrl, { method: "POST", body: ... }).catch(() => {});
}

// Bad: Awaiting or not excluding
if (pathname.startsWith("/api/")) {
  await fetch(trackUrl); // Will cause infinite loop!
}
```

---

## Performance Tips

### Do's

1. **Use pagination** - Don't fetch all words at once
   ```bash
   GET /api/profanity?page=1&limit=50
   ```

2. **Use the base endpoint** when variants aren't needed
   ```bash
   GET /api/profanity/base
   ```

3. **Batch requests** - Check multiple texts at once
   ```bash
   POST /api/check/batch
   {"texts": ["text1", "text2"]}
   ```

4. **Cache responses** - Store results locally

### Don'ts

1. **Don't poll rapidly** - Respect rate limits
2. **Don't send very long texts** - Keep under 5000 characters
3. **Don't fetch all pages** - Only request what you need
4. **Don't ignore rate limit headers** - Monitor `X-RateLimit-Remaining`

---

## Getting Help

If you encounter issues not covered here:

1. Check the [API Documentation](https://filipino-profanity-api-latest.vercel.app/docs)
2. [Report a Bug](https://github.com/jobelGolde12/filipino_profanity_api_latest/issues)
3. Test your requests using the [API Playground](https://filipino-profanity-api-latest.vercel.app/#api-tester)
