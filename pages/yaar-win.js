import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import {
  PageHead,
  BreadcrumbSchema,
  FAQSchema,
  WebPageSchema,
  ArticleSchema,
  HowToSchema,
  OrganizationSchema,
  WebsiteSchema,
} from "@/components/SEO";
import SiteFooter from "@/components/SiteFooter";

// ── SVG Icons ────────────────────────────────────────────────────────────────
const IconShieldCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const IconAlertTriangle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconSearch = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconLock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconSmartphone = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const IconTimer = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="10" y1="2" x2="14" y2="2" />
    <line x1="12" y1="14" x2="12" y2="8" />
    <circle cx="12" cy="14" r="8" />
  </svg>
);

const IconBarChart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconChevronDown = ({ isOpen }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 200ms ease",
    }}
    aria-hidden="true"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// ── Verification Steps Data (Synchronized with visible HTML and HowToSchema) ──
const VERIFICATION_STEPS = [
  {
    step: "01",
    name: "Check the Exact Domain",
    text: "Carefully inspect the browser address bar for spelling variations, extra hyphens, or unusual top-level domains. Verify that you are visiting the authentic platform domain rather than an unofficial clone or impersonation site.",
  },
  {
    step: "02",
    name: "Verify HTTPS Security and Certificate Details",
    text: "Confirm that the address uses a secure HTTPS connection with a valid SSL/TLS certificate. Keep in mind that while HTTPS encrypts traffic, HTTPS alone does not establish legal licensing or business authenticity.",
  },
  {
    step: "03",
    name: "Review About, Terms, and Privacy Documentation",
    text: "A legitimate and transparent web service publishes comprehensive Terms of Service, a transparent Privacy Policy, operational disclosures, and legitimate customer support contact channels.",
  },
  {
    step: "04",
    name: "Verify App and Package Sources",
    text: "Never download Android Package (APK) files or executable installers from unknown third-party websites, unverified Telegram groups, or unsolicited social media direct messages.",
  },
  {
    step: "05",
    name: "Never Disclose Passwords, OTPs, or Financial Credentials",
    text: "Never share one-time passwords (OTPs), account passwords, banking credentials, or UPI MPINs with any individual, bot, or unverified login form claiming to represent a platform.",
  },
];

// ── Search Intent Cards Data ─────────────────────────────────────────────────
const INTENT_CARDS = [
  {
    title: "Yaar Win Game",
    keyword: "Platform Concept & Rules",
    desc: "Understanding what the game refers to, the underlying gameplay mechanics, round cycles, and general digital gaming concepts.",
    icon: <IconSearch />,
  },
  {
    title: "YaarWin Login",
    keyword: "Account Access & Security",
    desc: "General instructions for securely accessing an existing profile through the provider's verified portal without falling victim to phishing.",
    icon: <IconLock />,
  },
  {
    title: "YaarWin Register",
    keyword: "Onboarding & Age Verification",
    desc: "Information regarding onboarding requirements, legal age boundaries (18+), terms consent, and responsible account setup.",
    icon: <IconShieldCheck />,
  },
  {
    title: "Yaar Win App",
    keyword: "Mobile Access & APK Verification",
    desc: "Guidance on mobile web navigation, APK file verification cautions, and avoiding compromised third-party mobile downloads.",
    icon: <IconSmartphone />,
  },
  {
    title: "YaarWin Results",
    keyword: "Period Records & History Tracking",
    desc: "Information on reviewing chronological round results, period numbers, number distributions, and empirical sequence telemetry.",
    icon: <IconBarChart />,
  },
  {
    title: "Yaar Win Prediction",
    keyword: "Mathematical & Probability Analysis",
    desc: "Understanding probability-based sequence tools, mathematical frequency models, and their inherent theoretical boundaries.",
    icon: <IconTimer />,
  },
];

// ── FAQ Items (12 Comprehensive Items matching visible UI and FAQSchema) ──────
const FAQ_ITEMS = [
  {
    question: "What is Yaar Win?",
    answer:
      "Yaar Win, also frequently written as YaarWin or Yaar Win Game, is a search term commonly associated with online gaming, color-prediction, and quick-cycle period games. The exact services, registered domains, game formats, and operational details can vary significantly across different third-party websites operating under similar names.",
  },
  {
    question: "Is Yaar Win a game or a gaming platform?",
    answer:
      "The phrase 'Yaar Win' is used in both contexts by online searchers. It often refers to a gaming platform or web portal that hosts quick-draw interval games, as well as specific color-prediction or number-selection game formats within such platforms. Users should always verify the specific domain and operator before participating.",
  },
  {
    question: "What is YaarWin?",
    answer:
      "YaarWin is simply the closed-compound spelling variation of Yaar Win. Both queries represent the identical topic and keyword cluster across search engines, referring to the same online gaming and prediction platform concept.",
  },
  {
    question: "How does Yaar Win login work?",
    answer:
      "To access an existing Yaar Win account, users navigate to the verified portal provided by the platform operator they originally registered with and enter their registered username or mobile number and password. Users should never enter credentials on unofficial mirror domains or links received via unsolicited Telegram chats.",
  },
  {
    question: "How do I register for Yaar Win?",
    answer:
      "Registration procedures depend entirely on the specific platform operator. Generally, platforms require a verified mobile number, creation of a secure password, agreement to the terms of service, and confirmation of legal majority (18 years or older). Always review terms and privacy disclosures before signing up.",
  },
  {
    question: "What is Yaar Win 30 second?",
    answer:
      "Yaar Win 30 second refers to a rapid-cycle game mode where each round or period concludes in 30 seconds. Players observe historical numbers, colors, or Big/Small distributions generated by server-side random number algorithms every half-minute.",
  },
  {
    question: "What is Yaar Win 1 minute?",
    answer:
      "Yaar Win 1 minute is a 60-second cycle game format where new period outcomes are calculated every minute. It provides slightly more analytical time between draws for players studying recent sequence histories and mathematical trend indicators.",
  },
  {
    question: "Where can I check Yaar Win results?",
    answer:
      "Yaar Win draw results should always be checked directly through the official results interface or historical draw table of the verified platform where the game was conducted. Third-party channels may display outdated, inaccurate, or fabricated draw outcomes.",
  },
  {
    question: "Can Yaar Win predictions guarantee results?",
    answer:
      "No. Statistical and mathematical analysis tools cannot guarantee future PRNG outcomes. WinGo and prediction-style games operate on randomized computer algorithms where each round is an independent probability event. Claims of '100% winning accuracy', 'fixed predictions', or 'sure shots' are mathematically false.",
  },
  {
    question: "Is Yaar Win APK safe?",
    answer:
      "The safety of any Yaar Win APK depends entirely on its source. Downloading APK packages from unverified third-party websites, social forums, or direct messaging channels carries severe security risks, including malware and data theft. Always verify the source and never disable core Android security protections.",
  },
  {
    question: "Is TRION AI the official Yaar Win website?",
    answer:
      "No. TRION AI is an independent data analytics and visualization software platform. TRION AI is not the owner, operator, or official representative of any Yaar Win platform, nor do we host real-money games or manage player accounts.",
  },
  {
    question: "Is Yaar Win legal in India?",
    answer:
      "The legal status of online prediction and gaming platforms in India varies significantly across individual states and specific game structures. Certain states strictly prohibit all real-money online gaming, while others differentiate based on skill versus chance criteria. Users must consult their local state regulations and seek legal counsel.",
  },
];

