import { requireAuth } from "@/lib/authMiddleware";
import { getLogicMeta } from "@/lib/logicStore";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Auth check
  let user;
  try {
    user = await requireAuth(req);
  } catch (err) {
    return res.status(err.status || 401).json({ error: err.message });
  }

  // Return only metadata — never raw logic
  const meta = getLogicMeta(user.email);

  if (!meta) {
    return res.status(200).json({ hasLogic: false, logic: null });
  }

  return res.status(200).json({ hasLogic: true, logic: meta });
}
