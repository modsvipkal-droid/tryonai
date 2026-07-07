import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import { PageHead } from "@/components/SEO";
import { watchAuthState, getFirebaseAuth } from "@/lib/firebase";

async function getIdToken() {
  try {
    const auth = await getFirebaseAuth();
    if (auth?.currentUser) return await auth.currentUser.getIdToken();
  } catch {}
  return null;
}

function Icon({ name, className }) {
  const icons = {
    code: (<><path d="m16 18 6-6-6-6"/><path d="M8 6l-6 6 6 6"/></>),
    key: (<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2"/><path d="M17 14v4"/></>),
    copy: (<><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></>),
    check: (<><polyline points="20 6 9 17 4 12"/></>),
    refresh: (<><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></>),
    x: (<><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>),
    arrowLeft: (<><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></>),
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
    terminal: (<><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></>),
    play: (<><polygon points="6 3 20 12 6 21 6 3"/></>),
  };
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name] || icons.code}
    </svg>
  );
}

const CODE_SNIPPETS = {
  python: {
    label: "Python",
    code: `import requests

API_KEY = "{{API_KEY}}"
BASE_URL = "https://wingo30.com"

headers = {
    "Authorization": f"Bearer {API_KEY}"
}

response = requests.get(
    f"{BASE_URL}/api/developer/30-sec-game-history",
    headers=headers,
    params={"page": 1, "limit": 20}
)

data = response.json()
print(data)`,
  },
  javascript: {
    label: "JavaScript",
    code: `const API_KEY = "{{API_KEY}}";
const BASE_URL = "https://wingo30.com";

fetch(\`\${BASE_URL}/api/developer/30-sec-game-history?page=1&limit=20\`, {
  headers: {
    Authorization: \`Bearer \${API_KEY}\`
  }
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));`,
  },
  nodejs: {
    label: "Node.js",
    code: `const https = require("https");

const API_KEY = "{{API_KEY}}";
const BASE_URL = "wingo30.com";

const options = {
  hostname: BASE_URL,
  path: "/api/developer/30-sec-game-history?page=1&limit=20",
  headers: { Authorization: \`Bearer \${API_KEY}\` }
};

https.get(options, (res) => {
  let body = "";
  res.on("data", (chunk) => (body += chunk));
  res.on("end", () => console.log(JSON.parse(body)));
});`,
  },
  php: {
    label: "PHP",
    code: `<?php

$apiKey = "{{API_KEY}}";
$baseUrl = "https://wingo30.com";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $baseUrl . "/api/developer/30-sec-game-history?page=1&limit=20");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $apiKey"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$data = json_decode($response, true);
print_r($data);
curl_close($ch);`,
  },
  nextjs: {
    label: "Next.js",
    code: `// Server-side data fetching in Next.js
export async function getServerSideProps() {
  const API_KEY = process.env.WINGO_API_KEY;
  const BASE_URL = "https://wingo30.com";

  const res = await fetch(
    \`\${BASE_URL}/api/developer/30-sec-game-history?page=1&limit=20\`,
    {
      headers: {
        Authorization: \`Bearer \${API_KEY}\`
      }
    }
  );

  const data = await res.json();

  return {
    props: { history: data }
  };
}`,
  },
  html: {
    label: "HTML",
    code: `<!DOCTYPE html>
<html>
<head>
  <title>Wingo API Example</title>
</head>
<body>
  <div id="output"></div>
  <script>
    const API_KEY = "{{API_KEY}}";

    fetch("https://wingo30.com/api/developer/30-sec-game-history?page=1&limit=10", {
      headers: { Authorization: \`Bearer \${API_KEY}\` }
    })
      .then(r => r.json())
      .then(data => {
        document.getElementById("output").textContent =
          JSON.stringify(data, null, 2);
      });
  </script>
</body>
</html>`,
  },
};

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
  return <div className="dev-skeleton" style={{ width: width || "100%", height: height || "20px" }} />;
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
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [keyData, setKeyData] = useState(null);
  const [stats, setStats] = useState(null);
  const [cacheStats, setCacheStats] = useState(null);
  const [generatedKey, setGeneratedKey] = useState(null);
  const [activeLang, setActiveLang] = useState("python");
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

  const liveRef = useRef(null);

  useEffect(() => {
    const unsub = watchAuthState((firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  const refreshToken = useCallback(async () => {
    const token = await getIdToken();
    setIdToken(token);
    return token;
  }, []);

  const fetchKeyData = useCallback(async (token) => {
    if (!token) return;
    try {
      const res = await fetch("/api/developer/key", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Failed to fetch key data: ${res.status}`);
      const data = await res.json();
      setKeyData(data.key);
      setStats(data.stats);
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
      if (!res.ok) throw new Error("Failed to generate key");
      const data = await res.json();
      setGeneratedKey(data.apiKey);
      setKeyData(data.key);
      setStats(data.stats);
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
      if (!res.ok) throw new Error("Failed to revoke key");
      const data = await res.json();
      setKeyData(null);
      setStats(data.stats);
      setGeneratedKey(null);
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
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      setHistoryData(data.data || []);
      setHistoryPagination(data.pagination);
      setHistoryMeta(data.meta);
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

  const snippetCode = (CODE_SNIPPETS[activeLang]?.code || "").replace(/\{\{API_KEY\}\}/g, keyData?.prefix ? (hasKey ? `${keyData.prefix}...${keyData.last4}` : "ws_YOUR_API_KEY_HERE") : "ws_YOUR_API_KEY_HERE");

  if (authLoading) {
    return (
      <div className="dev-page">
        <div className="dev-loading-full">
          <div className="dev-spinner" />
          <p>Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dev-page">
        <PageHead title="Developer API - TryonAI" description="TryonAI Developer API portal - build with Wingo30 real-time game data." canonical="https://wingo30.com/developer" />
        <div className="dev-loading-full">
          <Icon name="key" className="dev-big-icon" />
          <h2>Sign in to access the Developer API</h2>
          <button className="dev-btn dev-btn-primary" onClick={() => router.push("/login")}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dev-page">
      <PageHead
        title="Developer API - TryonAI"
        description="Access the TryonAI Developer API to integrate Wingo30 real-time game data into your applications. Generate API keys, view documentation, and test endpoints."
        canonical="https://wingo30.com/developer"
      />

      <header className="dev-topbar">
        <button className="dev-back-btn" onClick={() => router.push("/")} type="button" aria-label="Back to home">
          <Icon name="arrowLeft" />
        </button>
        <div className="dev-topbar-brand">
          <Icon name="code" />
          <span>Developer API</span>
        </div>
        <a href="https://wingo30.com" className="dev-topbar-link" target="_blank" rel="noopener noreferrer">wingo30.com</a>
      </header>

      <div className="dev-container">
        {error && (
          <div className="dev-alert dev-alert-error">
            <span>{error}</span>
            <button onClick={() => setError(null)} type="button" aria-label="Dismiss"><Icon name="x" /></button>
          </div>
        )}

        {generatedKey && (
          <div className="dev-alert dev-alert-success">
            <div>
              <strong>API Key generated successfully!</strong>
              <p>Copy your key now. You won't be able to see it again.</p>
              <code className="dev-key-display">{generatedKey}</code>
              <CopyButton text={generatedKey} />
            </div>
            <button onClick={() => setGeneratedKey(null)} type="button" aria-label="Dismiss"><Icon name="x" /></button>
          </div>
        )}

        <section className="dev-hero">
          <div className="dev-hero-badge">
            <span className="dev-live-badge" />
            LIVE REST API
          </div>
          <h1 className="dev-hero-title">Developer API</h1>
          <p className="dev-hero-sub">
            Integrate real-time Wingo30 game data into your applications.
            Access draw history, analyze patterns, and build powerful tools.
          </p>
          <div className="dev-hero-stats">
            <div className="dev-hero-stat">
              <Icon name="server" />
              <div>
                <strong>{cacheStats?.total?.toLocaleString() || <Skeleton width="60px" />}</strong>
                <span>Records</span>
              </div>
            </div>
            <div className="dev-hero-stat">
              <Icon name="activity" />
              <div>
                <strong>{cacheStats?.lastSyncedAt ? timeAgo(cacheStats.lastSyncedAt) : <Skeleton width="60px" />}</strong>
                <span>Last Synced</span>
              </div>
            </div>
            <div className="dev-hero-stat">
              <Icon name="zap" />
              <div>
                <strong>60/min</strong>
                <span>Rate Limit</span>
              </div>
            </div>
          </div>
        </section>

        <section className="dev-section">
          <h2 className="dev-section-title">Getting Started</h2>
          <div className="dev-steps">
            <div className="dev-step">
              <div className="dev-step-num">1</div>
              <h3>Generate API Key</h3>
              <p>Create a unique API key for your application.</p>
            </div>
            <div className="dev-step">
              <div className="dev-step-num">2</div>
              <h3>Copy Your Key</h3>
              <p>Save it securely — you won't see it again after you leave.</p>
            </div>
            <div className="dev-step">
              <div className="dev-step-num">3</div>
              <h3>Read Documentation</h3>
              <p>Understand endpoints, parameters, and response formats.</p>
            </div>
            <div className="dev-step">
              <div className="dev-step-num">4</div>
              <h3>Make Your First Request</h3>
              <p>Use the playground to test the API in real-time.</p>
            </div>
          </div>
        </section>

        <section className="dev-section">
          <div className="dev-dashboard-header">
            <h2 className="dev-section-title">API Dashboard</h2>
            <button className="dev-btn dev-btn-ghost" onClick={refreshAll} type="button" disabled={loading}>
              <Icon name="refresh" />
              Refresh
            </button>
          </div>
          <div className="dev-dashboard">
            <div className="dev-card dev-key-card">
              <div className="dev-card-header">
                <Icon name="key" />
                <span>API Key</span>
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
                <span>Usage Stats</span>
              </div>
              {loading ? (
                <div className="dev-stats-grid">
                  {[1,2,3,4].map(i => <Skeleton key={i} height="48px" />)}
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
                <p className="dev-empty-text">No usage data yet</p>
              )}
            </div>
          </div>
        </section>

        <section className="dev-section">
          <h2 className="dev-section-title">Code Examples</h2>
          <div className="dev-code-block">
            <div className="dev-code-tabs">
              {Object.entries(CODE_SNIPPETS).map(([key, lang]) => (
                <button
                  key={key}
                  className={`dev-code-tab ${activeLang === key ? "active" : ""}`}
                  onClick={() => setActiveLang(key)}
                  type="button"
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

        <section className="dev-section">
          <div className="dev-dashboard-header">
            <h2 className="dev-section-title">
              Live Database Browser
              <span className="dev-live-badge dev-live-badge-sm" />
            </h2>
          </div>
          <div className="dev-db-browser" ref={liveRef}>
            <div className="dev-db-controls">
              <div className="dev-db-search">
                <Icon name="search" />
                <input
                  type="text"
                  placeholder="Search by period..."
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
                {historyLoading ? "..." : "Filter"}
              </button>
            </div>
            {historyError && <div className="dev-alert dev-alert-error">{historyError}</div>}
            <div className="dev-db-table-wrap">
              {historyLoading ? (
                <div className="dev-loading-inline">
                  <div className="dev-spinner-sm" />
                  <span>Loading records...</span>
                </div>
              ) : historyData.length === 0 ? (
                <div className="dev-empty-state">
                  <Icon name="server" />
                  <p>No records found. Generate an API key and make a request to populate the database.</p>
                </div>
              ) : (
                <table className="dev-db-table">
                  <thead>
                    <tr>
                      <th>Period</th>
                      <th>Number</th>
                      <th>Size</th>
                      <th>Color</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyData.map((row, i) => (
                      <tr key={row.period || i}>
                        <td className="dev-cell-period">{row.period || "--"}</td>
                        <td>
                          <span className={`dev-number-badge dev-color-${(row.color || "").toLowerCase()}`}>
                            {row.number ?? "--"}
                          </span>
                        </td>
                        <td>{row.size || "--"}</td>
                        <td>
                          <span className={`dev-color-dot dev-color-${(row.color || "").toLowerCase()}`}>
                            {row.color || "--"}
                          </span>
                        </td>
                        <td className="dev-cell-time">{formatTime(row.timestamp || row.createdAt)}</td>
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

        <section className="dev-section">
          <h2 className="dev-section-title">API Documentation</h2>
          <div className="dev-docs">
            <div className="dev-doc-card">
              <h3>Base URL</h3>
              <code className="dev-doc-code">https://wingo30.com</code>
            </div>
            <div className="dev-doc-card">
              <h3>Authentication</h3>
              <p>All API requests require a Bearer token in the Authorization header.</p>
              <code className="dev-doc-code">Authorization: Bearer ws_YOUR_API_KEY</code>
            </div>
            <div className="dev-doc-card">
              <h3>Endpoints</h3>
              <div className="dev-endpoint">
                <span className="dev-method dev-method-get">GET</span>
                <code>/api/developer/30-sec-game-history</code>
              </div>
              <div className="dev-params">
                <h4>Query Parameters</h4>
                <table className="dev-params-table">
                  <thead>
                    <tr><th>Param</th><th>Type</th><th>Default</th><th>Description</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><code>page</code></td><td>integer</td><td>1</td><td>Page number</td></tr>
                    <tr><td><code>limit</code></td><td>integer</td><td>50</td><td>Records per page (max 100)</td></tr>
                    <tr><td><code>period</code></td><td>string</td><td>-</td><td>Search by period number</td></tr>
                    <tr><td><code>startDate</code></td><td>string</td><td>-</td><td>Filter from date (YYYY-MM-DD)</td></tr>
                    <tr><td><code>endDate</code></td><td>string</td><td>-</td><td>Filter to date (YYYY-MM-DD)</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="dev-doc-card">
              <h3>Success Response</h3>
              <pre className="dev-doc-pre">{JSON.stringify({
                ok: true,
                endpoint: "/api/developer/30-sec-game-history",
                data: [{ period: "20250321-1234", number: 5, size: "Big", color: "Green", timestamp: "2025-03-21T12:34:00Z" }],
                pagination: { page: 1, limit: 50, total: 15234, totalPages: 305 },
                meta: {
                  baseUrl: "https://wingo30.com",
                  cache: { syncedAt: "2025-03-21T12:34:00Z", inserted: 0, matched: 50, syncError: null },
                  rateLimit: { limit: 60, remaining: 59, resetAt: "2025-03-21T12:35:00Z" },
                },
              }, null, 2)}</pre>
            </div>
            <div className="dev-doc-card">
              <h3>Error Codes</h3>
              <table className="dev-params-table">
                <thead><tr><th>Code</th><th>Description</th></tr></thead>
                <tbody>
                  <tr><td><code>401</code></td><td>Missing or invalid API key</td></tr>
                  <tr><td><code>426</code></td><td>HTTPS required in production</td></tr>
                  <tr><td><code>429</code></td><td>Rate limit exceeded (60 req/min)</td></tr>
                  <tr><td><code>405</code></td><td>Method not allowed</td></tr>
                  <tr><td><code>503</code></td><td>Service unavailable (MongoDB)</td></tr>
                </tbody>
              </table>
            </div>
            <div className="dev-doc-card">
              <h3>Rate Limiting</h3>
              <p>60 requests per minute per API key. Response headers include current rate limit status:</p>
              <ul className="dev-doc-list">
                <li><code>X-RateLimit-Limit</code> — Max requests per window</li>
                <li><code>X-RateLimit-Remaining</code> — Requests left in current window</li>
                <li><code>X-RateLimit-Reset</code> — When the window resets (ISO 8601)</li>
                <li><code>Retry-After</code> — Seconds to wait when rate limited</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="dev-section">
          <h2 className="dev-section-title">API Playground</h2>
          <div className="dev-playground">
            <div className="dev-playground-form">
              <div className="dev-playground-field">
                <label>API Key</label>
                <input
                  type="text"
                  placeholder="ws_your_api_key_here"
                  value={playgroundKey}
                  onChange={(e) => setPlaygroundKey(e.target.value)}
                />
              </div>
              <div className="dev-playground-field">
                <label>Endpoint</label>
                <select value={playgroundEndpoint} onChange={(e) => setPlaygroundEndpoint(e.target.value)}>
                  <option value="30-sec-game-history">30-sec-game-history</option>
                </select>
              </div>
              <button className="dev-btn dev-btn-primary" onClick={handlePlaygroundSend} type="button" disabled={playgroundLoading || !playgroundKey}>
                {playgroundLoading ? (
                  <><div className="dev-spinner-sm" /> Sending...</>
                ) : (
                  <><Icon name="play" /> Send Request</>
                )}
              </button>
            </div>
            {playgroundResponse && (
              <div className="dev-playground-response">
                <div className="dev-response-meta">
                  <div className={`dev-status-badge dev-status-${playgroundResponse.status >= 200 && playgroundResponse.status < 300 ? "success" : playgroundResponse.status === 429 ? "warning" : "error"}`}>
                    {playgroundResponse.status || "ERR"}
                  </div>
                  <span className="dev-latency">{playgroundResponse.latency}ms</span>
                  {playgroundResponse.headers["x-ratelimit-remaining"] && (
                    <span className="dev-rate-info">Remaining: {playgroundResponse.headers["x-ratelimit-remaining"]}/{playgroundResponse.headers["x-ratelimit-limit"]}</span>
                  )}
                </div>
                <pre className="dev-response-body">{JSON.stringify(playgroundResponse.body, null, 2)}</pre>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
