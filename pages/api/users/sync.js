import { findUserByEmail, insertUser } from "@/lib/db";
import { sanitizeEmail, sanitizeString } from "@/lib/validate";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, displayName, photoURL } = req.body || {};
    const safeEmail = sanitizeEmail(email);
    if (!safeEmail) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    const existing = await findUserByEmail(safeEmail);
    if (existing) {
      // Never create a duplicate account — and surface block status so the
      // client cannot miss a server-side restriction.
      if (existing.subscriptionBlocked === true) {
        return res.status(403).json({
          blocked: true,
          error: "Your account has been blocked due to repeated subscription page visits without a purchase. Please contact support if you believe this was a mistake.",
        });
      }
      return res.status(200).json({ user: existing });
    }

    const user = {
      email: safeEmail,
      displayName: sanitizeString(displayName || safeEmail.split("@")[0], 100),
      photoURL: sanitizeString(photoURL || "", 500),
      unlimited: false,
      unlimitedAt: null,
      createdAt: Date.now(),
      subscriptionScreenVisits: 0,
      subscriptionBlocked: false,
      hasSuccessfulPurchase: false,
    };

    await insertUser(user);
    return res.status(201).json({ user });
  } catch {
    return res.status(200).json({ user: null, error: "Failed to create user" });
  }
}
