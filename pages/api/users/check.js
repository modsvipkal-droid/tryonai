import { findUserByEmail, updateUser } from "@/lib/db";
import { sanitizeEmail } from "@/lib/validate";

/**
 * Compute a user's effective access using server time.
 * Korven → lifetime once granted. FX1 → derived from fx1_subscription:
 * LIFETIME plans never expire; TEMPORARY plans auto-EXPIRED when now >= expires_at.
 * Never relies on a client-supplied timestamp or status.
 */
function computeAccess(user, now = Date.now()) {
  const modelAccess = Array.isArray(user?.model_access) ? user.model_access : [];
  const korven = modelAccess.includes("korven");
  const fx1Raw = user?.fx1_subscription && typeof user.fx1_subscription === "object" ? user.fx1_subscription : null;

  let fx1 = null;
  if (fx1Raw) {
    const lifetime = fx1Raw.access_type === "LIFETIME" || fx1Raw.expires_at == null;
    const expired = !lifetime && typeof fx1Raw.expires_at === "number" && now >= fx1Raw.expires_at;
    fx1 = {
      plan_id: fx1Raw.plan_id || null,
      plan_name: fx1Raw.plan_name || "FX1",
      access_type: fx1Raw.access_type || (lifetime ? "LIFETIME" : "TEMPORARY"),
      access_status: expired ? "EXPIRED" : (fx1Raw.access_status === "REVOKED" ? "REVOKED" : "ACTIVE"),
      started_at: fx1Raw.started_at || null,
      expires_at: lifetime ? null : fx1Raw.expires_at ?? null,
    };
  }

  const fx1Active = !!fx1 && fx1.access_status === "ACTIVE";
  const unlimited = korven || fx1Active;

  return {
    model: user?.model || "",
    model_access: modelAccess,
    korven,
    fx1,
    unlimited,
  };
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const email = sanitizeEmail(req.query.email);
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await findUserByEmail(email);
    const computed = computeAccess(user);

    // Persist auto-expiry so the stored flag matches reality.
    if (user && computed.fx1 && computed.fx1.access_status === "EXPIRED" && user.fx1_subscription?.access_status !== "EXPIRED") {
      await updateUser(email, {
        fx1_subscription: { ...user.fx1_subscription, access_status: "EXPIRED" },
        unlimited: computed.unlimited,
      });
    }

    return res.status(200).json({
      unlimited: computed.unlimited,
      model: computed.model,
      model_access: computed.model_access,
      fx1: computed.fx1,
      found: !!user,
    });
  } catch {
    return res.status(200).json({ unlimited: false, found: false });
  }
}
