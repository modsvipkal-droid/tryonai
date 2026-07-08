import { requireAuth } from "@/lib/authMiddleware";
import { hasActiveLogic, loadLogicForPrediction } from "@/lib/logicStore";
import { createRateLimiter } from "@/lib/rateLimit";
import { logSecurityEvent } from "@/lib/securityLog";

const predictLimiter = createRateLimiter({ windowMs: 10000, max: 30, name: "predict" });

const HISTORY_URL = "https://draw.ar-lottery01.com/WinGo/WinGo_30S/GetHistoryIssuePage.json?ts=";

const BIG_PATTERNS = new Set([
  "Dragonfly Doji", "Morning Star", "Bullish Engulfing", "Hammer",
  "Three White Soldiers", "Tweezer Bottom", "Inverted Hammer", "Bullish Harami", "Bullish Harami Cross",
]);

const SMALL_PATTERNS = new Set([
  "Evening Star", "Bearish Engulfing", "Shooting Star", "Tweezer Top",
  "Hanging Man", "Gravestone Doji", "Three Black Crows", "Bearish Kicker", "Falling Three Methods",
]);

function buildCandle(open, close) {
  return {
    open, close,
    high: Math.max(open, close), low: Math.min(open, close),
    bodySize: Math.abs(close - open),
    upperShadow: Math.max(open, close), lowerShadow: Math.min(open, close),
    isBullish: close > open, isBearish: close < open, isDoji: close === open,
  };
}

function detectTrend(numbers) {
  const first = numbers.slice(0, 4);
  const up = first.filter((n, i) => i > 0 && n > first[i - 1]).length;
  const down = first.filter((n, i) => i > 0 && n < first[i - 1]).length;
  if (up >= down + 1) return "uptrend";
  if (down >= up + 1) return "downtrend";
  return "neutral";
}

function detectPatterns(candles, numbers) {
  const patterns = [];
  const trend = detectTrend(numbers);
  for (let i = 0; i < candles.length; i++) {
    const c = candles[i];
    if (c.isDoji && trend === "downtrend") patterns.push({ name: "Dragonfly Doji", type: "BIG", strength: 6 });
    if (c.isDoji && trend === "uptrend") patterns.push({ name: "Gravestone Doji", type: "SMALL", strength: 6 });
    if (i >= 1) {
      const p = candles[i - 1];
      if (p.isBearish && c.isBullish && c.open <= p.low && c.close >= p.high) patterns.push({ name: "Bullish Engulfing", type: "BIG", strength: 9 });
      if (p.isBullish && c.isBearish && c.open >= p.high && c.close <= p.low) patterns.push({ name: "Bearish Engulfing", type: "SMALL", strength: 9 });
      if (p.isBearish && p.bodySize >= 2 && c.isBullish && c.bodySize <= p.bodySize - 1 && c.close < p.open && c.open > p.close) patterns.push({ name: "Bullish Harami", type: "BIG", strength: 7 });
      if (p.isBearish && p.bodySize >= 2 && c.isDoji && c.open > p.close && c.close < p.open) patterns.push({ name: "Bullish Harami Cross", type: "BIG", strength: 8 });
      if (p.isBearish && c.isBullish && c.low === p.low) patterns.push({ name: "Tweezer Bottom", type: "BIG", strength: 7 });
      if (p.isBullish && c.isBearish && c.high === p.high) patterns.push({ name: "Tweezer Top", type: "SMALL", strength: 7 });
      if (trend === "downtrend" && c.isBullish && c.bodySize >= 1 && c.bodySize <= 2) patterns.push({ name: "Hammer", type: "BIG", strength: 7 });
      if (trend === "downtrend" && c.isBearish && c.bodySize >= 1 && c.bodySize <= 2) patterns.push({ name: "Inverted Hammer", type: "BIG", strength: 6 });
      if (trend === "uptrend" && c.isBearish && c.bodySize >= 1 && c.bodySize <= 2) patterns.push({ name: "Hanging Man", type: "SMALL", strength: 6 });
      if (trend === "uptrend" && c.isBullish && c.bodySize >= 1 && c.bodySize <= 2) patterns.push({ name: "Shooting Star", type: "SMALL", strength: 6 });
      if (p.isBullish && c.isBearish && c.open < p.low) patterns.push({ name: "Bearish Kicker", type: "SMALL", strength: 9 });
    }
    if (i >= 2) {
      const p = candles[i - 1], p2 = candles[i - 2];
      if (p2.isBearish && p2.bodySize >= 2 && p.bodySize <= 1 && c.isBullish && c.bodySize >= 2) patterns.push({ name: "Morning Star", type: "BIG", strength: 10 });
      if (p2.isBullish && p2.bodySize >= 2 && p.bodySize <= 1 && c.isBearish && c.bodySize >= 2) patterns.push({ name: "Evening Star", type: "SMALL", strength: 10 });
      if (p2.isBullish && p.isBullish && c.isBullish) patterns.push({ name: "Three White Soldiers", type: "BIG", strength: 9 });
      if (p2.isBearish && p.isBearish && c.isBearish) patterns.push({ name: "Three Black Crows", type: "SMALL", strength: 9 });
    }
  }
  return patterns;
}

