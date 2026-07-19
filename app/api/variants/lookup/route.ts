import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/turso";
import * as fs from "fs";
import * as path from "path";
import { checkRateLimit, getRateLimitHeaders, getClientIdentifier } from "@/lib/rate-limit";

interface LookupMatch {
  variant: string;
  word: string;
  position: number;
}

interface LookupResponse {
  success: boolean;
  hasMatch: boolean;
  matchCount: number;
  data: LookupMatch[];
  source: "database" | "json";
}

async function fetchAllVariants(): Promise<Map<string, string>[]> {
  try {
    const result = await db.execute(
      "SELECT variant, word FROM word_variants ORDER BY LENGTH(variant) DESC"
    );
    const variantToWord = new Map<string, string>();
    for (const row of result.rows) {
      variantToWord.set(row.variant as string, row.word as string);
    }
    return [variantToWord];
  } catch {
    return [];
  }
}

function fetchJsonVariants(): Map<string, string> {
  const variantsRaw = fs.readFileSync(
    path.join(process.cwd(), "docs", "leetspeak", "filipino_variants.json"),
    "utf-8"
  );
  const variantsFile: { data: { word: string; variants: string[] }[] } =
    JSON.parse(variantsRaw);

  const variantToWord = new Map<string, string>();
  for (const entry of variantsFile.data) {
    for (const variant of entry.variants) {
      variantToWord.set(variant.toLowerCase(), entry.word);
    }
  }
  return variantToWord;
}

async function lookupText(inputText: string): Promise<LookupResponse> {
  const normalizedText = inputText.toLowerCase();
  const matches: LookupMatch[] = [];
  const seen = new Set<string>();
  let source: "database" | "json" = "database";

  let variantToWord: Map<string, string>;

  try {
    const dbMaps = await fetchAllVariants();
    if (dbMaps.length > 0) {
      variantToWord = dbMaps[0];
      source = "database";
    } else {
      variantToWord = fetchJsonVariants();
      source = "json";
    }
  } catch {
    variantToWord = fetchJsonVariants();
    source = "json";
  }

  for (const [variant, word] of variantToWord) {
    const key = `${variant}:${word}`;
    if (seen.has(key)) continue;

    let position = normalizedText.indexOf(variant);
    while (position !== -1) {
      seen.add(key);
      matches.push({ variant, word, position });
      position = normalizedText.indexOf(variant, position + 1);
    }
  }

  matches.sort((a, b) => a.position - b.position);

  return {
    success: true,
    hasMatch: matches.length > 0,
    matchCount: matches.length,
    data: matches,
    source,
  };
}

export async function GET(request: NextRequest) {
  const clientIp = getClientIdentifier(request);
  const rateLimitResult = checkRateLimit(clientIp, 30, 60_000);
  const rateLimitHeaders = getRateLimitHeaders(rateLimitResult, 30);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { success: false, error: "Rate limit exceeded. Please try again later." },
      { status: 429, headers: rateLimitHeaders }
    );
  }

  const text = request.nextUrl.searchParams.get("text");

  if (!text) {
    return NextResponse.json(
      { success: false, error: "Text query parameter is required" },
      { status: 400, headers: rateLimitHeaders }
    );
  }

  if (text.length > 10_000) {
    return NextResponse.json(
      { success: false, error: "Text must not exceed 10,000 characters" },
      { status: 400, headers: rateLimitHeaders }
    );
  }

  try {
    const result = await lookupText(text);
    return NextResponse.json(result, { headers: rateLimitHeaders });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500, headers: rateLimitHeaders }
    );
  }
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIdentifier(request);
  const rateLimitResult = checkRateLimit(clientIp, 30, 60_000);
  const rateLimitHeaders = getRateLimitHeaders(rateLimitResult, 30);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { success: false, error: "Rate limit exceeded. Please try again later." },
      { status: 429, headers: rateLimitHeaders }
    );
  }

  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { success: false, error: "Text parameter is required" },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    if (text.length > 10_000) {
      return NextResponse.json(
        { success: false, error: "Text must not exceed 10,000 characters" },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    const result = await lookupText(text);
    return NextResponse.json(result, { headers: rateLimitHeaders });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400, headers: rateLimitHeaders }
    );
  }
}
