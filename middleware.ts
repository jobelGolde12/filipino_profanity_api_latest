import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // Only track API routes
  if (pathname.startsWith("/api/")) {
    const endpoint = pathname;
    const method = request.method;
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Track the request asynchronously
    const trackPromise = fetch(`${request.nextUrl.origin}/api/admin/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint, method, ip, userAgent }),
    }).catch(() => {
      // Silent fail
    });

    // Don't wait for tracking to complete
    void trackPromise;
  }

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
