import { NextRequest, NextResponse } from "next/server";
import { trackRequest, ensureRequestTrackingTable } from "@/lib/request-tracker";

export async function POST(request: NextRequest) {
  try {
    await ensureRequestTrackingTable();
    const body = await request.json();
    const { endpoint, method, ip, userAgent } = body;

    if (!endpoint || !method) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    await trackRequest(endpoint, method, 200, ip, userAgent);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true }); // Don't fail the request
  }
}
