import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/turso";
import { getRequestStats, ensureRequestTrackingTable } from "@/lib/request-tracker";

const ADMIN_EMAIL = "jobelgolde43@gmail.com";
const ADMIN_PASS = "My_api_pass123";

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
    await ensureRequestTrackingTable();

    // Get request stats
    const requestStats = await getRequestStats();

    // Get total reports (all time, including resolved/dismissed)
    const totalReportsResult = await db.execute("SELECT COUNT(*) as count FROM reports");
    const totalReports = Number(totalReportsResult.rows[0]?.count ?? 0);

    // Get pending reports
    const pendingReportsResult = await db.execute(
      "SELECT COUNT(*) as count FROM reports WHERE status = 'pending'"
    );
    const pendingReports = Number(pendingReportsResult.rows[0]?.count ?? 0);

    // Get total submissions (all time, including approved/denied)
    const totalSubmissionsResult = await db.execute(
      "SELECT COUNT(*) as count FROM word_submissions"
    );
    const totalSubmissions = Number(totalSubmissionsResult.rows[0]?.count ?? 0);

    // Get pending submissions
    const pendingSubmissionsResult = await db.execute(
      "SELECT COUNT(*) as count FROM word_submissions WHERE status = 'pending'"
    );
    const pendingSubmissions = Number(pendingSubmissionsResult.rows[0]?.count ?? 0);

    // Get approved submissions count
    const approvedSubmissionsResult = await db.execute(
      "SELECT COUNT(*) as count FROM word_submissions WHERE status = 'approved'"
    );
    const approvedSubmissions = Number(approvedSubmissionsResult.rows[0]?.count ?? 0);

    // Get denied submissions count
    const deniedSubmissionsResult = await db.execute(
      "SELECT COUNT(*) as count FROM word_submissions WHERE status = 'denied'"
    );
    const deniedSubmissions = Number(deniedSubmissionsResult.rows[0]?.count ?? 0);

    // Get resolved reports count
    const resolvedReportsResult = await db.execute(
      "SELECT COUNT(*) as count FROM reports WHERE status = 'resolved'"
    );
    const resolvedReports = Number(resolvedReportsResult.rows[0]?.count ?? 0);

    // Total words in database
    const totalWordsResult = await db.execute("SELECT COUNT(*) as count FROM profanity");
    const totalWords = Number(totalWordsResult.rows[0]?.count ?? 0);

    return NextResponse.json({
      success: true,
      requests: requestStats,
      reports: {
        total: totalReports,
        pending: pendingReports,
        resolved: resolvedReports,
      },
      submissions: {
        total: totalSubmissions,
        pending: pendingSubmissions,
        approved: approvedSubmissions,
        denied: deniedSubmissions,
      },
      words: totalWords,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
