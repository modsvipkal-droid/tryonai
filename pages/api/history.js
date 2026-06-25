import { fetchWingoHistory, generateMockHistory, getCurrentIssue, estimateTimestamps } from "../../lib/wingo";

const FETCH_HEADERS = {
  "accept": "application/json,text/plain,*/*",
  "accept-language": "en-US,en;q=0.9",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "origin": "https://trxtrader.pro",
  "referer": "https://trxtrader.pro/",
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Cache-Control", "no-store, max-age=0");

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const response = await fetch("https://draw.ar-lottery01.com/WinGo/WinGo_30S/GetHistoryIssuePage.json?ts=" + Date.now(), {
      cache: "no-store", headers: FETCH_HEADERS, signal: controller.signal,
    });
    clearTimeout(timer);

    if (!response.ok) throw new Error("HTTP " + response.status);
    const text = await response.text();
    if (!text || text.startsWith("<")) throw new Error("HTML response");

    const payload = JSON.parse(text);
    const list = Array.isArray(payload?.data?.list) ? payload.data.list : [];
    const toHistoryRow = (item) => {
      const number = Number(item?.number ?? item?.premium ?? item?.sum);
      const period = String(item?.issueNumber ?? item?.issue ?? item?.period ?? "");
      if (!period || !Number.isFinite(number)) return null;
      const COLOR_NAMES = new Set(["red", "green", "violet"]);
      const colors = String(item?.color ?? "").toLowerCase().split(/[,\s]+/).map(s => s.trim()).filter(c => COLOR_NAMES.has(c));
      const infer = (n) => n === 0 ? ["red", "violet"] : n === 5 ? ["green", "violet"] : n % 2 === 0 ? ["red"] : ["green"];
      return { period, number, size: number >= 5 ? "Big" : "Small", colors: colors.length ? [...new Set(colors)] : infer(number) };
    };
    const rawHistory = list.map(toHistoryRow).filter(Boolean).slice(0, 10);
    const serviceTime = Number(payload?.serviceTime) || Date.now();
    const history = rawHistory.map((row, i) => ({ ...row, blockTimestamp: serviceTime - 3000 - i * 30000 }));
    const latest = history[0];
    const current = latest?.period && latest?.blockTimestamp
      ? (() => { const e = Math.max(0, serviceTime - latest.blockTimestamp); return { issueNumber: (() => { try { return (BigInt(latest.period) + BigInt(Math.floor(e / 30000) + 1)).toString(); } catch { return latest.period; } })(), remainingMs: 30000 - (e % 30000) }; })()
      : { issueNumber: "", remainingMs: 0 };

    return res.status(200).json({ history, current, serviceTime });
  } catch {
    const mock = generateMockHistory();
    const serviceTime = Date.now();
    const timed = mock.map((row, i) => ({ ...row, blockTimestamp: serviceTime - 3000 - i * 30000 }));
    const latest = timed[0];
    const current = latest?.period && latest?.blockTimestamp
      ? (() => { const e = Math.max(0, serviceTime - latest.blockTimestamp); return { issueNumber: (() => { try { return (BigInt(latest.period) + BigInt(Math.floor(e / 30000) + 1)).toString(); } catch { return latest.period; } })(), remainingMs: 30000 - (e % 30000) }; })()
      : { issueNumber: "", remainingMs: 0 };
    return res.status(200).json({ history: timed, current, serviceTime });
  }
}
