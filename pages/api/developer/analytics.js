import { withAuth } from "@/lib/authMiddleware";
import { getDeveloperStats } from "@/lib/developerApi";
import { getGameCacheStats } from "@/lib/gameSync";

function apiErrorStatus(error) {
  return error.message?.includes("MONGODB_URI") ? 503 : 500;
}

async function handler(req, res, user) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const [stats, cache] = await Promise.all([
      getDeveloperStats(user),
      getGameCacheStats().catch((error) => ({ error: error.message, total: 0, latestPeriod: null, lastSyncedAt: null })),
    ]);
    return res.status(200).json({ stats, cache });
  } catch (error) {
    console.error("Developer analytics API error:", error);
    return res.status(apiErrorStatus(error)).json({ error: error.message || "Developer analytics request failed" });
  }
}

export default withAuth(handler);
