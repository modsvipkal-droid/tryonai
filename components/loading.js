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
    text: "Enterprise-grade prediction tools trusted by thousands of users.",
  },
  {
    icon: <ZapIcon />,
    title: "Fast & Intelligent",
    text: "Lightning-fast analysis with optimized performance.",
  },
  {
    icon: <LockIcon />,
    title: "Privacy & Security",
    text: "Designed with modern security and privacy standards.",
  },
  {
    icon: <HeartIcon />,
    title: "Continuous Innovation",
    text: "We continuously improve features, performance, and user experience.",
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
    <svg className="loader-platform-icon-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="24" height="24">
      <path d="M17.6 9.48l1.84-3.18c.16-.31.06-.7-.25-.86a.566.566 0 0 0-.77.22l-1.88 3.24A11.51 11.51 0 0 0 12 8c-1.84 0-3.56.43-5.06 1.2L5.06 5.96a.566.566 0 0 0-.77-.22c-.31.16-.41.55-.25.86l1.84 3.18C3.12 11.75 1.25 14.88 1 18.5h22c-.25-3.62-2.12-6.75-4.9-9.02zM8 14.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm8 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="loader-platform-icon-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="24" height="24">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.51-.63.73-1.18 1.87-1.03 2.98.66.08 1.9-.55 2.96-1.43z" />
    </svg>
  );
}

function WindowsIcon() {
  return (
    <svg className="loader-platform-icon-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="24" height="24">
      <path d="M3 3h8.5v8.5H3V3zm9.5 0H21v8.5h-8.5V3zM3 12.5h8.5V21H3v-8.5zm9.5 0H21V21h-8.5v-8.5z" />
    </svg>
  );
}

function MacIcon() {
  return (
    <svg className="loader-platform-icon-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="24" height="24">
      <path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
    </svg>
  );
}

