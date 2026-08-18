import { withAuth } from "@/lib/authMiddleware";
import { createRateLimiter } from "@/lib/rateLimit";
import { upsertPresence, ensurePresenceIndexes } from "@/lib/db";
import { sanitizeString } from "@/lib/validate";

const heartbeatLimiter = createRateLimiter({ windowMs: 5000, max: 5, name: "presence-heartbeat" });

/**
 * Authenticated heartbeat for live session tracking.
 * Only minimal presence data is stored (email, last seen, last page, session id).
 * The user id/email always come from the verified session — never from the client.
 */
export default withAuth(async (req, res, user) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { limited } = heartbeatLimiter(req, res);
  if (limited) {
    return res.status(429).json({ error: "Too many requests" });
  }

  const sessionId = sanitizeString(req.body?.session_id, 64) || "default";
  const page = sanitizeString(req.body?.page, 60) || "";

  const now = Date.now();
  await upsertPresence({
    user_id: String(user.uid || user.email),
    email: user.email,
    status: "ONLINE",
    last_seen: now,
    last_page: page,
    session_id: sessionId,
  });

  ensurePresenceIndexes().catch(() => {});

  return res.status(200).json({ ok: true, t: now });
});
