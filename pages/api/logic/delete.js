import { requireAuth } from "@/lib/authMiddleware";
import { deleteLogic, hasActiveLogic } from "@/lib/logicStore";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "DELETE") {
    res.setHeader("Allow", "DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  }

  let user;
  try {
    user = await requireAuth(req);
  } catch (err) {
    return res.status(err.status || 401).json({ error: "Authentication required" });
  }

  if (!hasActiveLogic(user.email)) {
    return res.status(404).json({ error: "No active logic found" });
  }

  const success = deleteLogic(user.email);
  if (!success) {
    return res.status(500).json({ error: "Operation failed" });
  }

  return res.status(200).json({ success: true, message: "Logic deleted successfully" });
}
