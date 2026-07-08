import { clearAuthCookies } from "@/lib/authMiddleware";
import { logSecurityEvent } from "@/lib/securityLog";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  clearAuthCookies(res);
  logSecurityEvent("session_logout", { ip: req.ip });

  return res.status(200).json({ ok: true });
}
