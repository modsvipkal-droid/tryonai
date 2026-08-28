import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PageHead, BreadcrumbSchema, FAQSchema, WebPageSchema } from "@/components/SEO";
import ContentCard, { smartCardStyles } from "@/components/ContentCard";
import SiteFooter from "@/components/SiteFooter";

// ── Premium SVG Icons ─────────────────────────────────────────────────────────
const IconGamepad = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="6" y1="12" x2="10" y2="12" />
    <line x1="8" y1="10" x2="8" y2="14" />
    <line x1="15" y1="13" x2="15.01" y2="13" />
    <line x1="18" y1="11" x2="18.01" y2="11" />
    <rect x="2" y="6" width="20" height="12" rx="2" />
  </svg>
);

const IconClockTimer = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconListCheck = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

const IconTrendingUp = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const IconChevronDown = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ── Page-scoped styles ────────────────────────────────────────────────────────
const pageStyles = `
  html {
    height: auto !important;
    min-height: 100% !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    scroll-behavior: smooth !important;
    -webkit-overflow-scrolling: touch !important;
  }

  body {
    height: auto !important;
    min-height: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    background-color: #fbfdfc !important;
    color: #1e293b !important;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    overscroll-behavior-y: auto !important;
    -webkit-overflow-scrolling: touch !important;
  }

  #__next {
    height: auto !important;
    min-height: 100% !important;
    overflow: visible !important;
  }

  .wg-page-shell {
    min-height: 100vh;
    width: 100%;
    background: radial-gradient(100% 40% at 50% 0%, #f0f7f3 0%, #fbfdfc 100%);
    color: #1e293b;
    overflow-x: hidden;
    overflow-y: visible;
  }

  .wg-wrap {
    max-width: 880px;
    margin: 0 auto;
    padding: 40px 24px 80px;
  }

  /* Back Button */
  .wg-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #475569;
    font-weight: 500;
    font-size: 14px;
    margin-bottom: 28px;
    cursor: pointer;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    padding: 8px 14px;
    border-radius: 10px;
    outline: none;
    transition: all 0.15s ease;
    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
  }
  .wg-back:hover {
    color: #00985b;
    border-color: #d1eedf;
    background: #f4fbf7;
    transform: translateX(-2px);
  }
  .wg-back:focus-visible {
    outline: 2px solid #00985b;
    outline-offset: 2px;
  }

  /* Hero Section */
  .wg-hero {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 20px;
    padding: 36px 32px;
    margin-bottom: 36px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.03), 0 4px 20px rgba(0,152,91,0.03);
    position: relative;
  }

  .wg-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #eef8f3;
    border: 1px solid #d1eedf;
    color: #008751;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 9999px;
    margin-bottom: 16px;
  }
  .wg-badge-dot {
    width: 6px;
    height: 6px;
    background: #00985b;
    border-radius: 50%;
    animation: pulseDot 2s infinite;
  }
  @keyframes pulseDot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(1.2); }
  }

  h1.wg-h1 {
    font-size: clamp(24px, 4.5vw, 34px);
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 12px;
    line-height: 1.25;
    letter-spacing: -0.02em;
  }
  h1.wg-h1 .accent { color: #00985b; }
  h1.wg-h1 .accent2 { color: #007043; }

  .wg-subtitle {
    font-size: 15.5px;
    color: #475569;
    margin: 0;
    line-height: 1.65;
    max-width: 720px;
  }

  /* Stats Grid */
  .wg-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
    margin-top: 24px;
  }
  .wg-stat {
    background: #f8faf9;
    border: 1px solid #e6ede9;
    border-radius: 12px;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .wg-stat-label {
    font-size: 11px;
    color: #64748b;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .wg-stat-val {
    font-size: 13.5px;
    color: #0f172a;
    font-weight: 700;
  }

  /* Body Content */
  .wg-body {
    line-height: 1.75;
    color: #334155;
  }
  .wg-body p {
    margin: 0 0 18px;
    font-size: 15px;
    color: #334155;
  }
  .wg-body strong {
    color: #0f172a;
    font-weight: 600;
  }

  /* Section Titles */
  .wg-section {
    margin: 44px 0 0;
  }
  .wg-section h2 {
    font-size: clamp(19px, 3.5vw, 24px);
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 6px;
    letter-spacing: -0.015em;
    line-height: 1.3;
  }
  .wg-section-sub {
    font-size: 14px;
    color: #64748b;
    font-weight: 400;
    margin: 0 0 20px;
  }

  /* Feature Grid */
  .wg-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    margin: 22px 0 12px;
  }
  .wg-feat {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 22px 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
  }
  .wg-feat:hover {
    border-color: #cbd5e1;
    transform: translateY(-2px);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
  }
  .wg-icon-badge {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: #eef8f3;
    border: 1px solid #d1eedf;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #008751;
    margin-bottom: 14px;
    transition: transform 0.2s ease, background-color 0.2s ease;
  }
  .wg-feat:hover .wg-icon-badge {
    background: #e0f4ea;
    transform: scale(1.05);
    color: #00985b;
  }
  .wg-feat-title { font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
  .wg-feat-desc  { font-size: 13px; color: #475569; line-height: 1.55; }

  /* Signal Row Cards */
  .wg-signal-row {
    display: flex;
    align-items: center;
    gap: 14px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 14px 18px;
    margin-bottom: 10px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .wg-signal-row:hover {
    border-color: #cbd5e1;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .wg-signal-pill {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 9999px;
    flex-shrink: 0;
  }
  .pill-big    { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
  .pill-small  { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
  .pill-green  { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
  .pill-red    { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
  .pill-violet { background: #faf5ff; color: #6b21a8; border: 1px solid #e9d5ff; }
  .wg-signal-text {
    font-size: 14px;
    color: #334155;
    line-height: 1.5;
  }
  .wg-signal-text strong {
    color: #0f172a;
  }

  /* Divider */
  .wg-divider {
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 44px 0;
  }

  /* Notice / Alert */
  .wg-notice {
    background: #fefce8;
    border: 1px solid #fef08a;
    border-radius: 12px;
    padding: 16px 20px;
    color: #854d0e;
    font-size: 14px;
    line-height: 1.6;
    margin: 24px 0;
  }
  .wg-notice strong { color: #713f12; }

  /* Info Highlight */
  .wg-highlight {
    background: #f8faf9;
    border-left: 3px solid #00985b;
    border-radius: 0 12px 12px 0;
    padding: 16px 20px;
    margin: 24px 0;
    font-size: 14.5px;
    color: #1e293b;
    line-height: 1.65;
  }

  /* FAQ Accordion List */
  .wg-faq-item {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    margin-bottom: 12px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
    overflow: hidden;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .wg-faq-item:hover {
    border-color: #cbd5e1;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  }
  .wg-faq-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 20px;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    gap: 12px;
  }
  .wg-faq-header:focus-visible {
    outline: 2px solid #00985b;
    outline-offset: -2px;
  }
  .wg-faq-q {
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .wg-faq-num {
    flex-shrink: 0;
    background: #eef8f3;
    color: #008751;
    font-size: 12px;
    font-weight: 700;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .wg-faq-icon {
    flex-shrink: 0;
    color: #64748b;
    transition: transform 0.2s ease;
  }
  .wg-faq-icon.open {
    transform: rotate(180deg);
    color: #00985b;
  }
  .wg-faq-a {
    font-size: 14.5px;
    color: #475569;
    line-height: 1.65;
    margin: 0;
    padding: 0 20px 18px 56px;
  }

  /* Quick Navigation Cards */
  .wg-quick-links {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 14px;
    margin-top: 24px;
  }
  .wg-link-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-decoration: none;
    color: #1e293b;
    font-size: 13.5px;
    font-weight: 600;
    transition: all 0.15s ease;
  }
  .wg-link-card:hover {
    border-color: #00985b;
    background: #f4fbf7;
    color: #00985b;
    transform: translateY(-1px);
  }

  /* Conclusion Box */
  .wg-conclusion {
    background: linear-gradient(180deg, #ffffff 0%, #f4fbf7 100%);
    border: 1px solid #d1eedf;
    border-radius: 18px;
    padding: 32px 28px;
    margin-top: 48px;
    box-shadow: 0 2px 8px rgba(0, 152, 91, 0.03);
  }
  .wg-conclusion h2 {
    font-size: 19px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 10px;
  }
  .wg-conclusion p {
    font-size: 15px;
    color: #334155;
    line-height: 1.7;
    margin: 0;
  }

  /* Responsive Adjustments */
  @media (max-width: 640px) {
    .wg-wrap { padding: 24px 18px 60px; }
    .wg-hero { padding: 24px 20px; border-radius: 16px; margin-bottom: 28px; }
    .wg-section h2 { font-size: 18px; }
    .wg-faq-header { padding: 14px 16px; }
    .wg-faq-q { font-size: 14px; gap: 8px; }
    .wg-faq-a { padding: 0 16px 14px 44px; font-size: 13.5px; }
    .wg-stats { grid-template-columns: 1fr 1fr; gap: 8px; }
    .wg-signal-row { flex-direction: column; align-items: flex-start; gap: 8px; }
  }
`;

