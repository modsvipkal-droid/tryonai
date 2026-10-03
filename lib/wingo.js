const WINGO_URL = "https://draw.ar-lottery01.com/WinGo/WinGo_30S/GetHistoryIssuePage.json?ts=";
const ISSUE_DURATION_MS = 30000;
const COLOR_NAMES = new Set(["red", "green", "violet"]);

function inferColors(number) {
  if (number === 0) return ["red", "violet"];
  if (number === 5) return ["green", "violet"];
  return number % 2 === 0 ? ["red"] : ["green"];
}

function normalizeColors(color, number) {
  const colors = String(color ?? "")
    .toLowerCase()
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter((c) => COLOR_NAMES.has(c));
  return colors.length ? [...new Set(colors)] : inferColors(number);
}

function toHistoryRow(item) {
  const number = Number(item?.number ?? item?.premium ?? item?.sum);
  const period = String(item?.issueNumber ?? item?.issue ?? item?.period ?? "");
  if (!period || !Number.isFinite(number)) return null;
  return { period, number, size: number >= 5 ? "Big" : "Small", colors: normalizeColors(item?.color, number) };
}

export function estimateTimestamps(history, serviceTime) {
  if (!history.length) return history;
  return history.map((row, i) => ({ ...row, blockTimestamp: serviceTime - 3000 - i * ISSUE_DURATION_MS }));
}

function incrementIssue(issue, amount = 1) {
  try { return (BigInt(issue) + BigInt(amount)).toString(); } catch { return issue ? String(issue) : ""; }
}

export function getCurrentIssue(history, serviceTime) {
  const latest = history[0];
  if (!latest?.period || !latest?.blockTimestamp) return { issueNumber: "", remainingMs: 0 };
  const elapsed = Math.max(0, serviceTime - latest.blockTimestamp);
  return {
    issueNumber: incrementIssue(latest.period, Math.floor(elapsed / ISSUE_DURATION_MS) + 1),
    remainingMs: ISSUE_DURATION_MS - (elapsed % ISSUE_DURATION_MS),
  };
}

export function generateMockHistory() {
  const now = new Date();
  const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const seq = String(Math.floor(Math.random() * 900000000) + 100000000);
  const base = ymd + seq;
  const nums = [0, 3, 7, 2, 9, 1, 6, 4, 8, 5];
  const sizes = ["Small", "Small", "Big", "Small", "Big", "Small", "Big", "Small", "Big", "Big"];
  return nums.map((n, i) => ({
    period: String(BigInt(base) - BigInt(i)),
    number: n,
    size: sizes[i],
    colors: n === 0 ? ["red", "violet"] : n === 5 ? ["green", "violet"] : n % 2 === 0 ? ["red"] : ["green"],
  }));
}

export async function fetchWingoRaw() {
  const res = await fetch(WINGO_URL + Date.now(), { cache: "no-store" });
  if (!res.ok) throw new Error(`WinGo HTTP ${res.status}`);
  const text = await res.text();
  if (!text || text.startsWith("<")) throw new Error("WinGo returned HTML");
  return JSON.parse(text);
}

function parseWingoPayload(payload) {
  const list = Array.isArray(payload?.data?.list) ? payload.data.list : [];
  const raw = list.map(toHistoryRow).filter(Boolean).slice(0, 10);
  const serviceTime = Number(payload?.serviceTime) || Date.now();
  return { raw, serviceTime };
}

export async function fetchWingoHistory() {
  const payload = await fetchWingoRaw();
  const { raw, serviceTime } = parseWingoPayload(payload);
  if (!raw.length) throw new Error("Empty WinGo data");
  const history = estimateTimestamps(raw, serviceTime);
  return { history, current: getCurrentIssue(history, serviceTime), serviceTime };
}

export async function fetchWingoNumbers() {
  const payload = await fetchWingoRaw();
  const { raw } = parseWingoPayload(payload);
  const numbers = raw.map((r) => r.number).filter((n) => Number.isFinite(n));
  if (numbers.length < 3) throw new Error("Insufficient WinGo numbers");
  return numbers;
}
