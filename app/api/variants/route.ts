import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/turso";
import * as fs from "fs";
import * as path from "path";
import { checkRateLimit, getRateLimitHeaders, getClientIdentifier } from "@/lib/rate-limit";

interface VariantEntry {
  word: string;
  variant: string;
}

interface WordVariants {
  word: string;
  variants: string[];
}

interface PaginationParams {
  page: number;
  limit: number;
}

interface PaginatedResponse {
  success: boolean;
  count: number;
  source: "database" | "json";
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  data: WordVariants[];
}

function parsePagination(searchParams: URLSearchParams): PaginationParams {
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(200, Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10)));
  return { page, limit };
}

function groupVariants(rows: VariantEntry[]): WordVariants[] {
  const map = new Map<string, Set<string>>();
  for (const row of rows) {
    if (!map.has(row.word)) {
      map.set(row.word, new Set());
    }
    map.get(row.word)!.add(row.variant);
  }

  const result: WordVariants[] = [];
  for (const [word, variants] of map) {
    result.push({
      word,
      variants: [...variants].sort(),
    });
  }
  return result.sort((a, b) => a.word.localeCompare(b.word));
}

async function fetchFromDatabase(
  word?: string,
  search?: string
): Promise<VariantEntry[] | null> {
  try {
    let sql: string;
    let args: (string | number)[] = [];

    if (word) {
      sql = "SELECT word, variant FROM word_variants WHERE LOWER(word) = ? ORDER BY variant";
      args = [word.toLowerCase()];
    } else if (search) {
      sql = "SELECT word, variant FROM word_variants WHERE LOWER(word) LIKE ? ORDER BY word, variant";
      args = [`%${search.toLowerCase()}%`];
    } else {
      sql = "SELECT word, variant FROM word_variants ORDER BY word, variant";
    }

    const result = await db.execute({ sql, args });
    return result.rows as unknown as VariantEntry[];
  } catch {
    return null;
  }
}

function fetchFromJson(word?: string, search?: string): VariantEntry[] {
  const variantsRaw = fs.readFileSync(
    path.join(process.cwd(), "docs", "leetspeak", "filipino_variants.json"),
    "utf-8"
  );
  const variantsFile: { data: { word: string; variants: string[] }[] } =
    JSON.parse(variantsRaw);

  const results: VariantEntry[] = [];

  for (const entry of variantsFile.data) {
    if (word && entry.word.toLowerCase() !== word.toLowerCase()) continue;
    if (search && !entry.word.toLowerCase().includes(search.toLowerCase())) continue;

    for (const variant of entry.variants) {
      results.push({ word: entry.word, variant });
    }
  }

  return results;
}

export async function GET(request: NextRequest) {
  const clientIp = getClientIdentifier(request);
  const rateLimitResult = checkRateLimit(clientIp, 60, 60_000);
  const rateLimitHeaders = getRateLimitHeaders(rateLimitResult, 60);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { success: false, error: "Rate limit exceeded. Please try again later." },
      { status: 429, headers: rateLimitHeaders }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const word = searchParams.get("word") || undefined;
  const search = searchParams.get("search") || undefined;
  const pagination = parsePagination(searchParams);

  let rows: VariantEntry[];
  let source: "database" | "json" = "database";

  try {
    const dbRows = await fetchFromDatabase(word, search);
    if (dbRows) {
      rows = dbRows;
      source = "database";
    } else {
      rows = fetchFromJson(word, search);
      source = "json";
    }
  } catch {
    rows = fetchFromJson(word, search);
    source = "json";
  }

  const allGrouped = groupVariants(rows);
  const total = allGrouped.length;
  const totalPages = Math.ceil(total / pagination.limit);
  const start = (pagination.page - 1) * pagination.limit;
  const end = start + pagination.limit;
  const paginated = allGrouped.slice(start, end);

  const response: PaginatedResponse = {
    success: true,
    count: paginated.length,
    source,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages,
      hasNext: pagination.page < totalPages,
      hasPrev: pagination.page > 1,
    },
    data: paginated,
  };

  return NextResponse.json(response, { headers: rateLimitHeaders });
}
