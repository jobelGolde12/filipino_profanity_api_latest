import { db } from "./turso";

let tableReady = false;

export async function ensureRequestTrackingTable() {
  if (tableReady) return;
  await db.execute(`
    CREATE TABLE IF NOT EXISTS api_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      endpoint TEXT NOT NULL,
      method TEXT NOT NULL,
      status_code INTEGER,
      ip_address TEXT,
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_api_requests_created_at ON api_requests(created_at)
  `);
  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_api_requests_endpoint ON api_requests(endpoint)
  `);
  tableReady = true;
}

export async function trackRequest(
  endpoint: string,
  method: string,
  statusCode?: number,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    await ensureRequestTrackingTable();
    await db.execute({
      sql: "INSERT INTO api_requests (endpoint, method, status_code, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)",
      args: [endpoint, method, statusCode ?? null, ipAddress ?? null, userAgent ?? null],
    });
  } catch {
    // Silent fail - don't break the actual request
  }
}

export async function getRequestStats() {
  await ensureRequestTrackingTable();

  // Total requests
  const totalResult = await db.execute("SELECT COUNT(*) as count FROM api_requests");
  const totalRequests = Number(totalResult.rows[0]?.count ?? 0);

  // Requests today
  const todayResult = await db.execute(
    "SELECT COUNT(*) as count FROM api_requests WHERE DATE(created_at) = DATE('now')"
  );
  const todayRequests = Number(todayResult.rows[0]?.count ?? 0);

  // Requests this month
  const monthResult = await db.execute(
    "SELECT COUNT(*) as count FROM api_requests WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')"
  );
  const monthRequests = Number(monthResult.rows[0]?.count ?? 0);

  // Requests this year
  const yearResult = await db.execute(
    "SELECT COUNT(*) as count FROM api_requests WHERE strftime('%Y', created_at) = strftime('%Y', 'now')"
  );
  const yearRequests = Number(yearResult.rows[0]?.count ?? 0);

  // Daily requests for the last 30 days
  const dailyResult = await db.execute(`
    SELECT DATE(created_at) as date, COUNT(*) as count
    FROM api_requests
    WHERE created_at >= DATE('now', '-30 days')
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `);

  // Monthly requests for the current year
  const monthlyResult = await db.execute(`
    SELECT strftime('%Y-%m', created_at) as month, COUNT(*) as count
    FROM api_requests
    WHERE strftime('%Y', created_at) = strftime('%Y', 'now')
    GROUP BY strftime('%Y-%m', created_at)
    ORDER BY month ASC
  `);

  // Requests by endpoint
  const byEndpointResult = await db.execute(`
    SELECT endpoint, COUNT(*) as count
    FROM api_requests
    GROUP BY endpoint
    ORDER BY count DESC
    LIMIT 10
  `);

  // Yearly requests for the last 5 years
  const yearlyResult = await db.execute(`
    SELECT strftime('%Y', created_at) as year, COUNT(*) as count
    FROM api_requests
    WHERE created_at >= DATE('now', '-5 years')
    GROUP BY strftime('%Y', created_at)
    ORDER BY year ASC
  `);

  return {
    totalRequests,
    todayRequests,
    monthRequests,
    yearRequests,
    daily: dailyResult.rows.map((r) => ({ date: r.date as string, count: Number(r.count) })),
    monthly: monthlyResult.rows.map((r) => ({ month: r.month as string, count: Number(r.count) })),
    yearly: yearlyResult.rows.map((r) => ({ year: r.year as string, count: Number(r.count) })),
    byEndpoint: byEndpointResult.rows.map((r) => ({
      endpoint: r.endpoint as string,
      count: Number(r.count),
    })),
  };
}
