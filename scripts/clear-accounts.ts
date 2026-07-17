import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config();

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function clearAccountsTable() {
  console.log("Connecting to Turso database...");
  
  try {
    console.log("Deleting all data from accounts table...");
    const result = await db.execute("DELETE FROM accounts");
    console.log(`Deleted ${result.rowsAffected} rows from accounts table`);
    console.log("Done!");
  } catch (error) {
    console.error("Error:", error);
  }
}

clearAccountsTable();
