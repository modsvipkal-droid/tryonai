import fs from "fs";
import path from "path";
import crypto from "crypto";

// ─── Storage paths ──────────────────────────────────────────────────────────
const DATA_DIR = path.join(process.cwd(), ".data");
const LOGIC_DIR = path.join(DATA_DIR, "logic");

// ─── Encryption config ───────────────────────────────────────────────────────
const ALGORITHM = "aes-256-gcm";
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const SALT_LENGTH = 32;
const KDF_ITERATIONS = 100_000;
const KDF_DIGEST = "sha256";

// Master encryption secret from env, falls back to a derived secret
function getMasterSecret() {
  const secret = process.env.LOGIC_ENCRYPTION_SECRET || process.env.NEXTAUTH_SECRET || "trionai-logic-default-secret-change-in-production";
  return Buffer.isBuffer(secret) ? secret : Buffer.from(secret, "utf8");
}

// Derive a per-user key from the master secret + user identity salt
function deriveKey(userSalt) {
  const master = getMasterSecret();
  return crypto.pbkdf2Sync(master, userSalt, KDF_ITERATIONS, KEY_LENGTH, KDF_DIGEST);
}

// ─── Path helpers ─────────────────────────────────────────────────────────────
function userDir(email) {
  // Hash the email so the filesystem path doesn't expose PII
  const hash = crypto.createHash("sha256").update(email.toLowerCase()).digest("hex").slice(0, 16);
  return path.join(LOGIC_DIR, hash);
}

function logicBlobPath(email) {
  return path.join(userDir(email), "logic.enc");
}

function logicMetaPath(email) {
  return path.join(userDir(email), "meta.json");
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ─── Encryption / Decryption ──────────────────────────────────────────────────
function encrypt(plainBuffer, email) {
  const salt = crypto.randomBytes(SALT_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = deriveKey(Buffer.concat([salt, Buffer.from(email.toLowerCase())]));

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH });
  const encrypted = Buffer.concat([cipher.update(plainBuffer), cipher.final()]);
  const tag = cipher.getAuthTag();

  // Layout: [salt(32)] [iv(16)] [tag(16)] [encrypted]
  return Buffer.concat([salt, iv, tag, encrypted]);
}

function decrypt(encryptedBuffer, email) {
  const salt = encryptedBuffer.slice(0, SALT_LENGTH);
  const iv = encryptedBuffer.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const tag = encryptedBuffer.slice(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
  const data = encryptedBuffer.slice(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);

  const key = deriveKey(Buffer.concat([salt, Buffer.from(email.toLowerCase())]));
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH });
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]);
}

// ─── .trionai File Validation ─────────────────────────────────────────────────
const VALID_SIGNATURE = "TRIONAI_V1";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const REQUIRED_FIELDS = ["signature", "version", "name", "logic"];

