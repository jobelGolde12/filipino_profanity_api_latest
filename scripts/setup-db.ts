import { createClient } from "@libsql/client";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const pureFilipinoData = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "api", "pure_filipino.json"), "utf-8")
);

const regionalData = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "api", "regional.json"), "utf-8")
);

async function setupDatabase() {
  console.log("Connecting to Turso database...");
  console.log("URL:", process.env.TURSO_DATABASE_URL);

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

  console.log("Checking if data exists...");
  const existing = await db.execute("SELECT COUNT(*) as count FROM profanity");
  if ((existing.rows[0]?.count as number) > 0) {
    console.log("Data already exists. Dropping and re-seeding...");
    await db.execute("DELETE FROM profanity");
  }

  console.log("Seeding Filipino profanity words...");
  for (const item of pureFilipinoData) {
    await db.execute({
      sql: "INSERT INTO profanity (word, language, region, severity) VALUES (?, ?, ?, ?)",
      args: [item.word, "filipino", null, "medium"],
    });
  }
  console.log(`Inserted ${pureFilipinoData.length} Filipino words`);

  console.log("Seeding Regional profanity words...");
  for (const item of regionalData) {
    await db.execute({
      sql: "INSERT INTO profanity (word, language, region, severity) VALUES (?, ?, ?, ?)",
      args: [item.word, "regional", "visayan", "medium"],
    });
  }
  console.log(`Inserted ${regionalData.length} Regional words`);

  console.log("Verifying data...");
  const count = await db.execute("SELECT COUNT(*) as count FROM profanity");
  console.log(`Total words in database: ${count.rows[0]?.count}`);

  const filipinoCount = await db.execute("SELECT COUNT(*) as count FROM profanity WHERE language = 'filipino'");
  console.log(`Filipino words: ${filipinoCount.rows[0]?.count}`);

  const regionalCount = await db.execute("SELECT COUNT(*) as count FROM profanity WHERE language = 'regional'");
  console.log(`Regional words: ${regionalCount.rows[0]?.count}`);

  console.log("\nDatabase setup complete!");
}

setupDatabase().catch(console.error);