const PLATFORM_CARDS = [
  { name: "Android", icon: <AndroidIcon />, brand: "android", gradient: "linear-gradient(90deg, #3DDC84, #0A9F68)" },
  { name: "iOS", icon: <AppleIcon />, brand: "ios", gradient: "linear-gradient(90deg, #0A9F68, #34C28B)" },
  { name: "Windows PC", icon: <WindowsIcon />, brand: "windows", gradient: "linear-gradient(90deg, #087A52, #0A9F68)" },
  { name: "macOS", icon: <MacIcon />, brand: "macos", gradient: "linear-gradient(90deg, #087A52, #34C28B)" },
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
    tag: "Faster",
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
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/* Premium multi-layer TRION AI icon */
const TrionIcon = memo(function TrionIcon() {
  return (
    <svg className="loader-ai-icon" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        {/* Card fill */}
        <linearGradient id="tri-bg" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F2FAF6" />
          <stop offset="0.45" stopColor="#EAF7F1" />
          <stop offset="1" stopColor="#EAF7F1" />
        </linearGradient>

        {/* Waveform stroke gradient */}
        <linearGradient id="tri-wave" x1="10" y1="34" x2="54" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0A9F68" />
          <stop offset="0.55" stopColor="#34C28B" />
          <stop offset="1" stopColor="#087A52" />
        </linearGradient>

        {/* Outer ring stroke */}
        <linearGradient id="tri-ring" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(255,255,255,0.95)" />
          <stop offset="0.35" stopColor="rgba(52,194,139,0.7)" />
          <stop offset="0.7" stopColor="rgba(10,159,104,0.6)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.5)" />
        </linearGradient>

        {/* Inner ring stroke */}
        <linearGradient id="tri-ring2" x1="64" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(8,122,82,0.4)" />
          <stop offset="0.5" stopColor="rgba(52,194,139,0.3)" />
          <stop offset="1" stopColor="rgba(10,159,104,0.4)" />
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
        fill="#0A9F68"
        opacity="0.85"
      />

      {/* ── Spark: circle dot — top right ── */}
      <circle
        className="loader-ai-icon-spark"
        cx="47" cy="19"
        r="2.6"
        fill="#087A52"
        opacity="0.9"
        style={{ animationDelay: "1s" }}
      />

      {/* ── Spark: small triangle — bottom right ── */}
      <polygon
        className="loader-ai-icon-spark"
        points="50,44 53,49 47,49"
        fill="#34C28B"
        opacity="0.65"
        style={{ animationDelay: "0.5s" }}
      />
    </svg>
  );
});

/* ─── Loading Screen Component ───────────────────────────────────────────── */

const LoadingScreen = memo(function LoadingScreen({ onComplete, autoDismiss = false, error = "" }) {
  const [phase, setPhase] = useState("idle");
  const [dismissing, setDismissing] = useState(false);
  const [telegramClicked, setTelegramClicked] = useState(false);
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
  const coverageRef = useRef(null);
  const coverageItems = useRef([]);
  const platformRef = useRef(null);
  const platformItems = useRef([]);

  const handleTelegramClick = (e) => {
    e.preventDefault();
    if (telegramClicked) return;
    setTelegramClicked(true);
    setTimeout(() => {
      window.open(TELEGRAM_URL, "_blank", "noopener,noreferrer");
      setTelegramClicked(false);
    }, 1000);
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

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const items = coverageItems.current.filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("loader-coverage-card--visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const items = platformItems.current.filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("loader-platform-card--visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

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

              {/* Corner badge SVG overlay */}
              <svg
                className="loader-banner-corner"
                viewBox="0 0 44 44"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="22" cy="22" r="18" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                <path d="M22 14v8l5 3" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" />
                <circle cx="22" cy="22" r="3" fill="rgba(10,159,104,0.9)" />
              </svg>
            </div>

            <div className="loader-hero-copy">
              <div>
                <SparklesText
                  text="TRION AI"
                  className="text-6xl sm:text-7xl font-black tracking-tighter uppercase"
                  colors={{ first: "#087A52", second: "#0A9F68" }}
                />
                <p className="loader-description" id="loader-description">
                  Get live Wingo signal updates and Wingo AI prediction insights for BIG/SMALL and color
                  games. Track rounds, compare patterns, and use the Wingo tools for free.
                </p>
              </div>

              <div className="loader-actions">
                <div className="h-full w-full flex items-center justify-center text-black dark:text-white">
                  <div className="group cursor-pointer border bg-[#EAF7F1] dark:bg-[#EAF7F1] border-[#C7E5D6] bg-card gap-3 h-[68px] flex items-center p-[12px] rounded-2xl">
                  <button
                    data-slot="button"
                    className="cursor-pointer gap-2 whitespace-nowrap text-base font-semibold transition-all shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive backdrop-blur-sm shadow-[inset_0_3px_2px_rgba(255,255,255,0.1),inset_0_-3px_6px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.30),inset_0_-8px_12px_rgba(0,0,0,0.12),0_6px_14px_-8px_rgba(0,0,0,0.18)] hover:bg-[#087A52] hover:border-black/15 hover:shadow-[inset_0_3px_2px_rgba(255,255,255,0.15),inset_0_1px_0_rgba(255,255,255,0.40),inset_0_-10px_14px_rgba(0,0,0,0.16),0_8px_18px_-10px_rgba(0,0,0,0.22)] active:shadow-[inset_0_3px_2px_rgba(255,255,255,0.1),inset_0_1px_3px_rgba(0,0,0,0.22),inset_0_-6px_10px_rgba(0,0,0,0.18)] active:translate-y-[1px] dark:bg-[#0A9F68] px-6 py-3 bg-[#0A9F68] h-[48px] rounded-2xl flex items-center justify-center text-white"
                    type="button"
                    onClick={handleDismiss}
                    disabled={dismissing}
                    aria-busy={dismissing}
                    ref={startButtonRef}
                    id="loader-start-btn"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-life-buoy h-4 w-4 animate-spin"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="m4.93 4.93 4.24 4.24"></path>
                      <path d="m14.83 9.17 4.24-4.24"></path>
                      <path d="m14.83 14.83 4.24 4.24"></path>
                      <path d="m9.17 14.83-4.24 4.24"></path>
                      <circle cx="12" cy="12" r="4"></circle>
                    </svg>
                    <p className="flex items-center gap-2 justify-center">
                      {dismissing ? "Opening…" : "Get Started"}
                    </p>
                  </button>
                  <div className="group-hover:ml-4 ease-in-out transition-all size-[30px] flex items-center justify-center rounded-2xl border border-[#C7E5D6] dark:border-[#C7E5D6]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-arrow-right group-hover:rotate-180 ease-in-out transition-all"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </div>
              </div>

              <div className={`loader-tg-wrapper${telegramClicked ? " loader-tg-wrapper--active" : ""}`}>
                <div className="loader-tg-line horizontal top" />
                <div className="loader-tg-line vertical right" />
                <div className="loader-tg-line horizontal bottom" />
                <div className="loader-tg-line vertical left" />
                <div className="loader-tg-dot top left" />
                <div className="loader-tg-dot top right" />
                <div className="loader-tg-dot bottom right" />
                <div className="loader-tg-dot bottom left" />
                <button className="loader-tg-btn" onClick={handleTelegramClick} type="button">
                  <span className="loader-tg-btn-text">Join Telegram</span>
                  <svg className="loader-tg-btn-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M17.6744 11.4075L15.7691 17.1233C15.7072 17.309 15.5586 17.4529 15.3709 17.5087L3.69348 20.9803C3.22819 21.1186 2.79978 20.676 2.95328 20.2155L6.74467 8.84131C6.79981 8.67588 6.92419 8.54263 7.08543 8.47624L12.472 6.25822C12.696 6.166 12.9535 6.21749 13.1248 6.38876L17.5294 10.7935C17.6901 10.9542 17.7463 11.1919 17.6744 11.4075Z" />
                    <path d="M3.2959 20.6016L9.65986 14.2376" />
                    <path d="M17.7917 11.0557L20.6202 8.22724C21.4012 7.44619 21.4012 6.17986 20.6202 5.39881L18.4989 3.27749C17.7178 2.49645 16.4515 2.49645 15.6704 3.27749L12.842 6.10592" />
                    <path d="M11.7814 12.1163C11.1956 11.5305 10.2458 11.5305 9.66004 12.1163C9.07426 12.7021 9.07426 13.6519 9.66004 14.2376C10.2458 14.8234 11.1956 14.8234 11.7814 14.2376C12.3671 13.6519 12.3671 12.7021 11.7814 12.1163Z" />
                  </svg>
                </button>
              </div>

              <div className="loader-scroll-hint" aria-hidden="true">
                <span className="loader-scroll-hint-text">Scroll for more</span>
                <span className="loader-scroll-hint-arrow" />
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

            <div className="loader-overview-cards">
              {OVERVIEW_ITEMS.map((item, index) => (
                <article className={`loader-overview-card loader-overview-card--${index + 1}`} key={item.title}>
                  <div className="loader-overview-card-header">
                    <div className="loader-overview-card-icon">
                      {index === 0 && <LightbulbIcon />}
                      {index === 1 && <TargetIcon />}
                      {index === 2 && <CompassIcon />}
                    </div>
                    <h3>{item.title}</h3>
                  </div>
                  <p className="loader-overview-card-body">{item.text}</p>
                  <div className="loader-overview-card-pills">
                    {OVERVIEW_PILLS[index].map((pill) => (
                      <span className="loader-overview-card-pill" key={pill}>{pill}</span>
                    ))}
                  </div>
                  <span className="loader-overview-card-num">{index + 1}</span>
                </article>
              ))}
            </div>

            <div className="loader-overview-stats">
              {OVERVIEW_STATS.map((stat, index) => (
                <div className={`loader-overview-stat loader-overview-stat--${index + 1}`} key={stat.label}>
                  <div className="loader-overview-stat-value">{stat.value}</div>
                  <div className="loader-overview-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── SIGNALS ── */}
          <section className="loader-signals" aria-labelledby="loader-signals-title">
            <p className="loader-section-eyebrow">Signals & Indicators</p>
            <h2 className="loader-section-title" id="loader-signals-title">
              Number, Color &amp; Size Wingo Signals
            </h2>
            <p className="loader-section-copy">
              TRION AI turns Wingo30 history into readable signals: which numbers are hot, which
              colors are trending, and whether the pattern favors Big or Small.
            </p>

            <div className="loader-signal-grid">
              {SIGNAL_TYPES.map((signal, index) => (
                <article className="loader-signal-card" key={signal.title}>
                  <div className="loader-signal-icon">
                    {index === 0 && <Hash size={16} />}
                    {index === 1 && <Palette size={16} />}
                    {index === 2 && <Maximize2 size={16} />}
                    {index === 3 && <Flame size={16} />}
                    {index === 4 && <Snowflake size={16} />}
                  </div>
                  <div className="loader-signal-body">
                    <h3>{signal.title}</h3>
                    <span className="loader-signal-tag">{signal.tag}</span>
                    <p>{signal.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ── 30S CYCLE ── */}
          <section className="loader-cycle" aria-labelledby="loader-cycle-title">
            <p className="loader-section-eyebrow">Wingo30 Analysis</p>
            <h2 className="loader-section-title" id="loader-cycle-title">
              Wingo 30 Second Prediction Cycle
            </h2>
            <p className="loader-section-copy">
              Every 30 seconds a new Wingo30 period begins. TRION AI tracks the cycle in real time,
              shows the time remaining for the current period, and aligns every prediction with the
              next result.
            </p>

            <div className="loader-cycle-grid">
              {CYCLE_POINTS.map((point, index) => (
                <article className="loader-cycle-card" key={point.title}>
                  <div className="loader-cycle-num">{index + 1}</div>
                  <h3>{point.title}</h3>
                  <p>{point.text}</p>
                </article>
              ))}
            </div>
          </section>

          {/* ── DASHBOARD ── */}
          <section className="loader-dashboard" aria-labelledby="loader-dashboard-title">
            <p className="loader-section-eyebrow">Analytics</p>
            <h2 className="loader-section-title" id="loader-dashboard-title">
              TRION AI Dashboard – Live Analytics
            </h2>
            <p className="loader-section-copy">
              Win accuracy, prediction totals, the live period timer, hot signals, and the
              frequency board - all computed from real Wingo30 results.
            </p>

            <div className="loader-dashboard-timeline">
              <div className="loader-dashboard-timeline-line" aria-hidden="true" />
              {DASHBOARD_FEATURES.map((feature, index) => (
                <article
                  className={`loader-dashboard-item${index % 2 === 1 ? " loader-dashboard-item--right" : ""}`}
                  key={feature.title}
                >
                  <span className="loader-dashboard-dot" aria-hidden="true" />
                  <div className="loader-dashboard-card">
                    <div className="loader-dashboard-icon">
                      {index === 0 && <TrendingUp size={16} />}
                      {index === 1 && <ListChecks size={16} />}
                      {index === 2 && <Timer size={16} />}
                      {index === 3 && <Flame size={16} />}
                      {index === 4 && <BarChart3 size={16} />}
                      {index === 5 && <CircleDot size={16} />}
                    </div>
                    <span className="loader-dashboard-tag">{feature.tag}</span>
                    <h3>{feature.title}</h3>
                    <p>{feature.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ── MODELS ── */}
          <section className="loader-models" aria-labelledby="loader-models-title">
            <p className="loader-section-eyebrow">Premium Models</p>
            <h2 className="loader-section-title" id="loader-models-title">
              Korven vs FX1 Prediction Models
            </h2>
            <p className="loader-section-copy">
              Two lifetime premium profiles with unlimited predictions and full dashboard
              analytics. Pick the one that fits your approach and budget.
            </p>

            <div className="loader-models-grid">
              {MODELS.map((model, index) => (
                <article className={`loader-model-card${index === 1 ? " loader-model-card--fx1" : ""}`} key={model.name}>
                  <div className="loader-model-head">
                    <div className="loader-model-icon">
                      {index === 0 ? <Crown size={16} /> : <Rocket size={16} />}
                    </div>
                    <span className="loader-model-tag">{model.tag}</span>
                  </div>
                  <h3>{model.name}</h3>
                  <div className="loader-model-price">{model.price}<span> lifetime</span></div>
                  <p className="loader-model-profile">{model.profile}</p>
                  <ul className="loader-model-features">
                    {model.features.map((feat) => (
                      <li key={feat}>
                        <CheckIcon />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="loader-models-note">
              Model performance reflects statistical estimation, not guaranteed outcomes. No
              model can guarantee Wingo results.
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

            <div className="loader-timeline">
              <div className="loader-timeline-line" aria-hidden="true" />
              <motion.div
                className="loader-timeline-line-progress"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                style={{ transformOrigin: "top" }}
                aria-hidden="true"
              />
              {PROCESS_STEPS.map((step, index) => (
                <motion.div
                  className="loader-timeline-step"
                  key={step.number}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
                >
                  <div className="loader-timeline-icon">
                    {step.status === "completed" ? (
                      <CheckCircle size={18} className="loader-timeline-icon-completed" />
                    ) : step.status === "current" ? (
                      <Clock size={18} className="loader-timeline-icon-current" />
                    ) : (
                      <Circle size={18} className="loader-timeline-icon-upcoming" />
                    )}
                  </div>
                  <div className="loader-timeline-content">
                    <div className="loader-timeline-content-header">
                      <div className="loader-timeline-content-info">
                        <h3>{step.title}</h3>
                        {step.category && <span className="loader-timeline-category">{step.category}</span>}
                      </div>
                      <span className={`loader-timeline-badge loader-timeline-badge--${step.status}`}>
                        {step.status === "completed" ? "Completed" : step.status === "current" ? "In Progress" : "Pending"}
                      </span>
                    </div>
                    <p>{step.text}</p>
                    <div className="loader-timeline-progress">
                      <div
                        className={`loader-timeline-progress-bar loader-timeline-progress-bar--${step.status}`}
                        style={{ width: step.status === "completed" ? "100%" : step.status === "current" ? "50%" : "0%" }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── MARKETS ── */}
          <section className="loader-markets" aria-labelledby="loader-markets-title">
            <p className="loader-coverage-badge">MULTI-REGION COVERAGE</p>
            <h2 className="loader-section-title" id="loader-markets-title">
              Available Across South Asia
            </h2>
            <p className="loader-section-copy">
              Wingo Signals works seamlessly in all major South Asian markets with optimized server
              response.
            </p>

            <div className="loader-coverage" ref={coverageRef}>
              <div className="loader-coverage-line" aria-hidden="true" />
              {MARKET_CARDS.map((market, index) => (
                <article
                  className="loader-coverage-card"
                  key={market.country}
                  ref={(el) => { coverageItems.current[index] = el; }}
                >
                  <div className="loader-coverage-node" aria-hidden="true" />
                  <div className="loader-coverage-node-inner" aria-hidden="true" />
                  <div className="loader-coverage-card-inner">
                    <div className="loader-coverage-left">
                      <span className="loader-coverage-flag">
                        <Image
                          src={market.image}
                          alt={`${market.country} server`}
                          width={80}
                          height={80}
                        />
                      </span>
                    </div>
                    <div className="loader-coverage-center">
                      <h3>{market.country}</h3>
                      <p className="loader-coverage-role">{market.role}</p>
                      <div className="loader-coverage-status">
                        <span className="loader-coverage-dot" aria-hidden="true" />
                        <span>Online</span>
                        <span className="loader-coverage-sep">|</span>
                        <span>{market.latency}</span>
                        <span className="loader-coverage-sep">|</span>
                        <span>{market.uptime} Uptime</span>
                      </div>
                    </div>
                    <div className="loader-coverage-right">
                      <span className="loader-coverage-shield">
                        <ShieldIcon />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ── PLATFORM SUPPORT ── */}
          <section className="loader-platforms" aria-labelledby="loader-platforms-title" ref={platformRef}>
            <p className="loader-platform-badge">MULTI-PLATFORM SUPPORT</p>
            <h2 className="loader-section-title" id="loader-platforms-title">
              Available on All Platforms
            </h2>
            <p className="loader-platform-desc">
              Enjoy a seamless experience across all your devices.
            </p>

            <div className="loader-platform-grid">
              {PLATFORM_CARDS.map((platform, index) => (
                <article
                  className="loader-platform-card"
                  key={platform.name}
                  ref={(el) => { platformItems.current[index] = el; }}
                >
                  <div className="loader-platform-watermark" aria-hidden="true">
                    {platform.icon}
                  </div>
                  <div className="loader-platform-icon-container" data-brand={platform.brand}>
                    {platform.icon}
                  </div>
                  <div className="loader-platform-info">
                    <h3>{platform.name}</h3>
                    <div className="loader-platform-status">
                      <span className="loader-platform-check"><CheckIcon /></span>
                      <span>Supported</span>
                    </div>
                  </div>
                  <div className="loader-platform-bar" style={{ background: platform.gradient }} aria-hidden="true" />
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

          {/* ── ABOUT ── */}
          <section className="loader-about" aria-labelledby="loader-about-title">
            <p className="loader-section-eyebrow">Official Information</p>
            <h2 className="loader-section-title" id="loader-about-title">
              What TRION AI Does
            </h2>
            <p className="loader-section-copy">
              TRION AI is an AI-powered prediction and signals platform built for the Wingo
              30-second game. It analyzes live game history to produce number, color, and size
              signals for every new period. All predictions are statistical estimates derived from
              pattern and trend analysis.
            </p>

            <div className="loader-about-grid">
              {ABOUT_FEATURES.map((feature, index) => (
                <article className="loader-about-card" key={feature.title}>
                  <div className="loader-about-head">
                    <span className="loader-about-num">{String(index + 1).padStart(2, "0")}</span>
                    <span className="loader-about-tag">{feature.tag}</span>
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </article>
              ))}
            </div>

            <div className="loader-about-responsible">
              <strong>Responsible use.</strong> TRION AI is an analysis tool, not a guarantee of
              profit. Wingo games are chance-based, and even the best statistical signals can lose.
              Use the platform responsibly and never rely on predictions for essential funds.
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="loader-faq" aria-labelledby="loader-faq-title">
            <p className="loader-section-eyebrow">Help & Support</p>
            <h2 className="loader-section-title" id="loader-faq-title">
              Frequently Asked Questions
            </h2>
            <p className="loader-section-copy">
              Quick answers about the TRION AI prediction tool, premium models, payments, and
              activation.
            </p>

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
                      <h4 className="loader-faq-question">{faq.question}</h4>
                      <ChevronDown className="loader-faq-chevron" size={20} />
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
            {/* Ambient background */}
            <div className="loader-ty-ambient" aria-hidden="true">
              <div className="loader-ty-glow loader-ty-glow--1" />
              <div className="loader-ty-glow loader-ty-glow--2" />
              <div className="loader-ty-glow loader-ty-glow--3" />
            </div>

            {/* Floating particles */}
            <div className="loader-ty-particles" aria-hidden="true">
              <span className="loader-ty-particle loader-ty-particle--1" />
              <span className="loader-ty-particle loader-ty-particle--2" />
              <span className="loader-ty-particle loader-ty-particle--3" />
              <span className="loader-ty-particle loader-ty-particle--4" />
            </div>

            <div className="loader-thankyou-inner">
              {/* Premium top badge */}
              <p className="loader-ty-label">FROM TRION AI</p>

              {/* Hero title with blurred watermark */}
              <div className="loader-ty-title-wrap">
                <span className="loader-ty-watermark" aria-hidden="true">THANK YOU</span>
                <h2 className="loader-ty-heading" id="loader-thankyou-title">THANK YOU</h2>
              </div>

              {/* Appreciation message */}
              <p className="loader-ty-sub">
                Thank you for choosing TRION AI — your trusted Wingo signal &amp; prediction
                companion. We are constantly improving to give you the best signals, tools, and
                insights. Stay tuned, play smart, and keep winning! 🚀
              </p>

              {/* 2×2 Trust grid */}
              <div className="loader-ty-grid">
                {TRUST_CARDS.map((card, index) => (
                  <article className="loader-ty-grid-card" key={card.title}>
                    <div className="loader-ty-grid-icon">{card.icon}</div>
                    <h4 className="loader-ty-grid-title">{card.title}</h4>
                    <p className="loader-ty-grid-text">{card.text}</p>
                  </article>
                ))}
              </div>

              {/* Animated gradient divider */}
              <div className="loader-ty-divider" aria-hidden="true" />

              {/* Signature + verified badge */}
              <div className="loader-ty-signature">
                <p className="loader-ty-footer">With ❤️ — The TRION AI Team</p>
                <span className="loader-ty-verified">
                  <CheckIcon />
                  Verified Platform
                </span>
              </div>
            </div>
          </section>

{/* ── FOOTER ── */}
          <footer className="loader-footer" aria-label="Footer">
            <div className="loader-footer-inner">
              {/* Brand section - horizontal compact layout */}
              <div className="loader-footer-brand">
                <div className="loader-footer-logo">
                  <TrionIcon />
                </div>
                <div className="loader-footer-brand-text">
                  <strong>TRION AI</strong>
                  <p>AI-powered Wingo30 prediction & signals platform.</p>
                </div>
              </div>

              {/* Links grid - 2 columns: PLATFORM | SUPPORT */}
              <div className="loader-footer-links">
                <div className="loader-footer-link-group">
                  <h4>PLATFORM</h4>
                  <Link href="/subscription">Subscription & Models</Link>
                  <Link href="/login">Prediction Tool</Link>
                  <Link href="/developer">Developer API</Link>
                </div>

                <div className="loader-footer-link-group">
                  <h4>SUPPORT</h4>
                  <Link href="/contact">Contact Us</Link>
                  <button type="button" className="loader-footer-link" onClick={handleTelegramClick}>
                    Telegram Channel
                  </button>
                </div>
              </div>

              {/* Legal section */}
              <div className="loader-footer-legal">
                <h4>LEGAL</h4>
                <div className="loader-footer-legal-links">
                  <Link href="/privacy">Privacy Policy</Link>
                  <Link href="/terms">Terms & Conditions</Link>
                  <Link href="/refund">Refund Policy</Link>
                </div>
              </div>

              {/* Divider */}
              <div className="loader-footer-divider" aria-hidden="true" />

              {/* Copyright & disclaimer */}
              <div className="loader-footer-bottom">
                <span>© {new Date().getFullYear()} TRION AI. All rights reserved.</span>
                <span>Predictions are statistical estimates, not guaranteed results.</span>
              </div>
            </div>
          </footer>

        </main>
      </div>
    </section>
  );
});

export default LoadingScreen;
