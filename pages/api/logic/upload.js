import { requireAuth } from "@/lib/authMiddleware";
import { saveLogic, getLogicMeta } from "@/lib/logicStore";

export const config = {
  api: {
    bodyParser: false, // We handle raw body manually
  },
};

// Simple in-memory rate limit: max 5 uploads per hour per user
const uploadAttempts = new Map();

function checkRateLimit(email) {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxAttempts = 5;

  const record = uploadAttempts.get(email) || { count: 0, windowStart: now };

  if (now - record.windowStart > windowMs) {
    // Reset window
    record.count = 1;
    record.windowStart = now;
  } else {
    record.count += 1;
  }

  uploadAttempts.set(email, record);
  return record.count <= maxAttempts;
}

async function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

// Parse multipart/form-data manually (lightweight, no dependencies)
function parseMultipart(buffer, boundary) {
  const boundaryBuffer = Buffer.from("--" + boundary);
  const parts = [];

  let searchStart = 0;
  while (searchStart < buffer.length) {
    const boundaryStart = buffer.indexOf(boundaryBuffer, searchStart);
    if (boundaryStart === -1) break;

    const headerStart = boundaryStart + boundaryBuffer.length + 2; // skip \r\n
    const headerEnd = buffer.indexOf(Buffer.from("\r\n\r\n"), headerStart);
    if (headerEnd === -1) break;

    const headerText = buffer.slice(headerStart, headerEnd).toString("utf8");
    const dataStart = headerEnd + 4;

    const nextBoundary = buffer.indexOf(boundaryBuffer, dataStart);
    const dataEnd = nextBoundary !== -1 ? nextBoundary - 2 : buffer.length; // strip \r\n

    const data = buffer.slice(dataStart, dataEnd);
    parts.push({ headers: headerText, data });
    searchStart = nextBoundary !== -1 ? nextBoundary : buffer.length;
  }

  return parts;
}

function extractFileName(headers) {
  const match = headers.match(/filename="([^"]+)"/i);
  return match ? match[1] : null;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 1. Auth check
  let user;
  try {
    user = await requireAuth(req);
  } catch (err) {
    return res.status(err.status || 401).json({ error: err.message });
  }

  // 2. Rate limit
  if (!checkRateLimit(user.email)) {
    return res.status(429).json({ error: "Too many uploads. Please wait before trying again." });
  }

  // 3. Parse multipart body
  const contentType = req.headers["content-type"] || "";
  const boundaryMatch = contentType.match(/boundary=([^\s;]+)/);
  if (!boundaryMatch) {
    return res.status(400).json({ error: "Invalid Content-Type — multipart/form-data required." });
  }

  let rawBody;
  try {
    rawBody = await readRawBody(req);
  } catch {
    return res.status(400).json({ error: "Failed to read request body." });
  }

  const parts = parseMultipart(rawBody, boundaryMatch[1]);
  const filePart = parts.find((p) => p.headers.includes('name="file"') || p.headers.includes("filename="));

  if (!filePart) {
    return res.status(400).json({ error: "No file found in request." });
  }

  const fileName = extractFileName(filePart.headers) || "unknown.trionai";
  const fileBuffer = filePart.data;

  // 4. Validate & store
  try {
    const meta = await saveLogic(user.email, fileBuffer, fileName);
    return res.status(200).json({
      success: true,
      message: "Logic uploaded and activated successfully.",
      logic: meta,
    });
  } catch (err) {
    const isValidation = err.code === "INVALID_FILE";
    return res.status(isValidation ? 422 : 500).json({
      error: err.message || "Upload failed.",
    });
  }
}
