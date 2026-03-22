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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text: inputText } = body;

    if (!inputText || typeof inputText !== "string") {
      return NextResponse.json(
        { success: false, error: "Text parameter is required" },
        { status: 400 }
      );
    }

    const words = await getAllWords();
    const normalizedText = inputText.toLowerCase();
    const foundProfanity: ProfanityWord[] = [];

    for (const word of words) {
      if (normalizedText.includes(word)) {
        const result = await db.execute({
          sql: "SELECT word, language, region, severity FROM profanity WHERE LOWER(word) = ? LIMIT 1",
          args: [word],
        }).catch(() => ({ rows: [] }));

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
      }
    }

    return NextResponse.json({
      success: true,
      hasProfanity: foundProfanity.length > 0,
      count: foundProfanity.length,
      data: foundProfanity,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
