import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  Circle,
  Hash,
  Palette,
  Maximize2,
  Flame,
  Snowflake,
  TrendingUp,
  Timer,
  BarChart3,
  ListChecks,
  CircleDot,
  Crown,
  Rocket,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, memo } from "react";
import SparklesText from "./SparklesText";

const TELEGRAM_URL = "https://t.me/+spWu5CnIDrViNDRl";
const EXIT_MS = 600;
const ENTER_MS = 80;
const AUTO_DISMISS_MS = 5200;

const BANNERS = [
  { src: "/Bannerv1.jpg", alt: "TRION AI Wingo signal banner" },
  { src: "/Bannerv2.jpg", alt: "Wingo prediction tools banner" },
  { src: "/Bannerv3.jpg", alt: "Wingo color game insights banner" },
  { src: "/Howtologii.jpg", alt: "How to play Wingo guide banner" },
  { src: "/Pvt.jpg", alt: "Private VIP signals banner" },
  { src: "/Tg.jpg", alt: "Telegram community banner" },
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

const OVERVIEW_PILLS = [
  ["Smart", "Fast", "Accurate"],
  ["Signals", "Analysis", "Prediction"],
  ["Prediction", "Trends", "History"],
];

const OVERVIEW_STATS = [
  { value: "99.9%", label: "Prediction Accuracy" },
  { value: "30s", label: "Lightning Fast" },
  { value: "24/7", label: "AI Monitoring" },
  { value: "10K+", label: "Built for Accuracy" },
];

const TRUST_CARDS = [
  {
    icon: <ShieldIcon />,
    title: "Trusted AI Platform",
    text: "Enterprise-grade prediction tools trusted by thousands of users across the region.",
  },
  {
    icon: <ZapIcon />,
    title: "Fast & Intelligent",
    text: "Lightning-fast mathematical pattern analysis with optimized performance.",
  },
  {
    icon: <LockIcon />,
    title: "Privacy & Security",
    text: "Built with modern OAuth security and stringent privacy standards.",
  },
  {
    icon: <HeartIcon />,
    title: "Continuous Innovation",
    text: "Continuously improving neural models, uptime, and user experience.",
  },
];

const PROCESS_STEPS = [
  {
    number: "1",
    title: "Input Historical Data",
    text: "Take the final three drawn numbers from your current game log and enter them into the prediction calculator widget.",
    status: "completed",
    category: "Data Entry",
  },
  {
    number: "2",
    title: "Algorithmic Processing",
    text: "The software cross-references these digits against thousands of past drawing patterns to identify mathematical correlations.",
    status: "current",
    category: "Analysis",
  },
  {
    number: "3",
    title: "Evaluate the Output",
    text: "Review the suggested BIG or SMALL indicator, noting the confidence percentage provided, to help inform your personal gameplay strategy.",
    status: "upcoming",
    category: "Decision",
  },
];

const MARKET_CARDS = [
  {
    country: "India",
    image: "/india.jpg",
    role: "Primary Server",
    latency: "<35ms",
    uptime: "99.99%",
  },
  {
    country: "Bangladesh",
    image: "/Bangladesh.jpg",
    role: "Dedicated Node",
    latency: "<42ms",
    uptime: "99.97%",
  },
  {
    country: "Pakistan",
    image: "/Pakistan.jpg",
    role: "Optimized Routing",
    latency: "<48ms",
    uptime: "99.95%",
  },
  {
    country: "Nepal",
    image: "/Nepal.jpg",
    role: "Regional Edge",
    latency: "<38ms",
    uptime: "99.98%",
  },
];

function AndroidIcon() {
  return (
    <svg className="loader-platform-icon-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="22" height="22">
      <path d="M17.6 9.48l1.84-3.18c.16-.31.06-.7-.25-.86a.566.566 0 0 0-.77.22l-1.88 3.24A11.51 11.51 0 0 0 12 8c-1.84 0-3.56.43-5.06 1.2L5.06 5.96a.566.566 0 0 0-.77-.22c-.31.16-.41.55-.25.86l1.84 3.18C3.12 11.75 1.25 14.88 1 18.5h22c-.25-3.62-2.12-6.75-4.9-9.02zM8 14.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm8 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="loader-platform-icon-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="22" height="22">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.51-.63.73-1.18 1.87-1.03 2.98.66.08 1.9-.55 2.96-1.43z" />
    </svg>
  );
}

function WindowsIcon() {
  return (
    <svg className="loader-platform-icon-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="22" height="22">
      <path d="M3 3h8.5v8.5H3V3zm9.5 0H21v8.5h-8.5V3zM3 12.5h8.5V21H3v-8.5zm9.5 0H21V21h-8.5v-8.5z" />
    </svg>
  );
}

function MacIcon() {
  return (
    <svg className="loader-platform-icon-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="22" height="22">
      <path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
    </svg>
  );
}

const PLATFORM_CARDS = [
  { name: "Android", icon: <AndroidIcon />, brand: "android" },
  { name: "iOS", icon: <AppleIcon />, brand: "ios" },
  { name: "Windows PC", icon: <WindowsIcon />, brand: "windows" },
  { name: "macOS", icon: <MacIcon />, brand: "macos" },
];

const SIGNAL_TYPES = [
  { title: "Number Signal", tag: "Digit 0-9", text: "The most relevant digit from the recent pattern, ranked as the primary recommendation for the current period." },
  { title: "Color Signal", tag: "Green / Violet / Red", text: "Color estimate derived from the number mapping and the latest color distribution." },
  { title: "Size Signal", tag: "Big (5-9) / Small (0-4)", text: "Size estimate that reflects whether the recent trend favors larger or smaller digits." },
  { title: "Hot Signal", tag: "Most Frequent", text: "The number appearing most often in recent rounds, tracked live on the signal panel." },
  { title: "Cold Signal", tag: "Long Quiet", text: "Numbers that have stayed quiet and may surface in trend analysis." },
];

const DASHBOARD_FEATURES = [
  { title: "Win Accuracy", tag: "Real data", text: "The percentage of your settled predictions that matched the result, recalculated from real history." },
  { title: "Prediction Totals", tag: "Live count", text: "Total predictions, wins, and losses during your current session." },
  { title: "Period Timer", tag: "30s cycle", text: "Live countdown to the next Wingo30 result so you always predict the right period." },
  { title: "Hot Signal", tag: "Frequency", text: "The number with the highest recent frequency across the live sample." },
  { title: "Frequency Board", tag: "0-9", text: "How often each digit (0-9) has appeared, giving the full context behind a signal." },
  { title: "Latest Result", tag: "Settled", text: "The most recent settled number and size for reference before the next period." },
];

const MODELS = [
  {
    name: "Korven",
    price: "₹749",
    tag: "Entry-level",
    profile: "Usually fixes the result within 3-4 levels of analysis.",
    features: ["Lifetime premium access", "Unlimited predictions", "Full analytics dashboard"],
  },
  {
    name: "FX1",
    price: "₹1,100",
    tag: "Faster Engine",
    profile: "Usually fixes the result within about 2 levels - the quickest profile.",
    features: ["Lifetime premium access", "Unlimited predictions", "Full analytics dashboard"],
  },
];

const LOADER_FAQS = [
  {
    question: "What is TRION AI?",
    answer: "TRION AI is an AI-powered prediction and signals platform for the Wingo 30-second game. It analyzes real-time drawing history and statistical patterns to generate number, color, and size signals for each new period.",
  },
  {
    question: "How does the prediction tool work?",
    answer: "The tool fetches the latest Wingo30 game history, runs pattern and statistical analysis, and returns a signal for the current period. Signals are shown as number (0-9), color (Green, Violet, Red), and size (Big/Small) on the prediction screen.",
  },
  {
    question: "How long is a Wingo 30-second period?",
    answer: "A new Wingo30 period starts every 30 seconds. TRION AI refreshes live history in sync with that cycle, so signals always target the current period with a live countdown.",
  },
  {
    question: "What is the difference between Korven and FX1?",
    answer: "The Korven model (₹749) and FX1 model (₹1,100) use different analysis approaches. FX1 is positioned for faster result convergence. Both include lifetime premium access after payment verification.",
  },
  {
    question: "How do I activate premium access after paying?",
    answer: "Pay on the Subscription page, then submit the 12-digit UTR ID from your payment receipt (GPay, Paytm, PhonePe). Our team verifies the transaction and unlocks your account.",
  },
  {
    question: "Do I need a Google account to use the tool?",
    answer: "Yes. TRION AI uses Google OAuth for secure sign-in. You never create a password on the platform.",
  },
  {
    question: "Does TRION AI guarantee wins?",
    answer: "No. Predictions are statistical estimates based on history and patterns. No platform can guarantee Wingo results. TRION AI focuses on transparent signals and responsible play.",
  },
  {
    question: "Is there a developer API?",
    answer: "Yes. TRION AI provides a developer portal with real-time Wingo30 game data, API keys, and endpoint documentation.",
  },
  {
    question: "How can I contact support?",
    answer: "Use the contact page or join the official Telegram channel. Support covers activation, payments, and product questions.",
  },
  {
    question: "Where can I read the legal terms?",
    answer: "Our privacy policy, terms and conditions, and refund policy are linked in the footer of every page.",
  },
];

const ABOUT_FEATURES = [
  {
    title: "Live Prediction Tool",
    tag: "One tap",
    text: "Generate a signal for the current period with a single tap using real-time Wingo30 analysis.",
  },
  {
    title: "Trend & Hot-Cold",
    tag: "Patterns",
    text: "See which numbers repeat most and which are due, tracked live on the signal panel.",
  },
  {
    title: "Analytics Dashboard",
    tag: "Honest stats",
    text: "Win rate, prediction history, and frequency board computed from real settled results.",
  },
  {
    title: "Premium Models",
    tag: "Lifetime",
    text: "Korven (₹749) and FX1 (₹1,100) profiles, both with lifetime premium access after verification.",
  },
  {
    title: "Developer API",
    tag: "For builders",
    text: "Real-time Wingo30 game data, API keys, and endpoint documentation for developers.",
  },
  {
    title: "Google Sign-In",
    tag: "Secure",
    text: "Passwordless sign-in with Google OAuth - no passwords stored on the platform.",
  },
];

const CYCLE_POINTS = [
  {
    title: "Auto-refresh history",
    text: "The latest Wingo30 results are pulled from the live game feed continuously, every few seconds.",
  },
  {
    title: "Period-aware signals",
    text: "Predictions always reference the exact current issue number and show a live countdown.",
  },
  {
    title: "Result comparison",
    text: "Your predictions are matched against settled periods, so win and loss stats are based on real results.",
  },
];

/* ─── Icons ──────────────────────────────────────────────────────────────── */

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/* Premium multi-layer TRION AI icon */
const TrionIcon = memo(function TrionIcon() {
  return (
    <svg className="loader-ai-icon" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="tri-bg" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F0F8F4" />
          <stop offset="1" stopColor="#EAF7F1" />
        </linearGradient>

        <linearGradient id="tri-wave" x1="10" y1="34" x2="54" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#087A52" />
          <stop offset="0.5" stopColor="#0A9F68" />
          <stop offset="1" stopColor="#34C28B" />
        </linearGradient>
      </defs>

      <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#tri-bg)" stroke="#D1E8DC" strokeWidth="1.2" />
      <path
        className="loader-ai-icon-line"
        d="M14 34h8l5-12 6 20 5-14h12"
        stroke="url(#tri-wave)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="48" cy="20" r="2.5" fill="#0A9F68" />
    </svg>
  );
});

/* ─── Loading Screen Component ───────────────────────────────────────────── */

const LoadingScreen = memo(function LoadingScreen({ onComplete, autoDismiss = false, error = "" }) {
  const [phase, setPhase] = useState("idle");
  const [dismissing, setDismissing] = useState(false);
  const startButtonRef = useRef(null);
  const exitTimerRef = useRef(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState([]);

  const toggleAccordion = (index) => {
    setOpenFaq((prev) => {
      const indexExists = prev.includes(index);
      if (indexExists) {
        return prev.filter((activeIdx) => activeIdx !== index);
      }
      return [...prev, index];
    });
  };

  const handleTelegramClick = (e) => {
    e.preventDefault();
    window.open(TELEGRAM_URL, "_blank", "noopener,noreferrer");
  };

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
    const bannerTimer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % BANNERS.length);
    }, 3500);
    return () => clearInterval(bannerTimer);
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

  const handleKeyDown = useCallback((event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      handleDismiss();
    }
  }, [handleDismiss]);

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
      <div className="loader-shell">
        <main className={`loader-content${isVisible ? " loader-content--visible" : ""}`}>

          {/* ── HERO ── */}
          <section className="loader-hero" aria-labelledby="loader-title">
            <div className="loader-banner" aria-label="TRION AI banner gallery">
              {BANNERS.map((banner, index) => (
                <figure
                  className={`loader-banner-slide ${index === currentBannerIndex ? "loader-banner-slide--active" : ""}`}
                  key={banner.src}
                >
                  <Image
                    src={banner.src}
                    alt={banner.alt}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 575px) 100vw, 575px"
                  />
                </figure>
              ))}

              {/* Slide indicators */}
              <div className="loader-banner-dots" aria-hidden="true">
                {BANNERS.map((_, i) => (
                  <span
                    key={i}
                    className={`loader-banner-dot ${i === currentBannerIndex ? "loader-banner-dot--active" : ""}`}
                  />
                ))}
              </div>
            </div>

            <div className="loader-hero-copy">
              <div className="loader-hero-header">
                <div className="loader-hero-badge">
                  <span className="loader-hero-badge-dot" aria-hidden="true" />
                  Live AI Engine
                </div>

                <div className="loader-hero-title-wrap">
                  <SparklesText
                    text="TRION AI"
                    className="loader-hero-title text-5xl sm:text-6xl tracking-tight uppercase"
                    colors={{ first: "#087A52", second: "#0A9F68" }}
                  />
                </div>

                <p className="loader-description" id="loader-description">
                  Get live Wingo signal updates and Wingo AI prediction insights for BIG/SMALL and color
                  games. Track rounds, compare patterns, and use the Wingo tools with data-driven confidence.
                </p>
              </div>

              {error && (
                <div className="loader-error" role="alert">
                  <span>{error}</span>
                </div>
              )}

              <div className="loader-actions">
                <button
                  className="loader-btn-primary"
                  type="button"
                  onClick={handleDismiss}
                  disabled={dismissing}
                  aria-busy={dismissing}
                  ref={startButtonRef}
                  id="loader-start-btn"
                >
                  {dismissing ? (
                    <>
                      <svg className="loader-btn-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                        <path d="M12 2a10 10 0 0 1 10 10"/>
                      </svg>
                      <span>Opening…</span>
                    </>
                  ) : (
                    <>
                      <span>Get Started</span>
                      <svg className="loader-btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h14"/>
                        <path d="m12 5 7 7-7 7"/>
                      </svg>
                    </>
                  )}
                </button>

                <button
                  className="loader-btn-secondary"
                  type="button"
                  onClick={handleTelegramClick}
                  aria-label="Join Official Telegram Channel"
                >
                  <svg className="loader-btn-tg-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M21.5 4.2 17.8 20c-.22.94-.96 1.18-1.74.73l-4.86-3.57-2.34 2.26c-.26.26-.48.48-.98.48l.35-4.97 9.03-8.16c.39-.35-.09-.54-.6-.2L5.26 13.27.38 11.76c-1.04-.32-.98-.96.22-1.42L19.88 2.7c.87-.3 1.64.2 1.62 1.5Z"/>
                  </svg>
                  <span>Join Telegram</span>
                </button>
              </div>

              <div className="loader-scroll-hint" aria-hidden="true">
                <span className="loader-scroll-hint-text">Scroll to explore</span>
                <span className="loader-scroll-hint-arrow" />
              </div>
            </div>
          </section>

          {/* ── OVERVIEW ── */}
          <section className="loader-overview" aria-labelledby="loader-overview-title">
            <div className="loader-section-header">
              <span className="loader-section-eyebrow">AI Overview Summary</span>
              <h2 className="loader-section-title" id="loader-overview-title">
                Wingo Signal, Tool &amp; AI Prediction Hub
              </h2>
              <p className="loader-section-copy">
                Wingo Signals is a Wingo tool hub for checking Wingo signal pages, Wingo 30-second
                prediction, color prediction, TRION AI answers, and recent BIG/SMALL game history.
              </p>
            </div>

            <div className="loader-overview-cards">
              {OVERVIEW_ITEMS.map((item, index) => (
                <article className="loader-overview-card" key={item.title}>
                  <div className="loader-overview-card-header">
                    <div className="loader-card-icon-badge">
                      {index === 0 && <LightbulbIcon />}
                      {index === 1 && <TargetIcon />}
                      {index === 2 && <CompassIcon />}
                    </div>
                    <h3>{item.title}</h3>
                  </div>
                  <p className="loader-overview-card-body">{item.text}</p>
                  <div className="loader-overview-card-pills">
                    {OVERVIEW_PILLS[index].map((pill) => (
                      <span className="loader-pill" key={pill}>{pill}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="loader-overview-stats">
              {OVERVIEW_STATS.map((stat) => (
                <div className="loader-stat-box" key={stat.label}>
                  <div className="loader-stat-value">{stat.value}</div>
                  <div className="loader-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── SIGNALS ── */}
          <section className="loader-signals" aria-labelledby="loader-signals-title">
            <div className="loader-section-header">
              <span className="loader-section-eyebrow">Signals &amp; Indicators</span>
              <h2 className="loader-section-title" id="loader-signals-title">
                Number, Color &amp; Size Signals
              </h2>
              <p className="loader-section-copy">
                TRION AI turns Wingo30 history into structured signals: which numbers are hot, which
                colors are trending, and whether the pattern favors Big or Small.
              </p>
            </div>

            <div className="loader-signal-grid">
              {SIGNAL_TYPES.map((signal, index) => (
                <article className="loader-signal-card" key={signal.title}>
                  <div className="loader-card-icon-badge">
                    {index === 0 && <Hash size={18} />}
                    {index === 1 && <Palette size={18} />}
                    {index === 2 && <Maximize2 size={18} />}
                    {index === 3 && <Flame size={18} />}
                    {index === 4 && <Snowflake size={18} />}
                  </div>
                  <div className="loader-signal-body">
                    <div className="loader-signal-head">
                      <h3>{signal.title}</h3>
                      <span className="loader-pill">{signal.tag}</span>
                    </div>
                    <p>{signal.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ── 30S CYCLE ── */}
          <section className="loader-cycle" aria-labelledby="loader-cycle-title">
            <div className="loader-section-header">
              <span className="loader-section-eyebrow">Wingo30 Analysis</span>
              <h2 className="loader-section-title" id="loader-cycle-title">
                Wingo 30 Second Prediction Cycle
              </h2>
              <p className="loader-section-copy">
                Every 30 seconds a new Wingo30 period begins. TRION AI tracks the cycle in real time,
                shows the countdown, and aligns each signal with the next draw.
              </p>
            </div>

            <div className="loader-cycle-grid">
              {CYCLE_POINTS.map((point, index) => (
                <article className="loader-cycle-card" key={point.title}>
                  <div className="loader-step-number">{index + 1}</div>
                  <div className="loader-cycle-content">
                    <h3>{point.title}</h3>
                    <p>{point.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ── DASHBOARD ── */}
          <section className="loader-dashboard" aria-labelledby="loader-dashboard-title">
            <div className="loader-section-header">
              <span className="loader-section-eyebrow">Live Analytics</span>
              <h2 className="loader-section-title" id="loader-dashboard-title">
                TRION AI Analytics Dashboard
              </h2>
              <p className="loader-section-copy">
                Win accuracy, prediction totals, live period timers, and frequency distribution —
                all computed from real Wingo30 settled results.
              </p>
            </div>

            <div className="loader-dashboard-grid">
              {DASHBOARD_FEATURES.map((feature, index) => (
                <article className="loader-dashboard-card" key={feature.title}>
                  <div className="loader-card-icon-badge">
                    {index === 0 && <TrendingUp size={18} />}
                    {index === 1 && <ListChecks size={18} />}
                    {index === 2 && <Timer size={18} />}
                    {index === 3 && <Flame size={18} />}
                    {index === 4 && <BarChart3 size={18} />}
                    {index === 5 && <CircleDot size={18} />}
                  </div>
                  <div className="loader-dashboard-body">
                    <div className="loader-dashboard-head">
                      <h3>{feature.title}</h3>
                      <span className="loader-pill">{feature.tag}</span>
                    </div>
                    <p>{feature.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ── MODELS ── */}
          <section className="loader-models" aria-labelledby="loader-models-title">
            <div className="loader-section-header">
              <span className="loader-section-eyebrow">Prediction Profiles</span>
              <h2 className="loader-section-title" id="loader-models-title">
                Korven vs FX1 AI Models
              </h2>
              <p className="loader-section-copy">
                Two lifetime premium profiles with unlimited predictions and full dashboard
                analytics. Pick the profile that fits your analytical approach.
              </p>
            </div>

            <div className="loader-models-grid">
              {MODELS.map((model, index) => (
                <article className={`loader-model-card${index === 1 ? " loader-model-card--featured" : ""}`} key={model.name}>
                  <div className="loader-model-head">
                    <div className="loader-card-icon-badge">
                      {index === 0 ? <Crown size={18} /> : <Rocket size={18} />}
                    </div>
                    <span className="loader-pill">{model.tag}</span>
                  </div>
                  <h3>{model.name}</h3>
                  <div className="loader-model-price">
                    {model.price}<span> / lifetime</span>
                  </div>
                  <p className="loader-model-profile">{model.profile}</p>
                  <ul className="loader-model-features">
                    {model.features.map((feat) => (
                      <li key={feat}>
                        <CheckIcon />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="loader-notice-box">
              <strong>Notice:</strong> Model performance reflects statistical estimation, not guaranteed outcomes.
              RNG outcomes are independent. Play responsibly.
            </div>
          </section>

          {/* ── PROCESS ── */}
          <section className="loader-process" aria-labelledby="loader-process-title">
            <div className="loader-section-header">
              <span className="loader-section-eyebrow">Workflow</span>
              <h2 className="loader-section-title" id="loader-process-title">
                Understanding the Prediction Process
              </h2>
              <p className="loader-section-copy">
                How complex mathematical models translate into an intuitive, actionable format.
              </p>
            </div>

            <div className="loader-timeline">
              {PROCESS_STEPS.map((step) => (
                <div className="loader-timeline-step" key={step.number}>
                  <div className="loader-timeline-icon">
                    {step.status === "completed" ? (
                      <CheckCircle size={18} className="text-[#0A9F68]" />
                    ) : step.status === "current" ? (
                      <Clock size={18} className="text-[#087A52]" />
                    ) : (
                      <Circle size={18} className="text-[#9CA8A3]" />
                    )}
                  </div>
                  <div className="loader-timeline-content">
                    <div className="loader-timeline-content-header">
                      <div className="loader-timeline-content-info">
                        <h3>{step.title}</h3>
                        {step.category && <span className="loader-timeline-category">{step.category}</span>}
                      </div>
                      <span className={`loader-status-badge loader-status-badge--${step.status}`}>
                        {step.status === "completed" ? "Completed" : step.status === "current" ? "In Progress" : "Pending"}
                      </span>
                    </div>
                    <p>{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── MARKETS ── */}
          <section className="loader-markets" aria-labelledby="loader-markets-title">
            <div className="loader-section-header">
              <span className="loader-section-eyebrow">Multi-Region Coverage</span>
              <h2 className="loader-section-title" id="loader-markets-title">
                Available Across South Asia
              </h2>
              <p className="loader-section-copy">
                TRION Signals provides low-latency data feeds optimized for South Asian servers.
              </p>
            </div>

            <div className="loader-coverage-grid">
              {MARKET_CARDS.map((market) => (
                <article className="loader-coverage-card" key={market.country}>
                  <div className="loader-coverage-flag">
                    <Image
                      src={market.image}
                      alt={`${market.country} server node`}
                      width={48}
                      height={48}
                    />
                  </div>
                  <div className="loader-coverage-info">
                    <div className="loader-coverage-head">
                      <h3>{market.country}</h3>
                      <span className="loader-coverage-role">{market.role}</span>
                    </div>
                    <div className="loader-coverage-status">
                      <span className="loader-status-dot" aria-hidden="true" />
                      <span>{market.latency}</span>
                      <span className="loader-sep">•</span>
                      <span>{market.uptime} Uptime</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ── PLATFORM SUPPORT ── */}
          <section className="loader-platforms" aria-labelledby="loader-platforms-title">
            <div className="loader-section-header">
              <span className="loader-section-eyebrow">Cross-Platform</span>
              <h2 className="loader-section-title" id="loader-platforms-title">
                Available on All Platforms
              </h2>
              <p className="loader-section-copy">
                Enjoy a seamless, responsive experience across all your personal devices.
              </p>
            </div>

            <div className="loader-platform-grid">
              {PLATFORM_CARDS.map((platform) => (
                <article className="loader-platform-card" key={platform.name}>
                  <div className="loader-card-icon-badge">
                    {platform.icon}
                  </div>
                  <div className="loader-platform-info">
                    <h3>{platform.name}</h3>
                    <div className="loader-platform-status">
                      <CheckIcon />
                      <span>Supported</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ── LIVE INTERFACE ── */}
          <section className="loader-live" aria-labelledby="loader-live-title">
            <div className="loader-section-header">
              <span className="loader-section-eyebrow">Live Interface</span>
              <h2 className="loader-section-title" id="loader-live-title">
                TRION AI App &amp; Signal Preview
              </h2>
              <p className="loader-section-copy">
                Preview the live prediction dashboard and real-time community results.
              </p>
            </div>

            <div className="loader-screenshots" aria-label="TRION AI screenshot gallery">
              <div className="loader-screenshots-track">
                {[
                  { src: "/Withdrawal.jpg",   alt: "Withdrawal interface screenshot" },
                  { src: "/Backtoback.jpg",   alt: "Back-to-back prediction screenshot" },
                  { src: "/Feedback.jpg",     alt: "User feedback screenshot" },
                  { src: "/Oneto.jpg",        alt: "One-to-one signal screenshot" },
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

          {/* ── ABOUT ── */}
          <section className="loader-about" aria-labelledby="loader-about-title">
            <div className="loader-section-header">
              <span className="loader-section-eyebrow">Official Information</span>
              <h2 className="loader-section-title" id="loader-about-title">
                What TRION AI Does
              </h2>
              <p className="loader-section-copy">
                TRION AI is an AI-powered prediction and signals platform built for the Wingo
                30-second game. All signals are probabilistic pattern estimates.
              </p>
            </div>

            <div className="loader-about-grid">
              {ABOUT_FEATURES.map((feature, index) => (
                <article className="loader-about-card" key={feature.title}>
                  <div className="loader-about-head">
                    <span className="loader-about-num">{String(index + 1).padStart(2, "0")}</span>
                    <span className="loader-pill">{feature.tag}</span>
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </article>
              ))}
            </div>

            <div className="loader-notice-box">
              <strong>Responsible use:</strong> TRION AI is an analytical companion tool, not a guarantee of profit.
              Never stake essential funds based on probabilistic predictions.
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="loader-faq" aria-labelledby="loader-faq-title">
            <div className="loader-section-header">
              <span className="loader-section-eyebrow">Help &amp; Support</span>
              <h2 className="loader-section-title" id="loader-faq-title">
                Frequently Asked Questions
              </h2>
              <p className="loader-section-copy">
                Quick answers about the TRION AI prediction engine, models, payments, and activation.
              </p>
            </div>

            <div className="loader-faq-list">
              {LOADER_FAQS.map((faq, idx) => {
                const isOpen = openFaq.includes(idx);
                return (
                  <div className={`loader-faq-item${isOpen ? " loader-faq-item--open" : ""}`} key={faq.question}>
                    <button
                      type="button"
                      className="loader-faq-trigger"
                      onClick={() => toggleAccordion(idx)}
                      aria-expanded={isOpen}
                    >
                      <h3 className="loader-faq-question">{faq.question}</h3>
                      <ChevronDown className="loader-faq-chevron" size={18} />
                    </button>
                    <div className="loader-faq-content">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── THANK YOU / TRUST ── */}
          <section className="loader-thankyou" aria-labelledby="loader-thankyou-title">
            <div className="loader-thankyou-inner">
              <span className="loader-section-eyebrow">From TRION AI</span>
              <h2 className="loader-ty-heading" id="loader-thankyou-title">THANK YOU</h2>

              <p className="loader-ty-sub">
                Thank you for choosing TRION AI — your trusted Wingo signal &amp; prediction companion.
                We are constantly innovating to deliver clean, data-informed insights.
              </p>

              <div className="loader-ty-grid">
                {TRUST_CARDS.map((card) => (
                  <article className="loader-ty-grid-card" key={card.title}>
                    <div className="loader-card-icon-badge">{card.icon}</div>
                    <h4>{card.title}</h4>
                    <p>{card.text}</p>
                  </article>
                ))}
              </div>

              <div className="loader-ty-signature">
                <p className="loader-ty-footer">With care — The TRION AI Team</p>
                <span className="loader-verified-badge">
                  <CheckIcon />
                  Verified Platform
                </span>
              </div>
            </div>
          </section>

        </main>
      </div>

      {/* ── FOOTER ── */}
      <footer className="loader-footer" aria-label="Footer">
        <div className="loader-footer-inner">
          <div className="loader-footer-brand">
            <div className="loader-footer-logo">
              <TrionIcon />
            </div>
            <div className="loader-footer-brand-text">
              <strong>TRION AI</strong>
              <p>AI-powered Wingo30 prediction &amp; signals platform.</p>
            </div>
          </div>

          <div className="loader-footer-links">
            <div className="loader-footer-link-group">
              <h4>Platform</h4>
              <Link href="/subscription">Subscription &amp; Models</Link>
              <Link href="/login">Prediction Tool</Link>
              <Link href="/developer">Developer API</Link>
            </div>

            <div className="loader-footer-link-group">
              <h4>Support</h4>
              <Link href="/contact">Contact Us</Link>
              <button type="button" className="loader-footer-link" onClick={handleTelegramClick}>
                Telegram Channel
              </button>
            </div>

            <div className="loader-footer-link-group">
              <h4>Legal</h4>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms &amp; Conditions</Link>
              <Link href="/refund">Refund Policy</Link>
            </div>
          </div>

          <div className="loader-footer-bottom">
            <span>© {new Date().getFullYear()} TRION AI. All rights reserved.</span>
            <span>Predictions are statistical estimates, not guaranteed results.</span>
          </div>
        </div>
      </footer>

    </section>
  );
});

export default LoadingScreen;
