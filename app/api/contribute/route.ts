import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/turso";

const ADMIN_EMAIL = "jobelgolde43@gmail.com";
const ADMIN_PASS = "My_api_pass123";

let tableReady = false;

async function ensureTable() {
  if (tableReady) return;
  await db.execute(`
    CREATE TABLE IF NOT EXISTS word_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word TEXT NOT NULL,
      language TEXT NOT NULL,
      region TEXT,
      email TEXT,
      browser TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  tableReady = true;
}

function checkAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Basic ")) return false;
  const decoded = atob(authHeader.split(" ")[1]);
  const [email, password] = decoded.split(":");
  return email === ADMIN_EMAIL && password === ADMIN_PASS;
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureTable();
    const result = await db.execute(
      "SELECT id, word, language, region, email, browser, status, created_at FROM word_submissions ORDER BY created_at DESC"
    );
    return NextResponse.json({ success: true, data: result.rows });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureTable();

    const body = await request.json();
    const { word, language, region, email, browser } = body;

    if (!word || !language) {
      return NextResponse.json(
        { success: false, error: "Word and language are required" },
        { status: 400 }
      );
    }

    const validLanguages = ["filipino", "regional"];
    if (!validLanguages.includes(language)) {
      return NextResponse.json(
        { success: false, error: "Language must be 'filipino' or 'regional'" },
        { status: 400 }
      );
    }

    if (language === "regional" && !region) {
      return NextResponse.json(
        { success: false, error: "Region is required for regional words" },
        { status: 400 }
      );
    }

    if (word.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Word must be at least 2 characters" },
        { status: 400 }
      );
    }

    await db.execute({
      sql: "INSERT INTO word_submissions (word, language, region, email, browser, status) VALUES (?, ?, ?, ?, ?, ?)",
      args: [word.trim().toLowerCase(), language, region || null, email || null, browser || null, "pending"],
    });

    return NextResponse.json({ success: true, message: "Word submitted for review" });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to submit word" },
      { status: 500 }
    );
  }
}
