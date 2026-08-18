import fs from "fs";
import path from "path";
import { getMongoDb } from "./mongodb";

const DB_DIR = path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DB_DIR, "users.json");
const ACTIVATIONS_FILE = path.join(DB_DIR, "activations.json");
const MAINTENANCE_FILE = path.join(DB_DIR, "maintenance.json");
const PAYMENTS_FILE = path.join(DB_DIR, "payments.json");
const PRESENCE_FILE = path.join(DB_DIR, "presence.json");

function hasMongo() {
  return !!process.env.MONGODB_URI;
}

function ensureDir() {
  try { if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true }); } catch {}
}

function readJSON(file) {
  try { ensureDir(); if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, "utf8")); } catch {}
  return [];
}

function writeJSON(file, data) {
  try { ensureDir(); fs.writeFileSync(file, JSON.stringify(data, null, 2)); } catch {}
}

function toPlain(doc) {
  if (!doc) return null;
  if (Array.isArray(doc)) return doc.map((d) => toPlain(d));
  const { _id, ...rest } = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return rest;
}

export async function getUsers() {
  if (hasMongo()) {
    try {
      const db = await getMongoDb();
      return toPlain(await db.collection("users").find().sort({ createdAt: -1 }).toArray());
    } catch (e) { console.error("getUsers mongo error:", e?.message); }
  }
  const users = readJSON(USERS_FILE);
  return users.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export async function findUserByEmail(email) {
  if (hasMongo()) {
    try {
      const db = await getMongoDb();
      return toPlain(await db.collection("users").findOne({ email }));
    } catch (e) { console.error("findUserByEmail mongo error:", e?.message); }
  }
  const users = readJSON(USERS_FILE);
  return users.find((u) => u.email === email) || null;
}

export async function insertUser(user) {
  if (hasMongo()) {
    try {
      const db = await getMongoDb();
      const existing = await db.collection("users").findOne({ email: user.email });
      if (!existing) {
        await db.collection("users").insertOne({ ...user });
      }
      return user;
    } catch (e) { console.error("insertUser mongo error:", e?.message); }
  }
  const users = readJSON(USERS_FILE);
  if (!users.find((u) => u.email === user.email)) {
    users.unshift(user);
    writeJSON(USERS_FILE, users);
  }
  return user;
}

export async function updateUser(email, updates) {
  if (hasMongo()) {
    const db = await getMongoDb();
    const result = await db.collection("users").findOneAndUpdate(
      { email },
      { $set: updates },
      { returnDocument: "after", includeResultMetadata: false }
    );
    return toPlain(result);
  }
  const users = readJSON(USERS_FILE);
  const idx = users.findIndex((u) => u.email === email);
  if (idx === -1) return null;
  Object.assign(users[idx], updates);
  writeJSON(USERS_FILE, users);
  return users[idx];
}

export async function insertActivation(activation) {
  if (hasMongo()) {
    try {
      const db = await getMongoDb();
      await db.collection("activations").insertOne({ ...activation });
      return;
    } catch (e) { console.error("insertActivation mongo error:", e?.message); }
  }
  const acts = readJSON(ACTIVATIONS_FILE);
  acts.unshift(activation);
  writeJSON(ACTIVATIONS_FILE, acts);
}

export async function getActivations() {
  if (hasMongo()) {
    try {
      const db = await getMongoDb();
      return toPlain(await db.collection("activations").find().sort({ activatedAt: -1 }).toArray());
    } catch (e) { console.error("getActivations mongo error:", e?.message); }
  }
  return readJSON(ACTIVATIONS_FILE);
}

export async function getMaintenance() {
  if (hasMongo()) {
    try {
      const db = await getMongoDb();
      const doc = await db.collection("maintenance").findOne({ _id: "config" });
      if (doc) return toPlain(doc);
      return { enabled: false, title: "", message: "", eta: "", updatedAt: null };
    } catch (e) { console.error("getMaintenance mongo error:", e?.message); }
  }
  const data = readJSON(MAINTENANCE_FILE);
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { enabled: false, title: "", message: "", eta: "", updatedAt: null };
  }
  return data;
}

