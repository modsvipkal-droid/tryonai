import crypto from "crypto";

/**
 * Fampay UPI payment gateway — server-side only client.
 * Never import this file from client-side code. It reads secret env vars.
 */

const QR_URL = process.env.FAMPAY_QR_URL || "https://fampay.anujbots.xyz/qr.php";
const VERIFY_URL = process.env.FAMPAY_VERIFY_URL || "https://fampay.anujbots.xyz/verify.php";
const API_KEY = process.env.FAMPAY_API_KEY || "";
const UPI_ID = process.env.FAMPAY_UPI_ID || "biswajitbhai@fam";

/**
 * Server-side official model pricing. The frontend must never decide the
 * final payment amount — every amount originates from this table.
 */
export const FAMPAY_MODELS = {
  korven: { id: "korven", name: "Korven Model", amount: 749, label: "Korven Model", price: "749.00" },
  fx1: { id: "fx1", name: "FX1 Model", amount: 1000, label: "FX1 Model", price: "1000.00" },
};

/**
 * FX1 Model subscription plans — authoritative pricing + duration.
 * The frontend only sends a plan_id; amount and duration always come from here.
 * duration_days: null means Lifetime access.
 */
export const FX1_PLANS = {
  fx1_d7: { id: "fx1_d7", name: "7 Days", amount: 1000, duration_days: 7, access_type: "TEMPORARY", tag: "Starter" },
  fx1_m1: { id: "fx1_m1", name: "1 Month", amount: 3000, duration_days: 30, access_type: "TEMPORARY", tag: "Popular" },
  fx1_lt: { id: "fx1_lt", name: "Lifetime", amount: 10000, duration_days: null, access_type: "LIFETIME", tag: "Best Value" },
};

export function getModelById(id) {
  const key = String(id || "").toLowerCase().trim();
  return FAMPAY_MODELS[key] || null;
}

export function getModelName(id) {
  return getModelById(id)?.name || String(id || "").toUpperCase();
}

export function getFx1PlanById(planId) {
  const key = String(planId || "").toLowerCase().trim();
  return FX1_PLANS[key] || null;
}

export function getFx1Plans() {
  return Object.values(FX1_PLANS);
}

export function computeAccessExpiry(plan) {
  if (!plan || plan.duration_days === null || plan.duration_days === undefined) return null;
  return Date.now() + plan.duration_days * 24 * 60 * 60 * 1000;
}

export function generateInternalOrderId() {
  const rand = crypto.randomBytes(6).toString("hex").toUpperCase();
  const ts = Date.now().toString(36).toUpperCase();
  return `ORD_${ts}_${rand}`;
}

async function fampayFetch(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
    clearTimeout(timer);
    if (!res.ok) {
      throw Object.assign(new Error(`Fampay API HTTP ${res.status}`), { status: res.status });
    }
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error("Fampay returned non-JSON response");
    }
  } catch (err) {
    clearTimeout(timer);
    if (err.name === "AbortError") {
      throw new Error("Fampay request timed out");
    }
    throw err;
  }
}

/**
 * Generate a fresh payment QR through the gateway.
 * The gateway returns its own order id + qr image url.
 */
export async function generateQr({ amount, upiId = UPI_ID }) {
  const params = new URLSearchParams();
  params.set("upi", upiId);
  params.set("amount", String(amount));
  const payload = await fampayFetch(`${QR_URL}?${params.toString()}`);

  if (!payload || payload.status !== "success" || !payload.data) {
    throw new Error(payload?.message || "QR generation failed");
  }

  return {
    gatewayOrderId: payload.data.order_id || null,
    qrUrl: payload.data.qr_url || null,
    upiId: payload.data.upi_id || upiId,
    gatewayAmount: Number(payload.data.amount) || amount,
    createdAtIst: payload.data.created_at_ist || null,
    expiresAtIst: payload.data.expires_at_ist || null,
  };
}

function toNumber(value) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const cleaned = String(value).replace(/[^0-9.]/g, "");
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
}

/**
 * Independently verify a payment with the gateway using the gateway order id.
 * Returns a normalized result; the caller validates amount + uniqueness.
 */
export async function verifyPayment({ gatewayOrderId, expectedAmount }) {
  if (!API_KEY) {
    throw new Error("FAMPAY_API_KEY is not configured on the server");
  }

  const params = new URLSearchParams();
  params.set("api_key", API_KEY);
  params.set("order_id", gatewayOrderId);

  const payload = await fampayFetch(`${VERIFY_URL}?${params.toString()}`);

  const status = String(payload?.status || "").toLowerCase();
  const success = status === "success" || payload?.success === true || status === "paid" || status === "completed";

  const data = payload?.data && typeof payload.data === "object" ? payload.data : payload;
  const paidAmount = toNumber(data?.amount ?? data?.paid_amount ?? data?.received_amount ?? data?.expected_amount);
  const utr =
    data?.utr ||
    data?.txn_id ||
    data?.transaction_id ||
    data?.transaction_ref ||
    data?.ref_id ||
    data?.payment_ref ||
    data?.bank_ref ||
    null;

  return {
    success,
    rawStatus: payload?.status || null,
    message: payload?.message || null,
    orderId: payload?.order_id || gatewayOrderId,
    paidAmount,
    utr: utr ? String(utr).trim() : null,
    gatewayResponse: payload,
  };
}

export function amountsEqual(paid, expected) {
  if (paid === null || paid === undefined) return false;
  return Math.abs(paid - expected) < 0.01;
}