import { NextResponse } from "next/server";
import { db } from "@/lib/turso";

interface HealthStatus {
  status: "ok" | "degraded";
  timestamp: string;
  uptime: number;
  database: {
    connected: boolean;
    wordCount: number;
    variantCount: number;
  };
  version: string;
}

export async function GET() {
  const startTime = Date.now();

  const health: HealthStatus = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      connected: false,
      wordCount: 0,
      variantCount: 0,
    },
    version: "1.0.0",
  };

  try {
    const result = await db.execute("SELECT COUNT(*) as count FROM profanity");
    health.database.connected = true;
    health.database.wordCount = Number(result.rows[0]?.count ?? 0);

    const variantResult = await db.execute("SELECT COUNT(*) as count FROM word_variants");
    health.database.variantCount = Number(variantResult.rows[0]?.count ?? 0);
  } catch {
    health.status = "degraded";
  }

  const responseTime = Date.now() - startTime;

  return NextResponse.json(
    {
      ...health,
      responseTime: `${responseTime}ms`,
    },
    {
      status: health.status === "ok" ? 200 : 503,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    }
  );
}
