import { NextResponse } from "next/server";

const SENSITIVE_PATHS = ["/api/admin/", "/api/logic/", "/api/developer/", "/api/auth/"];

const BOT_PATTERNS = [
  /ahrefs/i, /semrush/i, /dotbot/i, /mj12bot/i, /majestic/i,
  /rogerbot/i, /exabot/i, /screaming/i, /yandex/i, /baiduspider/i,
  /petalbot/i, /scrapy/i, /curl/i, /wget/i, /python-urllib/i,
  /ruby/i, /perl/i, /nikto/i, /sqlmap/i, /nmap/i,
];

function detectBot(userAgent) {
  if (!userAgent) return false;
  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
}

export function middleware(request) {
  const url = request.nextUrl.pathname;
  const response = NextResponse.next();

  const isSensitive = SENSITIVE_PATHS.some((path) => url.startsWith(path));
  const userAgent = request.headers.get("user-agent") || "";

  if (isSensitive && detectBot(userAgent)) {
    return new NextResponse("Access Denied", { status: 403 });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|fonts|favicon.ico|manifest.json|robots.txt|sw.js|workbox-).*)",
  ],
};
