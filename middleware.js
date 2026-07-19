import { NextResponse } from "next/server";

const SENSITIVE_PATHS = ["/api/admin/", "/api/logic/", "/api/developer/", "/api/auth/"];
const ADMIN_PATHS = ["/manageadminbhai", "/api/admin/"];

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

function getRawAllowed() {
  const val = process.env.ALLOWED_IPS || "";
  return val.replace(/^["']|["']$/g, "");
}

function isAllowedIP(ip) {
  const raw = getRawAllowed();
  if (!raw) return true;
  const list = raw.split(",").map((s) => s.trim()).filter(Boolean);
  if (list.length === 0) return true;
  return list.includes(ip);
}

function getClientIP(request) {
  return request.headers.get("cf-connecting-ip")
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || request.headers.get("true-client-ip")
    || request.ip
    || "unknown";
}

export function middleware(request) {
  const url = request.nextUrl.pathname;
  const userAgent = request.headers.get("user-agent") || "";

  const isAdmin = ADMIN_PATHS.some((path) => url.startsWith(path) || url === path);
  const isSensitive = SENSITIVE_PATHS.some((path) => url.startsWith(path));

  if (isAdmin) {
    const clientIP = getClientIP(request);
    if (!isAllowedIP(clientIP)) {
      const response = new NextResponse(null, { status: 404 });
      response.headers.set("x-blocked-reason", "ip");
      return response;
    }
  }

  if (isSensitive && detectBot(userAgent)) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|fonts|favicon.ico|manifest.json|robots.txt|sw.js|workbox-).*)",
  ],
};