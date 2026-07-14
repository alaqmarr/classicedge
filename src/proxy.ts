import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Allow access to the login page without a token
        if (req.nextUrl.pathname === "/admin/login") {
          return true;
        }
        return !!token;
      }
    },
  }
)

export const config = {
  matcher: ["/admin/:path*"],
}