// ── Feature Items ─────────────────────────────────────────────────────────────
const CORE_PILLARS = [
  {
    icon: <IconGamepad />,
    title: "Draw Structure",
    desc: "Single digit selection from 0 through 9 combined with colour mappings across Red, Green, and Violet categories."
  },
  {
    icon: <IconClockTimer />,
    title: "Paced Countdown",
    desc: "Scheduled rounds running continuously every 30 seconds, 1 minute, 3 minutes, or 5 minutes per cycle."
  },
  {
    icon: <IconListCheck />,
    title: "Result Verification",
    desc: "Public draw periods with verifiable result histories allowing immediate settlement confirmation."
  },
  {
    icon: <IconTrendingUp />,
    title: "Trend Analytics",
    desc: "Statistical tools measuring Big/Small distribution ratios, color streaks, and rolling numeric frequencies."
  }
];

// ── FAQ Items ─────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    question: "What is Wingo prediction?",
    answer:
      "Wingo prediction is a trend-based reference that uses recent Wingo result data to indicate whether the current trend may lean toward Big or Small. It should be used only as a reference, not as a guaranteed result."
  },
  {
    question: "How to check Wingo result?",
    answer:
      "You can check the latest Wingo result by selecting the correct game period and checking the settled result after the countdown ends. Always verify the period number and latest result before recording the outcome."
  },
  {
    question: "What is Wingo Big and Small?",
    answer:
      "In the commonly used Big-Small classification, numbers 0, 1, 2, 3 and 4 are Small, while 5, 6, 7, 8 and 9 are Big."
  },
  {
    question: "What is Wingo AI prediction?",
    answer:
      "Wingo AI prediction refers to a data-based prediction tool that analyzes recent results and patterns to provide a Big or Small trend reference. AI prediction does not guarantee the actual outcome."
  },
  {
    question: "How does Wingo prediction work?",
    answer:
      "A Wingo prediction tool can analyze recent result history, previous patterns and other available data to generate a trend reference for the selected period. Past results cannot guarantee future results."
  },
  {
    question: "Is Wingo prediction accurate?",
    answer:
      "The accuracy of a prediction tool can vary from one period to another. Accuracy should be evaluated using settled predictions and actual results over a meaningful sample rather than relying on a single prediction."
  },
  {
    question: "Can Wingo prediction guarantee the next result?",
    answer:
      "No. No prediction method can reliably guarantee the next Wingo result. Predictions should be treated as informational or trend references only."
  },
  {
    question: "How to check Wingo prediction history?",
    answer:
      "Open the prediction history section and compare each prediction with its corresponding settled result. This allows you to review previous predictions and understand how the prediction tool performed."
  },
  {
    question: "What is Wingo 30 second prediction?",
    answer:
      "Wingo 30 second prediction refers to a prediction reference for a 30-second Wingo game period. Users should confirm the active period, countdown and settled result before checking whether the prediction was correct."
  },
  {
    question: "Which is the best Wingo prediction website?",
    answer:
      "A useful Wingo prediction website should provide clear result history, current period information, prediction records and transparent accuracy information without claiming guaranteed wins. Compare the available information before choosing a platform."
  }
];