export async function updateMaintenance(config) {
  const data = {
    enabled: !!config.enabled,
    title: typeof config.title === "string" ? config.title : "",
    message: typeof config.message === "string" ? config.message : "",
    eta: typeof config.eta === "string" ? config.eta : "",
    updatedAt: Date.now(),
  };
  if (hasMongo()) {
    const db = await getMongoDb();
    await db.collection("maintenance").updateOne(
      { _id: "config" },
      { $set: data },
      { upsert: true }
    );
    return data;
  }
  writeJSON(MAINTENANCE_FILE, data);
  return data;
}

export async function insertVisit(visit) {
  if (hasMongo()) {
    try {
      const db = await getMongoDb();
      await db.collection("visits").insertOne({ ...visit });
      const count = await db.collection("visits").countDocuments();
      if (count > 10000) {
        const oldest = await db.collection("visits").find().sort({ timestamp: 1 }).limit(count - 10000).toArray();
        if (oldest.length > 0) {
          await db.collection("visits").deleteMany({ _id: { $in: oldest.map((o) => o._id) } });
        }
      }
      return;
    } catch (e) { console.error("insertVisit mongo error:", e?.message); }
  }
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
  let visits = [];
  if (fs.existsSync(USERS_FILE.replace("users.json", "visits.json"))) {
    try { visits = JSON.parse(fs.readFileSync(path.join(DB_DIR, "visits.json"), "utf8")); } catch { visits = []; }
  }
  visits.push(visit);
  if (visits.length > 10000) visits = visits.slice(-10000);
  fs.writeFileSync(path.join(DB_DIR, "visits.json"), JSON.stringify(visits));
}

export async function getVisits() {
  if (hasMongo()) {
    try {
      const db = await getMongoDb();
      return toPlain(await db.collection("visits").find().toArray());
    } catch (e) { console.error("getVisits mongo error:", e?.message); }
  }
  const file = path.join(DB_DIR, "visits.json");
  if (fs.existsSync(file)) {
    try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch {}
  }
  return [];
}

// ──── Payment orders ─────────────────────────────────────────────────────

export async function createPaymentOrder(order) {
  if (hasMongo()) {
    try {
      const db = await getMongoDb();
      await db.collection("payments").insertOne({ ...order });
      return { ...order };
    } catch (e) {
      if (e?.code === 11000) return null;
      console.error("createPaymentOrder mongo error:", e?.message);
    }
  }
  const orders = readJSON(PAYMENTS_FILE);
  if (orders.some((o) => o.order_id === order.order_id)) return null;
  orders.unshift(order);
  writeJSON(PAYMENTS_FILE, orders);
  return { ...order };
}

export async function findPaymentByOrderId(orderId) {
  if (hasMongo()) {
    try {
      const db = await getMongoDb();
      return toPlain(await db.collection("payments").findOne({ order_id: orderId }));
    } catch (e) { console.error("findPaymentByOrderId mongo error:", e?.message); }
  }
  return readJSON(PAYMENTS_FILE).find((o) => o.order_id === orderId) || null;
}

export async function findPaymentByGatewayId(gatewayOrderId) {
  if (hasMongo()) {
    try {
      const db = await getMongoDb();
      return toPlain(await db.collection("payments").findOne({ gateway_order_id: gatewayOrderId }));
    } catch (e) { console.error("findPaymentByGatewayId mongo error:", e?.message); }
  }
  return readJSON(PAYMENTS_FILE).find((o) => o.gateway_order_id === gatewayOrderId) || null;
}

export async function findPaymentByUtr(utr) {
  if (hasMongo()) {
    try {
      const db = await getMongoDb();
      return toPlain(await db.collection("payments").findOne({ utr }));
    } catch (e) { console.error("findPaymentByUtr mongo error:", e?.message); }
  }
  return readJSON(PAYMENTS_FILE).find((o) => o.utr === utr) || null;
}

