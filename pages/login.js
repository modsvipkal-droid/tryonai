import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Turnstile } from "@marsidev/react-turnstile";
import { signInWithGoogle, watchAuthState, signOutUser } from "@/lib/firebase";
import {
  PageHead,
  OrganizationSchema,
  WebsiteSchema,
  WebPageSchema,
  BreadcrumbSchema,
  FAQSchema,
} from "@/components/SEO";

// ── SVG Icons ─────────────────────────────────────────────────────────────────
function GoogleMark() {
  return (
    <svg className="google-mark" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.24 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.98 10.98 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.12-1.44.34-2.1V7.06H2.18A10.98 10.98 0 0 0 1 12c0 1.77.42 3.45 1.18 4.94l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A10.98 10.98 0 0 0 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38Z" />
    </svg>
  );
}

const IconExternalLink = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "inline-block", verticalAlign: "middle", marginLeft: "4px" }}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const IconChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

function FeatureItem({ icon, label }) {
  return (
    <div className="sheet-feature">
      <span className="sheet-feature-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {icon}
        </svg>
      </span>
      <span>{label}</span>
    </div>
  );
}

// ── Login Help FAQ Data (Synchronized with FAQSchema) ─────────────────────────
const LOGIN_FAQS = [
  {
    question: "How do I sign in to TRION AI?",
    answer: "Click the Login button, complete the quick Cloudflare Turnstile bot verification check, and authenticate securely using your Google account. TRION AI uses passwordless Google OAuth."
  },
  {
    question: "Is my TRION AI login secure?",
    answer: "Yes. TRION AI utilizes Google OAuth 2.0 and Firebase Authentication. We never see, process, or store your Google password."
  },
  {
    question: "Why is my account blocked?",
    answer: "Accounts may be restricted due to repeated security triggers or checkout abuse. If you believe your account was blocked in error, contact TRION AI support on Telegram."
  },
  {
    question: "Can I access predictions without signing in?",
    answer: "Public guides and educational resources are freely accessible, but real-time prediction dashboards and live signals require signing in to your TRION AI account."
  }
];

// ── Page-Scoped Styles for Informational Sections ─────────────────────────────
const loginExtraStyles = `
  .login-info-section {
    width: 100%;
    max-width: 440px;
    margin: 24px auto 0;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .login-info-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 18px 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  }
  .login-info-card h2 {
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 8px;
    letter-spacing: -0.01em;
  }
  .login-info-card p {
    font-size: 13.5px;
    color: #475569;
    line-height: 1.6;
    margin: 0 0 10px;
  }
  .login-info-card p:last-child {
    margin-bottom: 0;
  }
  .login-checklist {
    list-style: none;
    padding: 0;
    margin: 10px 0 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .login-checklist li {
    font-size: 13px;
    color: #334155;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    line-height: 1.5;
  }
  .login-check-dot {
    color: #00985b;
    font-weight: 800;
    flex-shrink: 0;
  }
  .login-ext-link {
    color: #008751;
    text-decoration: underline;
    text-underline-offset: 3px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
  }
  .login-ext-link:hover {
    color: #006038;
  }
  .login-nav-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
  }
  .login-nav-tag {
    font-size: 12px;
    font-weight: 600;
    color: #008751;
    background: #f0fbf5;
    border: 1px solid #d1eedf;
    padding: 5px 10px;
    border-radius: 8px;
    text-decoration: none;
    transition: all 0.15s ease;
  }
  .login-nav-tag:hover {
    background: #e0f4ea;
    color: #006038;
    transform: translateY(-1px);
  }
  .login-faq-item {
    border-bottom: 1px solid #f1f5f9;
    padding: 10px 0;
  }
  .login-faq-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  .login-faq-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    text-align: left;
    font-size: 13.5px;
    font-weight: 600;
    color: #0f172a;
    gap: 8px;
  }
  .login-faq-btn:focus-visible {
    outline: 2px solid #00985b;
    outline-offset: 2px;
  }
  .login-faq-ans {
    font-size: 13px;
    color: #475569;
    line-height: 1.55;
    margin: 6px 0 0;
  }
  .login-faq-icon {
    flex-shrink: 0;
    color: #64748b;
    transition: transform 0.2s ease;
  }
  .login-faq-icon.open {
    transform: rotate(180deg);
    color: #00985b;
  }
`;

