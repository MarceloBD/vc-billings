import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "vc-billings-session";

const PROTECTED_PATHS = ["/dashboard"];
const PUBLIC_PATHS = ["/login"];

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
}

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return false;
  }
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = await isAuthenticated(request);

  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );
  if (isProtected && !authenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  if (isPublic && authenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
