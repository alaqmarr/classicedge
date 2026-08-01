import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req, event) {
    const url = req.nextUrl;
    
    // Skip analytics for api, _next, static files, admin
    if (
      url.pathname.startsWith('/api') || 
      url.pathname.startsWith('/_next') ||
      url.pathname.startsWith('/admin') ||
      url.pathname.includes('.')
    ) {
      return NextResponse.next();
    }

    const response = NextResponse.next();
    let sessionId = req.cookies.get('analytics_session')?.value;
    
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      response.cookies.set('analytics_session', sessionId, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }

    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const host = req.headers.get("host") || "localhost:3000";
    const apiUrl = `${protocol}://${host}/api/analytics/track`;

    const trackPromise = fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: url.pathname, sessionId: sessionId }),
    }).catch(err => console.error("Analytics tracking error:", err));

    if (event && (event as any).waitUntil) {
      (event as any).waitUntil(trackPromise);
    }

    return response;
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Only require authentication for /admin paths (except login)
        if (req.nextUrl.pathname.startsWith("/admin")) {
          if (req.nextUrl.pathname === "/admin/login") {
            return true;
          }
          return !!token;
        }
        // Public pages don't require auth
        return true;
      }
    },
  }
)

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
