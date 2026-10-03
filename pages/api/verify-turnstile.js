import { createRateLimiter } from "@/lib/rateLimit";
import { logSecurityEvent } from "@/lib/securityLog";

const turnstileLimiter = createRateLimiter({ windowMs: 60000, max: 20, name: "turnstile" });

export default async function handler(req, res) {
  const { limited } = turnstileLimiter(req, res);
  if (limited) {
    return res.status(429).json({ success: false, error: "Too many requests" });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { token } = req.body || {};
  if (!token || typeof token !== "string") {
    return res.status(400).json({ success: false, error: "Missing token" });
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    logSecurityEvent("turnstile_no_secret");
    return res.status(500).json({ success: false, error: "Server configuration error" });
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secret);
    formData.append("response", token);

    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: formData }
    );

    const data = await verifyRes.json();

    if (data.success) {
      return res.status(200).json({ success: true });
    }

    logSecurityEvent("turnstile_verification_failed");
    return res.status(400).json({ success: false, error: "Verification failed" });
  } catch {
    return res.status(500).json({ success: false, error: "Verification failed" });
  }
}
