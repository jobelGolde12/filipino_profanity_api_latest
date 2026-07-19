import { NextResponse } from "next/server";
import { db } from "@/lib/turso";
import * as fs from "fs";
import * as path from "path";
import { checkRateLimit, getRateLimitHeaders, getClientIdentifier } from "@/lib/rate-limit";

interface LanguageStats {
  count: number;
  percentage: number;
}

interface SeverityStats {
  low: number;
  medium: number;
  high: number;
}

interface RegionStats {
  [region: string]: number;
}

interface VariantStats {
  totalWords: number;
  totalVariants: number;
}

interface StatsResponse {
  success: boolean;
  total: number;
  byLanguage: {
    filipino: LanguageStats;
    regional: LanguageStats;
  };
  bySeverity: SeverityStats;
  byRegion: RegionStats;
  variants: VariantStats;
  source: "database" | "json";
}

interface WordRecord {
  word: string;
  language: string;
  region: string | null;
  severity: string;
}

async function fetchFromDatabase(): Promise<WordRecord[] | null> {
  try {
    const result = await db.execute(
      "SELECT word, language, region, severity FROM profanity"
    );
    return result.rows as unknown as WordRecord[];
  } catch {
    return null;
  }
}

function fetchFromJson(): WordRecord[] {
  const pureFilipino = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "api", "pure_filipino.json"), "utf-8")
  ) as { word: string }[];

  const regional = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "api", "regional.json"), "utf-8")
  ) as { word: string }[];

  const results: WordRecord[] = [];

  for (const item of pureFilipino) {
    results.push({
      word: item.word,
      language: "filipino",
      region: null,
      severity: "medium",
    });
  }

  for (const item of regional) {
    results.push({
      word: item.word,
      language: "regional",
      region: "visayan",
      severity: "medium",
    });
  }

  return results;
}

function calculateStats(words: WordRecord[]): Omit<StatsResponse, "success" | "source" | "variants"> {
  const total = words.length;

  const filipinoCount = words.filter((w) => w.language === "filipino").length;
  const regionalCount = words.filter((w) => w.language === "regional").length;

  const byLanguage = {
    filipino: {
      count: filipinoCount,
      percentage: total > 0 ? Math.round((filipinoCount / total) * 100) : 0,
    },
    regional: {
      count: regionalCount,
      percentage: total > 0 ? Math.round((regionalCount / total) * 100) : 0,
    },
  };

  const bySeverity: SeverityStats = {
    low: words.filter((w) => w.severity === "low").length,
    medium: words.filter((w) => w.severity === "medium").length,
    high: words.filter((w) => w.severity === "high").length,
  };

  const byRegion: RegionStats = {};
  for (const word of words) {
    const region = word.region || "none";
    byRegion[region] = (byRegion[region] || 0) + 1;
  }

  return {
    total,
    byLanguage,
    bySeverity,
    byRegion,
  };
}

async function fetchVariantStats(): Promise<VariantStats> {
  try {
    const result = await db.execute(
      "SELECT COUNT(DISTINCT word) as totalWords, COUNT(*) as totalVariants FROM word_variants"
    );
    const row = result.rows[0];
    return {
      totalWords: Number(row?.totalWords ?? 0),
      totalVariants: Number(row?.totalVariants ?? 0),
    };
  } catch {
    try {
      const variantsRaw = fs.readFileSync(
        path.join(process.cwd(), "docs", "leetspeak", "filipino_variants.json"),
        "utf-8"
      );
      const variantsFile: { data: { word: string; variants: string[] }[] } =
        JSON.parse(variantsRaw);
      let totalVariants = 0;
      for (const entry of variantsFile.data) {
        totalVariants += entry.variants.length;
      }
      return {
        totalWords: variantsFile.data.length,
        totalVariants,
      };
    } catch {
      return { totalWords: 0, totalVariants: 0 };
    }
  }
}

export async function GET(request: Request) {
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

  let words: WordRecord[] | null = null;
  let source: "database" | "json" = "database";

  words = await fetchFromDatabase();
  if (!words) {
    words = fetchFromJson();
    source = "json";
  }

  const stats = calculateStats(words);
  const variantStats = await fetchVariantStats();

  const response: StatsResponse = {
    success: true,
    ...stats,
    variants: variantStats,
    source,
  };

  return NextResponse.json(response, {
    headers: {
      ...rateLimitHeaders,
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
