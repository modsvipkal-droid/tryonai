import Link from "next/link";

export function LandingNav() {
  return (
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
  );
}

export function LandingFooter() {
  return (
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
  );
}

export default function LandingPageLayout({ children }) {
  return (
    <div className="landing-root">
      <LandingNav />
      <main>{children}</main>
      <LandingFooter />
    </div>
  );
}