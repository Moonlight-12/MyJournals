import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // For debugging - log token details (remove in production)
  console.log("Middleware token check:", {
    hasToken: !!token,
    hasAccessToken: !!token?.accessToken,
    exp: token?.exp,
    currentTime: Math.floor(Date.now() / 1000),
    isExpired: token?.exp ? Math.floor(Date.now() / 1000) > (token.exp as number) : "N/A",
  })

  // Check if token exists and has an accessToken
  if (!token || !token.accessToken) {
    console.log("No token or accessToken, redirecting to sign-in")
    return redirectToSignIn(request)
  }

  // Check if token is expired
  if (token.exp) {
    const currentTime = Math.floor(Date.now() / 1000) // Current time in seconds
    if (currentTime > (token.exp as number)) {
      console.log("Token expired, redirecting to sign-in")
      return redirectToSignIn(request)
    }
  }

  return NextResponse.next()
}

// Helper function to redirect to sign-in
function redirectToSignIn(request: NextRequest) {
  const url = new URL("/signin", request.url)
  // Add the original URL as a query parameter to redirect after login
  url.searchParams.set("callbackUrl", encodeURI(request.url))
  return NextResponse.redirect(url)
}

// Keep your existing matcher configuration
export const config = {
  matcher: ["/home", "/next-home", "/profile"],
}

