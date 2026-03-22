import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/turso";
import * as fs from "fs";
import * as path from "path";

interface ProfanityWord {
  word: string;
  language: string;
  region: string | null;
  severity: string;
}

interface PureFilipinoItem {
  id: number;
  word: string;
}

interface RegionalItem {
  id: number;
  word: string;
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
      }));
    results.push(...regionalWords);
  }

  return results;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type") || "all";
  const word = searchParams.get("word") || undefined;

  const validTypes = ["filipino", "regional", "all"];
  if (!validTypes.includes(type)) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid type parameter. Use: filipino, regional, or all",
      },
      { status: 400 }
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

  return NextResponse.json({
    success: true,
    type,
    count: data.length,
    source,
    data,
  });
}
