import crypto from "crypto";
import { ensureDeveloperIndexes, getMongoDb } from "./mongodb";

export const API_KEY_PREFIX = "ws_";
export const RATE_LIMIT_MAX = 60;
export const RATE_LIMIT_WINDOW_MS = 60 * 1000;

export function getDeveloperUserId(user) {
  return user?.uid || user?.email || "unknown";
}

export function hashApiKey(apiKey) {
  return crypto.createHash("sha256").update(String(apiKey)).digest("hex");
}

export function generateApiKey() {
  return `${API_KEY_PREFIX}${crypto.randomBytes(32).toString("base64url")}`;
}

export function maskApiKey(docOrKey) {
  if (!docOrKey) return null;
  if (typeof docOrKey === "string") {
    return `${docOrKey.slice(0, 10)}...${docOrKey.slice(-4)}`;
  }
  return `${docOrKey.prefix || API_KEY_PREFIX}...${docOrKey.last4 || "----"}`;
}

export function serializeKeyDoc(doc) {
  if (!doc) return null;
  return {
    id: String(doc._id),
    mask: maskApiKey(doc),
    prefix: doc.prefix,
    last4: doc.last4,
    active: Boolean(doc.active),
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
    lastUsedAt: doc.lastUsedAt ? new Date(doc.lastUsedAt).toISOString() : null,
    revokedAt: doc.revokedAt ? new Date(doc.revokedAt).toISOString() : null,
  };
}

export async function getActiveApiKeyForUser(user) {
  await ensureDeveloperIndexes();
  const db = await getMongoDb();
  const userId = getDeveloperUserId(user);
  return db.collection("api_keys").findOne(
    { userId, active: true, revokedAt: null },
    { sort: { createdAt: -1 } },
  );
}

export async function createApiKeyForUser(user) {
  await ensureDeveloperIndexes();
  const db = await getMongoDb();
  const now = new Date();
  const userId = getDeveloperUserId(user);
  const apiKey = generateApiKey();
  const keyHash = hashApiKey(apiKey);
  const doc = {
    userId,
    email: user.email,
    keyHash,
    prefix: apiKey.slice(0, 10),
    last4: apiKey.slice(-4),
    active: true,
    createdAt: now,
    updatedAt: now,
    lastUsedAt: null,
  };

  await db.collection("api_keys").updateMany(
    { userId, active: true, revokedAt: null },
    { $set: { active: false, revokedAt: now, revokedReason: "rotated", updatedAt: now } },
  );

  const result = await db.collection("api_keys").insertOne(doc);
  return { apiKey, keyDoc: { ...doc, _id: result.insertedId } };
}

export async function revokeApiKeysForUser(user) {
  await ensureDeveloperIndexes();
  const db = await getMongoDb();
  const now = new Date();
  const userId = getDeveloperUserId(user);
  const result = await db.collection("api_keys").updateMany(
    { userId, active: true, revokedAt: null },
    { $set: { active: false, revokedAt: now, revokedReason: "manual", updatedAt: now } },
  );
  return result.modifiedCount || 0;
}

export async function findApiKeyByToken(apiKey) {
  const token = String(apiKey || "").trim();
  if (!token.startsWith(API_KEY_PREFIX) || token.length < 20) {
    return { keyDoc: null, keyHash: token ? hashApiKey(token) : null };
  }

  await ensureDeveloperIndexes();
  const db = await getMongoDb();
  const keyHash = hashApiKey(token);
  const keyDoc = await db.collection("api_keys").findOne({ keyHash, active: true, revokedAt: null });
  return { keyDoc, keyHash };
}

export async function touchApiKey(keyDoc) {
  if (!keyDoc?._id) return;
  const db = await getMongoDb();
  await db.collection("api_keys").updateOne(
    { _id: keyDoc._id },
    { $set: { lastUsedAt: new Date(), updatedAt: new Date() } },
  );
}

export async function countRecentRequests(keyHash, sinceDate) {
  await ensureDeveloperIndexes();
  const db = await getMongoDb();
  return db.collection("api_logs").countDocuments({ keyHash, timestamp: { $gte: sinceDate } });
}

export function getRequestIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
}

export function getRequestProtocol(req) {
  const forwarded = req.headers["x-forwarded-proto"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim().toLowerCase();
  }
  return req.socket?.encrypted ? "https" : "http";
}

export async function logDeveloperRequest({ req, keyDoc, keyHash, endpoint, status, responseTimeMs, error }) {
  try {
    await ensureDeveloperIndexes();
    const db = await getMongoDb();
    await db.collection("api_logs").insertOne({
      endpoint,
      keyId: keyDoc?._id || null,
      keyHash: keyHash || keyDoc?.keyHash || null,
      userId: keyDoc?.userId || null,
      email: keyDoc?.email || null,
      status,
      responseTimeMs,
      ip: getRequestIp(req),
      userAgent: req.headers["user-agent"] || "",
      timestamp: new Date(),
      error: error || null,
    });
  } catch (logError) {
    console.warn("[developer-api] request log failed", logError.message);
  }
}

export async function getDeveloperStats(user) {
  await ensureDeveloperIndexes();
  const db = await getMongoDb();
  const userId = getDeveloperUserId(user);
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const match = { userId };

  const [totalRequests, requestsToday, monthlyRequests, avgRows, lastLog, dailyRows] = await Promise.all([
    db.collection("api_logs").countDocuments(match),
    db.collection("api_logs").countDocuments({ ...match, timestamp: { $gte: todayStart } }),
    db.collection("api_logs").countDocuments({ ...match, timestamp: { $gte: monthStart } }),
    db.collection("api_logs").aggregate([
      { $match: match },
      { $group: { _id: null, averageResponseTimeMs: { $avg: "$responseTimeMs" } } },
    ]).toArray(),
    db.collection("api_logs").find(match, { projection: { _id: 0, timestamp: 1, status: 1 } }).sort({ timestamp: -1 }).limit(1).next(),
    db.collection("api_logs").aggregate([
      { $match: { ...match, timestamp: { $gte: monthStart } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }, requests: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]).toArray(),
  ]);

  return {
    totalRequests,
    requestsToday,
    monthlyRequests,
    averageResponseTimeMs: Math.round(avgRows[0]?.averageResponseTimeMs || 0),
    lastActivityAt: lastLog?.timestamp ? new Date(lastLog.timestamp).toISOString() : null,
    dailySeries: dailyRows.map((row) => ({ date: row._id, requests: row.requests })),
  };
}
