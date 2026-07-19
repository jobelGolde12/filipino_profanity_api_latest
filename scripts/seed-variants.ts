import { createClient } from "@libsql/client";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

interface VariantEntry {
  word: string;
  variants: string[];
}

interface VariantsFile {
  success: boolean;
  type: string;
  count: number;
  source: string;
  data: VariantEntry[];
}

async function seedVariants() {
  console.log("Creating word_variants table...");
  await db.execute(`
    CREATE TABLE IF NOT EXISTS word_variants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      profanity_id INTEGER NOT NULL,
      word TEXT NOT NULL,
      variant TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (profanity_id) REFERENCES profanity(id) ON DELETE CASCADE
    )
  `);

  console.log("Creating indexes...");
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_word_variants_word ON word_variants(word)`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_word_variants_variant ON word_variants(variant)`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_word_variants_profanity_id ON word_variants(profanity_id)`);

  console.log("Checking if variants already exist...");
  const existing = await db.execute("SELECT COUNT(*) as count FROM word_variants");
  if ((existing.rows[0]?.count as number) > 0) {
    console.log("Variants already exist. Dropping and re-seeding...");
    await db.execute("DELETE FROM word_variants");
  }

  const variantsRaw = fs.readFileSync(
    path.join(process.cwd(), "docs", "leetspeak", "filipino_variants.json"),
    "utf-8"
  );
  const variantsFile: VariantsFile = JSON.parse(variantsRaw);

  console.log(`Seeding variants for ${variantsFile.data.length} words...`);

  const wordMapResult = await db.execute("SELECT id, LOWER(word) as word FROM profanity");
  const wordMap = new Map<string, number>();
  for (const row of wordMapResult.rows) {
    wordMap.set(row.word as string, row.id as number);
  }

  const BATCH_SIZE = 50;
  let totalInserted = 0;
  let skippedWords = 0;

  for (const entry of variantsFile.data) {
    const profanityId = wordMap.get(entry.word.toLowerCase());
    if (!profanityId) {
      console.warn(`  Warning: Word "${entry.word}" not found in profanity table. Skipping.`);
      skippedWords++;
      continue;
    }

    const variants = entry.variants.map((v) => v.toLowerCase());

    for (let i = 0; i < variants.length; i += BATCH_SIZE) {
      const batch = variants.slice(i, i + BATCH_SIZE);
      const statements = batch.map((variant) => ({
        sql: "INSERT INTO word_variants (profanity_id, word, variant) VALUES (?, ?, ?)",
        args: [profanityId, entry.word.toLowerCase(), variant],
      }));
      await db.batch(statements);
      totalInserted += batch.length;
    }
  }

  console.log(`\nSeed complete!`);
  if (skippedWords > 0) {
    console.log(`Skipped words: ${skippedWords}`);
  }
  console.log(`Total variants inserted: ${totalInserted}`);

  const count = await db.execute("SELECT COUNT(*) as count FROM word_variants");
  console.log(`Total variants in database: ${count.rows[0]?.count}`);

  const wordCount = await db.execute("SELECT COUNT(DISTINCT word) as count FROM word_variants");
  console.log(`Unique words with variants: ${wordCount.rows[0]?.count}`);
}

seedVariants().catch(console.error);
