import { withAuth } from "@/lib/authMiddleware";
import {
  createApiKeyForUser,
  getActiveApiKeyForUser,
  getDeveloperStats,
  revokeApiKeysForUser,
  serializeKeyDoc,
} from "@/lib/developerApi";

function apiErrorStatus(error) {
  return error.message?.includes("MONGODB_URI") ? 503 : 500;
}

async function handler(req, res, user) {
  res.setHeader("Cache-Control", "no-store");

  try {
    if (req.method === "GET") {
      const [keyDoc, stats] = await Promise.all([
        getActiveApiKeyForUser(user),
        getDeveloperStats(user),
      ]);
      return res.status(200).json({ key: serializeKeyDoc(keyDoc), stats });
    }

    if (req.method === "POST") {
      const { apiKey, keyDoc } = await createApiKeyForUser(user);
      const stats = await getDeveloperStats(user);
      return res.status(201).json({ apiKey, key: serializeKeyDoc(keyDoc), stats });
    }

    if (req.method === "DELETE") {
      const revoked = await revokeApiKeysForUser(user);
      const stats = await getDeveloperStats(user);
      return res.status(200).json({ revoked, key: null, stats });
    }

    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Developer key API error:", error);
    return res.status(apiErrorStatus(error)).json({ error: error.message || "Developer key request failed" });
  }
}

export default withAuth(handler);
