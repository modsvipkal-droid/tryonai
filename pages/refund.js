import { useEffect } from "react";
import { useRouter } from "next/router";
import { PageHead, BreadcrumbSchema } from "@/components/SEO";

const legalStyles = `
  @font-face {
    font-family: 'TrionAI';
    src: url('/fonts/trionAIofficial.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
  *, *::before, *::after { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  html, body {
    background: #eef7f3 !important;
    color: #17251f !important;
    font-family: 'TrionAI', 'Inter', sans-serif;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    margin: 0; padding: 0;
    min-height: 100vh;
    height: auto !important;
  }
  #__next {
    height: auto !important;
    min-height: 100% !important;
    overflow: visible !important;
    overflow-y: auto !important;
  }
  body { -webkit-font-smoothing: antialiased; }

  .legal-page {
    min-height: 100vh;
    width: 100%;
    background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 40%, #ecfdf5 100%);
    padding: 0 0 70px 0;
    position: relative;
    overflow: visible;
  }
  .legal-page::before {
    content: '';
    position: fixed;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(ellipse at 25% 25%, rgba(0,152,91,0.06) 0%, transparent 50%),
                radial-gradient(ellipse at 75% 75%, rgba(16,185,129,0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
  .orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.2;
    pointer-events: none;
    z-index: 0;
    animation: floatOrb 14s ease-in-out infinite alternate;
  }
  .orb-1 { width: 350px; height: 350px; background: #00985b; top: -80px; right: -80px; animation-delay: 0s; }
  .orb-2 { width: 280px; height: 280px; background: #10b981; bottom: 80px; left: -60px; animation-delay: -5s; }
  @keyframes floatOrb {
    from { transform: translate(0, 0) scale(1); }
    to { transform: translate(25px, 35px) scale(1.08); }
  }

  .legal-nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(0,152,91,0.15);
    padding: 16px 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 2px 12px rgba(0,75,47,0.04);
  }
  .legal-nav-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #007543;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    background: rgba(0,152,91,0.08);
    border: 1px solid rgba(0,152,91,0.25);
    padding: 8px 18px;
    border-radius: 50px;
    outline: none;
    transition: all 0.25s ease;
    font-family: 'TrionAI', 'Inter', sans-serif;
  }
  .legal-nav-back:hover {
    background: #00985b;
    border-color: #00985b;
    color: #ffffff;
    transform: translateX(-2px);
    box-shadow: 0 4px 14px rgba(0,152,91,0.25);
  }
  .legal-nav-title {
    font-size: 12px;
    font-weight: 700;
    color: #005537;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .legal-container {
    max-width: 800px;
    margin: 40px auto 0;
    padding: 0 20px;
    position: relative;
    z-index: 1;
    animation: fadeSlideUp 0.6s ease both;
  }
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .legal-hero {
    text-align: center;
    margin-bottom: 40px;
  }
  .legal-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(0,152,91,0.1);
    border: 1px solid rgba(0,152,91,0.25);
    color: #007543;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 6px 16px;
    border-radius: 50px;
    margin-bottom: 16px;
  }
  .legal-hero h1 {
    font-size: clamp(28px, 5vw, 42px);
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 12px 0;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }
  .legal-hero h1 span { color: #00985b; }
  .legal-meta {
    font-size: 13px;
    color: #64748b;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-weight: 500;
  }
  .legal-meta-dot { width: 4px; height: 4px; background: #94a3b8; border-radius: 50%; }

  .legal-card {
    background: #ffffff;
    border: 1px solid rgba(0,152,91,0.16);
    border-radius: 20px;
    padding: 32px 36px;
    margin-bottom: 20px;
    box-shadow: 0 8px 24px rgba(0,75,47,0.05), 0 1px 3px rgba(0,0,0,0.02);
    transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
    animation: fadeSlideUp 0.6s ease both;
  }
  .legal-card:hover {
    border-color: rgba(0,152,91,0.36);
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(0,75,47,0.08);
  }
  .legal-card:nth-child(2) { animation-delay: 0.08s; }
  .legal-card:nth-child(3) { animation-delay: 0.12s; }
  .legal-card:nth-child(4) { animation-delay: 0.16s; }

  h2.section-title {
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 14px 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  h2.section-title::before {
    content: '';
    display: block;
    width: 4px;
    height: 18px;
    background: linear-gradient(180deg, #10b981, #00985b);
    border-radius: 2px;
    flex-shrink: 0;
  }
  p.legal-p {
    font-size: 15px;
    line-height: 1.75;
    color: #334155;
    margin: 0 0 14px 0;
  }
  p.legal-p:last-child { margin-bottom: 0; }

  .warning-card {
    background: rgba(239,68,68,0.06);
    border: 1px solid rgba(239,68,68,0.22);
    border-radius: 12px;
    padding: 16px 18px;
    color: #991b1b;
    font-size: 14px;
    line-height: 1.65;
    margin-top: 14px;
  }
  .warning-card strong { color: #dc2626; }

  .legal-footer {
    margin-top: 36px;
    padding: 22px;
    background: rgba(0,152,91,0.07);
    border: 1px solid rgba(0,152,91,0.2);
    border-radius: 16px;
    text-align: center;
    color: #475569;
    font-size: 14px;
    line-height: 1.6;
    font-weight: 500;
  }

  @media (max-width: 640px) {
    .legal-card { padding: 22px 18px; border-radius: 16px; }
    .legal-hero h1 { font-size: 26px; }
    h2.section-title { font-size: 16px; }
    p.legal-p { font-size: 14px; }
    .legal-nav { padding: 12px 16px; }
  }
`;

