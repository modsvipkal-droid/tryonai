import { useEffect } from "react";
import { useRouter } from "next/router";
import { PageHead, BreadcrumbSchema } from "@/components/SEO";
import SiteFooter from "@/components/SiteFooter";

const legalStyles = `
  @font-face {
    font-family: 'TrionAI';
    src: url('/fonts/trionAIofficial.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
  *, *::before, *::after { box-sizing: border-box; }
  html {
    scroll-behavior: smooth !important;
    -webkit-overflow-scrolling: touch !important;
    height: auto !important;
    min-height: 100% !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
  }
  body {
    background: #eef7f3 !important;
    color: #17251f !important;
    font-family: 'TrionAI', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    overscroll-behavior-y: auto !important;
    -webkit-overflow-scrolling: touch !important;
    margin: 0 !important;
    padding: 0 !important;
    min-height: 100vh !important;
    height: auto !important;
    -webkit-font-smoothing: antialiased;
  }
  #__next {
    height: auto !important;
    min-height: 100% !important;
    overflow: visible !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .legal-page {
    min-height: 100vh;
    width: 100%;
    background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 40%, #ecfdf5 100%);
    padding: 0 !important;
    margin: 0 !important;
    position: relative;
    overflow-x: hidden;
    overflow-y: visible;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .legal-page::before {
    content: '';
    position: fixed;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(ellipse at 20% 20%, rgba(0,152,91,0.06) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 80%, rgba(16,185,129,0.05) 0%, transparent 50%);
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
    animation: floatOrb 16s ease-in-out infinite alternate;
  }
  .orb-1 { width: 380px; height: 380px; background: #00985b; top: -100px; right: -100px; }
  .orb-2 { width: 300px; height: 300px; background: #10b981; bottom: 80px; left: -80px; animation-delay: -6s; }
  @keyframes floatOrb {
    from { transform: translate(0, 0) scale(1); }
    to { transform: translate(28px, 38px) scale(1.1); }
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
    flex: 1 0 auto;
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
  .legal-card:nth-child(5) { animation-delay: 0.2s; }
  .legal-card:nth-child(6) { animation-delay: 0.24s; }

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
  ul.legal-list {
    margin: 0;
    padding-left: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  ul.legal-list li {
    font-size: 15px;
    line-height: 1.65;
    color: #334155;
    padding-left: 22px;
    position: relative;
  }
  ul.legal-list li::before {
    content: '→';
    position: absolute;
    left: 0;
    color: #00985b;
    font-weight: 700;
  }

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
    p.legal-p, ul.legal-list li { font-size: 14px; }
    .legal-nav { padding: 12px 16px; }
  }
`;