export function validateTrionAIFile(buffer, fileName) {
  // 1. Extension check
  if (!fileName || !fileName.toLowerCase().endsWith(".trionai")) {
    return { valid: false, error: "Invalid file extension. Only .trionai files are accepted." };
  }

  // 2. File size
  if (buffer.length === 0) {
    return { valid: false, error: "File is empty." };
  }
  if (buffer.length > MAX_FILE_SIZE) {
    return { valid: false, error: "File exceeds maximum allowed size of 5 MB." };
  }

  // 3. Try to parse as JSON (the .trionai format is signed JSON)
  let parsed;
  try {
    const text = buffer.toString("utf8");
    parsed = JSON.parse(text);
  } catch {
    return { valid: false, error: "Invalid TrionAI Logic File — corrupted or unreadable content." };
  }

  // 4. Signature check
  if (typeof parsed.signature !== "string" || !parsed.signature.startsWith(VALID_SIGNATURE)) {
    return { valid: false, error: "Invalid TrionAI Logic File — signature mismatch." };
  }

  // 5. Version check
  if (!parsed.version) {
    return { valid: false, error: "Invalid TrionAI Logic File — missing version field." };
  }

  // 6. Required fields
  for (const field of REQUIRED_FIELDS) {
    if (!(field in parsed)) {
      return { valid: false, error: `Invalid TrionAI Logic File — missing required field: "${field}".` };
    }
  }

  // 7. Logic structure check
  if (typeof parsed.logic !== "object" || Array.isArray(parsed.logic) || parsed.logic === null) {
    return { valid: false, error: "Invalid TrionAI Logic File — logic field must be an object." };
  }

  // 8. Integrity hash check (optional but checked if present)
  if (parsed.integrity) {
    const { integrity, ...rest } = parsed;
    const contentHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(rest, Object.keys(rest).sort()))
      .digest("hex");
    if (contentHash !== integrity) {
      return { valid: false, error: "Invalid TrionAI Logic File — integrity check failed." };
    }
  }

  return {
    valid: true,
    meta: {
      name: String(parsed.name).slice(0, 100),
      version: String(parsed.version).slice(0, 20),
      compatibility: String(parsed.compatibility || "TryonAI v1").slice(0, 50),
      signature: VALID_SIGNATURE,
    },
    logic: parsed.logic,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Save a user's logic file (encrypted).
 * Returns the metadata object (no logic content).
 */
export async function saveLogic(email, fileBuffer, fileName) {
  const validation = validateTrionAIFile(fileBuffer, fileName);
  if (!validation.valid) {
    throw Object.assign(new Error(validation.error), { code: "INVALID_FILE" });
  }

  const dir = userDir(email);
  ensureDir(dir);

  // Encrypt and store the raw file buffer
  const encrypted = encrypt(fileBuffer, email);
  fs.writeFileSync(logicBlobPath(email), encrypted);

  const now = Date.now();
  const meta = {
    email,
    fileName,
    name: validation.meta.name,
    version: validation.meta.version,
    compatibility: validation.meta.compatibility,
    signature: validation.meta.signature,
    uploadDate: now,
    lastUsed: null,
    status: "active",
  };

  fs.writeFileSync(logicMetaPath(email), JSON.stringify(meta, null, 2));
  return metaToPublic(meta);
}

/**
 * Get a user's logic metadata. Returns null if no logic uploaded.
 * NEVER returns raw logic content.
 */
export function getLogicMeta(email) {
  const metaPath = logicMetaPath(email);
  if (!fs.existsSync(metaPath)) return null;
  try {
    const raw = JSON.parse(fs.readFileSync(metaPath, "utf8"));
    return metaToPublic(raw);
  } catch {
    return null;
  }
}

/**
 * Load and decrypt a user's logic for server-side prediction use only.
 * This result MUST NEVER be sent to the client.
 */
export function loadLogicForPrediction(email) {
  const metaPath = logicMetaPath(email);
  const blobPath = logicBlobPath(email);

  if (!fs.existsSync(metaPath) || !fs.existsSync(blobPath)) {
    return null;
  }

  try {
    const encryptedBuffer = fs.readFileSync(blobPath);
    const decrypted = decrypt(encryptedBuffer, email);
    const parsed = JSON.parse(decrypted.toString("utf8"));

    // Update lastUsed timestamp
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
      meta.lastUsed = Date.now();
      fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
    } catch {}

    return parsed.logic || null;
  } catch {
    return null;
  }
}

/**
 * Delete a user's logic.
 */
export function deleteLogic(email) {
  const dir = userDir(email);
  const blobPath = logicBlobPath(email);
  const metaPath = logicMetaPath(email);

  try {
    if (fs.existsSync(blobPath)) fs.unlinkSync(blobPath);
    if (fs.existsSync(metaPath)) fs.unlinkSync(metaPath);
    // Remove the dir if empty
    if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0) {
      fs.rmdirSync(dir);
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a user has an active logic uploaded.
 */
export function hasActiveLogic(email) {
  return fs.existsSync(logicMetaPath(email)) && fs.existsSync(logicBlobPath(email));
}

// Strip internal fields from meta before sending to client
function metaToPublic(meta) {
  return {
    name: meta.name,
    version: meta.version,
    compatibility: meta.compatibility,
    signature: meta.signature,
    uploadDate: meta.uploadDate,
    lastUsed: meta.lastUsed,
    status: meta.status,
    fileName: meta.fileName,
  };
}
