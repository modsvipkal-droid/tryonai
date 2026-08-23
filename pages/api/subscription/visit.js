import { withAuth } from "@/lib/authMiddleware";
import { createRateLimiter } from "@/lib/rateLimit";
import { logSecurityEvent } from "@/lib/securityLog";
import {
  findUserByEmail,
  insertUser,
  updateUser,
  recordSubscriptionVisit,
  hasVerifiedPurchase,
  isSubscriptionBlocked,
  SUBSCRIPTION_VISIT_LIMIT,
} from "@/lib/db";
import { sanitizeEmail, sanitizeString } from "@/lib/validate";

const visitLimiter = createRateLimiter({ windowMs: 10000, max: 20, name: "subscription-visit" });

function publicState(u) {
  const visits = u?.subscriptionScreenVisits || 0;
  return {
    blocked: isSubscriptionBlocked(u),
    blockReason: u?.blockReason || null,
    subscriptionScreenVisits: visits,
    remaining: Math.max(0, SUBSCRIPTION_VISIT_LIMIT - visits),
    hasSuccessfulPurchase: hasVerifiedPurchase(u),
  };
}

/**
 * POST /api/subscription/visit
 *
 * Registers one genuine Subscription Screen open for the authenticated user.
 * Enforcement is entirely server-side:
 *  - Blocked accounts are rejected before anything else.
 *  - Verified purchasers are exempt (their counter stays disabled).
 *  - The visit id (generated once per real page-open on the client) makes the
 *    endpoint idempotent — reloads/remounts/re-renders never double count.
 *  - The counter increment + conditional block happen atomically in the DB.
 */
export default withAuth(async (req, res, user) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { limited } = visitLimiter(req, res);
  if (limited) {
    return res.status(429).json({ error: "Too many requests. Please wait." });
  }

  const email = sanitizeEmail(user.email);
  if (!email) {
    return res.status(401).json({ error: "Invalid account email" });
  }

  let dbUser = await findUserByEmail(email);
  if (!dbUser) {
    // First server-side sight of this account — seed safe defaults.
    dbUser = await insertUser({
      email,
      displayName: sanitizeString(email.split("@")[0], 100),
      photoURL: "",
      unlimited: false,
      unlimitedAt: null,
      createdAt: Date.now(),
      subscriptionScreenVisits: 0,
      subscriptionBlocked: false,
      hasSuccessfulPurchase: false,
    });
  }

  // Rule: a blocked account can never pass, regardless of client state.
  if (isSubscriptionBlocked(dbUser)) {
    logSecurityEvent("subscription_blocked_access", { email });
    return res.status(403).json({ ...publicState(dbUser), error: "Account blocked" });
  }

  // Rule: successful/verified purchasers are exempt from the visit limit.
  if (hasVerifiedPurchase(dbUser)) {
    if (dbUser.hasSuccessfulPurchase !== true) {
      await updateUser(email, {
        hasSuccessfulPurchase: true,
        subscriptionScreenVisits: 0,
        subscriptionBlocked: false,
        blockReason: null,
        blockedAt: null,
      });
      logSecurityEvent("subscription_abuse_restriction_cleared", { email });
    }
    return res.status(200).json({ ...publicState({ ...dbUser, hasSuccessfulPurchase: true }), counted: false });
  }

  // Idempotency: only count when the client proves a fresh page-open via a
  // stable per-open visit id. Missing id → do not count.
  const visitId = sanitizeString(req.body?.visitId, 64);
  if (!visitId) {
    return res.status(200).json({ ...publicState(dbUser), counted: false });
  }
  if (dbUser.lastVisitId && dbUser.lastVisitId === visitId) {
    return res.status(200).json({ ...publicState(dbUser), counted: false });
  }

  const updated = await recordSubscriptionVisit(email, visitId);
  if (!updated) {
    return res.status(200).json({ ...publicState(dbUser), counted: false });
  }

  if (isSubscriptionBlocked(updated)) {
    logSecurityEvent("subscription_auto_blocked", {
      email,
      visits: updated.subscriptionScreenVisits || 0,
    });
    return res.status(403).json({ ...publicState(updated), error: "Account blocked" });
  }

  return res.status(200).json({ ...publicState(updated), counted: true });
});