export default function YaarWinPage() {
  const router = useRouter();
  // First two FAQ items open by default for UX and immediate scannability
  const [openFaqs, setOpenFaqs] = useState({ 0: true, 1: true });

  const toggleFaq = (idx) => {
    setOpenFaqs((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const breadcrumbs = [
    { name: "Home", url: "https://wingo30.com" },
    { name: "Yaar Win Guide", url: "https://wingo30.com/yaar-win" },
  ];

  return (
    <>
      <PageHead
        title="Yaar Win Guide – Game, Login, Results & YaarWin Information | TRION AI"
        description="Yaar Win guide covering YaarWin game information, login, registration, 30-second and 1-minute formats, results, prediction analytics, safety and responsible-use guidance."
        canonical="https://wingo30.com/yaar-win"
      >
        <meta property="og:title" content="Yaar Win Guide – Game, Login, Results & YaarWin Information | TRION AI" />
        <meta
          property="og:description"
          content="Explore Yaar Win information, game formats, login guidance, results, prediction analytics, safety and responsible-use resources."
        />
        <meta property="og:url" content="https://wingo30.com/yaar-win" />
        <meta property="og:image" content="https://wingo30.com/yaar-win-guide-trion-ai.webp" />
        <meta name="twitter:title" content="Yaar Win Guide – Game, Login, Results & YaarWin Information | TRION AI" />
        <meta
          name="twitter:description"
          content="Comprehensive Yaar Win guide covering YaarWin game information, login, results, 30s/1m formats, statistical prediction models, and safety checklists."
        />
        <meta name="twitter:image" content="https://wingo30.com/yaar-win-guide-trion-ai.webp" />
      </PageHead>

      {/* JSON-LD Structured Data */}
      <OrganizationSchema />
      <WebsiteSchema />
      <WebPageSchema
        title="Yaar Win Guide – Game, Login, Results & YaarWin Information | TRION AI"
        description="Comprehensive Yaar Win and YaarWin game guide, platform verification rules, login checklists, 30-second and 1-minute formats, result analysis, and responsible gaming."
        url="https://wingo30.com/yaar-win"
        datePublished="2026-09-08T10:00:00+05:30"
        dateModified="2026-09-08T10:00:00+05:30"
      />
      <ArticleSchema
        title="Yaar Win Guide – Game, Login, Results & YaarWin Information | TRION AI"
        description="An in-depth independent analysis of Yaar Win and YaarWin: gameplay rules, login verification, result tracking, mathematical modeling, and responsible-use principles."
        url="https://wingo30.com/yaar-win"
        image="https://wingo30.com/yaar-win-guide-trion-ai.webp"
        datePublished="2026-09-08T10:00:00+05:30"
        dateModified="2026-09-08T10:00:00+05:30"
        about={["Yaar Win", "YaarWin", "WinGo Game Analysis", "Probability Modeling", "Digital Platform Verification"]}
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema questions={FAQ_ITEMS} />
      <HowToSchema
        name="How to Verify a Yaar Win Website Before Using It"
        description="A 5-step security verification guide to confirm domain legitimacy, verify SSL certificates, inspect policy documents, and avoid malicious APK downloads."
        steps={VERIFICATION_STEPS}
      />

      <div className="yw-shell">
        <main className="yw-container">
          {/* Navigation / Back Button */}
          <nav aria-label="Breadcrumb Navigation" className="yw-breadcrumb-nav">
            <button
              type="button"
              className="yw-back-btn"
              onClick={() => router.push("/")}
              aria-label="Return to TRION AI Home"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Back to Home</span>
            </button>
            <ol className="yw-breadcrumb-list">
              <li>
                <Link href="/" className="yw-breadcrumb-link">Home</Link>
              </li>
              <li aria-hidden="true" className="yw-breadcrumb-sep">/</li>
              <li aria-current="page" className="yw-breadcrumb-current">Yaar Win Guide</li>
            </ol>
          </nav>

          {/* 3. HERO SECTION */}
          <header className="yw-hero">
            <div className="yw-hero-badge">
              <span className="yw-hero-dot" aria-hidden="true" />
              <span>YAAR WIN GUIDE</span>
            </div>

            <h1 className="yw-hero-title">
              Yaar Win — Complete Game &amp; Platform Guide
            </h1>

            <p className="yw-hero-subtitle">
              Learn about Yaar Win, YaarWin game formats, common platform features, login and registration concepts, result history, prediction-related analytics and responsible-use considerations in one structured guide.
            </p>

            <div className="yw-hero-meta">
              <span>Reading Time: ~14 minutes</span>
              <span className="yw-meta-dot">•</span>
              <span>Last Updated: September 2026</span>
              <span className="yw-meta-dot">•</span>
              <span>Editorial Status: Independent Research</span>
            </div>

            <div className="yw-hero-actions">
              <a href="#quick-answer" className="yw-btn-primary">
                Explore Yaar Win Guide
              </a>
              <a href="#faq" className="yw-btn-secondary">
                View FAQ
              </a>
            </div>
          </header>

          {/* Featured Visual Image Section */}
          <figure className="yw-featured-figure">
            <div className="yw-featured-img-wrap">
              <Image
                src="/yaar-win-guide-trion-ai.webp"
                alt="Yaar Win Guide for game, login, results and YaarWin information by TRION AI"
                width={880}
                height={495}
                priority
                className="yw-featured-img"
              />
            </div>
            <figcaption className="yw-img-caption">
              Yaar Win Guide: Game, Login, Results &amp; YaarWin Information — TRION AI
            </figcaption>
          </figure>

          {/* 4. QUICK ANSWER BLOCK (AEO / AI Search / Snippet Optimized) */}
          <section id="quick-answer" className="yw-section yw-quick-answer-card">
            <div className="yw-card-tag">QUICK SUMMARY &bull; DIRECT ANSWER</div>
            <h2 className="yw-section-heading">What is Yaar Win?</h2>
            <div className="yw-featured-answer">
              <p>
                <strong>Yaar Win</strong>, also written as <strong>YaarWin</strong> or <strong>Yaar Win Game</strong>, is a search term commonly associated with online gaming and prediction-style platforms. The exact services, domains, games, payment methods and availability can vary between websites using similar names. Users should verify the current domain and platform information before signing in or sharing personal information.
              </p>
            </div>
            <div className="yw-callout-independent">
              <IconShieldCheck />
              <p>
                <strong>Independent Analytical Platform:</strong> This page provides informational and analytical information about the Yaar Win keyword and topic. TRION AI is an independent software and research engine and is not the operator or representative of any third-party Yaar Win platform unless officially authorized.
              </p>
            </div>
          </section>

          {/* Table of Contents for seamless UX */}
          <nav aria-label="Table of Contents" className="yw-toc-box">
            <h3 className="yw-toc-title">Table of Contents</h3>
            <div className="yw-toc-grid">
              <a href="#name-variations">1. Name Variations</a>
              <a href="#what-users-search">2. What People Search</a>
              <a href="#game-overview">3. Yaar Win Overview</a>
              <a href="#verify-platform">4. How to Verify Websites</a>
              <a href="#login-guide">5. Login &amp; Safety</a>
              <a href="#registration">6. Registration Concepts</a>
              <a href="#app-apk">7. App &amp; APK Safety</a>
              <a href="#game-formats">8. Game Formats Overview</a>
              <a href="#30-second">9. Yaar Win 30 Second</a>
              <a href="#1-minute">10. Yaar Win 1 Minute</a>
              <a href="#results-history">11. Results &amp; History</a>
              <a href="#prediction-analytics">12. Prediction Analytics</a>
              <a href="#trion-approach">13. TRION AI Approach</a>
              <a href="#responsible-use">14. Responsible Gaming</a>
              <a href="#legal-disclaimer">15. Legal Disclaimers</a>
              <a href="#privacy-security">16. Privacy &amp; Security</a>
              <a href="#faq">17. Frequently Asked Questions</a>
            </div>
          </nav>

          {/* 5. ENTITY / NAME VARIATIONS */}
          <section id="name-variations" className="yw-section">
            <h2 className="yw-section-title">Yaar Win Name Variations</h2>
            <p className="yw-p">
              When internet users explore digital gaming and prediction resources, they frequently search for the same core topic using several interchangeable spellings, linguistic adaptations, and typographical variations. The primary variations encountered across online search engines include:
            </p>
            <div className="yw-variations-grid">
              <div className="yw-var-pill">
                <span className="yw-var-name">Yaar Win</span>
                <span className="yw-var-desc">Standard spaced primary search query</span>
              </div>
              <div className="yw-var-pill">
                <span className="yw-var-name">YaarWin</span>
                <span className="yw-var-desc">Closed compound brand-style spelling</span>
              </div>
              <div className="yw-var-pill">
                <span className="yw-var-name">Yaar Win Game</span>
                <span className="yw-var-desc">Gameplay and rule specific intent</span>
              </div>
              <div className="yw-var-pill">
                <span className="yw-var-name">Yaarwin Game</span>
                <span className="yw-var-desc">Closed spelling gameplay variant</span>
              </div>
            </div>
            <p className="yw-p" style={{ marginTop: "16px" }}>
              Search engines treat these terms as a unified entity cluster. Regardless of whether a user writes &ldquo;Yaar Win&rdquo; or &ldquo;YaarWin,&rdquo; the search intent centers around understanding platform authenticity, login portals, draw result sequences, mobile application validity, and analytical statistical tools.
            </p>
          </section>

          {/* 6. WHAT USERS LOOK FOR (Intent-based Grid) */}
          <section id="what-users-search" className="yw-section">
            <h2 className="yw-section-title">What People Search About Yaar Win</h2>
            <p className="yw-p">
              Analysis of user search behavior reveals that interest in the Yaar Win ecosystem is distributed across six core informational categories. Structuring these intents helps visitors quickly locate the specific guidance they require:
            </p>
            <div className="yw-intent-grid">
              {INTENT_CARDS.map((card, idx) => (
                <div key={idx} className="yw-intent-card">
                  <div className="yw-intent-icon-wrap">{card.icon}</div>
                  <h3 className="yw-intent-card-title">{card.title}</h3>
                  <span className="yw-intent-badge">{card.keyword}</span>
                  <p className="yw-intent-card-desc">{card.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 7. YAAR WIN GAME OVERVIEW */}
          <section id="game-overview" className="yw-section">
            <h2 className="yw-section-title">Yaar Win Game Overview</h2>
            <p className="yw-p">
              The term <strong>Yaar Win</strong> (or <strong>YaarWin</strong>) generally refers to online platforms that host rapid-period digital prediction and number-draw games. Popularized across mobile-friendly web portals, these games operate around synchronized countdown timers where participants select from digital categories—such as single numbers (0 through 9), color segments (such as Red, Green, or Violet), or magnitude classifications (Big versus Small).
            </p>
            <p className="yw-p">
              Unlike traditional physical lotteries with daily or weekly draws, modern digital platforms utilize computer-based Pseudo-Random Number Generators (PRNGs) to publish outcomes at rapid intervals ranging from thirty seconds to several minutes. This speed has led to significant search interest, but it also creates confusion due to the emergence of numerous independent mirrors, clones, and affiliate domains.
            </p>
            <div className="yw-comparison-box">
              <h3 className="yw-subheading">Understanding the Difference: Platform Operator vs. Independent Analytics</h3>
              <div className="yw-two-col">
                <div className="yw-col-card">
                  <h4>Platform Operator Website</h4>
                  <ul>
                    <li>Hosts the actual real-money or digital gaming software</li>
                    <li>Maintains player account balances and deposit mechanisms</li>
                    <li>Processes financial transactions and round settlement</li>
                    <li>Subject to specific local gambling and licensing jurisdictions</li>
                  </ul>
                </div>
                <div className="yw-col-card highlight">
                  <h4>TRION AI Independent Analytics</h4>
                  <ul>
                    <li>Independent mathematical modeling and telemetry software</li>
                    <li>Ingests historical draw sequences for mathematical pattern research</li>
                    <li>Does not operate games, accept bets, or host player deposits</li>
                    <li>Focuses exclusively on data visualization and educational transparency</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 8. YAAR WIN PLATFORM VERIFICATION (High-Value Trust Section) */}
          <section id="verify-platform" className="yw-section">
            <h2 className="yw-section-title">How to Verify a Yaar Win Website</h2>
            <p className="yw-p">
              Because multiple third-party websites utilize variations of the Yaar Win name, discerning legitimate platforms from malicious copies or credential-harvesting phishing operations is critical for user safety. Follow this 5-step verification process before sharing any personal information:
            </p>

            <div className="yw-steps-container">
              {VERIFICATION_STEPS.map((stepItem, idx) => (
                <div key={idx} className="yw-step-card">
                  <div className="yw-step-number">{stepItem.step}</div>
                  <div className="yw-step-content">
                    <h3 className="yw-step-title">{stepItem.name}</h3>
                    <p className="yw-step-text">{stepItem.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="yw-notice-box">
              <IconAlertTriangle />
              <div>
                <strong>Critical Security Rule:</strong> Credible platforms will never contact you via private Telegram direct messages, WhatsApp messages, or social media asking for your login password, SMS verification code, or one-time payment transfers to private UPI addresses.
              </div>
            </div>
          </section>

          {/* 9. YAAR WIN LOGIN */}
          <section id="login-guide" className="yw-section">
            <h2 className="yw-section-title">Yaar Win Login</h2>
            <p className="yw-p">
              If you already maintain an account on a Yaar Win platform, accessing your dashboard requires navigating exclusively to the authentic, verified access point provided by the service you registered with. Avoid clicking on unverified login links found in search engine advertisements, social discussion threads, or third-party message channels.
            </p>

            <div className="yw-checklist-card">
              <h3 className="yw-subheading">Yaar Win Login Safety Checklist</h3>
              <p className="yw-p" style={{ marginBottom: "16px" }}>
                Verify each point before entering your account credentials on any portal:
              </p>
              <ul className="yw-checklist-list">
                <li>
                  <span className="yw-check-icon"><IconCheck /></span>
                  <span><strong>Verify the Full URL:</strong> Double-check the domain spelling letter-by-letter in the browser address bar.</span>
                </li>
                <li>
                  <span className="yw-check-icon"><IconCheck /></span>
                  <span><strong>Inspect the SSL Lock:</strong> Confirm an active HTTPS connection without browser security warnings.</span>
                </li>
                <li>
                  <span className="yw-check-icon"><IconCheck /></span>
                  <span><strong>Avoid Unknown Telegram Links:</strong> Never follow redirect links sent by anonymous community moderators.</span>
                </li>
                <li>
                  <span className="yw-check-icon"><IconCheck /></span>
                  <span><strong>Never Share Your One-Time Password (OTP):</strong> Legitimate systems never ask staff to request your OTP.</span>
                </li>
                <li>
                  <span className="yw-check-icon"><IconCheck /></span>
                  <span><strong>Maintain a Unique Password:</strong> Never reuse the password you use for email, banking, or personal accounts.</span>
                </li>
                <li>
                  <span className="yw-check-icon"><IconCheck /></span>
                  <span><strong>Avoid Unofficial APK Login Screens:</strong> Log in only via a secure browser or independently verified applications.</span>
                </li>
              </ul>
            </div>

            <div className="yw-callout-neutral">
              <p>
                <strong>Notice:</strong> TRION AI does not provide an account login form for Yaar Win, nor do we collect player login credentials. If you are looking for TRION AI&apos;s statistical analysis engine, you can explore the independent <Link href="/wingo-tool" className="yw-inline-link">TRION AI Wingo Tool</Link>.
              </p>
            </div>
          </section>

          {/* 10. YAAR WIN REGISTRATION */}
          <section id="registration" className="yw-section">
            <h2 className="yw-section-title">Yaar Win Registration</h2>
            <p className="yw-p">
              Registration requirements for Yaar Win websites differ depending on the specific platform operator, host country, and applicable regulatory frameworks. While individual requirements vary, reputable digital platforms generally maintain structured onboarding standards:
            </p>

            <div className="yw-features-list">
              <div className="yw-feature-row">
                <div className="yw-feature-bullet">1</div>
                <div>
                  <h3 className="yw-feature-title">Account Creation &amp; Identifier Verification</h3>
                  <p className="yw-feature-text">
                    Platforms typically require a primary identifier such as a valid mobile number or email address, accompanied by an SMS verification handshake to prevent duplicate automated registrations.
                  </p>
                </div>
              </div>

              <div className="yw-feature-row">
                <div className="yw-feature-bullet">2</div>
                <div>
                  <h3 className="yw-feature-title">Legal Age &amp; Identity Eligibility</h3>
                  <p className="yw-feature-text">
                    Legitimate gaming services strictly mandate that all users be of legal age (18 years or older, or the age of majority in their jurisdiction). Platforms may enforce Know-Your-Customer (KYC) identity checks before approving withdrawals.
                  </p>
                </div>
              </div>

              <div className="yw-feature-row">
                <div className="yw-feature-bullet">3</div>
                <div>
                  <h3 className="yw-feature-title">Terms of Service &amp; User Agreement Consent</h3>
                  <p className="yw-feature-text">
                    Users must actively review and accept platform rules regarding account usage, dispute settlement, geographic restrictions, and responsible-gaming requirements.
                  </p>
                </div>
              </div>

              <div className="yw-feature-row">
                <div className="yw-feature-bullet">4</div>
                <div>
                  <h3 className="yw-feature-title">Privacy Disclosures &amp; Data Protection</h3>
                  <p className="yw-feature-text">
                    A credible service publishes clear policies specifying how player telemetry, contact information, and session logs are encrypted and managed.
                  </p>
                </div>
              </div>
            </div>

            <p className="yw-p" style={{ marginTop: "18px" }}>
              <em>Note: TRION AI does not publish unverified sign-up bonuses, minimum deposit amounts, or specific payment gateways, as these vary continuously across independent operators and may change without notice.</em>
            </p>
          </section>

          {/* 11. YAAR WIN APP & APK */}
          <section id="app-apk" className="yw-section">
            <h2 className="yw-section-title">Yaar Win App</h2>
            <p className="yw-p">
              Users searching for <strong>Yaar Win app</strong> or <strong>YaarWin APK</strong> downloads often seek the convenience of native Android smartphone access. However, downloading and installing raw APK files from the internet carries substantial digital security risks if not conducted with extreme caution.
            </p>

            <div className="yw-apk-box">
              <h3 className="yw-subheading">Checklist: Before Installing Any Yaar Win APK</h3>
              <ol className="yw-numbered-list">
                <li>
                  <strong>Verify the Source Domain:</strong> Confirm that the APK download link originates directly from the platform&apos;s verified website, not from an unmoderated third-party file host.
                </li>
                <li>
                  <strong>Verify Operator Authenticity:</strong> Check whether the developer signature on the installation package matches the declared operating company.
                </li>
                <li>
                  <strong>Avoid &ldquo;Modded&rdquo; or &ldquo;Cracked&rdquo; APKs:</strong> Files distributed on Telegram claiming to offer &ldquo;auto-win algorithms,&rdquo; &ldquo;hack versions,&rdquo; or &ldquo;balance glitches&rdquo; almost universally contain spyware, keyloggers, or trojans designed to steal personal data.
                </li>
                <li>
                  <strong>Review Installation Permissions:</strong> Be suspicious if a simple gaming app requests dangerous permissions such as reading SMS messages, accessing contact lists, or background accessibility controls.
                </li>
                <li>
                  <strong>Never Bypass Device Security Protections:</strong> Never disable Android Google Play Protect or install certificates from unknown sources simply to run an unverified APK.
                </li>
              </ol>
            </div>

            <div className="yw-callout-independent">
              <IconShieldCheck />
              <p>
                <strong>Safety Clarification:</strong> TRION AI does not distribute, endorse, or verify any third-party Yaar Win APK. Users accessing third-party applications do so entirely at their own discretion and should prioritize mobile device security at all times.
              </p>
            </div>
          </section>

          {/* 12. YAAR WIN GAME FORMATS */}
          <section id="game-formats" className="yw-section">
            <h2 className="yw-section-title">Yaar Win Game Formats</h2>
            <p className="yw-p">
              Websites associated with the <strong>Yaar Win game</strong> name feature a variety of fast-paced prediction-style mechanics modeled after modern digital interval lottery games. While specific features depend on the individual host website, typical formats fall into structured mathematical categories:
            </p>

            <div className="yw-formats-table-wrapper">
              <table className="yw-table">
                <thead>
                  <tr>
                    <th>Format Type</th>
                    <th>Core Mechanics</th>
                    <th>Outcome Categorization</th>
                    <th>Typical Cycle Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Number Selection</strong></td>
                    <td>Predicting an exact single digit outcome from 0 through 9 generated by the server PRNG.</td>
                    <td>Single integer (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)</td>
                    <td>30s, 1m, 3m, 5m</td>
                  </tr>
                  <tr>
                    <td><strong>Color Prediction</strong></td>
                    <td>Selecting whether the winning period outcome maps to Red, Green, or Violet.</td>
                    <td>Green (1,3,7,9), Red (2,4,6,8), Violet (0,5)</td>
                    <td>30s, 1m, 3m</td>
                  </tr>
                  <tr>
                    <td><strong>Big / Small Parity</strong></td>
                    <td>Binary magnitude classification of the winning single digit.</td>
                    <td>Small (0, 1, 2, 3, 4) vs. Big (5, 6, 7, 8, 9)</td>
                    <td>30s, 1m, 3m, 5m</td>
                  </tr>
                  <tr>
                    <td><strong>Quick-Round Intervals</strong></td>
                    <td>Rapid successive draw periods synchronized across all concurrent web users.</td>
                    <td>Continuous rolling period sequence</td>
                    <td>30 Seconds &amp; 1 Minute</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="yw-p" style={{ marginTop: "14px" }}>
              <em>Available formats may change over time and may differ between websites using the Yaar Win name. Always check the active rules on your platform of choice.</em>
            </p>
          </section>

          {/* 13. YAAR WIN 30 SECOND */}
          <section id="30-second" className="yw-section">
            <h2 className="yw-section-title">Yaar Win 30 Second</h2>
            <p className="yw-p">
              Searches for <strong>yaar win 30 second</strong> (and <strong>yaarwin 30 second</strong>) center on the most rapid game cycle available on these platforms. In this mode, a complete round begins, accepts selections, closes, and publishes the winning result within a thirty-second window.
            </p>

            <div className="yw-cycle-card">
              <h3 className="yw-subheading">Key Characteristics of the 30-Second Format:</h3>
              <ul className="yw-bullet-list">
                <li>
                  <strong>Period Identifier:</strong> Each 30-second round is cataloged by a unique chronological period ID (often combining date and sequential round index).
                </li>
                <li>
                  <strong>Rapid Decision Horizon:</strong> Users typically have 20–25 seconds to review sequence metrics before the countdown timer locks for resolution.
                </li>
                <li>
                  <strong>Result Publication:</strong> The server-side algorithm resolves the random digit, color classification, and Big/Small parity instantly at the zero-second mark.
                </li>
                <li>
                  <strong>High Sequential Volume:</strong> Over 2,800 rounds take place every 24-hour cycle, producing extensive datasets for statistical and sequence analysis.
                </li>
              </ul>
            </div>

            <div className="yw-callout-warning">
              <IconAlertTriangle />
              <p>
                <strong>Analytical Reality Check:</strong> Due to the sheer speed of 30-second rounds, human emotional fatigue and cognitive bias can escalate quickly. TRION AI can provide analytical visualization and sequence tracking where supported, but <em>statistical analysis cannot guarantee future outcomes</em>. Every single round is generated by an independent random number generator.
              </p>
            </div>
          </section>

          {/* 14. YAAR WIN 1 MINUTE */}
          <section id="1-minute" className="yw-section">
            <h2 className="yw-section-title">Yaar Win 1 Minute</h2>
            <p className="yw-p">
              The <strong>yaar win 1 minute</strong> (or <strong>yaarwin 1 minute</strong>) format operates on a standard sixty-second cycle. This extra duration offers users a calmer operational environment compared to the hyper-fast 30-second round:
            </p>

            <div className="yw-features-list">
              <div className="yw-feature-row">
                <div className="yw-feature-bullet">60s</div>
                <div>
                  <h3 className="yw-feature-title">Structured Decision Cadence</h3>
                  <p className="yw-feature-text">
                    A 60-second cycle provides 45–50 seconds of observational time, allowing data analysts to examine rolling historical period records, recent streak persistences, and parity balance before each cutoff.
                  </p>
                </div>
              </div>

              <div className="yw-feature-row">
                <div className="yw-feature-bullet">1.4K</div>
                <div>
                  <h3 className="yw-feature-title">Daily Round History</h3>
                  <p className="yw-feature-text">
                    With 1,440 rounds per day, the 1-minute mode offers a comprehensive sample size for studying probability distributions, frequency variances, and historical pattern clustering.
                  </p>
                </div>
              </div>

              <div className="yw-feature-row">
                <div className="yw-feature-bullet">PRNG</div>
                <div>
                  <h3 className="yw-feature-title">Independent Event Probabilities</h3>
                  <p className="yw-feature-text">
                    Whether observing 1-minute or 30-second cycles, each outcome remains an independent mathematical trial. Previous results do not exert physical memory or force on the next draw.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 15. YAAR WIN RESULTS & HISTORY */}
          <section id="results-history" className="yw-section">
            <h2 className="yw-section-title">Yaar Win Results &amp; History</h2>
            <p className="yw-p">
              Studying historical draw results is one of the most common activities among users researching <strong>yaar win results</strong> and <strong>yaarwin history</strong>. Historical records provide valuable empirical data for quantitative analysis and algorithmic modeling:
            </p>

            <div className="yw-history-grid">
              <div className="yw-hist-item">
                <h3 className="yw-hist-title">Sequence Observation</h3>
                <p className="yw-hist-desc">
                  Tracking chronological strings of outcomes to observe alternation sequences (e.g., Big-Small-Big-Small) and cluster groupings.
                </p>
              </div>

              <div className="yw-hist-item">
                <h3 className="yw-hist-title">Digit Frequency Analysis</h3>
                <p className="yw-hist-desc">
                  Calculating how frequently each individual digit (0 through 9) has occurred over rolling horizons of 50, 100, or 500 rounds.
                </p>
              </div>

              <div className="yw-hist-item">
                <h3 className="yw-hist-title">Streak Length Visualization</h3>
                <p className="yw-hist-desc">
                  Observing runs of identical colors or sizes (e.g., five consecutive Green rounds) and measuring historical continuation rates versus divergence.
                </p>
              </div>

              <div className="yw-hist-item">
                <h3 className="yw-hist-title">Big / Small Parity Ratios</h3>
                <p className="yw-hist-desc">
                  Comparing the proportion of Big outcomes (5–9) versus Small outcomes (0–4) against the theoretical 50% baseline.
                </p>
              </div>

              <div className="yw-hist-item">
                <h3 className="yw-hist-title">Color Distribution Rates</h3>
                <p className="yw-hist-desc">
                  Monitoring the distribution of Red (even numbers), Green (odd numbers), and dual-color Violet outcomes (numbers 0 and 5).
                </p>
              </div>

              <div className="yw-hist-item">
                <h3 className="yw-hist-title">Period-by-Period Telemetry</h3>
                <p className="yw-hist-desc">
                  Verifying timestamps and sequence numbers to ensure continuity and identify server latency anomalies.
                </p>
              </div>
            </div>

            <div className="yw-callout-warning" style={{ marginTop: "20px" }}>
              <IconAlertTriangle />
              <p>
                <strong>Fundamental Probability Principle:</strong> Historical data reflects what has already occurred in past rounds; it does not dictate future events. <em>Past results do not guarantee future results.</em> Conflating past frequency with guaranteed future outcomes is known as the Gambler&apos;s Fallacy.
              </p>
            </div>
          </section>

          {/* 16. YAAR WIN PREDICTION & STATISTICAL ANALYSIS */}
          <section id="prediction-analytics" className="yw-section">
            <h2 className="yw-section-title">Yaar Win Prediction &amp; Statistical Analysis</h2>
            <p className="yw-p">
              Searches for <strong>yaar win prediction</strong> and <strong>yaarwin prediction</strong> represent a major segment of user inquiries. It is essential to understand what predictive analytical tools can and cannot accomplish from an objective mathematical perspective:
            </p>
            <p className="yw-p">
              Prediction software does not possess supernatural clairvoyance or backdoor access to game servers. Instead, legitimate mathematical models evaluate historical period data, distribution variance, and statistical trends. Such analysis should always be treated as <strong>probability-based research rather than absolute certainty</strong>.
            </p>

            <div className="yw-pillars-container">
              <h3 className="yw-subheading">TRION AI&apos;s 5-Pillar Statistical Analytical Framework</h3>
              <div className="yw-pillar-card">
                <div className="yw-pillar-badge">Pillar 1</div>
                <div>
                  <h4 className="yw-pillar-name">Historical Data Ingestion</h4>
                  <p className="yw-pillar-desc">
                    Systematically buffering real-world draw outcomes across chronological period numbers to create structured datasets for review.
                  </p>
                </div>
              </div>

              <div className="yw-pillar-card">
                <div className="yw-pillar-badge">Pillar 2</div>
                <div>
                  <h4 className="yw-pillar-name">Distribution &amp; Variance Analysis</h4>
                  <p className="yw-pillar-desc">
                    Calculating mathematical hit rates, cold-number absence counters, and Big/Small parity deviations across defined sample sizes.
                  </p>
                </div>
              </div>

              <div className="yw-pillar-card">
                <div className="yw-pillar-badge">Pillar 3</div>
                <div>
                  <h4 className="yw-pillar-name">Sequence &amp; Trend Modeling</h4>
                  <p className="yw-pillar-desc">
                    Utilizing algorithms to detect recurring pattern transitions, streak lengths, and cyclical sequences within rolling datasets.
                  </p>
                </div>
              </div>

              <div className="yw-pillar-card">
                <div className="yw-pillar-badge">Pillar 4</div>
                <div>
                  <h4 className="yw-pillar-name">Probability Visualization</h4>
                  <p className="yw-pillar-desc">
                    Converting raw numerical tables into intuitive telemetry charts, hot/cold indicators, and trend meters that make data scanning effortless.
                  </p>
                </div>
              </div>

              <div className="yw-pillar-card">
                <div className="yw-pillar-badge">Pillar 5</div>
                <div>
                  <h4 className="yw-pillar-name">Confidence &amp; Limitation Indicators</h4>
                  <p className="yw-pillar-desc">
                    Displaying algorithmic confidence indicators strictly as mathematical probabilities, clearly communicating statistical variance and limitations.
                  </p>
                </div>
              </div>
            </div>

            <div className="yw-disclaimer-box">
              <h4 className="yw-disclaimer-title">Zero Tolerance for Misleading Accuracy Claims</h4>
              <p>
                TRION AI explicitly rejects predatory marketing terms common across the online gaming space. We never promote or promise:
              </p>
              <ul className="yw-prohibited-list">
                <li>&ldquo;100% Guaranteed Win&rdquo;</li>
                <li>&ldquo;Fixed Results or Server Hack&rdquo;</li>
                <li>&ldquo;Sure Shot Predictions&rdquo;</li>
                <li>&ldquo;Guaranteed Daily Income&rdquo;</li>
              </ul>
              <p style={{ marginTop: "10px" }}>
                Any platform, channel, or influencer advertising guaranteed outcomes on PRNG games is engaging in deceptive marketing. Probability modeling is an analytical aid, not a financial guarantee.
              </p>
            </div>
          </section>

          {/* 17. TRION AI DIFFERENTIATION */}
          <section id="trion-approach" className="yw-section">
            <h2 className="yw-section-title">How TRION AI Approaches Yaar Win Data</h2>
            <p className="yw-p">
              TRION AI stands apart from affiliate landing pages and gambling operators through its dedication to rigorous data science, visual transparency, and responsible user education. Our engineering principles include:
            </p>

            <div className="yw-diff-grid">
              <div className="yw-diff-card">
                <h4>Pure Analytical Software</h4>
                <p>
                  TRION AI is an independent data intelligence and visualization platform. We do not operate casino games, host wagers, or accept player deposits.
                </p>
              </div>

              <div className="yw-diff-card">
                <h4>Empirical Telemetry</h4>
                <p>
                  Our models (including Korven and FX1 architectures) process mathematical frequency, standard deviation, and rolling sequence buffers to provide deep statistical insights.
                </p>
              </div>

              <div className="yw-diff-card">
                <h4>Transparent Limitations</h4>
                <p>
                  We clearly present the mathematical reality of PRNG systems. We ensure users understand that past statistics cannot eliminate variance.
                </p>
              </div>

              <div className="yw-diff-card">
                <h4>Educational Mission</h4>
                <p>
                  We equip users with structured analytical dashboards, bankroll risk management principles, and objective evaluation frameworks to replace emotional guessing.
                </p>
              </div>
            </div>

            <p className="yw-p" style={{ marginTop: "16px" }}>
              To experience TRION AI&apos;s interactive analytical suite, visit our dedicated <Link href="/wingo-tool" className="yw-inline-link">Wingo Tool Suite</Link> and explore our <Link href="/wingo-ai-prediction" className="yw-inline-link">Wingo AI Prediction Overview</Link>.
            </p>
          </section>

          {/* 18. RESPONSIBLE USE */}
          <section id="responsible-use" className="yw-section">
            <h2 className="yw-section-title">Yaar Win &amp; Responsible Use</h2>
            <p className="yw-p">
              Engaging with online gaming or prediction platforms requires strict self-discipline and awareness of financial risks. TRION AI advocates for responsible digital habits and enforces strict safety principles:
            </p>

            <div className="yw-safety-card">
              <h3 className="yw-subheading">Core Principles of Responsible Participation:</h3>
              <ul className="yw-safety-list">
                <li>
                  <strong>18+ Age Restriction:</strong> Digital prediction and gaming platforms are intended strictly for adults aged 18 and older. Minors must never participate.
                </li>
                <li>
                  <strong>Never Treat Games as an Income Source:</strong> Games based on random number generation must never be regarded as jobs, investments, or avenues for financial recovery.
                </li>
                <li>
                  <strong>Never Chase Losses:</strong> Increasing stakes in an attempt to quickly recover lost funds is a primary cause of financial distress. Accept session boundaries without exception.
                </li>
                <li>
                  <strong>Never Risk Essential Living Expenses:</strong> Only allocate entertainment funds that you can afford to lose without impacting housing, food, medical, or educational commitments.
                </li>
                <li>
                  <strong>Set Strict Session Time Limits:</strong> Extended screen sessions induce cognitive fatigue and impair analytical judgment. Establish rigid timer alarms.
                </li>
                <li>
                  <strong>Comply with Local Legal Frameworks:</strong> Ensure that your digital activities fully comply with the municipal, state, and federal laws applicable in your jurisdiction.
                </li>
              </ul>
            </div>

            <p className="yw-p" style={{ marginTop: "18px" }}>
              For our comprehensive safety framework, self-assessment checklists, and mental health helpline resources, please{" "}
              <Link href="/responsible-gambling" className="yw-inline-link-bold">
                Read the complete Responsible Use &amp; 18+ Policy
              </Link>.
            </p>
          </section>

          {/* 19. LEGAL DISCLAIMER */}
          <section id="legal-disclaimer" className="yw-section">
            <h2 className="yw-section-title">Legal &amp; Platform Disclaimer</h2>
            <div className="yw-legal-box">
              <p className="yw-legal-text">
                <strong>Independent Status Disclosure:</strong> TRION AI is an independent data analytics, software development, and visualization platform. Unless explicitly stated and verifiably authorized, TRION AI is not the operator, owner, affiliate, or official representative of any third-party Yaar Win platform or related domain.
              </p>
              <p className="yw-legal-text">
                <strong>No Financial or Legal Advice:</strong> All materials, analyses, statistical calculations, and guides published on this website are provided strictly for educational and research purposes. Nothing on this page constitutes financial, legal, or investment advice.
              </p>
              <p className="yw-legal-text">
                <strong>Jurisdictional Compliance:</strong> The legal status of online digital prediction games varies widely across states and countries. Users are solely responsible for verifying the legality, authenticity, terms, and regulatory compliance of any third-party service they elect to access. TRION AI makes no claim of universal legality.
              </p>
            </div>
          </section>

          {/* 20. PRIVACY & SECURITY CONSIDERATIONS */}
          <section id="privacy-security" className="yw-section">
            <h2 className="yw-section-title">Privacy &amp; Security Considerations</h2>
            <p className="yw-p">
              Safeguarding your personal data in the digital gaming space requires proactive security measures. Follow these essential privacy practices:
            </p>

            <div className="yw-security-grid">
              <div className="yw-sec-item">
                <IconLock />
                <h4>Domain Verification</h4>
                <p>Always verify the authentic domain name before typing usernames, passwords, or personal details.</p>
              </div>

              <div className="yw-sec-item">
                <IconShieldCheck />
                <h4>Never Disclose OTPs</h4>
                <p>Your one-time authentication codes are private. No support representative will ever legitimately request them.</p>
              </div>

              <div className="yw-sec-item">
                <IconAlertTriangle />
                <h4>Avoid Unnecessary Documents</h4>
                <p>Do not upload sensitive identity documents to unverified websites or informal social messaging groups.</p>
              </div>

              <div className="yw-sec-item">
                <IconSmartphone />
                <h4>APK File Vigilance</h4>
                <p>Avoid installing third-party APK packages from untrusted web sources or modified app stores.</p>
              </div>
            </div>

            <p className="yw-p" style={{ marginTop: "18px" }}>
              To learn how TRION AI protects visitor privacy and enforces a zero financial data footprint, review our{" "}
              <Link href="/privacy" className="yw-inline-link">Privacy Policy</Link> and read more{" "}
              <Link href="/about" className="yw-inline-link">About TRION AI</Link>. For direct inquiries, feel free to{" "}
              <Link href="/contact" className="yw-inline-link">Contact Us</Link>.
            </p>
          </section>

          {/* 21. FAQ SECTION (Accordion UI with first 2 open by default) */}
          <section id="faq" className="yw-section">
            <div className="yw-card-tag">QUESTIONS &bull; FACTUAL ANSWERS</div>
            <h2 className="yw-section-title">Frequently Asked Questions About Yaar Win</h2>
            <p className="yw-p" style={{ marginBottom: "24px" }}>
              Below are clear, factual answers to the most common questions regarding Yaar Win, YaarWin platform verification, game formats, login procedures, and statistical prediction tools:
            </p>

            <div className="yw-faq-accordion" role="region" aria-label="Yaar Win FAQ Accordion">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = !!openFaqs[idx];
                return (
                  <div key={idx} className={`yw-faq-item ${isOpen ? "open" : ""}`}>
                    <button
                      type="button"
                      className="yw-faq-question-btn"
                      onClick={() => toggleFaq(idx)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${idx}`}
                      id={`faq-question-${idx}`}
                    >
                      <span className="yw-faq-q-text">{item.question}</span>
                      <span className="yw-faq-icon-wrap">
                        <IconChevronDown isOpen={isOpen} />
                      </span>
                    </button>
                    {isOpen && (
                      <div
                        id={`faq-answer-${idx}`}
                        className="yw-faq-answer-panel"
                        role="region"
                        aria-labelledby={`faq-question-${idx}`}
                      >
                        <p className="yw-faq-answer-text">{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* 47. FINAL CTA */}
          <section className="yw-final-cta">
            <h2 className="yw-final-title">Explore More TRION AI Analytics</h2>
            <p className="yw-final-desc">
              Explore our statistical analysis tools, data dashboards and responsible-use resources.
            </p>
            <div className="yw-final-actions">
              <Link href="/wingo-tool" className="yw-btn-primary">
                <span>Wingo Tool</span>
                <IconArrowRight />
              </Link>
              <Link href="/responsible-gambling" className="yw-btn-secondary">
                <span>Responsible Use</span>
              </Link>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>

      <style jsx global>{`
        /* ── Custom Font: TrionAIAbout ────────────────────────────────────────── */
        @font-face {
          font-family: 'TrionAIAbout';
          src: url('/fonts/trionAIabout.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }

        *, *::before, *::after {
          box-sizing: border-box;
          font-family: 'TrionAIAbout', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }

        /* ── Root & Scroll Constraints ───────────────────────────────────────── */
        html {
          height: auto !important;
          min-height: 100% !important;
          overflow-x: hidden !important;
          overflow-y: auto !important;
          scroll-behavior: smooth !important;
          -webkit-overflow-scrolling: touch !important;
          font-family: 'TrionAIAbout', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }

        body {
          height: auto !important;
          min-height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          background-color: #fbfdfc !important;
          color: #1e293b !important;
          font-family: 'TrionAIAbout', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden !important;
          overflow-y: auto !important;
          overscroll-behavior-y: auto !important;
        }

        #__next {
          height: auto !important;
          min-height: 100% !important;
          overflow: visible !important;
          font-family: 'TrionAIAbout', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }

        /* ── Page Shell & Balanced Layout Container ──────────────────────────── */
        .yw-shell {
          min-height: 100vh;
          width: 100%;
          background: radial-gradient(120% 50% at 50% 0%, #f0f7f3 0%, #fbfdfc 100%);
          color: #1e293b;
          overflow-x: hidden;
          overflow-y: visible;
        }

        .yw-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 24px 84px;
        }

        /* ── Breadcrumb Navigation ───────────────────────────────────────────── */
        .yw-breadcrumb-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 30px;
        }

        .yw-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #475569;
          font-weight: 500;
          font-size: 13.5px;
          cursor: pointer;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 8px 16px;
          border-radius: 12px;
          outline: none;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
        }

        .yw-back-btn:hover {
          color: #00985b;
          border-color: #d1eedf;
          background: #f4fbf7;
          transform: translateX(-2px);
          box-shadow: 0 2px 6px rgba(0, 152, 91, 0.08);
        }

        .yw-back-btn:focus-visible {
          outline: 2px solid #00985b;
          outline-offset: 2px;
        }

        .yw-breadcrumb-list {
          display: flex;
          align-items: center;
          gap: 8px;
          list-style: none;
          margin: 0;
          padding: 0;
          font-size: 13px;
          color: #64748b;
        }

        .yw-breadcrumb-link {
          color: #64748b;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .yw-breadcrumb-link:hover {
          color: #00985b;
          text-decoration: underline;
        }

        .yw-breadcrumb-sep {
          color: #cbd5e1;
        }

        .yw-breadcrumb-current {
          color: #1e293b;
          font-weight: 600;
        }

        /* ── Hero Section (Strong Hierarchy & Spacing) ────────────────────────── */
        .yw-hero {
          background: #ffffff;
          border: 1px solid #e8f0ec;
          border-radius: 24px;
          padding: 42px 36px;
          margin-bottom: 28px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.015), 0 12px 32px rgba(0, 152, 91, 0.035);
        }

        .yw-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #eef8f3;
          border: 1px solid #d1eedf;
          color: #008751;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 9999px;
          margin-bottom: 18px;
        }

        .yw-hero-dot {
          width: 6px;
          height: 6px;
          background: #00985b;
          border-radius: 50%;
        }

        .yw-hero-title {
          font-size: clamp(28px, 4.4vw, 38px);
          font-weight: 800;
          line-height: 1.25;
          letter-spacing: -0.025em;
          color: #0f172a;
          margin: 0 0 16px 0;
        }

        .yw-hero-subtitle {
          font-size: clamp(15.5px, 2.2vw, 17px);
          line-height: 1.7;
          color: #475569;
          margin: 0 0 22px 0;
          max-width: 800px;
        }

        .yw-hero-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 13px;
          color: #64748b;
          margin-bottom: 26px;
          padding-top: 18px;
          border-top: 1px solid #f1f5f9;
        }

        .yw-meta-dot {
          color: #cbd5e1;
        }

        .yw-hero-actions {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
        }

        .yw-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #00985b;
          color: #ffffff;
          font-size: 14.5px;
          font-weight: 600;
          padding: 11px 24px;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.18s ease;
          box-shadow: 0 2px 6px rgba(0, 152, 91, 0.2);
          border: none;
          cursor: pointer;
        }

        .yw-btn-primary:hover {
          background: #00834e;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(0, 152, 91, 0.3);
        }

        .yw-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          color: #334155;
          font-size: 14.5px;
          font-weight: 600;
          padding: 11px 22px;
          border-radius: 12px;
          text-decoration: none;
          border: 1px solid #e2e8f0;
          transition: all 0.18s ease;
        }

        .yw-btn-secondary:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #0f172a;
        }

        /* ── Featured Visual Section ─────────────────────────────────────────── */
        .yw-featured-figure {
          margin: 0 0 34px 0;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          padding: 14px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02), 0 10px 24px rgba(0, 152, 91, 0.03);
          overflow: hidden;
        }

        .yw-featured-img-wrap {
          position: relative;
          width: 100%;
          border-radius: 14px;
          overflow: hidden;
          background: #f1f5f9;
          display: flex;
        }

        .yw-featured-img {
          width: 100% !important;
          height: auto !important;
          display: block;
          object-fit: cover;
          border-radius: 14px;
        }

        .yw-img-caption {
          margin-top: 12px;
          padding: 0 8px 4px;
          font-size: 13.5px;
          color: #64748b;
          text-align: center;
          font-style: italic;
          line-height: 1.5;
        }

        /* ── Generic Content Sections ────────────────────────────────────────── */
        .yw-section {
          background: #ffffff;
          border: 1px solid #e8f0ec;
          border-radius: 22px;
          padding: 36px 32px;
          margin-bottom: 34px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.015);
        }

        .yw-section-title {
          font-size: clamp(21px, 3.2vw, 25px);
          font-weight: 750;
          color: #0f172a;
          margin: 0 0 18px 0;
          letter-spacing: -0.018em;
          line-height: 1.35;
        }

        .yw-section-heading {
          font-size: clamp(20px, 3vw, 24px);
          font-weight: 750;
          color: #0f172a;
          margin: 0 0 16px 0;
          letter-spacing: -0.015em;
        }

        .yw-subheading {
          font-size: 17.5px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 14px 0;
          letter-spacing: -0.01em;
        }

        .yw-card-tag {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.07em;
          color: #008751;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .yw-p {
          font-size: 15.5px;
          line-height: 1.75;
          color: #334155;
          margin: 0 0 16px 0;
        }

        .yw-p:last-child {
          margin-bottom: 0;
        }

        .yw-inline-link {
          color: #00985b;
          text-decoration: underline;
          text-underline-offset: 3px;
          font-weight: 500;
          transition: color 0.15s ease;
        }

        .yw-inline-link:hover {
          color: #007645;
        }

        .yw-inline-link-bold {
          color: #00985b;
          text-decoration: underline;
          text-underline-offset: 3px;
          font-weight: 700;
          transition: color 0.15s ease;
        }

        .yw-inline-link-bold:hover {
          color: #007645;
        }

        /* ── Quick Answer Card ───────────────────────────────────────────────── */
        .yw-quick-answer-card {
          border-left: 5px solid #00985b;
        }

        .yw-featured-answer {
          background: #f6fcf8;
          border: 1px solid #d5efe1;
          border-radius: 14px;
          padding: 20px 22px;
          margin-bottom: 20px;
        }

        .yw-featured-answer p {
          font-size: 16px;
          line-height: 1.7;
          color: #164e33;
          margin: 0;
        }

        .yw-callout-independent {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 16px 20px;
          color: #475569;
          font-size: 14px;
          line-height: 1.65;
        }

        .yw-callout-independent svg {
          color: #00985b;
          flex-shrink: 0;
          margin-top: 3px;
        }

        .yw-callout-independent p {
          margin: 0;
        }

        /* ── Table of Contents ───────────────────────────────────────────────── */
        .yw-toc-box {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 26px 28px;
          margin-bottom: 34px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        }

        .yw-toc-title {
          font-size: 14.5px;
          font-weight: 750;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #475569;
          margin: 0 0 16px 0;
        }

        .yw-toc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 10px 18px;
        }

        .yw-toc-grid a {
          font-size: 14px;
          color: #00985b;
          text-decoration: none;
          padding: 4px 0;
          transition: all 0.15s ease;
          display: inline-block;
        }

        .yw-toc-grid a:hover {
          color: #00683e;
          text-decoration: underline;
          transform: translateX(2px);
        }

        /* ── Name Variations ─────────────────────────────────────────────────── */
        .yw-variations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
          gap: 14px;
          margin-top: 18px;
        }

        .yw-var-pill {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          transition: border-color 0.15s ease;
        }

        .yw-var-pill:hover {
          border-color: #cbd5e1;
        }

        .yw-var-name {
          font-size: 15.5px;
          font-weight: 700;
          color: #0f172a;
        }

        .yw-var-desc {
          font-size: 12.5px;
          color: #64748b;
          line-height: 1.45;
        }

        /* ── What Users Search (Intent Cards) ────────────────────────────────── */
        .yw-intent-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 18px;
          margin-top: 20px;
        }

        .yw-intent-card {
          background: #fcfefe;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 22px 20px;
          display: flex;
          flex-direction: column;
          transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
        }

        .yw-intent-card:hover {
          transform: translateY(-2px);
          border-color: #cbd5e1;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
        }

        .yw-intent-icon-wrap {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: #eef8f3;
          color: #00985b;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .yw-intent-card-title {
          font-size: 16.5px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 6px 0;
        }

        .yw-intent-badge {
          display: inline-block;
          font-size: 11.5px;
          font-weight: 600;
          color: #008751;
          background: #f0fbf5;
          padding: 3px 10px;
          border-radius: 8px;
          margin-bottom: 12px;
          align-self: flex-start;
        }

        .yw-intent-card-desc {
          font-size: 14px;
          line-height: 1.65;
          color: #475569;
          margin: 0;
        }

        /* ── Comparison Box ──────────────────────────────────────────────────── */
        .yw-comparison-box {
          margin-top: 26px;
          padding-top: 22px;
          border-top: 1px solid #f1f5f9;
        }

        .yw-two-col {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 18px;
          margin-top: 16px;
        }

        .yw-col-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 22px;
        }

        .yw-col-card.highlight {
          background: #f4fbf7;
          border-color: #d1eedf;
        }

        .yw-col-card h4 {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 14px 0;
        }

        .yw-col-card ul {
          margin: 0;
          padding-left: 20px;
          font-size: 14px;
          line-height: 1.7;
          color: #475569;
        }

        .yw-col-card li {
          margin-bottom: 8px;
        }

        /* ── 5-Step Verification ─────────────────────────────────────────────── */
        .yw-steps-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin: 22px 0;
        }

        .yw-step-card {
          display: flex;
          align-items: flex-start;
          gap: 18px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 20px 22px;
          transition: border-color 0.15s ease;
        }

        .yw-step-card:hover {
          border-color: #cbd5e1;
        }

        .yw-step-number {
          font-size: 17px;
          font-weight: 800;
          color: #00985b;
          background: #eef8f3;
          border-radius: 12px;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .yw-step-content {
          flex: 1;
        }

        .yw-step-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 6px 0;
        }

        .yw-step-text {
          font-size: 14.5px;
          line-height: 1.7;
          color: #475569;
          margin: 0;
        }

        .yw-notice-box {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          background: #fef8f0;
          border: 1px solid #fed7aa;
          border-radius: 14px;
          padding: 16px 20px;
          color: #9a3412;
          font-size: 14px;
          line-height: 1.65;
        }

        .yw-notice-box svg {
          color: #ea580c;
          flex-shrink: 0;
          margin-top: 3px;
        }

        /* ── Checklists ──────────────────────────────────────────────────────── */
        .yw-checklist-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 24px 26px;
          margin: 20px 0;
        }

        .yw-checklist-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .yw-checklist-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 14.5px;
          line-height: 1.65;
          color: #334155;
        }

        .yw-check-icon {
          color: #00985b;
          flex-shrink: 0;
          margin-top: 3px;
        }

        .yw-callout-neutral {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 16px 20px;
          font-size: 14px;
          line-height: 1.65;
          color: #475569;
          margin-top: 16px;
        }

        .yw-callout-neutral p {
          margin: 0;
        }

        /* ── Features List ───────────────────────────────────────────────────── */
        .yw-features-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 20px;
        }

        .yw-feature-row {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 18px 20px;
        }

        .yw-feature-bullet {
          background: #00985b;
          color: #ffffff;
          font-weight: 700;
          font-size: 12px;
          min-width: 34px;
          height: 34px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .yw-feature-title {
          font-size: 15.5px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 5px 0;
        }

        .yw-feature-text {
          font-size: 14px;
          line-height: 1.65;
          color: #475569;
          margin: 0;
        }

        /* ── APK Box ─────────────────────────────────────────────────────────── */
        .yw-apk-box {
          background: #fffbf5;
          border: 1px solid #fed7aa;
          border-radius: 18px;
          padding: 24px 26px;
          margin: 20px 0;
        }

        .yw-numbered-list {
          margin: 14px 0 0 0;
          padding-left: 22px;
          font-size: 14.5px;
          line-height: 1.75;
          color: #475569;
        }

        .yw-numbered-list li {
          margin-bottom: 12px;
        }

        /* ── Table Wrapper ───────────────────────────────────────────────────── */
        .yw-formats-table-wrapper {
          overflow-x: auto;
          margin: 20px 0;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
        }

        .yw-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 14px;
          background: #ffffff;
        }

        .yw-table th {
          background: #f8fafc;
          color: #0f172a;
          font-weight: 700;
          padding: 14px 18px;
          border-bottom: 1px solid #e2e8f0;
          white-space: nowrap;
        }

        .yw-table td {
          padding: 14px 18px;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
          line-height: 1.6;
        }

        .yw-table tr:last-child td {
          border-bottom: none;
        }

        /* ── Cycle Card ──────────────────────────────────────────────────────── */
        .yw-cycle-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 22px;
          margin: 18px 0;
        }

        .yw-bullet-list {
          margin: 12px 0 0 0;
          padding-left: 22px;
          font-size: 14.5px;
          line-height: 1.75;
          color: #475569;
        }

        .yw-bullet-list li {
          margin-bottom: 10px;
        }

        /* ── Callout Warning ─────────────────────────────────────────────────── */
        .yw-callout-warning {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          background: #fef8f0;
          border: 1px solid #fed7aa;
          border-radius: 14px;
          padding: 18px 20px;
          color: #9a3412;
          font-size: 14.5px;
          line-height: 1.7;
          margin-top: 18px;
        }

        .yw-callout-warning svg {
          color: #ea580c;
          flex-shrink: 0;
          margin-top: 3px;
        }

        .yw-callout-warning p {
          margin: 0;
        }

        /* ── History Grid ────────────────────────────────────────────────────── */
        .yw-history-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          margin-top: 18px;
        }

        .yw-hist-item {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 18px 20px;
        }

        .yw-hist-title {
          font-size: 15.5px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 6px 0;
        }

        .yw-hist-desc {
          font-size: 13.5px;
          line-height: 1.65;
          color: #475569;
          margin: 0;
        }

        /* ── Pillars Container ───────────────────────────────────────────────── */
        .yw-pillars-container {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin: 20px 0;
        }

        .yw-pillar-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 16px 20px;
        }

        .yw-pillar-badge {
          background: #eef8f3;
          color: #008751;
          font-size: 12px;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 8px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .yw-pillar-name {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 5px 0;
        }

        .yw-pillar-desc {
          font-size: 14px;
          line-height: 1.65;
          color: #475569;
          margin: 0;
        }

        /* ── Disclaimer Box ──────────────────────────────────────────────────── */
        .yw-disclaimer-box {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 16px;
          padding: 20px 22px;
          color: #991b1b;
          font-size: 14px;
          line-height: 1.65;
          margin-top: 20px;
        }

        .yw-disclaimer-title {
          font-size: 15.5px;
          font-weight: 750;
          margin: 0 0 10px 0;
          color: #b91c1c;
        }

        .yw-prohibited-list {
          margin: 10px 0;
          padding-left: 22px;
          font-weight: 600;
        }

        /* ── Diff Grid ───────────────────────────────────────────────────────── */
        .yw-diff-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          margin-top: 18px;
        }

        .yw-diff-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 20px;
        }

        .yw-diff-card h4 {
          font-size: 15.5px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 8px 0;
        }

        .yw-diff-card p {
          font-size: 13.5px;
          line-height: 1.65;
          color: #475569;
          margin: 0;
        }

        /* ── Safety Card ─────────────────────────────────────────────────────── */
        .yw-safety-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 22px 24px;
          margin-top: 18px;
        }

        .yw-safety-list {
          margin: 12px 0 0 0;
          padding-left: 22px;
          font-size: 14.5px;
          line-height: 1.75;
          color: #334155;
        }

        .yw-safety-list li {
          margin-bottom: 12px;
        }

        /* ── Legal Box ───────────────────────────────────────────────────────── */
        .yw-legal-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 22px 24px;
        }

        .yw-legal-text {
          font-size: 14px;
          line-height: 1.75;
          color: #475569;
          margin: 0 0 14px 0;
        }

        .yw-legal-text:last-child {
          margin-bottom: 0;
        }

        /* ── Security Grid ───────────────────────────────────────────────────── */
        .yw-security-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 16px;
          margin-top: 18px;
        }

        .yw-sec-item {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 18px 20px;
          color: #00985b;
        }

        .yw-sec-item h4 {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin: 10px 0 6px 0;
        }

        .yw-sec-item p {
          font-size: 13px;
          line-height: 1.6;
          color: #475569;
          margin: 0;
        }

        /* ── FAQ Accordion (Clean Alignment & Transitions) ───────────────────── */
        .yw-faq-accordion {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .yw-faq-item {
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          background: #ffffff;
          overflow: hidden;
          transition: border-color 0.18s ease;
        }

        .yw-faq-item.open {
          border-color: #d1eedf;
          background: #fafdfb;
        }

        .yw-faq-question-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 22px;
          background: transparent;
          border: none;
          outline: none;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          gap: 14px;
        }

        .yw-faq-question-btn:focus-visible {
          background: #f0fbf5;
          outline: 2px solid #00985b;
          outline-offset: -2px;
        }

        .yw-faq-q-text {
          font-size: 16px;
          font-weight: 650;
          color: #0f172a;
          line-height: 1.45;
        }

        .yw-faq-icon-wrap {
          color: #64748b;
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .yw-faq-item.open .yw-faq-icon-wrap {
          color: #00985b;
        }

        .yw-faq-answer-panel {
          padding: 0 22px 20px 22px;
          border-top: 1px solid transparent;
        }

        .yw-faq-item.open .yw-faq-answer-panel {
          border-top: 1px solid #edf7f1;
          padding-top: 14px;
        }

        .yw-faq-answer-text {
          font-size: 15px;
          line-height: 1.75;
          color: #334155;
          margin: 0;
        }

        /* ── Final CTA ───────────────────────────────────────────────────────── */
        .yw-final-cta {
          background: linear-gradient(135deg, #ffffff 0%, #f4fbf7 100%);
          border: 1px solid #d1eedf;
          border-radius: 22px;
          padding: 42px 32px;
          text-align: center;
          margin-bottom: 24px;
          box-shadow: 0 4px 18px rgba(0, 152, 91, 0.05);
        }

        .yw-final-title {
          font-size: clamp(24px, 3.6vw, 30px);
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 12px 0;
        }

        .yw-final-desc {
          font-size: 15.5px;
          line-height: 1.65;
          color: #475569;
          margin: 0 auto 24px auto;
          max-width: 600px;
        }

        .yw-final-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        /* ── Responsive Breakpoints ──────────────────────────────────────────── */
        @media (max-width: 768px) {
          .yw-container {
            padding: 24px 16px 60px;
          }

          .yw-hero {
            padding: 30px 22px;
            border-radius: 20px;
          }

          .yw-featured-figure {
            padding: 10px;
            border-radius: 18px;
            margin-bottom: 26px;
          }

          .yw-section {
            padding: 26px 20px;
            border-radius: 18px;
            margin-bottom: 26px;
          }

          .yw-step-card {
            gap: 14px;
            padding: 16px 18px;
          }

          .yw-step-number {
            width: 38px;
            height: 38px;
            font-size: 15px;
          }

          .yw-toc-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .yw-container {
            padding: 18px 14px 50px;
          }

          .yw-hero {
            padding: 24px 18px;
          }

          .yw-section {
            padding: 22px 16px;
          }

          .yw-hero-actions,
          .yw-final-actions {
            flex-direction: column;
            width: 100%;
          }

          .yw-btn-primary,
          .yw-btn-secondary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}
