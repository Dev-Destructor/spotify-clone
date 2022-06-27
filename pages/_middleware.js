import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const url = req.nextUrl.clone();
  url.pathname = "/login";

  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  // Allow the request if the its a next-auth session and provider fetching or already contains a token
  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }

  // Otherwise redirect to the login page
  if (!token || pathname !== "/login") {
    return NextResponse.rewrite(url);
  }
}