function aggregatePrediction(patterns) {
  if (patterns.length === 0) return null;
  const totalStrength = patterns.reduce((s, p) => s + p.strength, 0);
  let bigStrength = 0, smallStrength = 0;
  for (const p of patterns) {
    if (p.type === "BIG") bigStrength += p.strength;
    else smallStrength += p.strength;
  }
  const prediction = bigStrength >= smallStrength ? "Big" : "Small";
  const confidence = Math.round((Math.max(bigStrength, smallStrength) / totalStrength) * 100);
  const topPatterns = [...patterns].sort((a, b) => b.strength - a.strength).slice(0, 3);
  return { prediction, confidence, bigPatterns: patterns.filter((p) => p.type === "BIG"), smallPatterns: patterns.filter((p) => p.type === "SMALL"), bigStrength, smallStrength, bigPct: Math.round((bigStrength / totalStrength) * 100), smallPct: Math.round((smallStrength / totalStrength) * 100), topPatterns };
}

function analyseNumbers(numbers) {
  if (!Array.isArray(numbers) || numbers.length < 3) {
    return { prediction: "Big", confidence: 50, pattern: null, reason: "Insufficient data" };
  }
  const validNumbers = numbers.filter((n) => Number.isFinite(Number(n))).map(Number);
  if (validNumbers.length < 3) {
    return { prediction: "Big", confidence: 50, pattern: null, reason: "Insufficient data" };
  }
  const candles = [];
  for (let i = 1; i < validNumbers.length; i++) {
    candles.push(buildCandle(validNumbers[i - 1], validNumbers[i]));
  }
  const patterns = detectPatterns(candles, validNumbers);
  const result = aggregatePrediction(patterns);
  if (!result) {
    const avg = validNumbers.reduce((s, n) => s + n, 0) / validNumbers.length;
    return { prediction: avg >= 4.5 ? "Big" : "Small", confidence: 55, pattern: null, reason: "No pattern detected; mean analysis" };
  }
  return { prediction: result.prediction, confidence: result.confidence, pattern: result.topPatterns[0]?.name || null, patternsFound: result.topPatterns, reason: result.topPatterns.map((p) => `${p.name} (${p.type}, strength ${p.strength})`).join(", ") };
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");

  const { limited } = predictLimiter(req, res);
  if (limited) {
    logSecurityEvent("predict_rate_limited", { ip: req.ip });
    return res.status(429).json({ error: "Too many requests" });
  }

  let authUser;
  try {
    authUser = await requireAuth(req);
  } catch {
    return res.status(401).json({ error: "Authentication required", code: "UNAUTHENTICATED" });
  }

  if (!hasActiveLogic(authUser.email)) {
    return res.status(403).json({ error: "Please upload your Custom Logic (.trionai) before generating predictions.", code: "NO_LOGIC" });
  }

  const userLogic = loadLogicForPrediction(authUser.email);

  if (req.method === "POST") {
    const { numbers } = req.body || {};
    if (!Array.isArray(numbers) || numbers.length < 3) {
      return res.status(400).json({ error: "Array of numbers (min 3) required" });
    }
    const safeNumbers = numbers.map(Number).filter((n) => Number.isFinite(n) && n >= 0 && n <= 9).slice(0, 20);
    if (safeNumbers.length < 3) {
      return res.status(400).json({ error: "Invalid numbers provided" });
    }
    return res.status(200).json(analyseNumbers(safeNumbers));
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const FETCH_HEADERS = {
    "accept": "application/json,text/plain,*/*",
    "accept-language": "en-US,en;q=0.9",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "origin": "https://wingo30.com",
    "referer": "https://wingo30.com/",
  };

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(HISTORY_URL + Date.now(), { cache: "no-store", headers: FETCH_HEADERS, signal: controller.signal });
    clearTimeout(timer);
    if (!response.ok) throw new Error("Fetch failed");
    const text = await response.text();
    if (!text || text.startsWith("<")) throw new Error("Invalid response");
    const payload = JSON.parse(text);
    const list = Array.isArray(payload?.data?.list) ? payload.data.list : [];
    const numbers = list.map((item) => Number(item?.number ?? item?.premium ?? item?.sum)).filter((n) => Number.isFinite(n)).slice(0, 11);
    return res.status(200).json(analyseNumbers(numbers));
  } catch {
    const fallback = Math.random() >= 0.5 ? "Big" : "Small";
    return res.status(200).json({ prediction: fallback, confidence: 50, pattern: null, reason: "Fallback due to API error" });
  }
}
