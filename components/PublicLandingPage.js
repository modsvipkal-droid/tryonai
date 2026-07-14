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
      question: "What is TryonAI?",
      answer: "TryonAI is an AI-powered prediction and signals platform for the Wingo30 lottery game. It analyzes real-time drawing trends, historical statistics, and candlestick patterns to generate predictive data."
    },
    {
      question: "How does the Wingo30 prediction bot work?",
      answer: "Our algorithm retrieves game history data and runs technical analysis calculations (detecting trends, body bodySizes, and candlestick shapes like Hammers, Morning Stars, etc.) to project outcome probability indicators."
    },
    {
      question: "Is TryonAI free to use?",
      answer: "TryonAI provides unlimited predictions and dashboard access under our premium VIP plan. You can view our available options and subscribe through the Subscription Plans page."
    },
    {
      question: "What is the monthly subscription price?",
      answer: "The TryonAI VIP subscription plan is ₹799 per month. This unlocks 30 days of unlimited predictive signals, real-time analytics, and dashboard charts."
    },
    {
      question: "How do I activate my license after paying?",
      answer: "Copy the 12-digit transaction UTR ID from your payment receipt (GPay, Paytm, PhonePe) and paste it into the form on the Subscription page. Our system will verify and unlock your access automatically."
    }
  ];

  const toggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <>
      <PageHead
        title="Wingo 30s Prediction AI: Live Signals & Analytics"
        description="TryonAI is the leading AI-powered Wingo30 prediction and signals platform. Access real-time trend charts, candlestick pattern recognition, and smart signals."
        canonical="https://wingo30.com/"
      >
        <meta name="keywords" content="Wingo AI, Wingo prediction, Wingo30, TrionAI, Wingo VIP, Wingo analyst, colour prediction bot, AI Wingo, Wingo 30 second, Wingo live signals" />
      </PageHead>

      {/* SEO Structured Data schemas rendered publically for bots */}
      <OrganizationSchema />
      <WebsiteSchema />
      <WebPageSchema title="TryonAI - Wingo 30s Prediction AI Platform" description="AI Wingo30 prediction and signals platform with real-time candlestick pattern analysis and smart trading indicators." url="https://wingo30.com/" />
      <BreadcrumbSchema items={[{ name: "Home", url: "https://wingo30.com/" }]} />
      <SoftwareAppSchema />
      <FAQSchema questions={faqs} />

      <div className="landing-root">
        {/* Navigation Header */}
        <header className="landing-header">
          <div className="landing-header-container">
            <Link href="/" className="landing-brand">
              <span className="landing-logo">T</span>
              <span className="landing-brand-text">TryonAI</span>
            </Link>
            <nav className="landing-nav">
              <Link href="/subscription" className="landing-nav-link">Subscription</Link>
              <Link href="/developer" className="landing-nav-link">Developer API</Link>
              <Link href="/contact" className="landing-nav-link">Contact Us</Link>
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
          <h1>Wingo 30s Prediction AI:<br />Live Signals & Analytics</h1>
          <p>Supercharge your Wingo 30-second game analysis. Leverage real-time statistical predictions, pattern recognition, and trend charts built on advanced machine learning algorithms.</p>
          <div className="landing-hero-ctas">
            <Link href="/login" className="landing-cta-primary">Get Started Now</Link>
            <Link href="/subscription" className="landing-cta-secondary">View Subscription Plans</Link>
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
              <h3>Real-Time Signals</h3>
              <p>Get instant predictions for numbers (0-9), colors (Green, Violet, Red), and sizes (Big/Small) generated every 30 seconds.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrap">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <h3>Interactive Charts</h3>
              <p>Monitor trend charts and hot & cold frequency meters detailing draw frequencies to make statistical choices.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrap">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3>Custom Logic Upload</h3>
              <p>Upload your custom `.trionai` prediction models to run localized, tailored algorithms on our execution engine.</p>
            </div>
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
          </div>
        </section>

        {/* Footer */}
        <footer className="landing-footer">
          <div className="footer-container">
            <div className="footer-brand">
              <h4>TryonAI</h4>
              <p>AI-driven predictive platform and developer integration portal for Wingo30 game analysis.</p>
            </div>
            <div className="footer-navs">
              <div className="footer-nav-col">
                <h5>Platform</h5>
                <ul className="footer-links">
                  <li><Link href="/" className="footer-link">Home</Link></li>
                  <li><Link href="/subscription" className="footer-link">Subscription</Link></li>
                  <li><Link href="/developer" className="footer-link">Developer API</Link></li>
                </ul>
              </div>
              <div className="footer-nav-col">
                <h5>Legal</h5>
                <ul className="footer-links">
                  <li><Link href="/privacy" className="footer-link">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="footer-link">Terms & Conditions</Link></li>
                  <li><Link href="/refund" className="footer-link">Refund Policy</Link></li>
                </ul>
              </div>
              <div className="footer-nav-col">
                <h5>Support</h5>
                <ul className="footer-links">
                  <li><Link href="/contact" className="footer-link">Contact Us</Link></li>
                  <li><a href="https://t.me/kal_mods" className="footer-link" target="_blank" rel="noopener noreferrer">Telegram Channel</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} TryonAI. All rights reserved. Game responsibly.</p>
            <p>Developed under standard statistical prediction guidelines.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
