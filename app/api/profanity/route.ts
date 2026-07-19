import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/turso";
import * as fs from "fs";
import * as path from "path";
import { checkRateLimit, getRateLimitHeaders, getClientIdentifier } from "@/lib/rate-limit";

interface ProfanityWord {
  word: string;
  language: string;
  region: string | null;
  severity: string;
  variants: string[];
}

interface PureFilipinoItem {
  id: number;
  word: string;
}

interface RegionalItem {
  id: number;
  word: string;
}

interface VariantRow {
  word: string;
  variant: string;
}

interface PaginationParams {
  page: number;
  limit: number;
}

interface PaginatedResponse {
  success: boolean;
  type: string;
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
  data: ProfanityWord[];
}

function parsePagination(searchParams: URLSearchParams): PaginationParams {
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(200, Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10)));
  return { page, limit };
}

async function fetchVariantsFromDatabase(): Promise<Map<string, string[]>> {
  const variantMap = new Map<string, string[]>();
  try {
    const result = await db.execute("SELECT word, variant FROM word_variants ORDER BY word, variant");
    for (const row of result.rows) {
      const word = (row.word as string).toLowerCase();
      if (!variantMap.has(word)) {
        variantMap.set(word, []);
      }
      variantMap.get(word)!.push(row.variant as string);
    }
  } catch {
    // fallback to json
  }
  return variantMap;
}

function fetchVariantsFromJson(): Map<string, string[]> {
  const variantMap = new Map<string, string[]>();
  try {
    const variantsRaw = fs.readFileSync(
      path.join(process.cwd(), "docs", "leetspeak", "filipino_variants.json"),
      "utf-8"
    );
    const variantsFile: { data: { word: string; variants: string[] }[] } = JSON.parse(variantsRaw);
    for (const entry of variantsFile.data) {
      variantMap.set(entry.word.toLowerCase(), entry.variants);
    }
  } catch {
    // ignore
  }
  return variantMap;
}

async function getVariantMap(): Promise<Map<string, string[]>> {
  const dbMap = await fetchVariantsFromDatabase();
  if (dbMap.size > 0) return dbMap;
  return fetchVariantsFromJson();
}

async function fetchFromDatabase(type: string, word?: string): Promise<ProfanityWord[] | null> {
  try {
    let sql: string;
    let args: (string | null)[] = [];

    if (type === "filipino") {
      if (word) {
        sql = "SELECT word, language, region, severity FROM profanity WHERE language = ? AND word LIKE ?";
        args = ["filipino", `%${word}%`];
      } else {
        sql = "SELECT word, language, region, severity FROM profanity WHERE language = ?";
        args = ["filipino"];
      }
    } else if (type === "regional") {
      if (word) {
        sql = "SELECT word, language, region, severity FROM profanity WHERE language = ? AND word LIKE ?";
        args = ["regional", `%${word}%`];
      } else {
        sql = "SELECT word, language, region, severity FROM profanity WHERE language = ?";
        args = ["regional"];
      }
    } else {
      if (word) {
        sql = "SELECT word, language, region, severity FROM profanity WHERE word LIKE ?";
        args = [`%${word}%`];
      } else {
        sql = "SELECT word, language, region, severity FROM profanity";
      }
    }

    const result = await db.execute({ sql, args });
    return result.rows as unknown as ProfanityWord[];
  } catch {
    return null;
  }
}

function fetchFromJson(type: string, searchWord?: string): ProfanityWord[] {
  const pureFilipino = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "api", "pure_filipino.json"), "utf-8")
  ) as PureFilipinoItem[];

  const regional = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "api", "regional.json"), "utf-8")
  ) as RegionalItem[];

  const results: ProfanityWord[] = [];

  if (type === "filipino" || type === "all") {
    const filipinoWords = pureFilipino
      .filter((item) => !searchWord || item.word.toLowerCase().includes(searchWord.toLowerCase()))
      .map((item) => ({
        word: item.word,
        language: "filipino",
        region: null,
        severity: "medium",
        variants: [] as string[],
      }));
    results.push(...filipinoWords);
  }

  if (type === "regional" || type === "all") {
    const regionalWords = regional
      .filter((item) => !searchWord || item.word.toLowerCase().includes(searchWord.toLowerCase()))
      .map((item) => ({
        word: item.word,
        language: "regional",
        region: "visayan",
        severity: "medium",
        variants: [] as string[],
      }));
    results.push(...regionalWords);
  }

  return results;
}

function paginateData(
  data: ProfanityWord[],
  params: PaginationParams
): { paginated: ProfanityWord[]; total: number; totalPages: number } {
  const total = data.length;
  const totalPages = Math.ceil(total / params.limit);
  const start = (params.page - 1) * params.limit;
  const end = start + params.limit;
  const paginated = data.slice(start, end);

  return { paginated, total, totalPages };
}

export async function GET(request: NextRequest) {
  const clientIp = getClientIdentifier(request);
  const rateLimitResult = checkRateLimit(clientIp, 60, 60_000);
  const rateLimitHeaders = getRateLimitHeaders(rateLimitResult, 60);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: "Rate limit exceeded. Please try again later.",
      },
      {
        status: 429,
        headers: rateLimitHeaders,
      }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type") || "all";
  const word = searchParams.get("word") || undefined;
  const pagination = parsePagination(searchParams);

  const validTypes = ["filipino", "regional", "all"];
  if (!validTypes.includes(type)) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid type parameter. Use: filipino, regional, or all",
      },
      {
        status: 400,
        headers: rateLimitHeaders,
      }
    );
  }

  let data: ProfanityWord[];
  let source: "database" | "json" = "database";

  try {
    const dbData = await fetchFromDatabase(type, word);
    if (dbData) {
      data = dbData;
      source = "database";
    } else {
      data = fetchFromJson(type, word);
      source = "json";
    }
  } catch {
    data = fetchFromJson(type, word);
    source = "json";
  }

  const variantMap = await getVariantMap();

  for (const entry of data) {
    entry.variants = variantMap.get(entry.word.toLowerCase()) || [];
  }

  const { paginated, total, totalPages } = paginateData(data, pagination);

  const response: PaginatedResponse = {
    success: true,
    type,
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

  return NextResponse.json(response, {
    headers: rateLimitHeaders,
  });
}
