import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const TELEGRAM_URL = "https://t.me/+spWu5CnIDrViNDRl";
const EXIT_MS = 600;
const ENTER_MS = 80;
const AUTO_DISMISS_MS = 5200;

const BANNERS = [
  { src: "/Bannerv1.jpg", alt: "TRION AI Wingo signal banner" },
  { src: "/Bannerv2.jpg", alt: "Wingo prediction tools banner" },
  { src: "/Bannerv3.jpg", alt: "Wingo color game insights banner" },
];

const OVERVIEW_ITEMS = [
  {
    title: "What It Does",
    text: "Shows Wingo prediction tools, color prediction pages, AI bot guidance, Smart AI checks, and settled game history in one place.",
  },
  {
    title: "Best For",
    text: "Players searching for Wingo signal, Wingo tool, Wingo analyzer, Wingo 30 second prediction, Wingo AI prediction, and Wingo pages.",
  },
  {
    title: "How To Use",
    text: "Start with the 30-second prediction page, compare color prediction trends, then review Wingo bot or history pages for context.",
  },
];

const PROCESS_STEPS = [
  {
    number: "1",
    title: "Input Historical Data",
    text: "Take the final three drawn numbers from your current game log and enter them into the prediction calculator widget.",
  },
  {
    number: "2",
    title: "Algorithmic Processing",
    text: "The software cross-references these digits against thousands of past drawing patterns to identify mathematical correlations.",
  },
  {
    number: "3",
    title: "Evaluate the Output",
    text: "Review the suggested BIG or SMALL indicator, noting the confidence percentage provided, to help inform your personal gameplay strategy.",
  },
];

const MARKET_CARDS = [
  {
    country: "India",
    image: "/india.jpg",
    text: "Primary server - low latency across all regions",
  },
  {
    country: "Bangladesh",
    image: "/Bangladesh.jpg",
    text: "Dedicated node - fast signal delivery",
  },
  {
    country: "Pakistan",
    image: "/Pakistan.jpg",
    text: "Optimized routing - stable connections",
  },
  {
    country: "Nepal",
    image: "/Nepal.jpg",
    text: "Regional support - reliable performance",
  },
];

/* ─── Icons ──────────────────────────────────────────────────────────────── */

