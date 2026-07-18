import { createClient } from "@libsql/client";
import * as fs from "fs";
import * as path from "path";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const pureFilipinoData = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "api", "pure_filipino.json"), "utf-8")
);

const regionalData = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "api", "regional.json"), "utf-8")
);

async function seed() {
  console.log("Creating profanity table...");
  await db.execute(`
    CREATE TABLE IF NOT EXISTS profanity (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word TEXT NOT NULL,
      language TEXT NOT NULL,
      region TEXT,
      severity TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("Creating reports table...");
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

  console.log("Checking if data exists...");
  const existing = await db.execute("SELECT COUNT(*) as count FROM profanity");
  if ((existing.rows[0]?.count as number) > 0) {
    console.log("Data already exists. Skipping seed.");
    return;
  }

  console.log("Seeding Filipino profanity words...");
  for (const item of pureFilipinoData) {
    await db.execute({
      sql: "INSERT INTO profanity (word, language, region, severity) VALUES (?, ?, ?, ?)",
      args: [item.word, "filipino", null, "medium"],
    });
  }

  console.log("Seeding Regional profanity words...");
  for (const item of regionalData) {
    await db.execute({
      sql: "INSERT INTO profanity (word, language, region, severity) VALUES (?, ?, ?, ?)",
      args: [item.word, "regional", "visayan", "medium"],
    });
  }

  console.log("Seed complete!");
  const count = await db.execute("SELECT COUNT(*) as count FROM profanity");
  console.log(`Total words: ${count.rows[0]?.count}`);
}

seed().catch(console.error);
