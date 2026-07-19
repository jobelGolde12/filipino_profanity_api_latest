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
}

interface BatchCheckResult {
  text: string;
  hasProfanity: boolean;
  count: number;
  data: ProfanityWord[];
}

interface BatchCheckResponse {
  success: boolean;
  totalTexts: number;
  textsWithProfanity: number;
  results: BatchCheckResult[];
}

async function getAllWords(): Promise<string[]> {
  try {
    const result = await db.execute("SELECT word FROM profanity");
    return result.rows.map((row) => (row.word as string).toLowerCase());
  } catch {
    const pureFilipino = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "api", "pure_filipino.json"), "utf-8")
    ) as { word: string }[];
    const regional = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "api", "regional.json"), "utf-8")
    ) as { word: string }[];
    return [...pureFilipino, ...regional].map((item) => item.word.toLowerCase());
  }
}

async function checkSingleText(
  text: string,
  allWords: string[]
): Promise<BatchCheckResult> {
  const normalizedText = text.toLowerCase();
  const foundWords = new Set<string>();

  for (const word of allWords) {
    if (normalizedText.includes(word)) {
      foundWords.add(word);
    }
  }

  const foundProfanity: ProfanityWord[] = [];

  for (const word of foundWords) {
    try {
      const result = await db.execute({
        sql: "SELECT word, language, region, severity FROM profanity WHERE LOWER(word) = ? LIMIT 1",
        args: [word],
      });

      if (result.rows.length > 0) {
        foundProfanity.push(result.rows[0] as unknown as ProfanityWord);
      } else {
        const isFilipino = fs
          .readFileSync(path.join(process.cwd(), "api", "pure_filipino.json"), "utf-8")
          .toLowerCase()
          .includes(word);

        foundProfanity.push({
          word,
          language: isFilipino ? "filipino" : "regional",
          region: isFilipino ? null : "visayan",
          severity: "medium",
        });
      }
    } catch {
      foundProfanity.push({
        word,
        language: "unknown",
        region: null,
        severity: "medium",
      });
    }
  }

  return {
    text,
    hasProfanity: foundProfanity.length > 0,
    count: foundProfanity.length,
    data: foundProfanity,
  };
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIdentifier(request);
  const rateLimitResult = checkRateLimit(clientIp, 20, 60_000);
  const rateLimitHeaders = getRateLimitHeaders(rateLimitResult, 20);

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

  try {
    const body = await request.json();
    const { texts } = body;

    if (!texts || !Array.isArray(texts)) {
      return NextResponse.json(
        {
          success: false,
          error: "texts parameter is required and must be an array",
        },
        {
          status: 400,
          headers: rateLimitHeaders,
        }
      );
    }

    if (texts.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "texts array cannot be empty",
        },
        {
          status: 400,
          headers: rateLimitHeaders,
        }
      );
    }

    if (texts.length > 10) {
      return NextResponse.json(
        {
          success: false,
          error: "Maximum 10 texts allowed per batch request",
        },
        {
          status: 400,
          headers: rateLimitHeaders,
        }
      );
    }

    for (const text of texts) {
      if (typeof text !== "string") {
        return NextResponse.json(
          {
            success: false,
            error: "All items in texts array must be strings",
          },
          {
            status: 400,
            headers: rateLimitHeaders,
          }
        );
      }

      if (text.length > 5_000) {
        return NextResponse.json(
          {
            success: false,
            error: "Each text must not exceed 5,000 characters",
          },
          {
            status: 400,
            headers: rateLimitHeaders,
          }
        );
      }
    }

    const allWords = await getAllWords();
    const results: BatchCheckResult[] = [];

    for (const text of texts) {
      const result = await checkSingleText(text, allWords);
      results.push(result);
    }

    const textsWithProfanity = results.filter((r) => r.hasProfanity).length;

    const response: BatchCheckResponse = {
      success: true,
      totalTexts: results.length,
      textsWithProfanity,
      results,
    };

    return NextResponse.json(response, {
      headers: rateLimitHeaders,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid request body",
      },
      {
        status: 400,
        headers: rateLimitHeaders,
      }
    );
  }
}
