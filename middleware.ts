// middleware.ts

import { NextResponse } from "next/server";

export function middleware() {
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
