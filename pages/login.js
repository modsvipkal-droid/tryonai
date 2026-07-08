import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Turnstile } from "@marsidev/react-turnstile";
import { signInWithGoogle, watchAuthState } from "@/lib/firebase";
import { PageHead, OrganizationSchema, WebsiteSchema, WebPageSchema, BreadcrumbSchema } from "@/components/SEO";

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

function SplashScreen({ onComplete }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 2500);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="auth-splash">
      <div className="splash-bg" />
      <div className="splash-content">
        <div className="splash-logo-wrap">
          <div className="splash-logo-glow" />
          <div className="splash-logo">
            <svg viewBox="0 0 40 40" fill="none">
              <rect x="2" y="2" width="36" height="36" rx="8" fill="#22c55e" />
              <path d="M12 20h6l2-6 4 12 2-6h4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <h1 className="splash-title">TryonAI</h1>
        <p className="splash-sub">Premium Trading Signals</p>
        <div className="splash-loader">
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, label }) {
  return (
    <div className="sheet-feature">
      <span className="sheet-feature-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {icon}
        </svg>
      </span>
      <span>{label}</span>
    </div>
  );
}

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
        <button className="sheet-handle" type="button" onClick={onClose} aria-label="Close">
          <span />
        </button>

        <div className="sheet-body">
          <h2 className="sheet-title">Welcome back</h2>
          <p className="sheet-sub">Sign in to TryonAI platform</p>

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
            <span>I agree to Terms & Privacy Policy</span>
          </label>

          <button className="gu-btn" type="button" onClick={() => onGoogleLogin(turnstileToken)} disabled={loading || !agreed || !turnstileToken}>
            <div className="gu-btn-inner">
              <div className="gu-btn-content">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 64 64" height="32" width="24">
                  <g fill="none" fillRule="evenodd" strokeWidth="1" stroke="none">
                    <g fillRule="nonzero" transform="translate(3.000000, 2.000000)">
                      <path fill="#4285F4" d="M57.8123233,30.1515267 C57.8123233,27.7263183 57.6155321,25.9565533 57.1896408,24.1212666 L29.4960833,24.1212666 L29.4960833,35.0674653 L45.7515771,35.0674653 C45.4239683,37.7877475 43.6542033,41.8844383 39.7213169,44.6372555 L39.6661883,45.0037254 L48.4223791,51.7870338 L49.0290201,51.8475849 C54.6004021,46.7020943 57.8123233,39.1313952 57.8123233,30.1515267" />
                      <path fill="#34A853" d="M29.4960833,58.9921667 C37.4599129,58.9921667 44.1456164,56.3701671 49.0290201,51.8475849 L39.7213169,44.6372555 C37.2305867,46.3742596 33.887622,47.5868638 29.4960833,47.5868638 C21.6960582,47.5868638 15.0758763,42.4415991 12.7159637,35.3297782 L12.3700541,35.3591501 L3.26524241,42.4054492 L3.14617358,42.736447 C7.9965904,52.3717589 17.959737,58.9921667 29.4960833,58.9921667" />
                      <path fill="#FBBC05" d="M12.7159637,35.3297782 C12.0932812,33.4944915 11.7329116,31.5279353 11.7329116,29.4960833 C11.7329116,27.4640054 12.0932812,25.4976752 12.6832029,23.6623884 L12.6667095,23.2715173 L3.44779955,16.1120237 L3.14617358,16.2554937 C1.14708246,20.2539019 0,24.7439491 0,29.4960833 C0,34.2482175 1.14708246,38.7380388 3.14617358,42.736447 L12.7159637,35.3297782" />
                      <path fill="#EB4335" d="M29.4960833,11.4050769 C35.0347044,11.4050769 38.7707997,13.7975244 40.9011602,15.7968415 L49.2255853,7.66898166 C44.1130815,2.91684746 37.4599129,0 29.4960833,0 C17.959737,0 7.9965904,6.62018183 3.14617358,16.2554937 L12.6832029,23.6623884 C15.0758763,16.5505675 21.6960582,11.4050769 29.4960833,11.4050769" />
                    </g>
                  </g>
                </svg>
                <span>{loading ? "Signing in..." : "Sign In with Google"}</span>
              </div>
            </div>
          </button>

          <p className="sheet-oauth-note">Secured by Google OAuth. We never store passwords.</p>

          {error && (
            <div className="auth-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h0"/></svg>
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  const router = useRouter();
  const [step, setStep] = useState("splash");
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    let active = true;
    let unsub = () => {};

    watchAuthState((user) => {
      if (!active) return;
      if (user) { router.replace("/"); return; }
      setChecking(false);
    }).then((fn) => { unsub = fn; }).catch(() => { if (active) setChecking(false); });

    return () => { active = false; unsub(); };
  }, [router]);

  const handleSplashComplete = useCallback(() => {
    if (checking) return;
    setStep("login");
  }, [checking]);

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

  if (checking) {
    return (
      <main className="login-page">
        <div className="background" />
        <div className="auth-checking">
          <div className="auth-checking-spinner" />
          <p>Checking login...</p>
        </div>
      </main>
    );
  }

  if (step === "splash") {
    return (
      <main className="login-page">
        <div className="background" />
        <SplashScreen onComplete={handleSplashComplete} />
      </main>
    );
  }

  return (
    <>
      <PageHead
        title="Sign In"
        description="Sign in to TryonAI to access AI-powered Wingo30 predictions, real-time pattern analysis, smart trading signals, and live analytics dashboard."
        canonical="https://wingo30.com/login"
      >
        <meta name="keywords" content="Wingo AI login, TryonAI login, Wingo30 sign in, AI prediction login, trading platform, Wingo prediction access, Kal mods, wingo vip, wingo analyst, wingo app, trionAI, wingo colour prediction, AI wingo prediction, wingo ai prediction app" />
      </PageHead>
      <OrganizationSchema />
      <WebsiteSchema />
      <WebPageSchema title="Sign In | TryonAI" description="Sign in to TryonAI for AI-powered Wingo30 predictions." url="https://wingo30.com/login" />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://wingo30.com/" },
        { name: "Sign In", url: "https://wingo30.com/login" }
      ]} />
      <main className="login-page">
        <div className="background" />
        <div className="login-hero-image" style={{ backgroundImage: 'url(/Loginbg.jpg)' }} />

        <div className="login-bg-shapes" aria-hidden="true">
          <svg className="l-shape l-shape-1" viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" fill="none" stroke="rgba(21,39,254,0.07)" strokeWidth="1" /><circle cx="60" cy="60" r="30" fill="none" stroke="rgba(140,158,255,0.06)" strokeWidth="0.5" /><circle cx="60" cy="60" r="12" fill="rgba(21,39,254,0.04)" /></svg>
          <svg className="l-shape l-shape-2" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="rgba(21,39,254,0.06)" strokeWidth="0.7" fill="none" /></svg>
          <svg className="l-shape l-shape-3" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke="rgba(140,158,255,0.06)" strokeWidth="0.7" fill="none" /><path d="M9 12l2 2 4-4" stroke="rgba(21,39,254,0.06)" strokeWidth="0.7" fill="none" /></svg>
          <svg className="l-shape l-shape-4" viewBox="0 0 24 24"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9" stroke="rgba(21,39,254,0.05)" strokeWidth="0.7" fill="none" /></svg>
          <svg className="l-shape l-shape-5" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m8 4l8-4m-8 4v10" stroke="rgba(140,158,255,0.06)" strokeWidth="0.7" fill="none" /></svg>
        </div>

        <span className="login-blob blob-tl" />
        <span className="login-blob blob-tr" />
        <span className="login-blob blob-bl" />
        <span className="login-blob blob-br" />
        <span className="login-dots dots-tl" />
        <span className="login-dots dots-tr" />
        <span className="login-dots dots-bl" />
        <span className="login-dots dots-br" />

        <div className="login-content-area">
          <h1 className="login-heading">Welcome Back</h1>
          <p className="login-subhead">Sign in securely with your Google account</p>

          <div className="login-features">
            <div className="login-feature">
              <div className="login-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div className="login-feature-text">
                <strong>Secure Access</strong>
                <span>Your data is protected with top security</span>
              </div>
            </div>
            <div className="login-feature">
              <div className="login-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <div className="login-feature-text">
                <strong>Quick & Easy Login</strong>
                <span>In just one click and get started</span>
              </div>
            </div>
            <div className="login-feature">
              <div className="login-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <div className="login-feature-text">
                <strong>Personalized</strong>
                <span>A tailored experience just for you</span>
              </div>
            </div>
          </div>

          <button className="login-btn" type="button" onClick={() => { setError(""); setSheetOpen(true); }}>
            <div className="login-btn-inner">
              <div className="login-btn-blob" aria-hidden="true">
                <svg id="visual" viewBox="0 0 960 540" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1">
                  <defs>
                    <linearGradient id="grad1_0" x1="43.8%" y1="0%" x2="100%" y2="100%">
                      <stop offset="14.444444444444446%" stopColor="#ffffff" stopOpacity="1" />
                      <stop offset="85.55555555555554%" stopColor="#ffffff" stopOpacity="1" />
                    </linearGradient>
                    <linearGradient id="grad2_0" x1="0%" y1="0%" x2="56.3%" y2="100%">
                      <stop offset="14.444444444444446%" stopColor="#ffffff" stopOpacity="1" />
                      <stop offset="85.55555555555554%" stopColor="#ffffff" stopOpacity="1" />
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
              <div className="login-btn-arrow">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
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