function ArrowIcon() {
  return (
    <svg className="loader-button-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <line x1="3" y1="10" x2="15" y2="10" strokeWidth="2.2" />
      <polyline points="10,5 15.5,10 10,15" strokeWidth="2.2" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg className="loader-button-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M21.5 4.2 17.8 20c-.22.94-.96 1.18-1.74.73l-4.86-3.57-2.34 2.26c-.26.26-.48.48-.98.48l.35-4.97 9.03-8.16c.39-.35-.09-.54-.6-.2L5.26 13.27.38 11.76c-1.04-.32-.98-.96.22-1.42L19.88 2.7c.87-.3 1.64.2 1.62 1.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* Premium multi-layer TRION AI icon */
function TrionIcon() {
  return (
    <svg className="loader-ai-icon" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        {/* Card fill */}
        <linearGradient id="tri-bg" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f0eaff" />
          <stop offset="0.45" stopColor="#e0f7ee" />
          <stop offset="1" stopColor="#ece8ff" />
        </linearGradient>

        {/* Waveform stroke gradient */}
        <linearGradient id="tri-wave" x1="10" y1="34" x2="54" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00d07a" />
          <stop offset="0.55" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#3b82f6" />
        </linearGradient>

        {/* Outer ring stroke */}
        <linearGradient id="tri-ring" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(255,255,255,0.95)" />
          <stop offset="0.35" stopColor="rgba(196,181,253,0.7)" />
          <stop offset="0.7" stopColor="rgba(110,231,183,0.6)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.5)" />
        </linearGradient>

        {/* Inner ring stroke */}
        <linearGradient id="tri-ring2" x1="64" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(139,92,246,0.4)" />
          <stop offset="0.5" stopColor="rgba(0,208,122,0.3)" />
          <stop offset="1" stopColor="rgba(59,130,246,0.4)" />
        </linearGradient>

        {/* Glow filter */}
        <filter id="tri-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Soft inner shadow */}
        <filter id="tri-inner" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
          <feOffset dy="1" />
          <feComposite in2="SourceAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0.08  0 0 0 0 0.09  0 0 0 0 0.14  0 0 0 0.18 0" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Outer dashed rotating ring ── */}
      <rect
        className="loader-ai-icon-ring"
        x="1" y="1" width="62" height="62" rx="21"
        stroke="url(#tri-ring)"
        strokeWidth="1.4"
        strokeDasharray="10 5"
        fill="none"
        opacity="0.8"
      />

      {/* ── Inner rotating ring ── */}
      <rect
        className="loader-ai-icon-ring2"
        x="4.5" y="4.5" width="55" height="55" rx="18.5"
        stroke="url(#tri-ring2)"
        strokeWidth="0.8"
        strokeDasharray="6 8"
        fill="none"
        opacity="0.65"
      />

      {/* ── Glass card base ── */}
      <rect x="6" y="6" width="52" height="52" rx="17" fill="url(#tri-bg)" />

      {/* ── Top highlight ── */}
      <rect x="6" y="6" width="52" height="22" rx="17" fill="rgba(255,255,255,0.52)" />
      <rect x="6" y="6" width="52" height="52" rx="17" stroke="rgba(255,255,255,0.84)" strokeWidth="1" fill="none" />

      {/* ── Glow layer behind waveform ── */}
      <path
        d="M12 36h8l5-14 6 23 5-16h8"
        stroke="url(#tri-wave)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.12"
        filter="url(#tri-glow)"
      />

      {/* ── Main animated waveform ── */}
      <path
        className="loader-ai-icon-line"
        d="M12 36h8l5-14 6 23 5-16h8"
        stroke="url(#tri-wave)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ── Spark: diamond — top left ── */}
      <path
        className="loader-ai-icon-spark"
        d="M19 22l3.6-3.6 3.6 3.6-3.6 3.6z"
        fill="#8b5cf6"
        opacity="0.85"
      />

      {/* ── Spark: circle dot — top right ── */}
      <circle
        className="loader-ai-icon-spark"
        cx="47" cy="19"
        r="2.6"
        fill="#00d07a"
        opacity="0.9"
        style={{ animationDelay: "1s" }}
      />

      {/* ── Spark: small triangle — bottom right ── */}
      <polygon
        className="loader-ai-icon-spark"
        points="50,44 53,49 47,49"
        fill="#3b82f6"
        opacity="0.65"
        style={{ animationDelay: "0.5s" }}
      />
    </svg>
  );
}

/* ─── Loading Screen Component ───────────────────────────────────────────── */

export default function LoadingScreen({ onComplete, autoDismiss = false, error = "" }) {
  const [phase, setPhase] = useState("idle");
  const [dismissing, setDismissing] = useState(false);
  const startButtonRef = useRef(null);
  const exitTimerRef = useRef(null);

  const handleDismiss = useCallback(() => {
    setDismissing((alreadyDismissing) => {
      if (alreadyDismissing) return alreadyDismissing;

      exitTimerRef.current = window.setTimeout(() => {
        if (onComplete) onComplete();
      }, EXIT_MS);

      return true;
    });
  }, [onComplete]);

  useEffect(() => {
    const enterTimer = window.setTimeout(() => {
      setPhase("idle");
    }, ENTER_MS);

    return () => {
      window.clearTimeout(enterTimer);
      window.clearTimeout(exitTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!autoDismiss) return undefined;

    const autoTimer = window.setTimeout(handleDismiss, AUTO_DISMISS_MS);
    return () => window.clearTimeout(autoTimer);
  }, [autoDismiss, handleDismiss]);

  useEffect(() => {
    if (phase !== "idle" || autoDismiss) return undefined;

    const focusTimer = window.setTimeout(() => {
      startButtonRef.current?.focus();
    }, 140);

    return () => window.clearTimeout(focusTimer);
  }, [autoDismiss, phase]);

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      handleDismiss();
    }
  }

  const isVisible = phase !== "enter";
  const state = error ? "error" : dismissing ? "loading" : "default";

  return (
    <section
      className={`loader-root${dismissing ? " loader-root--exit" : ""}`}
      data-state={state}
      role="dialog"
      aria-modal="true"
      aria-labelledby="loader-title"
      aria-describedby="loader-description"
      aria-busy={dismissing}
      onKeyDown={handleKeyDown}
    >
      {/* Layered ambient background */}
      <div className="loader-bg" aria-hidden="true">
        <div className="loader-bg-orb2" />
        <div className="loader-bg-orb3" />
      </div>

      <div className="loader-shell">
        <main className={`loader-content${isVisible ? " loader-content--visible" : ""}`}>

          {/* ── HERO ── */}
          <section className="loader-hero" aria-labelledby="loader-title">
            <div className="loader-banner" aria-label="TRION AI banner gallery">
              <div className="loader-banner-track">
                {[...BANNERS, BANNERS[0]].map((banner, index) => (
                  <figure className="loader-banner-slide" key={`${banner.src}-${index}`}>
                    <Image
                      src={banner.src}
                      alt={index === BANNERS.length ? "" : banner.alt}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 575px) 100vw, 575px"
                    />
                  </figure>
                ))}
              </div>

              {/* Corner badge SVG overlay */}
              <svg
                className="loader-banner-corner"
                viewBox="0 0 44 44"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="22" cy="22" r="18" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                <path d="M22 14v8l5 3" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" />
                <circle cx="22" cy="22" r="3" fill="rgba(0,208,122,0.9)" />
              </svg>
            </div>

            <div className="loader-hero-copy">
              <p className="loader-kicker">trion ai</p>

              <div className="loader-title-row">
                <TrionIcon />
                <h1 className="loader-title" id="loader-title">TRION AI</h1>
              </div>

              <p className="loader-description" id="loader-description">
                Get live Wingo signal updates and Wingo AI prediction insights for BIG/SMALL and color
                games. Track rounds, compare patterns, and use the Wingo tools for free.
              </p>

              {error ? (
                <p className="loader-error" role="alert">{error}</p>
              ) : null}

              <div className="loader-actions">
                <button
                  className="loader-action loader-action--primary"
                  type="button"
                  onClick={handleDismiss}
                  disabled={dismissing}
                  aria-busy={dismissing}
                  ref={startButtonRef}
                  id="loader-start-btn"
                >
                  <span>{dismissing ? "Opening…" : "Get Started"}</span>
                  <ArrowIcon />
                </button>

                <a
                  className="loader-action loader-action--telegram"
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="loader-telegram-btn"
                >
                  <TelegramIcon />
                  <span>Join Telegram</span>
                </a>
              </div>
            </div>
          </section>

          {/* ── OVERVIEW ── */}
          <section className="loader-overview" aria-labelledby="loader-overview-title">
            <p className="loader-section-eyebrow">AI Overview Summary</p>
            <h2 className="loader-section-title" id="loader-overview-title">
              Wingo Signal, Tool &amp; AI Prediction Hub
            </h2>
            <p className="loader-section-copy">
              Wingo Signals is a Wingo tool hub for checking Wingo signal pages, Wingo 30&nbsp;second
              prediction, color prediction, Wingo TRION AI answers, Wingo analyzer pages, and recent
              BIG SMALL game history. The goal is to make Wingo period data easier to read before
              users compare results or study patterns.
            </p>

            <div className="loader-overview-list">
              {OVERVIEW_ITEMS.map((item) => (
                <article className="loader-overview-item" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          {/* ── PROCESS ── */}
          <section className="loader-process" aria-labelledby="loader-process-title">
            <h2 className="loader-section-title" id="loader-process-title">
              Understanding the Prediction Process
            </h2>
            <p className="loader-section-copy">
              Our tools are designed to simplify complex mathematical models into an easy-to-read
              format. Here is how you can use our calculators to evaluate your next move.
            </p>

            <div className="loader-step-list">
              {PROCESS_STEPS.map((step) => (
                <article className="loader-step" key={step.number}>
                  <div className="loader-step-number">
                    <span>{step.number}</span>
                  </div>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ── MARKETS ── */}
          <section className="loader-markets" aria-labelledby="loader-markets-title">
            <h2 className="loader-section-title" id="loader-markets-title">
              Available Across South Asia
            </h2>
            <p className="loader-section-copy">
              Wingo Signals works seamlessly in all major South Asian markets with optimized server
              response.
            </p>

            <div className="loader-market-grid">
              {MARKET_CARDS.map((market) => (
                <article className="loader-market-card" key={market.country}>
                  <span className="loader-market-flag">
                    <Image
                      src={market.image}
                      alt={`${market.country} server`}
                      width={80}
                      height={80}
                    />
                  </span>
                  <h3>{market.country}</h3>
                  <p>{market.text}</p>
                </article>
              ))}
            </div>
          </section>

          {/* ── LIVE INTERFACE ── */}
          <section className="loader-live" aria-labelledby="loader-live-title">
            <p className="loader-section-eyebrow">Live Interface</p>
            <h2 className="loader-section-title" id="loader-live-title">
              <span className="loader-section-title--accent">TRION AI</span> Prediction and feedback Screenshots
            </h2>
            <p className="loader-section-copy">
              Preview the TRION Signals dashboard across 30-second, color prediction, TRION AI,
              Smart AI, and chart views.
            </p>

            {/* Auto-scrolling screenshot carousel */}
            <div className="loader-screenshots" aria-label="TRION AI screenshot gallery">
              <div className="loader-screenshots-track">
                {[
                  { src: "/Withdrawal.jpg",   alt: "Withdrawal interface screenshot" },
                  { src: "/Backtoback.jpg",   alt: "Back-to-back prediction screenshot" },
                  { src: "/Feedback.jpg",     alt: "User feedback screenshot" },
                  { src: "/Oneto.jpg",        alt: "One-to-one signal screenshot" },
                  /* duplicate for seamless loop */
                  { src: "/Withdrawal.jpg",   alt: "" },
                  { src: "/Backtoback.jpg",   alt: "" },
                  { src: "/Feedback.jpg",     alt: "" },
                  { src: "/Oneto.jpg",        alt: "" },
                ].map((img, i) => (
                  <figure className="loader-screenshot-slide" key={i} aria-hidden={i >= 4}>
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 575px) 72vw, 400px"
                    />
                  </figure>
                ))}
              </div>
            </div>
          </section>

          {/* ── THANK YOU ── */}
          <section className="loader-thankyou" aria-labelledby="loader-thankyou-title">
            <div className="loader-thankyou-inner">
              <div className="loader-thankyou-sparkles" aria-hidden="true">
                <span className="loader-ty-spark loader-ty-spark--1">✦</span>
                <span className="loader-ty-spark loader-ty-spark--2">✦</span>
                <span className="loader-ty-spark loader-ty-spark--3">✦</span>
                <span className="loader-ty-spark loader-ty-spark--4">✦</span>
                <span className="loader-ty-spark loader-ty-spark--5">✦</span>
              </div>
              <p className="loader-ty-label">From TRION AI</p>
              <h2 className="loader-ty-heading" id="loader-thankyou-title">THANK YOU</h2>
              <p className="loader-ty-sub">
                Thank you for choosing TRION AI — your trusted Wingo signal &amp; prediction
                companion. We are constantly improving to give you the best signals, tools, and
                insights. Stay tuned, play smart, and keep winning! 🚀
              </p>
              <div className="loader-ty-divider" aria-hidden="true" />
              <p className="loader-ty-footer">With ❤️ — The TRION AI Team</p>
            </div>
          </section>

        </main>
      </div>
    </section>
  );
}