export default function RefundPolicy() {
  const router = useRouter();

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const next = document.getElementById("__next");

    html.classList.add("legal-page");
    html.style.setProperty("height", "auto", "important");
    html.style.setProperty("overflow-y", "auto", "important");
    html.style.setProperty("overflow-x", "hidden", "important");
    html.style.setProperty("scroll-behavior", "smooth", "important");

    body.style.setProperty("height", "auto", "important");
    body.style.setProperty("overflow-y", "auto", "important");
    body.style.setProperty("overflow-x", "hidden", "important");

    if (next) {
      next.style.setProperty("height", "auto", "important");
      next.style.setProperty("overflow", "visible", "important");
    }

    try {
      sessionStorage.setItem("trion_intro_seen", "1");
    } catch {}

    return () => {
      html.classList.remove("legal-page");
      html.style.removeProperty("height");
      html.style.removeProperty("overflow-y");
      html.style.removeProperty("overflow-x");
      html.style.removeProperty("scroll-behavior");

      body.style.removeProperty("height");
      body.style.removeProperty("overflow-y");
      body.style.removeProperty("overflow-x");

      if (next) {
        next.style.removeProperty("height");
        next.style.removeProperty("overflow");
      }
    };
  }, []);

  const handleBack = () => {
    try {
      sessionStorage.setItem("trion_intro_seen", "1");
    } catch {}
    router.push("/");
  };

  return (
    <>
      <PageHead
        title="Refund Policy"
        description="TryonAI Refund Policy. Understand the terms and conditions regarding digital subscriptions and payment refunds."
        canonical="https://wingo30.com/refund"
      >
        <style dangerouslySetInnerHTML={{ __html: legalStyles }} />
      </PageHead>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://wingo30.com/" },
        { name: "Refund Policy", url: "https://wingo30.com/refund" }
      ]} />

      <div className="legal-page">
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        <nav className="legal-nav">
          <button className="legal-nav-back" onClick={handleBack} type="button">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Home
          </button>
          <span className="legal-nav-title">Refund Policy</span>
        </nav>

        <div className="legal-container">
          <div className="legal-hero">
            <div className="legal-badge">💳 Billing Policy</div>
            <h1>Refund <span>Policy</span></h1>
            <div className="legal-meta">
              <span>TryonAI</span>
              <span className="legal-meta-dot" />
              <span>Last Updated: July 14, 2026</span>
            </div>
          </div>

          <div className="legal-card">
            <p className="legal-p">At TryonAI, we strive to deliver top-tier AI analysis and smart signals. Due to the digital nature of our subscription services, we maintain a clear policy regarding cancellations and refunds.</p>
          </div>

          <div className="legal-card">
            <h2 className="section-title">1. No-Refund Policy</h2>
            <p className="legal-p">TryonAI provides immediate digital access to real-time predictive signals and analytics upon subscription activation. As such, all sales are final, and we do not issue refunds for any reason, including change of mind, perceived lack of accuracy, or underutilization of the tool.</p>
            <div className="warning-card">
              <strong>⚠️ Important:</strong> Digital services are delivered instantly upon payment verification — no refunds or chargebacks are accepted under any circumstances.
            </div>
          </div>

          <div className="legal-card">
            <h2 className="section-title">2. Activation Issues</h2>
            <p className="legal-p">If you have paid for a subscription but experience delays in activation (e.g. if your UTR ID is taking longer to verify), please contact us immediately on Telegram. We will verify your transaction code and manually credit your license key as needed. Under no circumstances should duplicate payments be submitted.</p>
          </div>

          <div className="legal-card">
            <h2 className="section-title">3. Subscription Cancellations</h2>
            <p className="legal-p">Your subscription is purchased on a month-to-month basis and does not auto-renew. Once your paid period (30 days) expires, your premium status will revert to free status. To prevent loss of premium features, you must manually purchase a renewal.</p>
          </div>

          <div className="legal-card">
            <h2 className="section-title">4. Account Suspensions</h2>
            <p className="legal-p">No refunds will be granted for accounts suspended or terminated due to violation of our Terms & Conditions, including botting, scraping, API key resale, or system abuse.</p>
          </div>

          <div className="legal-footer">
            Payment issues? Contact us on{" "}
            <a href="https://t.me/kal_mods" target="_blank" rel="noopener noreferrer" style={{ color: "#00985b", textDecoration: "none", fontWeight: 700 }}>
              Telegram Support ↗
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
