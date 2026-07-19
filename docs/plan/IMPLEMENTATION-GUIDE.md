# Quick Implementation Guide

## 1. Fix Hardcoded Credentials

**Current problem** (`app/api/reports/admin/route.ts:4-5`):
```typescript
const ADMIN_EMAIL = "jobelgolde43@gmail.com";
const ADMIN_PASS = "My_api_pass123";
```

**Fix**:
```typescript
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASS = process.env.ADMIN_PASS;

if (!ADMIN_EMAIL || !ADMIN_PASS) {
  throw new Error("ADMIN_EMAIL and ADMIN_PASS must be set in environment variables");
}
```

**`.env` additions**:
```
ADMIN_EMAIL=jobelgolde43@gmail.com
ADMIN_PASS=your_secure_password_here
```

---

## 2. Add Health Check Endpoint

**Create** `app/api/health/route.ts`:
```typescript
import { NextResponse } from "next/server";
import { db } from "@/lib/turso";

export async function GET() {
  const checks = {
    status: "ok",
    timestamp: new Date().toISOString(),
    database: "unknown",
    wordCount: 0,
  };

  try {
    const result = await db.execute("SELECT COUNT(*) as count FROM profanity");
    checks.database = "connected";
    checks.wordCount = Number(result.rows[0]?.count ?? 0);
  } catch {
    checks.database = "disconnected";
    checks.status = "degraded";
  }

  const status = checks.status === "ok" ? 200 : 503;
  return NextResponse.json(checks, { status });
}
```

---

## 3. Add Rate Limiting

**Create** `lib/rate-limit.ts`:
```typescript
const rateLimit = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  ip: string,
  limit = 60,
  windowMs = 60000
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record || now > record.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetTime: now + windowMs };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  return { allowed: true, remaining: limit - record.count, resetTime: record.resetTime };
}
```

**Usage in routes**:
```typescript
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const { allowed, remaining, resetTime } = checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { success: false, error: "Rate limit exceeded" },
      {
        status: 429,
        headers: {
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": resetTime.toString(),
        },
      }
    );
  }

  // ... normal handler
}
```

---

## 4. Add Text Masking Endpoint

**Create** `app/api/mask/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/turso";

async function getAllWords(): Promise<string[]> {
  try {
    const result = await db.execute("SELECT word FROM profanity");
    return result.rows.map((row) => (row.word as string).toLowerCase());
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, maskChar = "*", partial = true } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { success: false, error: "Text parameter is required" },
        { status: 400 }
      );
    }

    const words = await getAllWords();
    let maskedText = text;
    const matches: { word: string; start: number; end: number }[] = [];

    for (const word of words) {
      const regex = new RegExp(word, "gi");
      let match;
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          word: match[0],
          start: match.index,
          end: match.index + match[0].length,
        });
      }
    }

    // Sort by position (reverse to maintain indices)
    matches.sort((a, b) => b.start - a.start);

    for (const m of matches) {
      const replacement = partial
        ? m.word[0] + maskChar.repeat(m.word.length - 1)
        : maskChar.repeat(m.word.length);
      maskedText = maskedText.slice(0, m.start) + replacement + maskedText.slice(m.end);
    }

    return NextResponse.json({
      success: true,
      original: text,
      masked: maskedText,
      matchCount: matches.length,
      matches: matches.map((m) => m.word),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

---

## 5. Add Pagination to /api/profanity

**Modify** `app/api/profanity/route.ts`:
```typescript
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type") || "all";
  const word = searchParams.get("word") || undefined;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(200, Math.max(1, parseInt(searchParams.get("limit") ?? "50")));

  // ... existing fetch logic ...

  const total = data.length;
  const offset = (page - 1) * limit;
  const paginatedData = data.slice(offset, offset + limit);

  return NextResponse.json({
    success: true,
    type,
    count: paginatedData.length,
    source,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: paginatedData,
  });
}
```