export async function updatePaymentByOrderId(orderId, updates) {
  if (hasMongo()) {
    try {
      const db = await getMongoDb();
      const result = await db.collection("payments").findOneAndUpdate(
        { order_id: orderId },
        { $set: updates },
        { returnDocument: "after", includeResultMetadata: false }
      );
      return toPlain(result);
    } catch (e) { console.error("updatePaymentByOrderId mongo error:", e?.message); }
  }
  const orders = readJSON(PAYMENTS_FILE);
  const idx = orders.findIndex((o) => o.order_id === orderId);
  if (idx === -1) return null;
  Object.assign(orders[idx], updates);
  writeJSON(PAYMENTS_FILE, orders);
  return orders[idx];
}

export async function listPayments() {
  if (hasMongo()) {
    try {
      const db = await getMongoDb();
      return toPlain(await db.collection("payments").find().sort({ created_at: -1 }).toArray());
    } catch (e) { console.error("listPayments mongo error:", e?.message); }
  }
  return readJSON(PAYMENTS_FILE);
}

// ──── Live presence (heartbeat/session tracking) ─────────────────────────
// Temporary session data only. Permanent user/payment records are stored
// separately and are never touched by presence cleanup.

export async function upsertPresence(presence) {
  if (hasMongo()) {
    try {
      const db = await getMongoDb();
      const existing = await db.collection("live_presence").findOne({ user_id: presence.user_id, session_id: presence.session_id });
      await db.collection("live_presence").updateOne(
        { user_id: presence.user_id, session_id: presence.session_id },
        {
          $set: {
            email: presence.email,
            status: presence.status || "ONLINE",
            last_seen: presence.last_seen,
            last_page: presence.last_page || "",
            updated_at: presence.last_seen,
          },
          $setOnInsert: {
            session_started: presence.session_started || presence.last_seen,
          },
        },
        { upsert: true }
      );
      if (existing) {
        return { ...existing, ...presence };
      }
      return presence;
    } catch (e) { console.error("upsertPresence mongo error:", e?.message); }
  }
  const records = readJSON(PRESENCE_FILE);
  const idx = records.findIndex((r) => r.user_id === presence.user_id && r.session_id === presence.session_id);
  if (idx === -1) {
    records.push({
      user_id: presence.user_id,
      email: presence.email,
      status: presence.status || "ONLINE",
      last_seen: presence.last_seen,
      last_page: presence.last_page || "",
      session_id: presence.session_id,
      session_started: presence.session_started || presence.last_seen,
    });
  } else {
    Object.assign(records[idx], {
      email: presence.email,
      status: presence.status || "ONLINE",
      last_seen: presence.last_seen,
      last_page: presence.last_page || "",
    });
  }
  writeJSON(PRESENCE_FILE, records);
  return presence;
}

export async function getPresence() {
  if (hasMongo()) {
    try {
      const db = await getMongoDb();
      return toPlain(await db.collection("live_presence").find().toArray());
    } catch (e) { console.error("getPresence mongo error:", e?.message); }
  }
  return readJSON(PRESENCE_FILE);
}

export async function deleteStalePresence(beforeTimestamp) {
  if (hasMongo()) {
    try {
      const db = await getMongoDb();
      const result = await db.collection("live_presence").deleteMany({ last_seen: { $lt: beforeTimestamp } });
      return result.deletedCount || 0;
    } catch (e) { console.error("deleteStalePresence mongo error:", e?.message); }
  }
  const records = readJSON(PRESENCE_FILE);
  const remaining = records.filter((r) => (r.last_seen || 0) >= beforeTimestamp);
  writeJSON(PRESENCE_FILE, remaining);
  return records.length - remaining.length;
}

export async function ensurePresenceIndexes() {
  if (!hasMongo()) return;
  try {
    const db = await getMongoDb();
    await Promise.all([
      db.collection("live_presence").createIndex({ user_id: 1, session_id: 1 }, { unique: true }),
      db.collection("live_presence").createIndex({ last_seen: -1 }),
    ]);
  } catch (e) { console.error("ensurePresenceIndexes mongo error:", e?.message); }
}
