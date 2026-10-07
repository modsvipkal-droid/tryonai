import { getCsrfTokenFromCookies, validateCsrfToken, generateCsrfToken } from "@/lib/csrf";
import { createRateLimiter } from "@/lib/rateLimit";

const csrfLimiter = createRateLimiter({ windowMs: 60000, max: 60, name: "auth-csrf" });

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { limited } = csrfLimiter(req, res);
  if (limited) {
    return res.status(429).json({ error: "Too many requests" });
  }

  const existing = getCsrfTokenFromCookies(req);
  if (existing && validateCsrfToken(existing)) {
    return res.status(200).json({ csrfToken: existing });
  }

  const token = generateCsrfToken();
  res.setHeader(
    "Set-Cookie",
    `__Host-csrf-token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`
  );
  return res.status(200).json({ csrfToken: token });
}