export default function PrivacyPolicy() {
  const router = useRouter();

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const next = document.getElementById("__next");

    html.classList.add("legal-page");
    body.classList.add("legal-page");

    html.style.setProperty("height", "auto", "important");
    html.style.setProperty("min-height", "100%", "important");
    html.style.setProperty("overflow-y", "auto", "important");
    html.style.setProperty("overflow-x", "hidden", "important");
    html.style.setProperty("scroll-behavior", "smooth", "important");
    html.style.setProperty("-webkit-overflow-scrolling", "touch", "important");

    body.style.setProperty("height", "auto", "important");
    body.style.setProperty("min-height", "100%", "important");
    body.style.setProperty("overflow-y", "auto", "important");
    body.style.setProperty("overflow-x", "hidden", "important");
    body.style.setProperty("overscroll-behavior-y", "auto", "important");
    body.style.setProperty("-webkit-overflow-scrolling", "touch", "important");

    if (next) {
      next.style.setProperty("height", "auto", "important");
      next.style.setProperty("min-height", "100%", "important");
      next.style.setProperty("overflow", "visible", "important");
    }

    try {
      sessionStorage.setItem("trion_intro_seen", "1");
    } catch {}

    return () => {
      html.classList.remove("legal-page");
      body.classList.remove("legal-page");

      html.style.removeProperty("height");
      html.style.removeProperty("min-height");
      html.style.removeProperty("overflow-y");
      html.style.removeProperty("overflow-x");
      html.style.removeProperty("scroll-behavior");
      html.style.removeProperty("-webkit-overflow-scrolling");

      body.style.removeProperty("height");
      body.style.removeProperty("min-height");
      body.style.removeProperty("overflow-y");
      body.style.removeProperty("overflow-x");
      body.style.removeProperty("overscroll-behavior-y");
      body.style.removeProperty("-webkit-overflow-scrolling");

      if (next) {
        next.style.removeProperty("height");
        next.style.removeProperty("min-height");
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
        title="Privacy Policy"
        description="TryonAI Privacy Policy. Understand how we collect, store, and protect your information."
        canonical="https://wingo30.com/privacy"
      >
        <style dangerouslySetInnerHTML={{ __html: legalStyles }} />
      </PageHead>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://wingo30.com/" },
        { name: "Privacy Policy", url: "https://wingo30.com/privacy" }
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
          <span className="legal-nav-title">Privacy Policy</span>
        </nav>

        <div className="legal-container">
          <div className="legal-hero">
            <div className="legal-badge">🔒 Privacy & Data</div>
            <h1>Privacy <span>Policy</span></h1>
            <div className="legal-meta">
              <span>TryonAI</span>
              <span className="legal-meta-dot" />
              <span>Last Updated: July 14, 2026</span>
            </div>
          </div>

          <div className="legal-card">
            <p className="legal-p">At TryonAI, we prioritize the privacy of our visitors. This Privacy Policy outlines the types of personal data we collect, how we use it, and the security protocols we employ to protect your information.</p>
          </div>

          <div className="legal-card">
            <h2 className="section-title">1. Information We Collect</h2>
            <p className="legal-p">We collect information to provide a secure and customized experience. The data we collect includes:</p>
            <ul className="legal-list">
              <li><strong style={{ color: "#0f172a" }}>Authentication Information:</strong> Google account email, name, and profile picture collected via secure Google Sign-In.</li>
              <li><strong style={{ color: "#0f172a" }}>Usage Analytics:</strong> Anonymized click metrics, page views, game data requests, and referral sources to monitor performance.</li>
              <li><strong style={{ color: "#0f172a" }}>Device Metadata:</strong> Browser type, operating system, and IP address for security auditing and rate limiting.</li>
            </ul>
          </div>

          <div className="legal-card">
            <h2 className="section-title">2. How We Use Your Information</h2>
            <p className="legal-p">The collected information is used to:</p>
            <ul className="legal-list">
              <li>Authenticate and maintain your platform access.</li>
              <li>Provide real-time AI Wingo30 predictions tailored to your settings.</li>
              <li>Audit payment UTR IDs to unlock premium subscriptions.</li>
              <li>Monitor for abusive behavior or security threats.</li>
            </ul>
          </div>

          <div className="legal-card">
            <h2 className="section-title">3. Data Protection and Security</h2>
            <p className="legal-p">We implement strict security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. We utilize HTTPS encryption, Content Security Policies (CSP), and secure database controls.</p>
          </div>

          <div className="legal-card">
            <h2 className="section-title">4. Cookie Policy</h2>
            <p className="legal-p">TryonAI uses local storage and cookies to maintain your active authentication session and save platform interface preferences such as dashboard layout settings.</p>
          </div>

          <div className="legal-card">
            <h2 className="section-title">5. Third-Party Services</h2>
            <p className="legal-p">We work with trusted third-party providers, including Firebase (Authentication & Hosting) and Cloudflare (Turnstile bot prevention). These providers handle data in accordance with their respective privacy policies.</p>
          </div>

          <div className="legal-card">
            <h2 className="section-title">6. Contact Us</h2>
            <p className="legal-p">If you have any questions regarding this Privacy Policy, please reach out to us through our official support channel on Telegram or via email.</p>
          </div>

          <div className="legal-footer">
            Privacy concerns?{" "}
            <a href="https://t.me/kal_mods" target="_blank" rel="noopener noreferrer" style={{ color: "#00985b", textDecoration: "none", fontWeight: 700 }}>
              Contact us on Telegram ↗
            </a>
          </div>
        </div>
        <SiteFooter />
      </div>
    </>
  );
}