export default function WingoPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const nextEl = document.getElementById("__next");

    const prevHtmlOverflow = html.style.overflow;
    const prevHtmlHeight = html.style.height;
    const prevHtmlScrollBehavior = html.style.scrollBehavior;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyHeight = body.style.height;
    const prevNextOverflow = nextEl ? nextEl.style.overflow : "";
    const prevNextHeight = nextEl ? nextEl.style.height : "";

    html.style.overflowY = "auto";
    html.style.height = "auto";
    html.style.scrollBehavior = "smooth";
    body.style.overflowY = "auto";
    body.style.height = "auto";
    if (nextEl) {
      nextEl.style.overflow = "visible";
      nextEl.style.height = "auto";
    }

    return () => {
      html.style.overflow = prevHtmlOverflow;
      html.style.height = prevHtmlHeight;
      html.style.scrollBehavior = prevHtmlScrollBehavior;
      body.style.overflow = prevBodyOverflow;
      body.style.height = prevBodyHeight;
      if (nextEl) {
        nextEl.style.overflow = prevNextOverflow;
        nextEl.style.height = prevNextHeight;
      }
    };
  }, []);

  const PAGE_URL = "https://wingo30.com/wingo";
  const PAGE_TITLE = "Wingo – Complete Game Guide, Rules & Results";
  const PAGE_DESC =
    "Understand how Wingo works: draw rules, Big Small classification, 30s timers, live result checking, and trend analysis tools without false promises.";

  return (
    <>
      {/* ── SEO Head ─────────────────────────────────────────────────────── */}
      <PageHead
        title={PAGE_TITLE}
        description={PAGE_DESC}
        canonical={PAGE_URL}
      >
        <style dangerouslySetInnerHTML={{ __html: pageStyles + smartCardStyles }} />
      </PageHead>

      {/* ── Structured Data Schemas ───────────────────────────────────────── */}
      <WebPageSchema title={PAGE_TITLE} description={PAGE_DESC} url={PAGE_URL} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wingo30.com/" },
          { name: "Wingo", url: PAGE_URL }
        ]}
      />
      <FAQSchema questions={FAQ_ITEMS} />

      {/* ── Page Shell ────────────────────────────────────────────────────── */}
      <div className="wg-page-shell">
        <div className="wg-wrap">

          {/* Back Button */}
          <button
            className="wg-back"
            onClick={() => router.push("/")}
            type="button"
            aria-label="Back to Home"
          >
            <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Home
          </button>

          {/* ── Hero ──────────────────────────────────────────────────────── */}
          <header className="wg-hero">
            <div className="wg-badge">
              <span className="wg-badge-dot" aria-hidden="true" />
              Official Game Overview
            </div>

            <h1 className="wg-h1">
              <span className="accent">Wingo</span> – Complete Guide to Rules, Draw Modes, Results &amp; Prediction Analysis
            </h1>

            <p className="wg-subtitle">
              A comprehensive, factual guide explaining the mechanics of <strong>Wingo</strong>, 
              covering colour-number rules, Big/Small classifications, 30-second countdown structures, 
              live result verification, and data-driven trend reference methodologies.
            </p>

            <div className="wg-stats">
              {[
                { label: "Core Concept",     val: "Digit & Colour Draw (0–9)" },
                { label: "Standard Intervals", val: "30s · 1Min · 3Min · 5Min" },
                { label: "Classification",   val: "Big (5–9) · Small (0–4)" },
                { label: "Result Mechanics", val: "Certified Server RNG" },
              ].map((stat) => (
                <div className="wg-stat" key={stat.label}>
                  <span className="wg-stat-label">{stat.label}</span>
                  <span className="wg-stat-val">{stat.val}</span>
                </div>
              ))}
            </div>
          </header>

          {/* ── Article Content ───────────────────────────────────────────── */}
          <article className="wg-body">

            {/* Intro Paragraph */}
            <p>
              As one of the most widely recognized online interval games, <strong>Wingo</strong> combines 
              rapid countdown timers with simple numeric and colour classifications. Whether participants follow 
              fast 30-second draws or longer multi-minute cycles, understanding how the underlying game structure operates 
              is essential. By learning how results are settled, how numbers are categorized into Big or Small tiers, and how 
              analytical tools compile statistical history, players and observers can approach the platform with clarity and 
              realistic expectations.
            </p>

            <ContentCard type="warning" title="Informational Notice & RNG Fairness">
              Wingo draws are powered by automated Random Number Generator (RNG) systems. 
              Each round is entirely independent, and no tool or strategy can guarantee winning outcomes. 
              All guides and statistical references are provided strictly for educational and analytical purposes.
            </ContentCard>

            {/* ── Section 1 ────────────────────────────────────────────────── */}
            <section className="wg-section">
              <h2>What is Wingo: Game Mechanics, Colours &amp; Big-Small Rules</h2>
              <p className="wg-section-sub">Deconstructing number sets, payout colours, and binary grouping</p>

              <p>
                In standard <strong>Wingo</strong> formats, each round produces a single winning integer between 0 and 9. 
                These digits are classified across three distinct dimensions: numeric value, associated colour, and binary size.
              </p>

              <div className="wg-grid">
                {CORE_PILLARS.map((pillar) => (
                  <div className="wg-feat" key={pillar.title}>
                    <div className="wg-icon-badge">{pillar.icon}</div>
                    <div className="wg-feat-title">{pillar.title}</div>
                    <div className="wg-feat-desc">{pillar.desc}</div>
                  </div>
                ))}
              </div>

              <p>
                The primary colour and size divisions operate as follows:
              </p>

              {[
                {
                  pill: "pill-green",
                  label: "GREEN (1, 3, 7, 9)",
                  title: "Odd Green Set",
                  desc: "Includes all odd single digits except 5. Represents 40% of the single-digit spectrum."
                },
                {
                  pill: "pill-red",
                  label: "RED (2, 4, 6, 8)",
                  title: "Even Red Set",
                  desc: "Includes all even positive single digits except 0. Represents 40% of the total number set."
                },
                {
                  pill: "pill-violet",
                  label: "VIOLET (0, 5)",
                  title: "Special Split Digits",
                  desc: "Number 0 pairs with Red and Violet; number 5 pairs with Green and Violet, sharing a secondary payout tier."
                },
                {
                  pill: "pill-small",
                  label: "SMALL (0, 1, 2, 3, 4)",
                  title: "Lower Tier Classification",
                  desc: "Categorizes any result from 0 through 4 as Small in standard binary trend analysis."
                },
                {
                  pill: "pill-big",
                  label: "BIG (5, 6, 7, 8, 9)",
                  title: "Upper Tier Classification",
                  desc: "Categorizes any result from 5 through 9 as Big in Wingo big small prediction systems."
                }
              ].map((row) => (
                <div className="wg-signal-row" key={row.label}>
                  <span className={`wg-signal-pill ${row.pill}`}>{row.label}</span>
                  <span className="wg-signal-text">
                    <strong>{row.title}:</strong> {row.desc}
                  </span>
                </div>
              ))}
            </section>

            <hr className="wg-divider" />

            {/* ── Section 2 ────────────────────────────────────────────────── */}
            <section className="wg-section">
              <h2>Wingo Draw Intervals: Understanding the 30-Second &amp; 1-Minute Modes</h2>
              <p className="wg-section-sub">Pacing, countdown lockouts, and period identification</p>

              <p>
                Platforms hosting <strong>Wingo</strong> typically segment games into multiple time intervals to suit different 
                analytical preferences. The most prominent format is the <strong>Wingo 30 second prediction</strong> environment, 
                where rounds conclude rapidly every half-minute.
              </p>

              <p>
                Each interval features a unique sequential period number (e.g., 20260824001). During the active period, users observe 
                the countdown timer. Most platforms implement a 5-second lockout window prior to settlement, during which no further 
                entries can be submitted while the RNG engine finalizes the draw.
              </p>

              <ContentCard type="important" title="Period Verification Rule">
                Always cross-reference the active period code with the settled <strong>Wingo latest result</strong>. 
                Because high-speed rounds advance rapidly, ensuring you are reviewing data for the matching round is vital for maintaining accurate historical records.
              </ContentCard>
            </section>

            <hr className="wg-divider" />

            {/* ── Section 3 ────────────────────────────────────────────────── */}
            <section className="wg-section">
              <h2>How to Perform a Wingo Result Check &amp; Track Prediction History</h2>
              <p className="wg-section-sub">Verifying draw settlements and maintaining transparent statistical logs</p>

              <p>
                Conducting a proper <strong>Wingo result check</strong> involves inspecting settled historical logs rather than relying 
                on momentary visual cues. A standard <strong>Wingo prediction website</strong> displays a structured table showing the 
                period number, the drawn digit, its assigned colour, and the Big/Small classification.
              </p>

              <ul style={{ paddingLeft: "20px", margin: "14px 0 20px", lineHeight: "1.7" }}>
                <li style={{ marginBottom: "10px" }}>
                  <strong>Verify the Period:</strong> Confirm that the period ID of the result matches your recorded observation.
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <strong>Inspect the History Tab:</strong> Review the <strong>Wingo prediction history</strong> to evaluate how earlier mathematical suggestions performed across a broad window (50+ rounds).
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <strong>Monitor Streak Clusters:</strong> Note the presence of repeating streaks (e.g., four consecutive Big results or alternating Red/Green patterns) on the <strong>Wingo result today</strong> board.
                </li>
              </ul>

              <p>
                Evaluating performance over meaningful sample sizes prevents the cognitive trap of over-interpreting isolated wins or misses.
              </p>
            </section>

            <hr className="wg-divider" />

            {/* ── Section 4 ────────────────────────────────────────────────── */}
            <section className="wg-section">
              <h2>Analyzing Wingo AI Signals &amp; Big-Small Trend References Responsibly</h2>
              <p className="wg-section-sub">Utilizing data-driven tools while respecting RNG boundaries</p>

              <p>
                The rise of automated tools has introduced the concept of a <strong>Wingo AI signal</strong> and modern <strong>Wingo AI prediction</strong> algorithms. 
                These systems ingest live draw feeds, compute rolling frequency ratios, and generate a <strong>Wingo prediction today</strong> reference based on historical pattern matching.
              </p>

              <ContentCard type="best-practice" title="Core Guidelines for Responsible Signal Usage">
                <ul>
                  <li><strong>Treat Signals as Informational References:</strong> Algorithms calculate what happened historically under similar conditions without foretelling future RNG outputs.</li>
                  <li><strong>Beware of Unrealistic Marketing:</strong> Avoid services claiming "100% accuracy" or "sure shot wins." Legitimate analytical software presents objective confidence ratings based solely on past data correlations.</li>
                  <li><strong>Maintain Strict Bankroll Discipline:</strong> Never risk funds based on algorithmic recommendations. Set clear stop-loss limits and treat interval games primarily as analytical entertainment.</li>
                </ul>
              </ContentCard>
            </section>

            <hr className="wg-divider" />

            {/* ── Quick Navigation Links ────────────────────────────────────── */}
            <section className="wg-section">
              <h2>Explore Related Prediction Resources</h2>
              <p className="wg-section-sub">Access specialized tools, AI models, and detailed gameplay guides</p>

              <div className="wg-quick-links">
                <a href="/wingo-ai-prediction" className="wg-link-card">
                  <span>Wingo AI Prediction Guide</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                </a>
                <a href="/wingo-prediction" className="wg-link-card">
                  <span>Wingo Prediction Analysis</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                </a>
                <a href="/wingo-tool" className="wg-link-card">
                  <span>Wingo Predictor Tool</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                </a>
                <a href="/wingo30" className="wg-link-card">
                  <span>Wingo 30 Real-Time Engine</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                </a>
              </div>
            </section>

          </article>

          <hr className="wg-divider" />

          {/* ── Frequently Asked Questions ─────────────────────────────────── */}
          <section className="wg-section" aria-labelledby="faq-heading">
            <h2 id="faq-heading">Frequently Asked Questions</h2>
            <p className="wg-section-sub">Core questions and answers regarding Wingo rules, results, and prediction references</p>

            <div className="wg-faq-list">
              {FAQ_ITEMS.map((item, index) => {
                const isOpen = openFaq === index;
                return (
                  <div className="wg-faq-item" key={item.question}>
                    <button
                      className="wg-faq-header"
                      onClick={() => toggleFaq(index)}
                      aria-expanded={isOpen}
                      type="button"
                    >
                      <span className="wg-faq-q">
                        <span className="wg-faq-num" aria-hidden="true">{index + 1}</span>
                        {item.question}
                      </span>
                      <span className={`wg-faq-icon ${isOpen ? "open" : ""}`} aria-hidden="true">
                        <IconChevronDown />
                      </span>
                    </button>
                    {isOpen && (
                      <div className="wg-faq-a">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Conclusion ─────────────────────────────────────────────────── */}
          <footer className="wg-conclusion">
            <h2>Conclusion</h2>
            <p>
              Understanding the rules and mechanics of <strong>Wingo</strong> provides a solid foundation for interpreting 
              draw outcomes, analyzing Big/Small distributions, and reviewing historical trends. Whether tracking rapid 30-second cycles 
              or examining data-driven prediction tools, maintaining an informed, realistic perspective ensures that observations remain 
              grounded in mathematical principles rather than unrealistic expectations. Always verify period records, evaluate trends over 
              structured sample sizes, and engage responsibly.
            </p>
          </footer>

        </div>
        <SiteFooter />
      </div>
    </>
  );
}
