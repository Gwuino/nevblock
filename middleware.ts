import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/manage")) {
    return NextResponse.next();
  }
  if (pathname === "/manage/login") {
    return NextResponse.next();
  }
  const session = request.cookies.get("nevblock_session");
  if (!session?.value) {
    const login = new URL("/manage/login", request.url);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/manage", "/manage/:path*"],
};
