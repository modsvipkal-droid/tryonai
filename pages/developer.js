import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  PageHead,
  OrganizationSchema,
  WebPageSchema,
  BreadcrumbSchema,
  SoftwareAppSchema,
  HowToSchema,
  FAQSchema,
} from "@/components/SEO";
import SiteFooter from "@/components/SiteFooter";
import ContentCard, { smartCardStyles } from "@/components/ContentCard";
import { watchAuthState, getFirebaseAuth } from "@/lib/firebase";

async function getIdToken() {
  try {
    const auth = await getFirebaseAuth();
    if (auth?.currentUser) return await auth.currentUser.getIdToken();
  } catch {}
  return null;
}

function Icon({ name, className = "" }) {
  const icons = {
    code: (<><path d="m16 18 6-6-6-6"/><path d="M8 6l-6 6 6 6"/></>),
    key: (<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2"/><path d="M17 14v4"/></>),
    copy: (<><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></>),
    check: (<><polyline points="20 6 9 17 4 12"/></>),
    refresh: (<><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></>),
    x: (<><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>),
    arrowLeft: (<><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></>),
    arrowRight: (<><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>),
    users: (<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>),
    activity: (<><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>),
    clock: (<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>),
    globe: (<><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>),
    zap: (<><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>),
    book: (<><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></>),
    server: (<><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></>),
    search: (<><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>),
    chevronLeft: (<><path d="m15 18-6-6 6-6"/></>),
    chevronRight: (<><path d="m9 18 6-6-6-6"/></>),
    chevronDown: (<><polyline points="6 9 12 15 18 9"/></>),
    terminal: (<><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></>),
    play: (<><polygon points="6 3 20 12 6 21 6 3"/></>),
    shield: (<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>),
    layers: (<><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>),
    database: (<><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></>),
    externalLink: (<><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>),
  };
  return (
    <svg
      className={`dev-icon ${className}`.trim()}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name] || icons.code}
    </svg>
  );
}

const CODE_SNIPPETS = {
  curl: {
    label: "cURL",
    code: `curl -X GET "https://wingo30.com/api/developer/30-sec-game-history?page=1&limit=20" \\
  -H "Authorization: Bearer {{API_KEY}}" \\
  -H "Accept: application/json"`,
  },
  javascript: {
    label: "JavaScript (Fetch)",
    code: `const API_KEY = "{{API_KEY}}";
const BASE_URL = "https://wingo30.com";

async function fetchWingoHistory() {
  try {
    const response = await fetch(\`\${BASE_URL}/api/developer/30-sec-game-history?page=1&limit=20\`, {
      method: "GET",
      headers: {
        "Authorization": \`Bearer \${API_KEY}\`,
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(\`HTTP error \${response.status}: \${response.statusText}\`);
    }

    const payload = await response.json();
    console.log("Total records in database:", payload.pagination.total);
    console.log("Latest draw records:", payload.data);
    return payload;
  } catch (err) {
    console.error("Wingo API request failed:", err);
  }
}

fetchWingoHistory();`,
  },
  python: {
    label: "Python (Requests)",
    code: `import requests

API_KEY = "{{API_KEY}}"
BASE_URL = "https://wingo30.com"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Accept": "application/json"
}

params = {
    "page": 1,
    "limit": 20
}

try:
    response = requests.get(
        f"{BASE_URL}/api/developer/30-sec-game-history",
        headers=headers,
        params=params,
        timeout=10
    )
    response.raise_for_status()
    data = response.json()
    print(f"Request status: {data.get('ok')}")
    print(f"Total draws indexed: {data['pagination']['total']}")
    for draw in data.get("data", []):
        print(f"Period {draw['period']} -> Number {draw['number']} ({draw['size']}, {draw['color']})")
except requests.exceptions.RequestException as error:
    print(f"API Error: {error}")`,
  },
  nodejs: {
    label: "Node.js (HTTPS)",
    code: `const https = require("https");

const API_KEY = "{{API_KEY}}";
const options = {
  hostname: "wingo30.com",
  path: "/api/developer/30-sec-game-history?page=1&limit=20",
  method: "GET",
  headers: {
    "Authorization": \`Bearer \${API_KEY}\`,
    "Accept": "application/json"
  }
};

const req = https.request(options, (res) => {
  let rawData = "";
  res.on("data", (chunk) => { rawData += chunk; });
  res.on("end", () => {
    try {
      const parsed = JSON.parse(rawData);
      console.log("Draws retrieved:", parsed.data?.length);
      console.log("Rate limit remaining:", res.headers["x-ratelimit-remaining"]);
    } catch (e) {
      console.error("JSON parse error:", e);
    }
  });
});

req.on("error", (err) => console.error("Request error:", err));
req.end();`,
  },
  php: {
    label: "PHP (cURL)",
    code: `<?php
$apiKey = "{{API_KEY}}";
$baseUrl = "https://wingo30.com";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $baseUrl . "/api/developer/30-sec-game-history?page=1&limit=20");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer " . $apiKey,
    "Accept: application/json"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

$response = curl_exec($ch);
if (curl_errno($ch)) {
    echo "cURL Error: " . curl_error($ch);
} else {
    $data = json_decode($response, true);
    print_r($data);
}
curl_close($ch);
?>`,
  },
  nextjs: {
    label: "Next.js (Server-side)",
    code: `// Server-side data fetching in Next.js (getServerSideProps or API route)
export async function getServerSideProps() {
  const API_KEY = process.env.WINGO_API_KEY;
  const BASE_URL = "https://wingo30.com";

  try {
    const res = await fetch(
      \`\${BASE_URL}/api/developer/30-sec-game-history?page=1&limit=20\`,
      {
        headers: {
          Authorization: \`Bearer \${API_KEY}\`,
          Accept: "application/json",
        },
        next: { revalidate: 15 },
      }
    );

    if (!res.ok) {
      throw new Error(\`Wingo API error status: \${res.status}\`);
    }

    const data = await res.json();
    return {
      props: {
        gameHistory: data.data || [],
        pagination: data.pagination || null,
      },
    };
  } catch (error) {
    return {
      props: {
        gameHistory: [],
        error: error.message,
      },
    };
  }
}`,
  },
};

const FAQ_LIST = [
  {
    question: "What is the Wingo Game API?",
    answer:
      "The Wingo Game API is a RESTful JSON developer interface provided by TRION AI to access real-time and historical WinGo 30-second game draw results, period identifiers, numeric outcomes, colour distributions, and size parity.",
    details:
      "It allows developers, data analysts, and software engineers to query rolling round data via standard HTTP GET requests and integrate verified game information directly into web apps, automated dashboards, or analytical tools.",
  },
  {
    question: "Who can use the Wingo Game API?",
    answer:
      "The Wingo Game API is intended for backend developers, full-stack engineers, data analysts, and software integrators who need programmatic access to WinGo game data.",
    details:
      "Any registered user with a TRION AI account can generate an API key from the developer portal and begin querying endpoints from servers, cloud functions, or custom applications.",
  },
  {
    question: "How do I get started with the Wingo Game API?",
    answer:
      "To get started, create a TRION AI developer account, generate a Bearer API key in the developer console, configure your HTTP Authorization header, and send an HTTPS GET request to /api/developer/30-sec-game-history.",
    details:
      "Follow our 7-step quick start guide to configure request parameters such as page limits, period search filters, and date ranges.",
  },
  {
    question: "What data can the Wingo Game API provide?",
    answer:
      "The Wingo Game API provides structured round data including the unique draw period number, winning digit (0–9), size category (Big/Small), colour tokens (Green, Red, Violet), epoch blockTimestamp, and ISO-8601 UTC draw timestamp, along with pagination and cache synchronization metadata.",
    details:
      "Responses also include server-side metadata such as total indexed database records, last synchronization timestamp, and real-time rate limit headers.",
  },
  {
    question: "What authentication is required for the Wingo API?",
    answer:
      "All public Wingo Game API endpoints require Bearer token authentication via the HTTP Authorization header: Authorization: Bearer ws_YOUR_API_KEY.",
    details:
      "API keys are generated securely from the TRION AI developer dashboard, stored as cryptographic hashes, and must be kept confidential in server-side environment variables.",
  },
  {
    question: "How do I make an API request?",
    answer:
      "You make an API request by issuing an HTTPS GET call with your Bearer token in the Authorization header and optional query parameters in the URL string.",
    details:
      "You can test queries directly using cURL, JavaScript Fetch, Python Requests, Node.js, PHP, or our in-browser Interactive API Playground.",
  },
  {
    question: "What format does the Wingo API response use?",
    answer:
      "The Wingo Game API returns standard RFC 8259 compliant JSON payloads with explicit schema definitions for records, pagination metadata, and server cache status.",
    details:
      "Every response includes an ok boolean indicator, an array of game draw objects in data, and pagination limits in pagination.",
  },
  {
    question: "How can I troubleshoot Wingo API errors?",
    answer:
      "You can troubleshoot API errors by checking the HTTP status code (such as 401 for invalid keys or 429 for rate limits) and inspecting response headers like Retry-After and X-RateLimit-Remaining.",
    details:
      "Review our troubleshooting matrix to resolve parameter formatting issues, protocol upgrades, or database backoff scenarios.",
  },
  {
    question: "Can I integrate the Wingo API into my own application?",
    answer:
      "Yes, you can integrate the Wingo API into any web application, mobile app, Telegram bot, or server-side service that supports standard HTTPS GET requests.",
    details:
      "For security, we recommend proxying API calls through your own backend server so your secret API key is never exposed to client browsers.",
  },
  {
    question: "Where can I get support for the Wingo Game API?",
    answer:
      "You can access developer support through the official TRION AI contact channel at /contact or reach our engineering support team directly on Telegram at t.me/kal_mods.",
    details:
      "Our support team assists with API key management, quota inquiries, rate limit questions, and technical integration guidance.",
  },
];

