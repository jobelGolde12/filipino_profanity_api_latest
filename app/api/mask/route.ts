import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/turso";
import * as fs from "fs";
import * as path from "path";
import { checkRateLimit, getRateLimitHeaders, getClientIdentifier } from "@/lib/rate-limit";

interface MaskResult {
  word: string;
  start: number;
  end: number;
  original: string;
  masked: string;
}

interface MaskResponse {
  success: boolean;
  original: string;
  masked: string;
  matchCount: number;
  matches: string[];
  details: MaskResult[];
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

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function maskText(
  text: string,
  words: string[],
  maskChar: string,
  partial: boolean
): { masked: string; matches: MaskResult[] } {
  const matches: MaskResult[] = [];
  let maskedText = text;

  const sortedWords = [...words].sort((a, b) => b.length - a.length);

  const seen = new Set<string>();

  for (const word of sortedWords) {
    const regex = new RegExp(escapeRegex(word), "gi");
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      const key = `${match.index}-${match[0].length}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const original = match[0];
      let replacement: string;

      if (partial && original.length > 1) {
        replacement = original[0] + maskChar.repeat(original.length - 1);
      } else {
        replacement = maskChar.repeat(original.length);
      }

      matches.push({
        word,
        start: match.index,
        end: match.index + original.length,
        original,
        masked: replacement,
      });
    }
  }

  matches.sort((a, b) => a.start - b.start);

  for (let i = matches.length - 1; i >= 0; i--) {
    const m = matches[i];
    maskedText = maskedText.slice(0, m.start) + m.masked + maskedText.slice(m.end);
  }

  return { masked: maskedText, matches };
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIdentifier(request);
  const rateLimitResult = checkRateLimit(clientIp, 30, 60_000);
  const rateLimitHeaders = getRateLimitHeaders(rateLimitResult, 30);

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
    const { text, maskChar = "*", partial = true } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Text parameter is required and must be a string",
        },
        {
          status: 400,
          headers: rateLimitHeaders,
        }
      );
    }

    if (text.length > 10_000) {
      return NextResponse.json(
        {
          success: false,
          error: "Text exceeds maximum length of 10,000 characters",
        },
        {
          status: 400,
          headers: rateLimitHeaders,
        }
      );
    }

    if (typeof maskChar !== "string" || maskChar.length !== 1) {
      return NextResponse.json(
        {
          success: false,
          error: "maskChar must be a single character",
        },
        {
          status: 400,
          headers: rateLimitHeaders,
        }
      );
    }

    const words = await getAllWords();
    const { masked, matches } = maskText(text, words, maskChar, partial);

    const response: MaskResponse = {
      success: true,
      original: text,
      masked,
      matchCount: matches.length,
      matches: [...new Set(matches.map((m) => m.word))],
      details: matches,
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
