import { fetchWingoHistory } from "./wingo";
import { ensureDeveloperIndexes, getMongoDb } from "./mongodb";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function toInt(value, fallback, min, max) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function normalizeDate(value, endOfDay = false) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
    date.setHours(endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0, endOfDay ? 999 : 0);
  }
  return date;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeGame(row, index, syncedAt) {
  const blockTimestamp = Number(row.blockTimestamp) || Date.now() - index * 30000;
  const number = Number(row.number);
  const colors = Array.isArray(row.colors) ? row.colors : [];

  return {
    period: String(row.period),
    number,
    size: row.size || (number >= 5 ? "Big" : "Small"),
    colors,
    color: colors.join(", "),
    blockTimestamp,
    drawTime: new Date(blockTimestamp),
    syncedAt,
  };
}

function serializeGame(doc) {
  return {
    period: doc.period,
    number: doc.number,
    size: doc.size,
    colors: Array.isArray(doc.colors) ? doc.colors : [],
    color: doc.color || (Array.isArray(doc.colors) ? doc.colors.join(", ") : ""),
    blockTimestamp: Number(doc.blockTimestamp) || 0,
    time: doc.drawTime ? new Date(doc.drawTime).toISOString() : null,
  };
}

export async function syncLatestGames() {
  await ensureDeveloperIndexes();
  const db = await getMongoDb();
  const syncedAt = new Date();

  const payload = await fetchWingoHistory();
  const history = Array.isArray(payload?.history) ? payload.history : [];
  const games = history
    .map((row, index) => normalizeGame(row, index, syncedAt))
    .filter((row) => row.period && Number.isFinite(row.number));

  if (!games.length) {
    return { inserted: 0, matched: 0, syncedAt, serviceTime: payload?.serviceTime || Date.now() };
  }

  const result = await db.collection("games").bulkWrite(
    games.map((game) => ({
      updateOne: {
        filter: { period: game.period },
        update: {
          $set: game,
          $setOnInsert: { createdAt: syncedAt },
        },
        upsert: true,
      },
    })),
    { ordered: false },
  );

  return {
    inserted: result.upsertedCount || 0,
    matched: result.matchedCount || 0,
    syncedAt,
    serviceTime: payload?.serviceTime || Date.now(),
  };
}

export async function queryGames(options = {}) {
  await ensureDeveloperIndexes();
  const db = await getMongoDb();
  const page = toInt(options.page, 1, 1, 100000);
  const limit = toInt(options.limit, DEFAULT_LIMIT, 1, MAX_LIMIT);
  const filter = {};
  const search = String(options.search || "").trim();
  const from = normalizeDate(options.from);
  const to = normalizeDate(options.to, true);

  if (search) {
    filter.period = { $regex: escapeRegExp(search), $options: "i" };
  }

  if (from || to) {
    filter.blockTimestamp = {};
    if (from) filter.blockTimestamp.$gte = from.getTime();
    if (to) filter.blockTimestamp.$lte = to.getTime();
  }

  const collection = db.collection("games");
  const [total, docs] = await Promise.all([
    collection.countDocuments(filter),
    collection
      .find(filter, { projection: { _id: 0 } })
      .sort({ blockTimestamp: -1, period: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    records: docs.map(serializeGame),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

export async function getGameCacheStats() {
  await ensureDeveloperIndexes();
  const db = await getMongoDb();
  const latest = await db
    .collection("games")
    .find({}, { projection: { _id: 0, period: 1, syncedAt: 1, blockTimestamp: 1 } })
    .sort({ blockTimestamp: -1 })
    .limit(1)
    .next();
  const total = await db.collection("games").estimatedDocumentCount();

  return {
    total,
    latestPeriod: latest?.period || null,
    lastSyncedAt: latest?.syncedAt ? new Date(latest.syncedAt).toISOString() : null,
  };
}
