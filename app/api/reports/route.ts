import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/turso";

let tableReady = false;

async function ensureTable() {
  if (tableReady) return;
  await db.execute(`
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      email TEXT,
      browser TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  tableReady = true;
}

export async function POST(request: NextRequest) {
  try {
    await ensureTable();

    const body = await request.json();
    const { title, description, email, browser } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: "Title and description are required" },
        { status: 400 }
      );
    }

    await db.execute({
      sql: "INSERT INTO reports (title, description, email, browser, status) VALUES (?, ?, ?, ?, ?)",
      args: [title, description, email || null, browser || null, "pending"],
    });

    return NextResponse.json({ success: true, message: "Report submitted" });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to submit report" },
      { status: 500 }
    );
  }
}
