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
    console.log("Total records:", payload.pagination.total);
    console.log("Latest draws:", payload.data);
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
    print(f"Status: {data.get('ok')}")
    print(f"Total draws in database: {data['pagination']['total']}")
    for draw in data.get("data", []):
        print(f"Period {draw['period']} -> Number {draw['number']} ({draw['size']}, {draw['color']})")
except requests.exceptions.RequestException as error:
    print(f"API Error: {error}")`,
  },
  nodejs: {
    label: "Node.js",
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
    question: "How do I use the Wingo Game API?",
    answer:
      "To use the Wingo Game API, create a TRION AI developer account, generate a Bearer API key in the developer console, and pass the key in the Authorization header of an HTTP GET request to the /api/developer/30-sec-game-history endpoint.",
    details:
      "Every request must include the header 'Authorization: Bearer ws_YOUR_API_KEY'. You can customize the response by specifying query parameters like page, limit (up to 100), period search, and date ranges.",
  },
  {
    question: "What data does the Wingo Game API provide?",
    answer:
      "The Wingo Game API provides structured round data including the unique draw period number, winning digit (0–9), size category (Big/Small), colour tokens (Green, Red, Violet), epoch blockTimestamp, and ISO-8601 UTC draw timestamp, along with pagination and cache synchronization metadata.",
    details:
      "Responses also include server-side metadata such as total indexed database records, last synchronization timestamp, and real-time rate limit headers.",
  },
  {
    question: "Does the Wingo Game API provide game history?",
    answer:
      "Yes, the Wingo Game API provides paginated historical draw records stored in a synchronized database, supporting period searching, date range filtering, and pagination up to 100 records per page.",
    details:
      "Developers can paginate through thousands of past draw cycles to backtest statistical models, calculate streak distributions, or analyze historical parity patterns.",
  },
  {
    question: "Does the Wingo Game API require authentication?",
    answer:
      "Yes, all public Wingo Game API endpoints require Bearer token authentication via the HTTP Authorization header. API keys are generated securely from the TRION AI developer dashboard and must be kept confidential.",
    details:
      "Requests sent without an Authorization header or with invalid keys receive an HTTP 401 Unauthorized status code. API keys should be stored in backend environment variables and never exposed in client-side bundles.",
  },
  {
    question: "How can I integrate the Wingo API into my website?",
    answer:
      "You can integrate the Wingo API into your website by making server-side HTTP GET requests from your backend framework (such as Next.js, Node.js, Python, or PHP) using your API key and rendering the returned JSON data in your custom UI.",
    details:
      "Using a server-side proxy or backend route handler keeps your API key secure while delivering live draw results, colour indicators, and period tables to your frontend visitors.",
  },
  {
    question: "Can I use the Wingo API in a mobile application?",
    answer:
      "Yes, any iOS, Android, Flutter, React Native, or mobile web application capable of sending standard HTTPS requests can consume the Wingo Game API JSON endpoints.",
    details:
      "For mobile apps, we recommend routing requests through your own backend proxy server so that your API key is not bundled into client-side application binaries.",
  },
  {
    question: "What programming languages can use the Wingo API?",
    answer:
      "Any programming language that supports HTTP requests and JSON parsing—including JavaScript/TypeScript, Python, PHP, Go, Java, C#, Rust, and Ruby—can easily interact with the Wingo Game API.",
    details:
      "Because the API adheres to standard REST architecture, no proprietary SDK is required. Standard HTTP libraries such as Fetch, Axios, Requests, or cURL work seamlessly.",
  },
  {
    question: "Does the Wingo API guarantee prediction results?",
    answer:
      "No, the Wingo Game API provides verified historical and real-time draw telemetry for statistical analysis and application development. It does not manipulate game outcomes or guarantee future prediction results, as all draws originate from server-side Random Number Generators (RNG).",
    details:
      "TRION AI promotes responsible mathematical analysis. The API acts as an objective data feed for historical pattern recognition and application integrations rather than a guaranteed winning system.",
  },
];

const INTEGRATION_STEPS = [
  {
    step: 1,
    title: "Obtain an API Key",
    desc: "Sign in to your TRION AI developer account and generate a unique Bearer API key in the developer console.",
  },
  {
    step: 2,
    title: "Configure Authentication Headers",
    desc: "Add your API key to the HTTP Authorization header as a Bearer token: 'Authorization: Bearer ws_YOUR_API_KEY'.",
  },
  {
    step: 3,
    title: "Select Endpoint & Query Parameters",
    desc: "Target the GET /api/developer/30-sec-game-history endpoint and configure optional query parameters such as page, limit, period, or date filters.",
  },
  {
    step: 4,
    title: "Execute HTTP Request",
    desc: "Send an HTTPS GET request using your preferred HTTP client (cURL, Fetch, Requests, or Axios) and inspect rate limit response headers.",
  },
  {
    step: 5,
    title: "Parse & Validate JSON Response",
    desc: "Parse the structured JSON response containing the data array, pagination metadata, and server cache synchronization timestamps.",
  },
  {
    step: 6,
    title: "Render Data in Application",
    desc: "Bind the game draw records (period, number, size, color, timestamp) into your custom dashboard, telemetry UI, or statistical analysis pipeline.",
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

  const refreshToken = useCallback(async () => {
    const token = await getIdToken();
    setIdToken(token);
    return token;
  }, []);

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
  const PAGE_TITLE = "Wingo Game API – Developer API & Documentation | TRION AI";
  const PAGE_DESC =
    "Explore the Wingo Game API by TRION AI. View API documentation, endpoints, response formats and integration guidance for developers.";

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
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESC} />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:type" content="article" />
        <meta property="article:modified_time" content="2026-09-03T09:45:00+05:30" />
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
      <WebPageSchema title={PAGE_TITLE} description={PAGE_DESC} url={PAGE_URL} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wingo30.com/" },
          { name: "Developer", url: PAGE_URL },
          { name: "Wingo Game API", url: PAGE_URL },
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
        name="How to Integrate the Wingo Game API"
        description="A step-by-step developer workflow for integrating TRION AI Wingo Game API endpoints into web, server, and mobile applications."
        steps={INTEGRATION_STEPS.map((s) => ({
          name: s.title,
          text: s.desc,
          url: `${PAGE_URL}#how-to-integrate-the-wingo-game-api`,
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
          
          <h1 className="dev-hero-title">Wingo Game API</h1>
          
          {/* Top AI / AEO Summary (50-80 words direct answer) */}
          <div className="dev-aeo-summary" role="region" aria-label="API Overview Summary">
            <p>
              <strong>Wingo Game API</strong> is a developer interface provided by <strong>TRION AI</strong> for accessing structured WinGo game data and integrating real-time draw results into applications, dashboards, and analytical software. This documentation explains available endpoints, authentication methods, request structures, and response schemas, allowing developers to query live 30-second draws and historical records programmatically.
            </p>
          </div>

          {/* Freshness & Metadata Signals */}
          <div className="dev-freshness-bar">
            <span className="dev-freshness-item">
              <Icon name="clock" /> Last updated: <strong>September 3, 2026</strong>
            </span>
            <span className="dev-freshness-sep">&bull;</span>
            <span className="dev-freshness-item">
              <Icon name="shield" /> Entity: <strong>TRION AI</strong>
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

        {/* ── Developer Quick Start ─────────────────────────────────── */}
        <section className="dev-section" id="quick-start">
          <div className="dev-section-header">
            <div className="dev-section-icon"><Icon name="zap" /></div>
            <div>
              <h2 className="dev-section-title">Developer Quick Start</h2>
              <p className="dev-section-desc">Get started with the Wingo Game API in five rapid steps.</p>
            </div>
          </div>

          <div className="dev-steps">
            <div className="dev-step">
              <div className="dev-step-num">1</div>
              <h3>Review Requirements</h3>
              <p>Ensure your client supports HTTPS GET requests and JSON parsing.</p>
            </div>
            <div className="dev-step">
              <div className="dev-step-num">2</div>
              <h3>Generate API Key</h3>
              <p>Create a Bearer token in your developer dashboard console.</p>
            </div>
            <div className="dev-step">
              <div className="dev-step-num">3</div>
              <h3>Configure Endpoint</h3>
              <p>Call <code>/api/developer/30-sec-game-history</code> with parameters.</p>
            </div>
            <div className="dev-step">
              <div className="dev-step-num">4</div>
              <h3>Send Request</h3>
              <p>Pass your token in the <code>Authorization</code> header.</p>
            </div>
            <div className="dev-step">
              <div className="dev-step-num">5</div>
              <h3>Integrate JSON</h3>
              <p>Parse draw numbers, colours, and sizes into your custom app.</p>
            </div>
          </div>
        </section>

        {/* ── Section: What Is the Wingo Game API? ───────────────────── */}
        <section className="dev-section" id="what-is-the-wingo-game-api">
          <h2 className="dev-section-title">What Is the Wingo Game API?</h2>
          
          <div className="dev-direct-answer">
            <p>
              <strong>Direct Answer:</strong> The Wingo Game API is a REST-based web service developed by TRION AI that provides programmatic access to verified WinGo 30-second game history, rolling round results, colour classifications, and numeric draw outcomes in structured JSON format.
            </p>
          </div>

          <div className="dev-article-body">
            <p>
              Modern game tracking systems and analytical dashboards require low-latency, dependable data feeds. The <strong>Wingo Game API</strong> bridges the gap between raw round draws and developer applications by automatically aggregating, indexing, and normalizing draw telemetry from the WinGo 30-second cycle. Whether you are building an automated analytics suite, custom telemetry displays, or historical trend indicators, the API provides high-throughput data access without requiring manual web scraping.
            </p>
            <p>
              By utilizing the official endpoints on <Link href="/" className="dev-inline-link">TRION AI</Link>, software engineers can query draw records, filter rounds by period sequence numbers, and inspect time-stamped draw outcomes across rolling 24-hour windows. The API is designed specifically for developers, data scientists, and independent tool builders seeking authoritative WinGo telemetry.
            </p>

            <ContentCard type="key-point" title="Core API Identity & Entity Hierarchy">
              <p>
                <strong>Entity Mapping:</strong> <code>TRION AI (Provider) &rarr; Wingo Game API (Service) &rarr; Developer Documentation &rarr; Software Applications</code>.
              </p>
              <p>
                The API operates strictly over encrypted HTTPS protocols, returning RFC 8259 compliant JSON payloads with explicit schema definitions.
              </p>
            </ContentCard>
          </div>
        </section>

        {/* ── Section: How Does the Wingo Game API Work? ─────────────── */}
        <section className="dev-section" id="how-does-the-wingo-game-api-work">
          <h2 className="dev-section-title">How Does the Wingo Game API Work?</h2>
          
          <div className="dev-direct-answer">
            <p>
              <strong>Direct Answer:</strong> The Wingo Game API functions through a high-speed request-response lifecycle where client applications send authenticated HTTP GET requests, which the API gateway validates, queries against an indexed database cache, and returns as structured JSON data within milliseconds.
            </p>
          </div>

          <div className="dev-article-body">
            <p>
              To maintain sub-second response times, TRION AI implements an automated background ingestion pipeline that continuously synchronizes settled game draws into an optimized MongoDB cluster. The standard request lifecycle follows six well-defined architectural stages:
            </p>

            <div className="dev-lifecycle-grid">
              <div className="dev-lifecycle-card">
                <span className="dev-lifecycle-step">Step 1</span>
                <h4>Application Request</h4>
                <p>Your client application issues an HTTPS GET request to the public endpoint with a Bearer authentication token.</p>
              </div>
              <div className="dev-lifecycle-card">
                <span className="dev-lifecycle-step">Step 2</span>
                <h4>Gateway Validation</h4>
                <p>The API gateway checks protocol security (enforcing HTTPS in production) and verifies the Bearer token header format.</p>
              </div>
              <div className="dev-lifecycle-card">
                <span className="dev-lifecycle-step">Step 3</span>
                <h4>Authentication & Rate Limiting</h4>
                <p>The server hashes the key, verifies active permissions, and evaluates the rolling 60-request-per-minute window.</p>
              </div>
              <div className="dev-lifecycle-card">
                <span className="dev-lifecycle-step">Step 4</span>
                <h4>Telemetry Synchronization</h4>
                <p>The synchronization engine matches incoming draw records against existing period entries, preventing duplicates.</p>
              </div>
              <div className="dev-lifecycle-card">
                <span className="dev-lifecycle-step">Step 5</span>
                <h4>Query & Filtering</h4>
                <p>Database indexes query requested periods, pagination limits (1–100), and ISO date filters with sub-100ms latency.</p>
              </div>
              <div className="dev-lifecycle-card">
                <span className="dev-lifecycle-step">Step 6</span>
                <h4>JSON Response Delivery</h4>
                <p>The client receives a clean JSON payload containing the draw array, pagination metadata, and rate limit headers.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section: What Data Does the Wingo Game API Provide? ────── */}
        <section className="dev-section" id="what-data-does-the-wingo-game-api-provide">
          <h2 className="dev-section-title">What Data Does the Wingo Game API Provide?</h2>
          
          <div className="dev-direct-answer">
            <p>
              <strong>Direct Answer:</strong> The Wingo Game API delivers complete round data fields for every draw, including the period identifier, winning number (0–9), parity size classification (Big/Small), colour array (Green, Red, Violet), block timestamp, and UTC draw time string.
            </p>
          </div>

          <div className="dev-article-body">
            <p>
              Every record in the <code>data</code> array represents a settled 30-second game round. Below is the complete field reference verified from the actual API schema:
            </p>

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

            <p>
              In addition to game records, the top-level response provides a <code>pagination</code> object (detailing <code>total</code> records, <code>totalPages</code>, and page navigation booleans) and a <code>meta</code> object containing server cache synchronization stats and rate limit metrics.
            </p>
          </div>
        </section>

        {/* ── Section: Wingo Game API Features ───────────────────────── */}
        <section className="dev-section" id="wingo-game-api-features">
          <h2 className="dev-section-title">Wingo Game API Features</h2>
          
          <div className="dev-direct-answer">
            <p>
              <strong>Direct Answer:</strong> The API provides real-time data synchronization, historical pagination up to 100 records per call, period search filtering, granular date queries, built-in rate limit telemetry headers, and strict RESTful JSON formatting.
            </p>
          </div>

          <div className="dev-features-grid">
            <div className="dev-feature-box">
              <div className="dev-feature-icon"><Icon name="activity" /></div>
              <h3>Sub-Second Synchronization</h3>
              <p>Synchronizes fresh 30-second round results into database storage immediately upon draw finalization.</p>
            </div>
            <div className="dev-feature-box">
              <div className="dev-feature-icon"><Icon name="layers" /></div>
              <h3>Structured RESTful JSON</h3>
              <p>Adheres to standard HTTP conventions and JSON specifications for universal programming language compatibility.</p>
            </div>
            <div className="dev-feature-box">
              <div className="dev-feature-icon"><Icon name="search" /></div>
              <h3>Granular Query Filtering</h3>
              <p>Filter records by exact period ID strings or query historical spans using ISO start and end date parameters.</p>
            </div>
            <div className="dev-feature-box">
              <div className="dev-feature-icon"><Icon name="shield" /></div>
              <h3>Secure Bearer Authentication</h3>
              <p>Individual SHA-256 hashed API keys ensure access control, isolation, and secure request logging.</p>
            </div>
            <div className="dev-feature-box">
              <div className="dev-feature-icon"><Icon name="zap" /></div>
              <h3>Rate Limit Telemetry</h3>
              <p>Transparent response headers (<code>X-RateLimit-Remaining</code>, <code>X-RateLimit-Reset</code>) prevent unexpected client throttling.</p>
            </div>
            <div className="dev-feature-box">
              <div className="dev-feature-icon"><Icon name="database" /></div>
              <h3>High-Capacity Pagination</h3>
              <p>Request up to 100 records per API page to perform batch data collection and historical backtesting.</p>
            </div>
          </div>
        </section>

        {/* ── Section: Wingo Game API Endpoints ──────────────────────── */}
        <section className="dev-section" id="wingo-game-api-endpoints">
          <h2 className="dev-section-title">Wingo Game API Endpoints</h2>
          
          <div className="dev-direct-answer">
            <p>
              <strong>Direct Answer:</strong> The primary public endpoint is <code>GET /api/developer/30-sec-game-history</code>, which retrieves paginated WinGo 30-second draw history with support for period searching and date filtering.
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

        {/* ── Section: Wingo Game API Request Examples ───────────────── */}
        <section className="dev-section" id="wingo-game-api-request-examples">
          <h2 className="dev-section-title">Wingo Game API Request Examples</h2>
          
          <div className="dev-direct-answer">
            <p>
              <strong>Direct Answer:</strong> Requests can be dispatched using standard HTTP libraries across any programming language by configuring the HTTP method to GET and supplying your Bearer API key in the Authorization header.
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

        {/* ── Section: Wingo Game API Response Format ────────────────── */}
        <section className="dev-section" id="wingo-game-api-response-format">
          <h2 className="dev-section-title">Wingo Game API Response Format</h2>
          
          <div className="dev-direct-answer">
            <p>
              <strong>Direct Answer:</strong> The API returns an RFC 8259 compliant JSON object containing an <code>ok</code> status boolean, an array of game draw records in <code>data</code>, pagination details in <code>pagination</code>, and server cache synchronization metadata in <code>meta</code>.
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
        </section>

        {/* ── Section: How to Integrate the Wingo Game API ───────────── */}
        <section className="dev-section" id="how-to-integrate-the-wingo-game-api">
          <h2 className="dev-section-title">How to Integrate the Wingo Game API</h2>
          
          <div className="dev-direct-answer">
            <p>
              <strong>Direct Answer:</strong> Integration involves generating your Bearer API key, setting up an HTTPS GET request with the Authorization header in your backend or serverless route, parsing the returned JSON payload, and mapping the draw fields into your application interface.
            </p>
          </div>

          <div className="dev-integration-steps">
            {INTEGRATION_STEPS.map((s) => (
              <div className="dev-integration-card" key={s.step}>
                <div className="dev-integration-num">{s.step}</div>
                <div className="dev-integration-info">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <ContentCard type="best-practice" title="Backend Proxy Integration Best Practice">
            <p>
              <strong>Security Rule:</strong> Always make API calls from your server-side environment (such as Next.js API routes, Express.js, Django, or Laravel) rather than directly from client-side browser JavaScript. Storing your API key in environment variables (e.g., <code>process.env.WINGO_API_KEY</code>) protects your credentials from exposure in client network inspectors.
            </p>
          </ContentCard>
        </section>

        {/* ── Section: What Can Developers Use the Wingo Game API For? ─ */}
        <section className="dev-section" id="what-can-developers-use-the-wingo-game-api-for">
          <h2 className="dev-section-title">What Can Developers Use the Wingo Game API For?</h2>
          
          <div className="dev-direct-answer">
            <p>
              <strong>Direct Answer:</strong> Developers use the Wingo Game API to build real-time monitoring dashboards, visual streak heatmaps, statistical research utilities, algorithmic backtesting platforms, and automated Telegram or Discord alert integrations.
            </p>
          </div>

          <div className="dev-use-cases-grid">
            <div className="dev-use-case">
              <div className="dev-use-case-icon"><Icon name="activity" /></div>
              <h3>Live Telemetry Dashboards</h3>
              <p>Display real-time WinGo 30-second draw feeds, live numbers, and rolling colour trends on custom monitoring interfaces.</p>
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
            For advanced mathematical indicators and visual calculators, explore our companion <Link href="/wingo-tool" className="dev-inline-link">Wingo Master Calculator</Link> and live <Link href="/wingosignal" className="dev-inline-link">Wingo Signal</Link> tools.
          </p>
        </section>

        {/* ── Section: Authentication and API Access ─────────────────── */}
        <section className="dev-section" id="authentication-and-api-access">
          <h2 className="dev-section-title">Authentication and API Access</h2>
          
          <div className="dev-direct-answer">
            <p>
              <strong>Direct Answer:</strong> The Wingo Game API utilizes standard HTTP Bearer token authentication. You must include your API key in the <code>Authorization</code> header of every request: <code>Authorization: Bearer ws_YOUR_API_KEY</code>.
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

        {/* ── Section: Errors and Troubleshooting ────────────────────── */}
        <section className="dev-section" id="errors-and-troubleshooting">
          <h2 className="dev-section-title">Wingo Game API Errors and Troubleshooting</h2>
          
          <div className="dev-direct-answer">
            <p>
              <strong>Direct Answer:</strong> The API returns standard HTTP status codes indicating request success or failure, along with a descriptive JSON error payload and rate limit telemetry.
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

        {/* ── Section: Wingo Game API Limitations ────────────────────── */}
        <section className="dev-section" id="wingo-game-api-limitations">
          <h2 className="dev-section-title">Wingo Game API Limitations and Responsible Use</h2>
          
          <div className="dev-direct-answer">
            <p>
              <strong>Direct Answer:</strong> The API enforces a throughput limit of 60 requests per minute per key, limits page sizes to 100 records, and is intended strictly for statistical tracking and historical analytics.
            </p>
          </div>

          <div className="dev-article-body">
            <ContentCard type="warning" title="Responsible Use & RNG Outcome Notice">
              <p>
                <strong>Statistical Scope:</strong> WinGo game outcomes are generated via server-side Random Number Generators (RNG). The Wingo Game API provides historical telemetry and settled round data for educational, visualization, and analytical research.
              </p>
              <p>
                TRION AI explicitly clarifies that past round sequences and mathematical pattern analyses do not guarantee future game outcomes. The API must never be misrepresented as a guaranteed predictive tool.
              </p>
            </ContentCard>
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
          <h2 className="dev-section-title">Frequently Asked Questions About Wingo Game API</h2>
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
