import {
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS,
  countRecentRequests,
  findApiKeyByToken,
  getRequestProtocol,
  logDeveloperRequest,
  touchApiKey,
} from "@/lib/developerApi";
import { queryGames, syncLatestGames } from "@/lib/gameSync";

const ENDPOINT = "/api/developer/30-sec-game-history";

function firstQuery(value) {
  return Array.isArray(value) ? value[0] : value;
}

function getBearerToken(req) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return "";
  return header.slice(7).trim();
}

function apiErrorStatus(error) {
  return error.message?.includes("MONGODB_URI") ? 503 : 500;
}

export default async function handler(req, res) {
  const startedAt = Date.now();
  let keyDoc = null;
  let keyHash = null;

  res.setHeader("Cache-Control", "no-store");

  async function send(status, payload, error = null) {
    const responseTimeMs = Date.now() - startedAt;
    await logDeveloperRequest({
      req,
      keyDoc,
      keyHash,
      endpoint: ENDPOINT,
      status,
      responseTimeMs,
      error,
    });
    return res.status(status).json(payload);
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return send(405, { ok: false, error: "Method not allowed" }, "method_not_allowed");
  }

  try {
    if (process.env.NODE_ENV === "production" && getRequestProtocol(req) !== "https") {
      return send(426, { ok: false, error: "HTTPS is required in production" }, "https_required");
    }

    const apiKey = getBearerToken(req);
    if (!apiKey) {
      return send(401, { ok: false, error: "Missing Bearer API key" }, "missing_api_key");
    }

    const lookup = await findApiKeyByToken(apiKey);
    keyDoc = lookup.keyDoc;
    keyHash = lookup.keyHash;

    if (!keyDoc) {
      return send(401, { ok: false, error: "Invalid or revoked API key" }, "invalid_api_key");
    }

    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
    const recentRequests = await countRecentRequests(keyHash, windowStart);
    const resetAt = new Date(windowStart.getTime() + RATE_LIMIT_WINDOW_MS).toISOString();

    res.setHeader("X-RateLimit-Limit", String(RATE_LIMIT_MAX));
    res.setHeader("X-RateLimit-Remaining", String(Math.max(0, RATE_LIMIT_MAX - recentRequests - 1)));
    res.setHeader("X-RateLimit-Reset", resetAt);

    if (recentRequests >= RATE_LIMIT_MAX) {
      res.setHeader("Retry-After", "60");
      return send(
        429,
        {
          ok: false,
          error: "Rate limit exceeded",
          rateLimit: { limit: RATE_LIMIT_MAX, remaining: 0, resetAt },
        },
        "rate_limited",
      );
    }

    let sync = null;
    let syncError = null;
    try {
      sync = await syncLatestGames();
    } catch (error) {
      syncError = error.message || "Sync failed";
    }

    const result = await queryGames({
      page: firstQuery(req.query.page),
      limit: firstQuery(req.query.limit),
      search: firstQuery(req.query.search || req.query.period),
      from: firstQuery(req.query.from || req.query.startDate),
      to: firstQuery(req.query.to || req.query.endDate),
    });

    await touchApiKey(keyDoc);

    return send(200, {
      ok: true,
      endpoint: ENDPOINT,
      data: result.records,
      pagination: result.pagination,
      meta: {
        baseUrl: "https://wingo30.com",
        cache: {
          syncedAt: sync?.syncedAt ? new Date(sync.syncedAt).toISOString() : null,
          inserted: sync?.inserted || 0,
          matched: sync?.matched || 0,
          syncError,
        },
        rateLimit: {
          limit: RATE_LIMIT_MAX,
          remaining: Math.max(0, RATE_LIMIT_MAX - recentRequests - 1),
          resetAt,
        },
      },
    });
  } catch (error) {
    console.error("Developer public history API error:", error);
    return send(apiErrorStatus(error), { ok: false, error: error.message || "History request failed" }, error.message);
  }
}
