import fs from "fs";
import path from "path";

const DB_DIR = path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DB_DIR, "users.json");
const ACTIVATIONS_FILE = path.join(DB_DIR, "activations.json");
const MAINTENANCE_FILE = path.join(DB_DIR, "maintenance.json");

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

function toPlain(doc) { return JSON.parse(JSON.stringify(doc)); }

export async function getUsers() {
  const users = readJSON(USERS_FILE);
  return users.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export async function findUserByEmail(email) {
  const users = readJSON(USERS_FILE);
  return users.find((u) => u.email === email) || null;
}

export async function insertUser(user) {
  const users = readJSON(USERS_FILE);
  if (!users.find((u) => u.email === user.email)) {
    users.unshift(user);
    writeJSON(USERS_FILE, users);
  }
  return user;
}

export async function updateUser(email, updates) {
  const users = readJSON(USERS_FILE);
  const idx = users.findIndex((u) => u.email === email);
  if (idx === -1) return null;
  Object.assign(users[idx], updates);
  writeJSON(USERS_FILE, users);
  return users[idx];
}

export async function insertActivation(activation) {
  const acts = readJSON(ACTIVATIONS_FILE);
  acts.unshift(activation);
  writeJSON(ACTIVATIONS_FILE, acts);
}

export async function getActivations() {
  return readJSON(ACTIVATIONS_FILE);
}

export async function getMaintenance() {
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
  writeJSON(MAINTENANCE_FILE, data);
  return data;
}