const QUICK_START_STEPS = [
  {
    step: 1,
    title: "Review API Requirements",
    desc: "Verify that your client application supports standard HTTPS GET requests and RFC 8259 JSON parsing.",
  },
  {
    step: 2,
    title: "Obtain a Bearer API Key",
    desc: "Sign in to your TRION AI account and generate a unique Bearer API key from the developer console below.",
  },
  {
    step: 3,
    title: "Configure Authorization Headers",
    desc: "Set the HTTP header: 'Authorization: Bearer ws_YOUR_API_KEY' along with 'Accept: application/json'.",
  },
  {
    step: 4,
    title: "Select Endpoint & Query Parameters",
    desc: "Target GET /api/developer/30-sec-game-history and set parameters like page (1), limit (20), period, or dates.",
  },
  {
    step: 5,
    title: "Send Server-Side HTTP Request",
    desc: "Execute the GET request via cURL, Fetch, Requests, or Axios and inspect the rate limit response headers.",
  },
  {
    step: 6,
    title: "Validate and Parse JSON Response",
    desc: "Parse the returned JSON payload containing game draw records, pagination metadata, and cache timestamps.",
  },
  {
    step: 7,
    title: "Integrate Draw Data into Application",
    desc: "Map the period numbers, winning digits, colours, and sizes into your custom UI, bot, or analytics pipeline.",
  },
];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [text]);
  return (
    <button className="dev-copy-btn" onClick={handleCopy} type="button" aria-label="Copy to clipboard">
      <Icon name={copied ? "check" : "copy"} />
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function Skeleton({ width, height }) {
  return <span className="dev-skeleton" style={{ width: width || "100%", height: height || "20px", display: "inline-block" }} />;
}

function formatTime(dateStr) {
  if (!dateStr) return "--";
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function formatDate(dateStr) {
  if (!dateStr) return "--";
  const d = new Date(dateStr);
  return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

function timeAgo(dateStr) {
  if (!dateStr) return "Never";
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function DeveloperPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [keyData, setKeyData] = useState(null);
  const [stats, setStats] = useState(null);
  const [cacheStats, setCacheStats] = useState(null);
  const [generatedKey, setGeneratedKey] = useState(null);
  const [activeLang, setActiveLang] = useState("javascript");
  const [error, setError] = useState(null);

  const [historyData, setHistoryData] = useState([]);
  const [historyPagination, setHistoryPagination] = useState(null);
  const [historyMeta, setHistoryMeta] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [historyPage, setHistoryPage] = useState(1);
  const [historySearch, setHistorySearch] = useState("");
  const [historyDateFrom, setHistoryDateFrom] = useState("");
  const [historyDateTo, setHistoryDateTo] = useState("");

  const [playgroundKey, setPlaygroundKey] = useState("");
  const [playgroundEndpoint, setPlaygroundEndpoint] = useState("30-sec-game-history");
  const [playgroundResponse, setPlaygroundResponse] = useState(null);
  const [playgroundLoading, setPlaygroundLoading] = useState(false);

  const [openFaq, setOpenFaq] = useState(null);

  const liveRef = useRef(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  // Restore smooth window scrolling on document
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const nextEl = document.getElementById("__next");

    const prevHtmlOverflow = html.style.overflow;
    const prevHtmlHeight = html.style.height;
    const prevHtmlScrollBehavior = html.style.scrollBehavior;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyHeight = body.style.height;
    const prevNextOverflow = nextEl ? nextEl.style.overflow : "";
    const prevNextHeight = nextEl ? nextEl.style.height : "";

    html.classList.add("developer-page", "dev-page");
    html.style.overflowY = "auto";
    html.style.height = "auto";
    html.style.scrollBehavior = "smooth";
    body.classList.add("developer-page", "dev-page");
    body.style.overflowY = "auto";
    body.style.height = "auto";
    if (nextEl) {
      nextEl.style.overflow = "visible";
      nextEl.style.height = "auto";
    }

    return () => {
      html.classList.remove("developer-page", "dev-page");
      html.style.overflow = prevHtmlOverflow;
      html.style.height = prevHtmlHeight;
      html.style.scrollBehavior = prevHtmlScrollBehavior;
      body.classList.remove("developer-page", "dev-page");
      body.style.overflow = prevBodyOverflow;
      body.style.height = prevBodyHeight;
      if (nextEl) {
        nextEl.style.overflow = prevNextOverflow;
        nextEl.style.height = prevNextHeight;
      }
    };
  }, []);

  const refreshToken = useCallback(async () => {
    const token = await getIdToken();
    setIdToken(token);
    return token;
  }, []);

  useEffect(() => {
    const unsub = watchAuthState((firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
      if (firebaseUser) {
        refreshToken();
      }
    });
    return () => unsub();
  }, [refreshToken]);

  const fetchKeyData = useCallback(async (token) => {
    if (!token) return;
    try {
      const res = await fetch("/api/developer/key", {
        headers: { Authorization: `Bearer ${token}` },
      });
      let body = null;
      try { body = await res.json(); } catch {}
      if (!res.ok) throw new Error(body?.error || `Server error (${res.status})`);
      setKeyData(body.key);
      setStats(body.stats);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const fetchAnalytics = useCallback(async (token) => {
    if (!token) return;
    try {
      const res = await fetch("/api/developer/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setStats(data.stats);
      setCacheStats(data.cache);
    } catch {}
  }, []);

  const generateKey = useCallback(async () => {
    const token = await refreshToken();
    if (!token) return;
    try {
      const res = await fetch("/api/developer/key", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      let body = null;
      try { body = await res.json(); } catch {}
      if (!res.ok) throw new Error(body?.error || `Server error (${res.status})`);
      setGeneratedKey(body.apiKey);
      setKeyData(body.key);
      setStats(body.stats);
      setPlaygroundKey(body.apiKey);
    } catch (err) {
      setError(err.message);
    }
  }, [refreshToken]);

  const revokeKey = useCallback(async () => {
    const token = await refreshToken();
    if (!token) return;
    try {
      const res = await fetch("/api/developer/key", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      let body = null;
      try { body = await res.json(); } catch {}
      if (!res.ok) throw new Error(body?.error || `Server error (${res.status})`);
      setKeyData(null);
      setStats(body.stats);
      setGeneratedKey(null);
      setPlaygroundKey("");
    } catch (err) {
      setError(err.message);
    }
  }, [refreshToken]);

  const fetchHistory = useCallback(async (token, page, search, from, to) => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("period", search);
      if (from) params.set("startDate", from);
      if (to) params.set("endDate", to);
      const res = await fetch(`/api/developer/30-sec-game-history?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let body = null;
      try { body = await res.json(); } catch {}
      if (!res.ok) throw new Error(body?.error || `Server error (${res.status})`);
      setHistoryData(body.data || []);
      setHistoryPagination(body.pagination);
      setHistoryMeta(body.meta);
    } catch (err) {
      setHistoryError(err.message);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (idToken) {
      setLoading(true);
      Promise.all([fetchKeyData(idToken), fetchAnalytics(idToken), fetchHistory(idToken, 1, "", "", "")])
        .catch(console.error)
        .finally(() => setLoading(false));
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [idToken, fetchKeyData, fetchAnalytics, fetchHistory, authLoading]);

  const refreshAll = useCallback(async () => {
    const token = await refreshToken();
    if (!token) return;
    setLoading(true);
    await Promise.all([fetchKeyData(token), fetchAnalytics(token)]);
    setLoading(false);
  }, [refreshToken, fetchKeyData, fetchAnalytics]);

  const handleGenerateKey = useCallback(async () => {
    setLoading(true);
    await generateKey();
    setLoading(false);
  }, [generateKey]);

  const handleRevokeKey = useCallback(async () => {
    if (!confirm("Are you sure you want to revoke your API key? This action cannot be undone.")) return;
    setLoading(true);
    await revokeKey();
    setLoading(false);
  }, [revokeKey]);

  const handleHistorySearch = useCallback(() => {
    refreshToken().then((token) => {
      if (token) fetchHistory(token, 1, historySearch, historyDateFrom, historyDateTo);
    });
  }, [refreshToken, fetchHistory, historySearch, historyDateFrom, historyDateTo]);

  const handleHistoryPageChange = useCallback((newPage) => {
    setHistoryPage(newPage);
    refreshToken().then((token) => {
      if (token) fetchHistory(token, newPage, historySearch, historyDateFrom, historyDateTo);
    });
  }, [refreshToken, fetchHistory, historySearch, historyDateFrom, historyDateTo]);

  const handlePlaygroundSend = useCallback(async () => {
    if (!playgroundKey) return;
    setPlaygroundLoading(true);
    setPlaygroundResponse(null);
    const startedAt = Date.now();
    try {
      let path = "/api/developer/30-sec-game-history";
      const res = await fetch(`${path}?page=1&limit=5`, {
        headers: { Authorization: `Bearer ${playgroundKey}` },
      });
      const latency = Date.now() - startedAt;
      let body = null;
      try { body = await res.json(); } catch { body = null; }
      setPlaygroundResponse({
        status: res.status,
        statusText: res.statusText,
        latency,
        headers: {
          "x-ratelimit-limit": res.headers.get("x-ratelimit-limit"),
          "x-ratelimit-remaining": res.headers.get("x-ratelimit-remaining"),
          "x-ratelimit-reset": res.headers.get("x-ratelimit-reset"),
          "cache-control": res.headers.get("cache-control"),
        },
        body,
      });
    } catch (err) {
      setPlaygroundResponse({
        status: 0,
        statusText: "Network Error",
        latency: Date.now() - startedAt,
        headers: {},
        body: { error: err.message },
      });
    } finally {
      setPlaygroundLoading(false);
    }
  }, [playgroundKey, playgroundEndpoint]);

  useEffect(() => {
    if (generatedKey) {
      const timer = setTimeout(() => setGeneratedKey(null), 30000);
      return () => clearTimeout(timer);
    }
  }, [generatedKey]);

  const maskedKey = keyData?.mask || "No API key";
  const hasKey = Boolean(keyData);

  const snippetCode = (CODE_SNIPPETS[activeLang]?.code || "").replace(
    /\{\{API_KEY\}\}/g,
    keyData?.prefix ? (hasKey ? `${keyData.prefix}...${keyData.last4}` : "ws_YOUR_API_KEY_HERE") : "ws_YOUR_API_KEY_HERE"
  );

  const PAGE_URL = "https://wingo30.com/developer";
  // Clean title without duplicate branding (PageHead adds ' | TRION AI')
  const PAGE_TITLE = "Wingo Game API – Developer Documentation";
  const PAGE_DESC =
    "Explore the official Wingo Game API by TRION AI. View endpoint documentation, authentication guides, request examples, and response schemas for developers.";

  const SAMPLE_RESPONSE = {
    ok: true,
    endpoint: "/api/developer/30-sec-game-history",
    data: [
      {
        period: "20260903301284",
        number: 7,
        size: "Big",
        colors: ["Green"],
        color: "Green",
        blockTimestamp: 1788414600000,
        time: "2026-09-03T04:10:00.000Z",
      },
      {
        period: "20260903301283",
        number: 0,
        size: "Small",
        colors: ["Red", "Violet"],
        color: "Red, Violet",
        blockTimestamp: 1788414570000,
        time: "2026-09-03T04:09:30.000Z",
      },
    ],
    pagination: {
      page: 1,
      limit: 20,
      total: 18520,
      totalPages: 926,
      hasNextPage: true,
      hasPrevPage: false,
    },
    meta: {
      baseUrl: "https://wingo30.com",
      cache: {
        syncedAt: "2026-09-03T04:10:02.145Z",
        inserted: 1,
        matched: 20,
        syncError: null,
      },
      rateLimit: {
        limit: 60,
        remaining: 59,
        resetAt: "2026-09-03T04:11:00.000Z",
      },
    },
  };

  return (
    <div className="dev-page">
      {/* ── SEO Metadata & Open Graph ───────────────────────────────── */}
      <PageHead
        title={PAGE_TITLE}
        description={PAGE_DESC}
        canonical={PAGE_URL}
      >
        <meta name="keywords" content="Wingo Game API, Wingo API, Wingo API documentation, Wingo game API documentation, Wingo results API, Wingo game history API, Wingo API endpoint, Wingo API integration, Wingo API for developers, WinGo 30 second API, WinGo data API" />
        <meta name="author" content="TRION AI" />
        <meta property="og:title" content={`${PAGE_TITLE} | TRION AI`} />
        <meta property="og:description" content={PAGE_DESC} />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:type" content="article" />
        <meta property="article:modified_time" content="2026-09-03T10:30:00+05:30" />
        <style dangerouslySetInnerHTML={{
          __html: `
            html {
              height: auto !important;
              min-height: 100% !important;
              overflow-x: hidden !important;
              overflow-y: auto !important;
              scroll-behavior: smooth !important;
              -webkit-overflow-scrolling: touch !important;
            }
            body {
              height: auto !important;
              min-height: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              overflow-x: hidden !important;
              overflow-y: auto !important;
              overscroll-behavior-y: auto !important;
              -webkit-overflow-scrolling: touch !important;
            }
            #__next {
              height: auto !important;
              min-height: 100% !important;
              overflow: visible !important;
            }
          ` + smartCardStyles
        }} />
      </PageHead>

      {/* ── Structured Data Schemas (JSON-LD) ───────────────────────── */}
      <OrganizationSchema />
      <WebPageSchema title={`${PAGE_TITLE} | TRION AI`} description={PAGE_DESC} url={PAGE_URL} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wingo30.com/" },
          { name: "Developer", url: PAGE_URL },
        ]}
      />
      <SoftwareAppSchema
        name="Wingo Game API"
        alternateName="TRION AI Wingo Game API"
        applicationCategory="DeveloperApplication"
        operatingSystem="Web, Cloud, iOS, Android, Server"
        description={PAGE_DESC}
        url={PAGE_URL}
      />
      <HowToSchema
        name="How Do You Get Started With the Wingo Game API?"
        description="A 7-step developer workflow for integrating TRION AI Wingo Game API endpoints into web, server, and mobile applications."
        steps={QUICK_START_STEPS.map((s) => ({
          name: s.title,
          text: s.desc,
          url: `${PAGE_URL}#how-do-you-get-started-with-the-wingo-game-api`,
        }))}
      />
      <FAQSchema questions={FAQ_LIST.map((q) => ({ question: q.question, answer: `${q.answer} ${q.details}` }))} />

      {/* ── Top Header Bar ─────────────────────────────────────────── */}
      <header className="dev-topbar">
        <button className="dev-back-btn" onClick={() => router.push("/")} type="button" aria-label="Back to home">
          <Icon name="arrowLeft" />
        </button>
        <div className="dev-topbar-brand">
          <Icon name="code" />
          <span>TRION AI Developer Portal</span>
        </div>
        <Link href="/" className="dev-topbar-link">
          wingo30.com
        </Link>
      </header>

      <div className="dev-container">
        {/* System Alert Messages */}
        {error && (
          <div className="dev-alert dev-alert-error" role="alert">
            <span>{error}</span>
            <button onClick={() => setError(null)} type="button" aria-label="Dismiss error"><Icon name="x" /></button>
          </div>
        )}

        {generatedKey && (
          <div className="dev-alert dev-alert-success" role="status">
            <div>
              <strong>API Key generated successfully!</strong>
              <p>Save this API key securely in your environment variables. It will not be shown again.</p>
              <code className="dev-key-display">{generatedKey}</code>
              <CopyButton text={generatedKey} />
            </div>
            <button onClick={() => setGeneratedKey(null)} type="button" aria-label="Dismiss alert"><Icon name="x" /></button>
          </div>
        )}

        {/* ── Main Hero & Single H1 ──────────────────────────────────── */}
        <section className="dev-hero">
          <div className="dev-hero-badge">
            <span className="dev-live-badge" />
            OFFICIAL REST API &bull; V1.0 LIVE
          </div>
          
          <h1 className="dev-hero-title">Wingo Game API – Developer Documentation</h1>
          
          {/* Top AI / AEO Summary (Direct Answer) */}
          <div className="dev-aeo-summary" role="region" aria-label="API Overview Summary">
            <p>
              <strong>The Wingo Game API</strong> provides developers with programmatic access to structured WinGo 30-second game data, draw numbers, colour distributions, and historical records through RESTful JSON endpoints. This documentation explains how the API works, authentication requirements, endpoint parameters, request formats, and response structures for integrating real-time telemetry into web, server, and mobile applications.
            </p>
          </div>

          {/* Freshness & Metadata Signals */}
          <div className="dev-freshness-bar">
            <span className="dev-freshness-item">
              <Icon name="clock" /> Last updated: <strong>September 3, 2026</strong>
            </span>
            <span className="dev-freshness-sep">&bull;</span>
            <span className="dev-freshness-item">
              <Icon name="shield" /> Provider: <strong>TRION AI</strong>
            </span>
            <span className="dev-freshness-sep">&bull;</span>
            <span className="dev-freshness-item">
              <Icon name="terminal" /> Protocol: <strong>HTTPS / REST JSON</strong>
            </span>
          </div>

          <div className="dev-hero-stats">
            <div className="dev-hero-stat">
              <Icon name="server" />
              <div>
                <strong>{cacheStats?.total ? cacheStats.total.toLocaleString() : "18,500+"}</strong>
                <span>Database Records</span>
              </div>
            </div>
            <div className="dev-hero-stat">
              <Icon name="activity" />
              <div>
                <strong>{cacheStats?.lastSyncedAt ? timeAgo(cacheStats.lastSyncedAt) : "Live (30s)"}</strong>
                <span>Sync Interval</span>
              </div>
            </div>
            <div className="dev-hero-stat">
              <Icon name="zap" />
              <div>
                <strong>60 / min</strong>
                <span>Rate Limit</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section: Wingo Game API at a Glance (Summary Box) ───────── */}
        <section className="dev-section" id="at-a-glance">
          <h2 className="dev-section-title">Wingo Game API at a Glance</h2>
          <div className="dev-glance-box">
            <div className="dev-glance-grid">
              <div className="dev-glance-item">
                <span className="dev-glance-label">Topic</span>
                <span className="dev-glance-val">Wingo Game API (REST v1)</span>
              </div>
              <div className="dev-glance-item">
                <span className="dev-glance-label">Purpose</span>
                <span className="dev-glance-val">Programmatic access to WinGo 30s draw history &amp; telemetry</span>
              </div>
              <div className="dev-glance-item">
                <span className="dev-glance-label">Audience</span>
                <span className="dev-glance-val">Backend engineers, full-stack developers &amp; data analysts</span>
              </div>
              <div className="dev-glance-item">
                <span className="dev-glance-label">Access Method</span>
                <span className="dev-glance-val">HTTPS GET requests with Bearer token authentication</span>
              </div>
              <div className="dev-glance-item">
                <span className="dev-glance-label">Supported Data</span>
                <span className="dev-glance-val">Period ID, winning digit (0–9), size, colours, UTC timestamp</span>
              </div>
              <div className="dev-glance-item">
                <span className="dev-glance-label">Documentation</span>
                <span className="dev-glance-val">Complete endpoint specs, query parameters, code tabs &amp; schemas</span>
              </div>
              <div className="dev-glance-item">
                <span className="dev-glance-label">Best Next Step</span>
                <span className="dev-glance-val">Generate your Bearer API key in the console below and test queries</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section: What Is the Wingo Game API? ───────────────────── */}
        <section className="dev-section" id="what-is-the-wingo-game-api">
          <h2 className="dev-section-title">What Is the Wingo Game API?</h2>
          
          <div className="dev-direct-answer">
            <p>
              <strong>Direct Answer:</strong> The Wingo Game API is a developer interface provided by TRION AI that allows supported applications to retrieve and work with WinGo 30-second game draw data through structured HTTP GET requests.
            </p>
          </div>

          <div className="dev-article-body">
            <p>
              Modern game tracking systems and analytical dashboards require low-latency, dependable data feeds. The <strong>Wingo Game API</strong> bridges the gap between raw round draws and developer applications by automatically aggregating, indexing, and normalizing draw telemetry from the WinGo 30-second cycle. Whether you are building an automated analytics suite, custom telemetry displays, or historical trend indicators, the API provides high-throughput data access without requiring manual web scraping.
            </p>
            <p>
              By utilizing the official endpoints on <Link href="/" className="dev-inline-link">TRION AI</Link>, software engineers can query draw records, filter rounds by period sequence numbers, and inspect time-stamped draw outcomes across rolling 24-hour windows.
            </p>

            <ContentCard type="key-point" title="Core API Identity & Entity Hierarchy">
              <p>
                <strong>Entity Relationship:</strong> <code>TRION AI (Provider) &rarr; Wingo Game API (Service) &rarr; Developer Documentation &rarr; Software Applications</code>.
              </p>
              <p>
                The API operates strictly over encrypted HTTPS protocols, returning RFC 8259 compliant JSON payloads with explicit schema definitions.
              </p>
            </ContentCard>
          </div>
        </section>

        {/* ── Section: Who Is the Wingo Game API For? ─────────────────── */}
        <section className="dev-section" id="who-is-the-wingo-game-api-for">
          <h2 className="dev-section-title">Who Is the Wingo Game API For?</h2>
          
          <div className="dev-direct-answer">
            <p>
              <strong>Direct Answer:</strong> The Wingo Game API is intended for developers, software engineers, and technical users who need programmatic access to verified WinGo game draw telemetry.
            </p>
          </div>

          <div className="dev-article-body">
            <p>The API is specifically structured for technical professionals across multiple disciplines:</p>
            <div className="dev-audience-grid">
              <div className="dev-audience-card">
                <div className="dev-audience-icon"><Icon name="code" /></div>
                <h3>Backend Developers</h3>
                <p>Engineers building automated ingestion pipelines, microservices, or server-side game caches in Node.js, Python, PHP, Go, or Java.</p>
              </div>
              <div className="dev-audience-card">
                <div className="dev-audience-icon"><Icon name="layers" /></div>
                <h3>Full-Stack Developers</h3>
                <p>Developers creating custom dashboard frontends, live telemetry widgets, or Next.js web applications with server-side data fetching.</p>
              </div>
              <div className="dev-audience-card">
                <div className="dev-audience-icon"><Icon name="activity" /></div>
                <h3>Data Analysts &amp; Researchers</h3>
                <p>Analysts examining number distribution, Big/Small parity balance, colour streaks, and probability variances across historical datasets.</p>
              </div>
              <div className="dev-audience-card">
                <div className="dev-audience-icon"><Icon name="zap" /></div>
                <h3>Bot &amp; Alert Integrators</h3>
                <p>Creators of community notification bots, webhook triggers, and automated alert systems for Telegram, Discord, or custom channels.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section: What Can Developers Do With the Wingo Game API? ─ */}
        <section className="dev-section" id="what-can-developers-do-with-the-wingo-game-api">
          <h2 className="dev-section-title">What Can Developers Do With the Wingo Game API?</h2>
          
          <div className="dev-direct-answer">
            <p>
              <strong>Direct Answer:</strong> Developers can use the Wingo Game API to build real-time monitoring dashboards, statistical trend analyzers, visual streak trackers, and automated community alerts without manual web scraping.
            </p>
          </div>

          <div className="dev-use-cases-grid">
            <div className="dev-use-case">
              <div className="dev-use-case-icon"><Icon name="activity" /></div>
              <h3>Live Telemetry Dashboards</h3>
              <p>Display real-time WinGo 30-second draw feeds, winning numbers, and rolling colour trends on custom monitoring interfaces.</p>
            </div>
            <div className="dev-use-case">
              <div className="dev-use-case-icon"><Icon name="zap" /></div>
              <h3>Statistical Pattern Analysis</h3>
              <p>Calculate streak lengths, parity frequencies (Big vs. Small ratio), and colour distribution curves over rolling 100-round sets.</p>
            </div>
            <div className="dev-use-case">
              <div className="dev-use-case-icon"><Icon name="users" /></div>
              <h3>Community Alert Bots</h3>
              <p>Integrate webhook pipelines to publish round summaries and historical statistics to community channels automatically.</p>
            </div>
            <div className="dev-use-case">
              <div className="dev-use-case-icon"><Icon name="database" /></div>
              <h3>Historical Backtesting Engines</h3>
              <p>Query thousands of past settled periods to analyze mathematical probabilities across long-term numeric sequences.</p>
            </div>
          </div>

          <p className="dev-use-case-note">
            For interactive calculators and visual pattern indicators, explore our companion <Link href="/wingo-tool" className="dev-inline-link">Wingo Master Calculator</Link> and live <Link href="/wingosignal" className="dev-inline-link">Wingo Signal</Link> tools.
          </p>
        </section>

        {/* ── Section: How Does the Wingo Game API Work? ─────────────── */}
        <section className="dev-section" id="how-does-the-wingo-game-api-work">
          <h2 className="dev-section-title">How Does the Wingo Game API Work?</h2>
          
          <div className="dev-direct-answer">
            <p>
              <strong>Direct Answer:</strong> The Wingo Game API works through a standard HTTPS request-response cycle where client applications send GET requests with a Bearer token, the API gateway validates authorization and rate limits (60 req/min), queries an indexed MongoDB cache, and returns structured JSON records.
            </p>
          </div>

          <div className="dev-article-body">
            <p>
              To maintain sub-second response times, TRION AI implements an automated background ingestion pipeline that continuously synchronizes settled game draws into an optimized MongoDB cluster. The standard request lifecycle follows six architectural stages:
            </p>

            <div className="dev-lifecycle-grid">
              <div className="dev-lifecycle-card">
                <span className="dev-lifecycle-step">Stage 1</span>
                <h4>Application Request</h4>
                <p>Your client application issues an HTTPS GET request to the public endpoint with a Bearer authentication token.</p>
              </div>
              <div className="dev-lifecycle-card">
                <span className="dev-lifecycle-step">Stage 2</span>
                <h4>Gateway Validation</h4>
                <p>The API gateway checks protocol security (enforcing HTTPS in production) and verifies the Bearer token header format.</p>
              </div>
              <div className="dev-lifecycle-card">
                <span className="dev-lifecycle-step">Stage 3</span>
                <h4>Auth &amp; Rate Limiting</h4>
                <p>The server hashes the key, verifies active permissions, and evaluates the rolling 60-request-per-minute window.</p>
              </div>
              <div className="dev-lifecycle-card">
                <span className="dev-lifecycle-step">Stage 4</span>
                <h4>Telemetry Synchronization</h4>
                <p>The synchronization engine matches incoming draw records against existing period entries, preventing duplicates.</p>
              </div>
              <div className="dev-lifecycle-card">
                <span className="dev-lifecycle-step">Stage 5</span>
                <h4>Query &amp; Filtering</h4>
                <p>Database indexes query requested periods, pagination limits (1–100), and ISO date filters with sub-100ms latency.</p>
              </div>
              <div className="dev-lifecycle-card">
                <span className="dev-lifecycle-step">Stage 6</span>
                <h4>JSON Response Delivery</h4>
                <p>The client receives a clean JSON payload containing the draw array, pagination metadata, and rate limit headers.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section: How Do You Get Started With the Wingo Game API? ─ */}
        <section className="dev-section" id="how-do-you-get-started-with-the-wingo-game-api">
          <h2 className="dev-section-title">How Do You Get Started With the Wingo Game API?</h2>
          
          <div className="dev-direct-answer">
            <p>
              <strong>Direct Answer:</strong> To get started with the Wingo Game API, create a TRION AI developer account, generate a Bearer API key in the developer console, configure your HTTP Authorization header, and send an HTTPS GET request to the game history endpoint.
            </p>
          </div>

          <div className="dev-integration-steps">
            {QUICK_START_STEPS.map((s) => (
              <div className="dev-integration-card" key={s.step}>
                <div className="dev-integration-num">{s.step}</div>
                <div className="dev-integration-info">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section: What API Endpoints Are Available? ─────────────── */}
        <section className="dev-section" id="what-api-endpoints-are-available">
          <h2 className="dev-section-title">What API Endpoints Are Available?</h2>
          
          <div className="dev-direct-answer">
            <p>
              <strong>Direct Answer:</strong> The primary public endpoint is <code>GET /api/developer/30-sec-game-history</code>, which returns paginated WinGo 30-second draw history with support for period searching and date filtering.
            </p>
          </div>

          <div className="dev-endpoint-spec">
            <div className="dev-endpoint-header">
              <span className="dev-method dev-method-get">GET</span>
              <code className="dev-endpoint-uri">/api/developer/30-sec-game-history</code>
              <span className="dev-auth-badge">Bearer Auth Required</span>
            </div>
            <p className="dev-endpoint-desc">
              Retrieves a paginated list of historical and recent 30-second WinGo round results, including period numbers, winning numbers, colour distributions, size ratings, and timestamp telemetry.
            </p>
          </div>

          <h3 className="dev-subheading">Query Parameters</h3>
          <div className="dev-table-wrap">
            <table className="dev-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Type</th>
                  <th>Required</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>page</code></td>
                  <td>integer</td>
                  <td>No</td>
                  <td><code>1</code></td>
                  <td>Page number index for pagination (minimum 1).</td>
                </tr>
                <tr>
                  <td><code>limit</code></td>
                  <td>integer</td>
                  <td>No</td>
                  <td><code>20</code></td>
                  <td>Number of records per page (minimum 1, maximum 100).</td>
                </tr>
                <tr>
                  <td><code>period</code> / <code>search</code></td>
                  <td>string</td>
                  <td>No</td>
                  <td><code>null</code></td>
                  <td>Search and filter by exact or partial period sequence number.</td>
                </tr>
                <tr>
                  <td><code>startDate</code> / <code>from</code></td>
                  <td>string</td>
                  <td>No</td>
                  <td><code>null</code></td>
                  <td>Filter records starting from date (format: <code>YYYY-MM-DD</code>).</td>
                </tr>
                <tr>
                  <td><code>endDate</code> / <code>to</code></td>
                  <td>string</td>
                  <td>No</td>
                  <td><code>null</code></td>
                  <td>Filter records ending on date (format: <code>YYYY-MM-DD</code>).</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Section: How Do Wingo API Requests Work? ───────────────── */}
        <section className="dev-section" id="how-do-wingo-api-requests-work">
          <h2 className="dev-section-title">How Do Wingo API Requests Work?</h2>
          
          <div className="dev-direct-answer">
            <p>
              <strong>Direct Answer:</strong> Wingo API requests are standard HTTP GET operations that pass query parameters in the URL string and require an <code>Authorization: Bearer ws_YOUR_API_KEY</code> header and <code>Accept: application/json</code> header.
            </p>
          </div>

          <div className="dev-code-block">
            <div className="dev-code-tabs" role="tablist">
              {Object.entries(CODE_SNIPPETS).map(([key, lang]) => (
                <button
                  key={key}
                  className={`dev-code-tab ${activeLang === key ? "active" : ""}`}
                  onClick={() => setActiveLang(key)}
                  type="button"
                  role="tab"
                  aria-selected={activeLang === key}
                >
                  {lang.label}
                </button>
              ))}
              <CopyButton text={snippetCode} />
            </div>
            <div className="dev-code-editor">
              <pre><code>{snippetCode}</code></pre>
            </div>
          </div>
        </section>

        {/* ── Section: What Does an API Response Look Like? ──────────── */}
        <section className="dev-section" id="what-does-an-api-response-look-like">
          <h2 className="dev-section-title">What Does an API Response Look Like?</h2>
          
          <div className="dev-direct-answer">
            <p>
              <strong>Direct Answer:</strong> The Wingo Game API returns an RFC 8259 compliant JSON payload containing an <code>ok</code> status boolean, an array of game records in <code>data</code>, pagination metadata in <code>pagination</code>, and server cache and rate limit telemetry in <code>meta</code>.
            </p>
          </div>

          <div className="dev-response-block">
            <div className="dev-response-header">
              <span className="dev-badge-json">HTTP 200 OK &bull; application/json</span>
              <CopyButton text={JSON.stringify(SAMPLE_RESPONSE, null, 2)} />
            </div>
            <pre className="dev-doc-pre">
              <code>{JSON.stringify(SAMPLE_RESPONSE, null, 2)}</code>
            </pre>
          </div>

          <h3 className="dev-subheading">Response Schema Fields</h3>
          <div className="dev-table-wrap">
            <table className="dev-table">
              <thead>
                <tr>
                  <th>Field Name</th>
                  <th>Type</th>
                  <th>Example</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>period</code></td>
                  <td>string</td>
                  <td><code>"20260903301284"</code></td>
                  <td>Unique sequential round period identifier for the draw.</td>
                </tr>
                <tr>
                  <td><code>number</code></td>
                  <td>integer</td>
                  <td><code>7</code></td>
                  <td>Winning drawn digit ranging from <code>0</code> through <code>9</code>.</td>
                </tr>
                <tr>
                  <td><code>size</code></td>
                  <td>string</td>
                  <td><code>"Big"</code> / <code>"Small"</code></td>
                  <td>Parity size calculation: numbers 5–9 are "Big", 0–4 are "Small".</td>
                </tr>
                <tr>
                  <td><code>colors</code></td>
                  <td>array of strings</td>
                  <td><code>["Red", "Violet"]</code></td>
                  <td>Array of matching colour tokens associated with the winning number.</td>
                </tr>
                <tr>
                  <td><code>color</code></td>
                  <td>string</td>
                  <td><code>"Red, Violet"</code></td>
                  <td>Comma-delimited string representation of the winning colours.</td>
                </tr>
                <tr>
                  <td><code>blockTimestamp</code></td>
                  <td>integer</td>
                  <td><code>1788414600000</code></td>
                  <td>Unix epoch timestamp in milliseconds when the round concluded.</td>
                </tr>
                <tr>
                  <td><code>time</code></td>
                  <td>string (ISO 8601)</td>
                  <td><code>"2026-09-03T04:10:00Z"</code></td>
                  <td>Standardized UTC ISO-8601 formatted date and time string.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Section: How Does Authentication Work? ─────────────────── */}
        <section className="dev-section" id="how-does-authentication-work">
          <h2 className="dev-section-title">How Does Authentication Work?</h2>
          
          <div className="dev-direct-answer">
            <p>
              <strong>Direct Answer:</strong> API authentication requires passing your unique SHA-256 hashed API key as a Bearer token in the HTTP <code>Authorization</code> header on every request: <code>Authorization: Bearer ws_YOUR_API_KEY</code>.
            </p>
          </div>

          <div className="dev-article-body">
            <p>
              API keys are provisioned with the <code>ws_</code> prefix to identify them as authorized WinGo data tokens. To ensure security across all integrations:
            </p>
            <ul className="dev-bullet-list">
              <li><strong>Never expose API keys</strong> in public GitHub repositories, client-side React bundles, or frontend HTML source code.</li>
              <li><strong>Store keys in server environment variables</strong> (e.g., <code>.env.local</code>) and fetch data via server-side routines.</li>
              <li><strong>Use key revocation</strong> in the TRION AI developer console immediately if a secret key is accidentally compromised.</li>
              <li><strong>Follow official technical standards</strong> for HTTP Authorization headers documented on <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization" target="_blank" rel="noopener noreferrer" className="dev-external-link">MDN Web Docs <Icon name="externalLink" /></a>.</li>
            </ul>
          </div>
        </section>

        {/* ── Section: How Should Developers Secure Their Integration? ─ */}
        <section className="dev-section" id="how-should-developers-secure-their-integration">
          <h2 className="dev-section-title">How Should Developers Secure Their Integration?</h2>
          
          <div className="dev-direct-answer">
            <p>
              <strong>Direct Answer:</strong> Developers should secure API integrations by keeping API keys in server-side environment variables, never committing credentials to version control, enforcing HTTPS in production, and validating API responses.
            </p>
          </div>

          <div className="dev-article-body">
            <ContentCard type="best-practice" title="Server-Side Proxy Architecture">
              <p>
                <strong>Security Rule:</strong> Always make API calls from your server-side environment (such as Next.js API routes, Express.js, Django, or Laravel) rather than directly from client-side browser JavaScript. Storing your API key in environment variables (e.g., <code>process.env.WINGO_API_KEY</code>) protects your credentials from exposure in client network inspectors.
              </p>
            </ContentCard>
          </div>
        </section>

        {/* ── Section: How Can You Troubleshoot API Requests? ────────── */}
        <section className="dev-section" id="how-can-you-troubleshoot-api-requests">
          <h2 className="dev-section-title">How Can You Troubleshoot API Requests?</h2>
          
          <div className="dev-direct-answer">
            <p>
              <strong>Direct Answer:</strong> You can troubleshoot API requests by inspecting HTTP status codes, checking <code>Retry-After</code> headers during rate limiting, and ensuring query parameters match expected data types.
            </p>
          </div>

          <div className="dev-table-wrap">
            <table className="dev-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Error Code</th>
                  <th>Meaning</th>
                  <th>Recommended Developer Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="dev-status-pill dev-status-400">400</span></td>
                  <td><code>bad_request</code></td>
                  <td>Invalid query parameters or malformed input.</td>
                  <td>Check that <code>page</code> and <code>limit</code> are positive integers (limit &le; 100).</td>
                </tr>
                <tr>
                  <td><span className="dev-status-pill dev-status-401">401</span></td>
                  <td><code>missing_api_key</code> / <code>invalid_api_key</code></td>
                  <td>Missing or revoked Bearer token.</td>
                  <td>Verify that your <code>Authorization: Bearer ws_...</code> header is correctly formatted.</td>
                </tr>
                <tr>
                  <td><span className="dev-status-pill dev-status-405">405</span></td>
                  <td><code>method_not_allowed</code></td>
                  <td>HTTP method other than GET was used.</td>
                  <td>Ensure your HTTP client is configured to send <code>GET</code> requests.</td>
                </tr>
                <tr>
                  <td><span className="dev-status-pill dev-status-426">426</span></td>
                  <td><code>https_required</code></td>
                  <td>Request was made over unencrypted HTTP.</td>
                  <td>Upgrade all request URLs to use <code>https://</code> in production.</td>
                </tr>
                <tr>
                  <td><span className="dev-status-pill dev-status-429">429</span></td>
                  <td><code>rate_limited</code></td>
                  <td>Rate limit of 60 requests/minute exceeded.</td>
                  <td>Inspect <code>Retry-After</code> header and throttle client requests according to <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429" target="_blank" rel="noopener noreferrer" className="dev-external-link">RFC 6585 standards <Icon name="externalLink" /></a>.</td>
                </tr>
                <tr>
                  <td><span className="dev-status-pill dev-status-503">503</span></td>
                  <td><code>service_unavailable</code></td>
                  <td>Temporary database connection issue.</td>
                  <td>Implement exponential backoff retry logic (1s, 2s, 4s).</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Section: Should You Use the API or the Wingo30 Web Interface? ── */}
        <section className="dev-section" id="should-you-use-the-api-or-the-wingo30-web-interface">
          <h2 className="dev-section-title">Should You Use the API or the Wingo30 Web Interface?</h2>
          
          <div className="dev-direct-answer">
            <p>
              <strong>Direct Answer:</strong> Use the Wingo30 web interface if you need immediate visual charts, signals, and calculators without coding; use the Wingo Game API if you are building automated software, custom dashboards, or database integrations.
            </p>
          </div>

          <div className="dev-table-wrap">
            <table className="dev-table">
              <thead>
                <tr>
                  <th>Dimension</th>
                  <th>Wingo30 Web Interface</th>
                  <th>Wingo Game API</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Target User</strong></td>
                  <td>General users, strategy analysts, visual trackers</td>
                  <td>Developers, engineers, data scientists, bot builders</td>
                </tr>
                <tr>
                  <td><strong>Technical Knowledge</strong></td>
                  <td>None required (browser-based UI)</td>
                  <td>HTTP requests, JSON parsing, backend integration</td>
                </tr>
                <tr>
                  <td><strong>Data Access</strong></td>
                  <td>Visual tables, live charts, interactive buttons</td>
                  <td>Programmatic REST endpoints, raw JSON telemetry</td>
                </tr>
                <tr>
                  <td><strong>Primary Use Case</strong></td>
                  <td>Manual game trend analysis &amp; calculator tools</td>
                  <td>Automated data pipelines, custom apps, alert bots</td>
                </tr>
                <tr>
                  <td><strong>Authentication</strong></td>
                  <td>Google account sign-in via web UI</td>
                  <td>Bearer API Key in HTTP Authorization header</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Section: Interactive Developer Dashboard ───────────────── */}
        <section className="dev-section" id="developer-dashboard">
          <div className="dev-dashboard-header">
            <div>
              <h2 className="dev-section-title">Developer Console &amp; Key Management</h2>
              <p className="dev-section-desc">Manage your API credentials, monitor monthly quota usage, and inspect database records.</p>
            </div>
            {user && (
              <button className="dev-btn dev-btn-ghost" onClick={refreshAll} type="button" disabled={loading}>
                <Icon name="refresh" />
                Refresh
              </button>
            )}
          </div>

          {!user ? (
            <div className="dev-guest-card">
              <div className="dev-guest-icon"><Icon name="key" /></div>
              <div className="dev-guest-content">
                <h3>Sign in to Generate Your API Key</h3>
                <p>Create a TRION AI account or sign in to get your live Bearer API key, track your daily request quotas, and access interactive API tools.</p>
              </div>
              <button className="dev-btn dev-btn-primary" onClick={() => router.push("/login")} type="button">
                Sign In to Developer Portal
              </button>
            </div>
          ) : (
            <div className="dev-dashboard">
              <div className="dev-card dev-key-card">
                <div className="dev-card-header">
                  <Icon name="key" />
                  <span>Your API Key</span>
                </div>
                <div className="dev-key-value">
                  {loading ? <Skeleton width="180px" /> : <code>{maskedKey}</code>}
                </div>
                <div className="dev-key-meta">
                  {keyData && (
                    <>
                      <span>Created: {formatDate(keyData.createdAt)}</span>
                      <span>Last used: {keyData.lastUsedAt ? timeAgo(keyData.lastUsedAt) : "Never"}</span>
                    </>
                  )}
                </div>
                <div className="dev-key-actions">
                  {hasKey ? (
                    <>
                      {keyData?.prefix && (
                        <CopyButton text={generatedKey || `${keyData.prefix}...${keyData.last4}`} />
                      )}
                      <button className="dev-btn dev-btn-danger" onClick={handleRevokeKey} type="button" disabled={loading}>
                        Revoke Key
                      </button>
                    </>
                  ) : (
                    <button className="dev-btn dev-btn-primary" onClick={handleGenerateKey} type="button" disabled={loading}>
                      {loading ? "Generating..." : "Generate API Key"}
                    </button>
                  )}
                </div>
              </div>

              <div className="dev-card dev-stats-card">
                <div className="dev-card-header">
                  <Icon name="activity" />
                  <span>API Usage Telemetry</span>
                </div>
                {loading ? (
                  <div className="dev-stats-grid">
                    {[1, 2, 3, 4].map((i) => <Skeleton key={i} height="48px" />)}
                  </div>
                ) : stats ? (
                  <div className="dev-stats-grid">
                    <div className="dev-stat-item">
                      <strong>{stats.totalRequests?.toLocaleString() || 0}</strong>
                      <span>Total Requests</span>
                    </div>
                    <div className="dev-stat-item">
                      <strong>{stats.requestsToday?.toLocaleString() || 0}</strong>
                      <span>Today</span>
                    </div>
                    <div className="dev-stat-item">
                      <strong>{stats.monthlyRequests?.toLocaleString() || 0}</strong>
                      <span>This Month</span>
                    </div>
                    <div className="dev-stat-item">
                      <strong>{stats.averageResponseTimeMs || 0}ms</strong>
                      <span>Avg Response</span>
                    </div>
                  </div>
                ) : (
                  <p className="dev-empty-text">No requests logged yet. Use your key in the playground below to start querying.</p>
                )}
              </div>
            </div>
          )}
        </section>

        {/* ── Section: Live Database Browser ─────────────────────────── */}
        {user && (
          <section className="dev-section" id="database-browser">
            <div className="dev-dashboard-header">
              <h2 className="dev-section-title">
                Live Database Records
                <span className="dev-live-badge dev-live-badge-sm" />
              </h2>
            </div>
            <div className="dev-db-browser" ref={liveRef}>
              <div className="dev-db-controls">
                <div className="dev-db-search">
                  <Icon name="search" />
                  <input
                    type="text"
                    placeholder="Search by period sequence..."
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleHistorySearch()}
                  />
                </div>
                <div className="dev-db-dates">
                  <input
                    type="date"
                    value={historyDateFrom}
                    onChange={(e) => setHistoryDateFrom(e.target.value)}
                    title="From date"
                  />
                  <input
                    type="date"
                    value={historyDateTo}
                    onChange={(e) => setHistoryDateTo(e.target.value)}
                    title="To date"
                  />
                </div>
                <button className="dev-btn dev-btn-primary dev-btn-sm" onClick={handleHistorySearch} type="button" disabled={historyLoading}>
                  {historyLoading ? "..." : "Filter Records"}
                </button>
              </div>
              {historyError && <div className="dev-alert dev-alert-error">{historyError}</div>}
              <div className="dev-db-table-wrap">
                {historyLoading ? (
                  <div className="dev-loading-inline">
                    <div className="dev-spinner-sm" />
                    <span>Querying database records...</span>
                  </div>
                ) : historyData.length === 0 ? (
                  <div className="dev-empty-state">
                    <Icon name="server" />
                    <p>No records found. Make an API request to populate telemetry.</p>
                  </div>
                ) : (
                  <table className="dev-db-table">
                    <thead>
                      <tr>
                        <th>Period</th>
                        <th>Number</th>
                        <th>Size</th>
                        <th>Color</th>
                        <th>Draw Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyData.map((row, i) => (
                        <tr key={row.period || i}>
                          <td className="dev-cell-period">{row.period || "--"}</td>
                          <td>
                            <span className={`dev-number-badge dev-color-${(row.color || "").toLowerCase().split(",")[0].trim()}`}>
                              {row.number ?? "--"}
                            </span>
                          </td>
                          <td>{row.size || "--"}</td>
                          <td>
                            <span className={`dev-color-dot dev-color-${(row.color || "").toLowerCase().split(",")[0].trim()}`}>
                              {row.color || "--"}
                            </span>
                          </td>
                          <td className="dev-cell-time">{formatTime(row.time || row.timestamp || row.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              {historyPagination && (
                <div className="dev-db-pagination">
                  <button
                    className="dev-btn dev-btn-ghost dev-btn-sm"
                    onClick={() => handleHistoryPageChange(historyPagination.page - 1)}
                    disabled={historyPagination.page <= 1 || historyLoading}
                    type="button"
                  >
                    <Icon name="chevronLeft" />
                    Prev
                  </button>
                  <span>Page {historyPagination.page} of {historyPagination.totalPages || 1}</span>
                  <button
                    className="dev-btn dev-btn-ghost dev-btn-sm"
                    onClick={() => handleHistoryPageChange(historyPagination.page + 1)}
                    disabled={(historyPagination.page || 1) >= (historyPagination.totalPages || 1) || historyLoading}
                    type="button"
                  >
                    Next
                    <Icon name="chevronRight" />
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Section: API Playground ────────────────────────────────── */}
        <section className="dev-section" id="api-playground">
          <h2 className="dev-section-title">Interactive API Playground</h2>
          <p className="dev-section-desc">Test the live Wingo Game API directly from your browser.</p>

          <div className="dev-playground">
            <div className="dev-playground-form">
              <div className="dev-playground-field">
                <label>API Key (Bearer Token)</label>
                <input
                  type="text"
                  placeholder="ws_your_api_key_here"
                  value={playgroundKey}
                  onChange={(e) => setPlaygroundKey(e.target.value)}
                />
              </div>
              <div className="dev-playground-field">
                <label>Target Endpoint</label>
                <select value={playgroundEndpoint} onChange={(e) => setPlaygroundEndpoint(e.target.value)}>
                  <option value="30-sec-game-history">GET /api/developer/30-sec-game-history (limit=5)</option>
                </select>
              </div>
              <button className="dev-btn dev-btn-primary" onClick={handlePlaygroundSend} type="button" disabled={playgroundLoading || !playgroundKey}>
                {playgroundLoading ? (
                  <><div className="dev-spinner-sm" /> Executing Request...</>
                ) : (
                  <><Icon name="play" /> Execute Request</>
                )}
              </button>
            </div>
            {playgroundResponse && (
              <div className="dev-playground-response">
                <div className="dev-response-meta">
                  <div className={`dev-status-badge dev-status-${playgroundResponse.status >= 200 && playgroundResponse.status < 300 ? "success" : playgroundResponse.status === 429 ? "warning" : "error"}`}>
                    {playgroundResponse.status || "ERR"} {playgroundResponse.statusText}
                  </div>
                  <span className="dev-latency">{playgroundResponse.latency}ms</span>
                  {playgroundResponse.headers["x-ratelimit-remaining"] && (
                    <span className="dev-rate-info">
                      Quota Remaining: {playgroundResponse.headers["x-ratelimit-remaining"]}/{playgroundResponse.headers["x-ratelimit-limit"]}
                    </span>
                  )}
                </div>
                <pre className="dev-response-body"><code>{JSON.stringify(playgroundResponse.body, null, 2)}</code></pre>
              </div>
            )}
          </div>
        </section>

        {/* ── Section: FAQ / AEO ─────────────────────────────────────── */}
        <section className="dev-section" id="faq">
          <h2 className="dev-section-title">Frequently Asked Questions</h2>
          <p className="dev-section-desc">Clear answers to common technical, architectural, and integration questions.</p>

          <div className="dev-faq-list">
            {FAQ_LIST.map((item, idx) => (
              <div className="dev-faq-item" key={idx}>
                <button
                  className="dev-faq-header"
                  onClick={() => toggleFaq(idx)}
                  type="button"
                  aria-expanded={openFaq === idx}
                >
                  <h3 className="dev-faq-question">{item.question}</h3>
                  <Icon name="chevronDown" className={`dev-faq-icon ${openFaq === idx ? "open" : ""}`} />
                </button>
                <div className={`dev-faq-answer ${openFaq === idx ? "expanded" : ""}`}>
                  <p><strong>Direct Answer:</strong> {item.answer}</p>
                  <p>{item.details}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section: Key Takeaway (AEO / GEO Summary) ──────────────── */}
        <section className="dev-section" id="key-takeaway">
          <h2 className="dev-section-title">Key Takeaway</h2>
          <div className="dev-takeaway-card">
            <p>
              <strong>The Wingo Game API by TRION AI</strong> provides developers with dependable, sub-second telemetry for WinGo 30-second draws. By offering RESTful JSON endpoints, Bearer token authentication, and comprehensive historical queries, the API enables software engineers to build custom dashboards, telemetry tools, and data pipelines with ease. To get started, generate your API key in the developer console and review our request examples above.
            </p>
          </div>
        </section>

        {/* ── Related Tools & Contextual Internal Links ──────────────── */}
        <section className="dev-section" id="related-resources">
          <h2 className="dev-section-title">Explore TRION AI Platform Resources</h2>
          <p className="dev-section-desc">Discover our full suite of AI prediction tools, telemetry indicators, and documentation.</p>

          <div className="dev-links-grid">
            <Link href="/" className="dev-link-card">
              <div>
                <strong>TRION AI Platform</strong>
                <span>Real-time AI Wingo prediction &amp; analytics engine</span>
              </div>
              <Icon name="arrowRight" />
            </Link>
            <Link href="/wingo-tool" className="dev-link-card">
              <div>
                <strong>Wingo Master Calculator</strong>
                <span>Interactive pattern analysis &amp; probability calculator</span>
              </div>
              <Icon name="arrowRight" />
            </Link>
            <Link href="/wingosignal" className="dev-link-card">
              <div>
                <strong>Wingo Signal Indicator</strong>
                <span>Live 1-minute telemetry &amp; parity signal feeds</span>
              </div>
              <Icon name="arrowRight" />
            </Link>
            <Link href="/wingo-ai-prediction" className="dev-link-card">
              <div>
                <strong>Wingo AI Prediction</strong>
                <span>Korven &amp; FX1 multi-model trend calculations</span>
              </div>
              <Icon name="arrowRight" />
            </Link>
            <Link href="/subscription" className="dev-link-card">
              <div>
                <strong>Developer Pro Plans</strong>
                <span>Unlock higher API rate limits &amp; historical datasets</span>
              </div>
              <Icon name="arrowRight" />
            </Link>
            <Link href="/wingo" className="dev-link-card">
              <div>
                <strong>Wingo Game Trends</strong>
                <span>Historical pattern analysis and statistical distributions</span>
              </div>
              <Icon name="arrowRight" />
            </Link>
          </div>
        </section>

        {/* ── Authoritative References ──────────────────────────────── */}
        <section className="dev-section dev-authoritative-section">
          <div className="dev-authoritative-box">
            <h4>Technical Specifications &amp; Authoritative Standards</h4>
            <p>
              The Wingo Game API adheres to established web standards for data exchange and security:
            </p>
            <ul className="dev-ref-list">
              <li>
                <a href="https://datatracker.ietf.org/doc/html/rfc8259" target="_blank" rel="noopener noreferrer" className="dev-ref-link">
                  IETF RFC 8259: The JavaScript Object Notation (JSON) Data Interchange Format <Icon name="externalLink" />
                </a>
              </li>
              <li>
                <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization" target="_blank" rel="noopener noreferrer" className="dev-ref-link">
                  MDN Web Docs: HTTP Authorization Header Specification <Icon name="externalLink" />
                </a>
              </li>
              <li>
                <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429" target="_blank" rel="noopener noreferrer" className="dev-ref-link">
                  MDN Web Docs: HTTP 429 Too Many Requests Status Code <Icon name="externalLink" />
                </a>
              </li>
            </ul>
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