function BottomSheet({ open, onClose, onGoogleLogin, loading, error }) {
  const [agreed, setAgreed] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAgreed(false);
    setTurnstileToken(null);
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet-modal" onClick={(e) => e.stopPropagation()}>
        <button className="sheet-handle" type="button" onClick={onClose} aria-label="Close modal">
          <span />
        </button>

        <div className="sheet-body">
          {/* Semantic non-heading element to avoid heading pollution */}
          <div className="sheet-title">Welcome back</div>
          <p className="sheet-sub">Sign in to TRION AI platform</p>

          <div className="sheet-features">
            <FeatureItem icon={<><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></>} label="Live Predictions" />
            <FeatureItem icon={<><path d="M3 3v18h18" /><path d="M7 16l4-8 4 4 4-6" /></>} label="Game History" />
            <FeatureItem icon={<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>} label="Secure Access" />
          </div>

          <div className="turnstile-wrap">
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              onSuccess={setTurnstileToken}
              onExpire={() => setTurnstileToken(null)}
              onError={() => { setTurnstileToken(null); setError("Bot check failed. Please refresh and try again."); }}
              scriptLoading="async"
              options={{ theme: "light" }}
            />
          </div>

          <label className="agree-toggle">
            <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} />
            <span className="agree-check" />
            <span>I agree to Terms &amp; Privacy Policy</span>
          </label>

          <button
            className="gu-btn"
            type="button"
            onClick={() => onGoogleLogin(turnstileToken)}
            disabled={loading || !agreed || !turnstileToken}
            aria-label="Sign In with Google"
          >
            <div className="gu-btn-inner">
              <div className="gu-btn-content">
                <GoogleMark />
                <span>{loading ? "Signing in..." : "Sign In with Google"}</span>
              </div>
            </div>
          </button>

          <p className="sheet-oauth-note">Secured by Google OAuth. We never store passwords.</p>

          {error && (
            <div className="auth-error" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h0"/></svg>
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const BLOCKED_ACCOUNT_MESSAGE =
  "Your account has been blocked due to repeated subscription page visits without a purchase. Please contact support if you believe this was a mistake.";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  useEffect(() => {
    // Arriving from an enforced block (subscription abuse) shows a clear notice.
    if (router.query.blocked) {
      setNotice(BLOCKED_ACCOUNT_MESSAGE);
      router.replace("/login", undefined, { shallow: true }).catch(() => {});
    }
  }, [router]);

  useEffect(() => {
    document.documentElement.classList.add("login-page");
    return () => {
      document.documentElement.classList.remove("login-page");
    };
  }, []);

  useEffect(() => {
    let active = true;
    let unsub = () => {};

    watchAuthState((user) => {
      if (!active) return;
      if (user) { router.replace("/"); }
    }).then((fn) => { unsub = fn; }).catch(() => {});

    return () => { active = false; unsub(); };
  }, [router]);

  async function handleGoogleLogin(turnstileToken) {
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      const verifyRes = await fetch("/api/verify-turnstile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: turnstileToken }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        setError("Bot verification failed. Please try again.");
        setLoading(false);
        return;
      }

      setSheetOpen(false);
      await new Promise((r) => setTimeout(r, 400));

      await signInWithGoogle();
      router.replace("/");
    } catch (err) {
      const msg = err?.message || "";
      const code = err?.code || "";
      if (code.includes("account-blocked")) {
        setError(BLOCKED_ACCOUNT_MESSAGE);
        // Clear any Firebase session the blocked account may still hold.
        try { await signOutUser(); } catch {}
        setLoading(false);
        return;
      }
      if (msg.includes("timed out")) {
        setError("Sign-in took too long. Please try again.");
      } else if (code.includes("network")) {
        setError("Network error. Check your connection.");
      } else if (msg.includes("cancelled") || msg.includes("user closed")) {
        setError("Sign-in cancelled.");
      } else {
        setError("Sign-in failed. Try again.");
      }
      setLoading(false);
    }
  }

  const PAGE_URL = "https://wingo30.com/login";
  const PAGE_TITLE = "TRION AI Login – Sign In to Your Account";
  const PAGE_DESC =
    "Sign in to your TRION AI account to access live Wingo predictions, real-time pattern analysis, and your personalized analytics dashboard.";

  return (
    <>
      {/* ── SEO Head ─────────────────────────────────────────────────────── */}
      <PageHead
        title={PAGE_TITLE}
        description={PAGE_DESC}
        canonical={PAGE_URL}
      >
        <style dangerouslySetInnerHTML={{ __html: loginExtraStyles }} />
      </PageHead>

      {/* ── Connected Structured Data Schemas ─────────────────────────────── */}
      <OrganizationSchema />
      <WebsiteSchema />
      <WebPageSchema
        title={PAGE_TITLE}
        description={PAGE_DESC}
        url={PAGE_URL}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wingo30.com/" },
          { name: "Sign In", url: PAGE_URL }
        ]}
      />
      <FAQSchema questions={LOGIN_FAQS} />

      {/* ── Main Authentication Interface ─────────────────────────────────── */}
      <main className="login-page">
        <div className="background" />
        <div className="login-hero-image" style={{ backgroundImage: "url(/Loginbg.jpg)" }} aria-label="TRION AI account sign in background" />

        <div className="login-bg-shapes" aria-hidden="true">
          <svg className="l-shape l-shape-1" viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" fill="none" stroke="rgba(21,39,254,0.07)" strokeWidth="1" /><circle cx="60" cy="60" r="30" fill="none" stroke="rgba(140,158,255,0.06)" strokeWidth="0.5" /><circle cx="60" cy="60" r="12" fill="rgba(21,39,254,0.04)" /></svg>
          <svg className="l-shape l-shape-2" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="rgba(21,39,254,0.06)" strokeWidth="0.7" fill="none" /></svg>
          <svg className="l-shape l-shape-3" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke="rgba(140,158,255,0.06)" strokeWidth="0.7" fill="none" /><path d="M9 12l2 2 4-4" stroke="rgba(21,39,254,0.06)" strokeWidth="0.7" fill="none" /></svg>
          <svg className="l-shape l-shape-4" viewBox="0 0 24 24"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9" stroke="rgba(21,39,254,0.05)" strokeWidth="0.7" fill="none" /></svg>
          <svg className="l-shape l-shape-5" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m8 4l8-4m-8 4v10" stroke="rgba(140,158,255,0.06)" strokeWidth="0.7" fill="none" /></svg>
        </div>

        <span className="login-blob blob-tl" aria-hidden="true" />
        <span className="login-blob blob-tr" aria-hidden="true" />
        <span className="login-blob blob-bl" aria-hidden="true" />
        <span className="login-blob blob-br" aria-hidden="true" />
        <span className="login-dots dots-tl" aria-hidden="true" />
        <span className="login-dots dots-tr" aria-hidden="true" />
        <span className="login-dots dots-bl" aria-hidden="true" />
        <span className="login-dots dots-br" aria-hidden="true" />

        <div className="login-content-area">
          {notice && (
            <div className="auth-error" role="alert" style={{ marginBottom: 16 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h0"/></svg>
              <span>{notice}</span>
            </div>
          )}

          {/* Exactly One H1 on the Page */}
          <h1 className="login-heading">Sign In to Your TRION AI Account</h1>
          <p className="login-subhead">Sign in securely to access live Wingo predictions, pattern analysis, and tools.</p>

          <div className="login-features">
            <div className="login-feature">
              <div className="login-feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div className="login-feature-text">
                <strong>Secure Access</strong>
                <span>Protected with Google OAuth 2.0 security</span>
              </div>
            </div>
            <div className="login-feature">
              <div className="login-feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <div className="login-feature-text">
                <strong>Quick &amp; Easy Sign In</strong>
                <span>One-click authentication without password friction</span>
              </div>
            </div>
            <div className="login-feature">
              <div className="login-feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <div className="login-feature-text">
                <strong>Live Predictions</strong>
                <span>Real-time access to 30s, 1Min, and 3Min signals</span>
              </div>
            </div>
          </div>

          <button
            className="login-btn"
            type="button"
            onClick={() => { setError(""); setSheetOpen(true); }}
            aria-label="Open sign in with Google dialog"
          >
            <div className="login-btn-inner">
              <div className="login-btn-blob" aria-hidden="true">
                <svg id="visual" viewBox="0 0 960 540" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <defs>
                    <linearGradient id="grad1_0" x1="43.8%" y1="0%" x2="100%" y2="100%">
                      <stop offset="14.4%" stopColor="#ffffff" stopOpacity="1" />
                      <stop offset="85.6%" stopColor="#ffffff" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  <g transform="translate(960, 0)">
                    <path d="M0 351C-50.9 351.5 -101.8 352.1 -134.3 324.3C-166.9 296.5 -181.2 240.4 -202.9 202.9C-224.7 165.5 -254 146.7 -279.9 116C-305.9 85.2 -328.4 42.6 -351 0L0 0Z" fill="#3238f8" />
                  </g>
                  <g transform="translate(0, 540)">
                    <path d="M0 -351C36.6 -320.4 73.3 -289.8 113.3 -273.5C153.3 -257.1 196.6 -254.9 234.8 -234.8C272.9 -214.6 305.8 -176.4 324.3 -134.3C342.8 -92.2 346.9 -46.1 351 0L0 0Z" fill="#3238f8" />
                  </g>
                </svg>
              </div>
              <span className="login-btn-text">Login</span>
              <div className="login-btn-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>

          {/* ── AEO Informational Sections (Clean Semantic Hierarchy) ────────── */}
          <div className="login-info-section">

            {/* Section 1: Why Sign In */}
            <section className="login-info-card">
              <h2>Why Sign In to TRION AI?</h2>
              <p>
                Signing in unlocks real-time Wingo draw signals, automated Big/Small sequence analysis across 30-second and 1-minute modes, and historical pattern indicators. Your authenticated session keeps your active model preferences synchronized securely across visits.
              </p>
            </section>

            {/* Section 2: Need Help Signing In (AEO Direct Answer) */}
            <section className="login-info-card">
              <h2>Need Help Signing In?</h2>
              <p>
                If you are having trouble signing in, check your internet connection and ensure your browser allows Google OAuth pop-ups. For blocked accounts or persistent login errors, contact TRION AI customer support.
              </p>

              <ul className="login-checklist">
                <li>
                  <span className="login-check-dot" aria-hidden="true">•</span>
                  <span>Ensure your browser allows Google sign-in pop-up windows.</span>
                </li>
                <li>
                  <span className="login-check-dot" aria-hidden="true">•</span>
                  <span>Complete the quick Turnstile bot verification check.</span>
                </li>
                <li>
                  <span className="login-check-dot" aria-hidden="true">•</span>
                  <span>
                    Review official security standards on{" "}
                    <a
                      href="https://developers.google.com/identity/protocols/oauth2"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="login-ext-link"
                    >
                      Google OAuth 2.0 Security<IconExternalLink />
                    </a>.
                  </span>
                </li>
                <li>
                  <span className="login-check-dot" aria-hidden="true">•</span>
                  <span>Contact support on Telegram if you encounter account lockouts.</span>
                </li>
              </ul>
            </section>

            {/* Section 3: Frequently Asked Login Questions (Visible Accordion) */}
            <section className="login-info-card" aria-label="Login FAQs">
              <h2>Frequently Asked Login Questions</h2>
              <div>
                {LOGIN_FAQS.map((item, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div className="login-faq-item" key={item.question}>
                      <button
                        className="login-faq-btn"
                        type="button"
                        onClick={() => toggleFaq(idx)}
                        aria-expanded={isOpen}
                      >
                        <span>{item.question}</span>
                        <span className={`login-faq-icon ${isOpen ? "open" : ""}`} aria-hidden="true">
                          <IconChevronDown />
                        </span>
                      </button>
                      {isOpen && <p className="login-faq-ans">{item.answer}</p>}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section 4: Contextual Internal Links */}
            <section className="login-info-card">
              <h2>Explore TRION AI Platform</h2>
              <p>Looking for prediction tools, strategies, or support?</p>
              <div className="login-nav-tags">
                <Link href="/wingo-ai-prediction" className="login-nav-tag">
                  Wingo AI Prediction
                </Link>
                <Link href="/wingo30" className="login-nav-tag">
                  Wingo 30 Engine
                </Link>
                <Link href="/subscription" className="login-nav-tag">
                  Plans &amp; Models
                </Link>
                <Link href="/contact" className="login-nav-tag">
                  Contact Support
                </Link>
                <Link href="/privacy" className="login-nav-tag">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="login-nav-tag">
                  Terms of Service
                </Link>
              </div>
            </section>

          </div>
        </div>

        <BottomSheet
          open={sheetOpen}
          onClose={() => { setSheetOpen(false); setError(""); }}
          onGoogleLogin={handleGoogleLogin}
          loading={loading}
          error={error}
        />
      </main>
    </>
  );
}
