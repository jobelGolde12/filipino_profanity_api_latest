import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const profanity = sqliteTable("profanity", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  word: text("word").notNull(),
  language: text("language").notNull(),
  region: text("region"),
  severity: text("severity"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export type ProfanityWord = typeof profanity.$inferSelect;
export type NewProfanityWord = typeof profanity.$inferInsert;
