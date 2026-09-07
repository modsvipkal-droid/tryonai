import Image from "next/image";
import Link from "next/link";

const TELEGRAM_URL = "https://t.me/+IeDdLm-koIc1Yzg1";

export default function SiteFooter() {
  const handleTelegramClick = (e) => {
    e.preventDefault();
    window.open(TELEGRAM_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <footer className="sf-footer" aria-label="Site Footer">
      <div className="sf-footer-inner">
        {/* Official Logo Image */}
        <div className="sf-footer-brand-section">
          <div className="sf-footer-top">
            <Image
              src="/trionAIofficial.png"
              alt="TRION AI Official"
              width={240}
              height={80}
              className="sf-footer-official-img"
            />
          </div>
          <p className="sf-footer-desc">
            Independent WinGo Prediction engine and real-time statistical pattern analytics software platform engineered for PRNG historical data visualization and accuracy research.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="sf-footer-links">
          <div className="sf-footer-link-group">
            <h4>Platform</h4>
            <Link href="/about">About TRION AI</Link>
            <Link href="/subscription">Subscription &amp; Models</Link>
            <Link href="/login">Prediction Tool</Link>
            <Link href="/developer">Developer API</Link>
          </div>

          <div className="sf-footer-link-group">
            <h4>Support</h4>
            <Link href="/contact">Contact Us</Link>
            <button type="button" className="sf-footer-link" onClick={handleTelegramClick}>
              Telegram Channel
            </button>
          </div>

          <div className="sf-footer-link-group">
            <h4>Legal</h4>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms &amp; Conditions</Link>
            <Link href="/refund">Refund Policy</Link>
            <Link href="/responsible-gambling">Responsible Gaming (18+)</Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="sf-footer-bottom">
          <span>© {new Date().getFullYear()} TRION AI. All rights reserved.</span>
          <span>Predictions are statistical estimates, not guaranteed results.</span>
        </div>
      </div>
    </footer>
  );
}
