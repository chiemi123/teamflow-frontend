import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  const isLoginPage = pathname === "/login";
  const isApiRoute = pathname.startsWith("/api");

  // 🔥 APIは通す（最重要）
  if (isApiRoute) {
    return NextResponse.next();
  }

  // ログインページは許可
  if (isLoginPage) {
    return NextResponse.next();
  }

  // tokenが無い → ログインへ
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
      以下をmiddleware対象外にする
      - api
      - _next/static
      - _next/image
      - favicon.ico
    */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
