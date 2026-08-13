import { useState } from "react";
import Link from "next/link";
import {
  PageHead,
  OrganizationSchema,
  WebsiteSchema,
  WebPageSchema,
  BreadcrumbSchema,
  SoftwareAppSchema,
  FAQSchema
} from "@/components/SEO";

export default function PublicLandingPage() {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      question: "What is TRION AI?",
      answer: "TRION AI is an AI-powered prediction and signals platform for the Wingo 30-second game. It analyzes real-time drawing history, statistical trends, and hot & cold patterns to generate predictive signals for number, color, and size outcomes."
    },
    {
      question: "How does the TRION AI Wingo prediction tool work?",
      answer: "The tool retrieves the latest Wingo30 game history and runs pattern and statistical analyses to estimate the direction of the next period. Results are shown as number (0-9), color (Green, Violet, Red), and size (Big/Small) signals on the prediction screen."
    },
    {
      question: "Is TRION AI free to use?",
      answer: "TRION AI provides unlimited predictions and dashboard access through its premium models. The Korven Model is ₹749 and the FX1 Model is ₹1,100, both with lifetime access after verification. You can view the options on the Subscription page."
    },
    {
      question: "Which prediction models does TRION AI offer?",
      answer: "TRION AI currently offers two premium models: the Korven Model (₹749) and the FX1 Model (₹1,100). Each model uses its own analysis approach and performance profile. See the Models page for details."
    },
    {
      question: "How do I activate my access after paying?",
      answer: "Complete your payment on the Subscription page, then submit your 12-digit transaction UTR ID from your payment receipt (GPay, Paytm, PhonePe). Our system verifies the payment and unlocks your premium access."
    },
    {
      question: "Does TRION AI guarantee prediction results?",
      answer: "No. Predictions are statistical estimates based on historical data and pattern analysis. TRION AI never guarantees wins, accuracy, or returns. Always play responsibly and use signals as one input in your own decisions."
    }
  ];

  const toggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const explore = [
    { title: "AI Prediction Tool", text: "The main TRION AI prediction screen with number, color, and size signals.", href: "/ai-prediction" },
    { title: "Wingo 30s Prediction", text: "How predictions work in the 30-second Wingo cycle with live history.", href: "/wingo-30-second-prediction" },
    { title: "Wingo Signals", text: "Signal types, trend charts, and hot & cold indicators explained.", href: "/wingo-signal" },
    { title: "AI Dashboard", text: "Win rate, round metrics, frequency board, and live signal panel.", href: "/ai-dashboard" },
    { title: "Korven Model", text: "TRION AI Korven model at ₹749 with lifetime access.", href: "/korven-model" },
    { title: "FX1 Model", text: "TRION AI FX1 model at ₹1,100 with lifetime access.", href: "/fx1-model" },
  ];

  return (
    <>
      <PageHead
        title="TRION AI – AI Wingo Prediction Platform"
        description="TRION AI is an AI-powered Wingo30 prediction and signals platform. Real-time analysis, trend charts, hot & cold signals, Korven and FX1 models, and a live analytics dashboard."
        canonical="https://wingo30.com/"
      />

      {/* SEO Structured Data schemas rendered publically for bots */}
      <OrganizationSchema />
      <WebsiteSchema />
      <WebPageSchema title="TRION AI – AI Wingo Prediction Platform" description="AI Wingo30 prediction and signals platform with real-time pattern analysis, trend charts, and smart signals." url="https://wingo30.com/" />
      <BreadcrumbSchema items={[{ name: "Home", url: "https://wingo30.com/" }]} />
      <SoftwareAppSchema />
      <FAQSchema questions={faqs} />

      <div className="landing-root">
        {/* Navigation Header */}
        <header className="landing-header">
          <div className="landing-header-container">
            <Link href="/" className="landing-brand">
              <span className="landing-logo">T</span>
              <span className="landing-brand-text">TRION AI</span>
            </Link>
            <nav className="landing-nav">
              <Link href="/ai-prediction" className="landing-nav-link">AI Prediction</Link>
              <Link href="/models" className="landing-nav-link">Models</Link>
              <Link href="/ai-dashboard" className="landing-nav-link">Dashboard</Link>
              <Link href="/faq" className="landing-nav-link">FAQ</Link>
              <Link href="/contact" className="landing-nav-link">Contact</Link>
              <Link href="/login" className="landing-login-btn">Sign In</Link>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="landing-hero">
          <div className="landing-hero-badge">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            AI Wingo Signals Platform
          </div>
          <h1>TRION AI – Wingo Prediction &<br />Signals Platform</h1>
          <p>Analyze the Wingo 30-second game with real-time pattern analysis, statistical predictions, trend charts, and hot & cold signals — powered by the Korven and FX1 models.</p>
          <div className="landing-hero-ctas">
            <Link href="/ai-prediction" className="landing-cta-primary">Explore the AI Prediction Tool</Link>
            <Link href="/models" className="landing-cta-secondary">View Prediction Models</Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="landing-features">
          <h2 className="landing-section-title">Core Platform Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrap">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <h3>Real-Time Predictions</h3>
              <p>Get signals for numbers (0-9), colors (Green, Violet, Red), and sizes (Big/Small) generated for each 30-second period.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrap">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <h3>Trend & Hot-Cold Charts</h3>
              <p>Monitor trend charts and frequency meters that show which numbers are appearing most and which are due.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrap">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3>Premium Models</h3>
              <p>Choose between the Korven and FX1 models, each with its own analysis approach and performance profile.</p>
            </div>
          </div>
        </section>

        {/* Explore section - internal linking */}
        <section className="landing-features">
          <h2 className="landing-section-title">Explore TRION AI</h2>
          <div className="features-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {explore.map((item) => (
              <Link key={item.href} href={item.href} className="feature-card" style={{ textDecoration: "none", display: "block" }}>
                <h3 style={{ color: "inherit" }}>{item.title}</h3>
                <p>{item.text}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="landing-faq">
          <div className="faq-container">
            <h2 className="landing-section-title">Frequently Asked Questions</h2>
            <div className="faq-list">
              {faqs.map((faq, idx) => (
                <div className="faq-item" key={idx}>
                  <button
                    className="faq-trigger"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={activeFaq === idx}
                  >
                    {faq.question}
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      style={{ transform: activeFaq === idx ? "rotate(180deg)" : "rotate(0)" }}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  {activeFaq === idx && (
                    <div className="faq-content">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p style={{ marginTop: 16, textAlign: "center" }}>
              <Link href="/faq" className="landing-nav-link">View all TRION AI FAQ</Link>
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="landing-footer">
          <div className="footer-container">
            <div className="footer-brand">
              <h4>TRION AI</h4>
              <p>AI-driven prediction and signals platform for Wingo30 game analysis, with developer API integration.</p>
            </div>
            <div className="footer-navs">
              <div className="footer-nav-col">
                <h5>Platform</h5>
                <ul className="footer-links">
                  <li><Link href="/" className="footer-link">Home</Link></li>
                  <li><Link href="/ai-prediction" className="footer-link">AI Prediction Tool</Link></li>
                  <li><Link href="/wingo-30-second-prediction" className="footer-link">Wingo 30s Prediction</Link></li>
                  <li><Link href="/wingo-signal" className="footer-link">Wingo Signals</Link></li>
                  <li><Link href="/ai-dashboard" className="footer-link">AI Dashboard</Link></li>
                </ul>
              </div>
              <div className="footer-nav-col">
                <h5>Models</h5>
                <ul className="footer-links">
                  <li><Link href="/models" className="footer-link">All Models</Link></li>
                  <li><Link href="/korven-model" className="footer-link">Korven Model</Link></li>
                  <li><Link href="/fx1-model" className="footer-link">FX1 Model</Link></li>
                  <li><Link href="/subscription" className="footer-link">Subscription</Link></li>
                </ul>
              </div>
              <div className="footer-nav-col">
                <h5>Company</h5>
                <ul className="footer-links">
                  <li><Link href="/about" className="footer-link">About TRION AI</Link></li>
                  <li><Link href="/faq" className="footer-link">FAQ</Link></li>
                  <li><Link href="/developer" className="footer-link">Developer API</Link></li>
                  <li><Link href="/contact" className="footer-link">Contact Us</Link></li>
                </ul>
              </div>
              <div className="footer-nav-col">
                <h5>Legal</h5>
                <ul className="footer-links">
                  <li><Link href="/privacy" className="footer-link">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="footer-link">Terms & Conditions</Link></li>
                  <li><Link href="/refund" className="footer-link">Refund Policy</Link></li>
                  <li><a href="https://t.me/kal_mods" className="footer-link" target="_blank" rel="noopener noreferrer">Telegram Channel</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} TRION AI (TryonAI). All rights reserved. Game responsibly.</p>
            <p>Predictions are statistical estimates. TRION AI does not guarantee wins or returns.</p>
          </div>
        </footer>
      </div>
    </>
  );
}