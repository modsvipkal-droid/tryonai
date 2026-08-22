import { useRouter } from "next/router";
import { PageHead, BreadcrumbSchema, FAQSchema, WebPageSchema } from "@/components/SEO";

// ── Page-scoped styles ────────────────────────────────────────────────────────
const bgStyle = `
  html, body { background: #0b0f1a !important; color: #e2e8f0 !important; font-family: 'Inter', sans-serif; overflow: auto !important; }

  .wkh-wrap {
    max-width: 860px;
    margin: 0 auto;
    padding: 48px 24px 72px;
  }

  /* Back */
  .wkh-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #e879f9;
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 32px;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    outline: none;
    transition: color 0.2s;
  }
  .wkh-back:hover { color: #c026d3; }
  .wkh-back:focus-visible { outline: 2px solid #e879f9; outline-offset: 4px; border-radius: 4px; }

  /* Hero */
  .wkh-hero {
    background: linear-gradient(135deg, #1a0a2e 0%, #0d1f38 100%);
    border: 1px solid #2a1040;
    border-radius: 20px;
    padding: 40px 36px;
    margin-bottom: 48px;
    position: relative;
    overflow: hidden;
  }
  .wkh-hero::before {
    content: '';
    position: absolute;
    top: -70px; right: -70px;
    width: 250px; height: 250px;
    background: radial-gradient(circle, rgba(232,121,249,0.13) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
  .wkh-hero::after {
    content: '';
    position: absolute;
    bottom: -50px; left: -50px;
    width: 180px; height: 180px;
    background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  /* Badge */
  .wkh-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(232,121,249,0.12);
    border: 1px solid rgba(232,121,249,0.28);
    color: #f0abfc;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 100px;
    margin-bottom: 18px;
  }
  .wkh-badge-dot {
    width: 6px; height: 6px;
    background: #e879f9;
    border-radius: 50%;
    animation: wkhPulse 1.8s ease-in-out infinite;
  }
  @keyframes wkhPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.3; transform: scale(0.6); }
  }

  /* H1 */
  h1.wkh-h1 {
    font-size: clamp(22px, 4vw, 34px);
    font-weight: 900;
    color: #f1f5f9;
    margin: 0 0 14px;
    line-height: 1.22;
    letter-spacing: -0.5px;
  }
  h1.wkh-h1 .pink   { color: #e879f9; }
  h1.wkh-h1 .indigo { color: #818cf8; }

  .wkh-subtitle {
    font-size: 15px;
    color: #94a3b8;
    margin: 0;
    line-height: 1.65;
    max-width: 640px;
  }

  /* Chips */
  .wkh-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 24px;
  }
  .wkh-chip {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    color: #94a3b8;
    font-size: 12px;
    font-weight: 500;
    padding: 4px 12px;
    border-radius: 100px;
  }

  /* Body */
  .wkh-body { line-height: 1.75; color: #cbd5e1; }
  .wkh-body p { margin: 0 0 20px; font-size: 15.5px; }
  .wkh-body strong { color: #f1f5f9; font-weight: 700; }
  .wkh-body em { color: #f0abfc; font-style: normal; font-weight: 600; }

  /* Sections */
  .wkh-section { margin: 48px 0 0; }
  .wkh-section h2 {
    font-size: clamp(18px, 3vw, 23px);
    font-weight: 800;
    color: #f1f5f9;
    margin: 0 0 6px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .wkh-section h2::before {
    content: '';
    display: inline-block;
    width: 4px; height: 22px;
    background: linear-gradient(180deg, #e879f9, #a21caf);
    border-radius: 2px;
    flex-shrink: 0;
  }
  .wkh-section-sub {
    font-size: 13px;
    color: #e879f9;
    font-weight: 600;
    margin: 0 0 20px;
    padding-left: 14px;
  }

  /* Info cards */
  .wkh-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 14px;
    margin-top: 22px;
  }
  .wkh-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    padding: 20px 18px;
    transition: border-color 0.2s, transform 0.2s;
  }
  .wkh-card:hover { border-color: rgba(232,121,249,0.4); transform: translateY(-2px); }
  .wkh-card-icon  { font-size: 24px; margin-bottom: 10px; }
  .wkh-card-title { font-size: 13px; font-weight: 700; color: #f1f5f9; margin-bottom: 6px; }
  .wkh-card-desc  { font-size: 13px; color: #94a3b8; line-height: 1.55; }

  /* Odds table */
  .wkh-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    font-size: 14px;
  }
  .wkh-table th {
    background: rgba(232,121,249,0.1);
    color: #f0abfc;
    font-weight: 700;
    text-align: left;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(232,121,249,0.2);
  }
  .wkh-table td {
    padding: 11px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    color: #94a3b8;
  }
  .wkh-table tr:hover td { background: rgba(255,255,255,0.02); }
  .wkh-table td:first-child { color: #e2e8f0; font-weight: 600; }
  .pill-red    { color: #fca5a5; font-weight: 700; }
  .pill-green  { color: #86efac; font-weight: 700; }
  .pill-violet { color: #c4b5fd; font-weight: 700; }

  /* Highlight */
  .wkh-highlight {
    background: rgba(232,121,249,0.07);
    border-left: 3px solid #e879f9;
    border-radius: 0 10px 10px 0;
    padding: 14px 18px;
    margin: 20px 0;
    font-size: 14.5px;
    color: #f0abfc;
    line-height: 1.65;
  }

  /* Trion promo card */
  .wkh-promo {
    background: linear-gradient(135deg, rgba(232,121,249,0.09) 0%, rgba(99,102,241,0.09) 100%);
    border: 1px solid rgba(232,121,249,0.25);
    border-radius: 16px;
    padding: 24px 26px;
    margin: 28px 0;
  }
  .wkh-promo-title {
    font-size: 15px;
    font-weight: 800;
    color: #f0abfc;
    margin: 0 0 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .wkh-promo-list {
    list-style: none;
    padding: 0; margin: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .wkh-promo-list li {
    font-size: 14px;
    color: #cbd5e1;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .wkh-promo-list li span.icon { font-size: 15px; }
  .wkh-promo-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 14px;
    background: rgba(232,121,249,0.15);
    border: 1px solid rgba(232,121,249,0.3);
    color: #f0abfc;
    font-size: 13px;
    font-weight: 700;
    padding: 7px 16px;
    border-radius: 100px;
    text-decoration: none;
    transition: background 0.2s;
  }
  .wkh-promo-link:hover { background: rgba(232,121,249,0.25); }

  /* Notice */
  .wkh-notice {
    background: rgba(234,179,8,0.07);
    border: 1px solid rgba(234,179,8,0.22);
    border-radius: 12px;
    padding: 16px 20px;
    color: #fde68a;
    font-size: 14px;
    line-height: 1.65;
    margin: 24px 0;
  }
  .wkh-notice strong { color: #fbbf24; }

  /* Legal box */
  .wkh-legal {
    background: rgba(239,68,68,0.07);
    border: 1px solid rgba(239,68,68,0.18);
    border-radius: 12px;
    padding: 16px 20px;
    color: #fca5a5;
    font-size: 14px;
    line-height: 1.65;
    margin: 20px 0;
  }
  .wkh-legal strong { color: #f87171; }

  /* Divider */
  .wkh-divider {
    border: none;
    border-top: 1px solid rgba(255,255,255,0.07);
    margin: 48px 0;
  }

  /* FAQ */
  .wkh-faq-item {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    padding: 22px 24px;
    margin-bottom: 12px;
    transition: border-color 0.2s;
  }
  .wkh-faq-item:hover { border-color: rgba(232,121,249,0.3); }
  .wkh-faq-q {
    font-size: 15px;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 10px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }
  .wkh-faq-num {
    flex-shrink: 0;
    background: rgba(232,121,249,0.15);
    color: #e879f9;
    font-size: 12px;
    font-weight: 800;
    width: 22px; height: 22px;
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    margin-top: 1px;
  }
  .wkh-faq-a {
    font-size: 14.5px;
    color: #94a3b8;
    line-height: 1.7;
    margin: 0;
    padding-left: 32px;
  }

  /* Conclusion */
  .wkh-conclusion {
    background: linear-gradient(135deg, rgba(232,121,249,0.07) 0%, rgba(99,102,241,0.06) 100%);
    border: 1px solid rgba(232,121,249,0.2);
    border-radius: 16px;
    padding: 28px 30px;
    margin-top: 48px;
  }
  .wkh-conclusion h2 {
    font-size: 18px;
    font-weight: 800;
    color: #e879f9;
    margin: 0 0 12px;
  }
  .wkh-conclusion p {
    font-size: 15px;
    color: #cbd5e1;
    line-height: 1.75;
    margin: 0;
  }

  /* Responsive */
  @media (max-width: 640px) {
    .wkh-wrap { padding: 28px 16px 56px; }
    .wkh-hero { padding: 28px 20px; }
    .wkh-section h2 { font-size: 18px; }
    .wkh-faq-q { font-size: 14px; }
    .wkh-table th, .wkh-table td { padding: 10px 12px; font-size: 13px; }
  }
`;

// ── FAQ data ──────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    question: "Wingo kya hai? (What is WinGo?)",
    answer:
      "WinGo — jise Colour Trading bhi kehte hain — ek colour prediction game hai jisme players ek number (0–9) ya colour (Red, Green, Violet) choose karke bet lagate hain. Har round ek specific period mein complete hota hai (30 seconds se lekar 10 minutes tak, platform ke anusaar). Result ek random number generator (RNG) se determine hota hai."
  },
  {
    question: "Wingo mein game modes kaunse hain?",
    answer:
      "Wingo kya hai platforms par commonly multiple timer modes milte hain: 30 Second (30s), 1 Minute (1Min), 3 Minute (3Min), 5 Minute (5Min), aur 10 Minute (10Min). India Lotto variant mein similar modes hote hain. Shorter periods (30s, 1Min) fast-paced hote hain, jabke longer periods (5Min, 10Min) relatively slower analysis time dete hain."
  },
  {
    question: "Wingo mein betting options aur odds/payout kya hain?",
    answer:
      "Players teen tarah se bet laga sakte hain: (1) Colour — Red ya Green par 2x payout, Violet par 4.5x payout. (2) Number — 0 se 9 tak kisi bhi number par, jiske odds alag hote hain. (3) Big/Small — numbers 5–9 = Big, 0–4 = Small, dono par approximately 2x odds. Violet sirf number 0 aur 5 par aata hai, isliye uska payout zyada hota hai."
  },
  {
    question: "Wingo prediction aur trick reliable hai kya?",
    answer:
      "AI-based 'prediction' apps ka daava hota hai ki woh future numbers ya colours predict kar sakte hain. Lekin haqeeqat mein WinGo results ek certified random number generator (RNG) se generate hote hain. Har draw independent hota hai — past results future draws ko guarantee nahi karte. Pattern analysis tools statistical trends dikhate hain, lekin koi bhi tool 100% accuracy ke saath predict nahi kar sakta."
  },
  {
    question: "Wingo result kaise check karein aur best prediction website kaunsi hai?",
    answer:
      "Latest Wingo results, history aur analysis dekhne ke liye TRION AI ka platform — Wingo30.com — use kar sakte hain. Yahan Wingo result, Wingo history, AI-based prediction tools aur related features ek hi jagah milte hain. Yeh ek informational aur analytical platform hai; real-money gaming decisions apni zimmedari par lein."
  },
  {
    question: "Wingo mein UPI se payment kaise kare?",
    answer:
      "Indian platforms par aam taur par Paytm, PhonePe, Google Pay jaisi UPI payment methods di jaati hain. Deposit karne se pehle platform ki terms of service padh lein, minimum deposit amount confirm karein, aur ensure karein ki platform aapke state mein legally operate karta hai. UPI transaction reversible nahi hote, isliye platform verify karna zaroori hai."
  },
  {
    question: "Kya Wingo India mein legal hai?",
    answer:
      "Wingo games ki legality is baat par depend karti hai ki platform kaise operate karta hai aur real-money gaming involved hai ya nahi. India mein online gaming laws alag-alag states mein different hain aur samay ke saath change bhi ho sakte hain. Kisi bhi Wingo platform use karne se pehle uske terms, applicable laws aur apne state ke rules zaroor check karein. Informational result/history services aur real-money gaming platforms ko ek jaisa nahi maana jaana chahiye."
  }
];

// ─────────────────────────────────────────────────────────────────────────────

export default function WingoKyaHaiPage() {
  const router = useRouter();

  const PAGE_URL   = "https://wingo30.com/wingo-kya-hai";
  const PAGE_TITLE = "Wingo Kya Hai? - WinGo Game Guide & Prediction Info";
  const PAGE_DESC  =
    "Wingo kya hai? Learn about WinGo colour prediction game: modes, betting options, odds, UPI payment, legality in India & best prediction tools explained.";

  return (
    <>
      {/* ── SEO Head ─────────────────────────────────────────────────────── */}
      <PageHead
        title={PAGE_TITLE}
        description={PAGE_DESC}
        canonical={PAGE_URL}
      >
        <style dangerouslySetInnerHTML={{ __html: bgStyle }} />
      </PageHead>

      {/* ── Structured Data ──────────────────────────────────────────────── */}
      <WebPageSchema title={PAGE_TITLE} description={PAGE_DESC} url={PAGE_URL} />
      <BreadcrumbSchema items={[
        { name: "Home",          url: "https://wingo30.com/" },
        { name: "Wingo Kya Hai", url: PAGE_URL }
      ]} />
      <FAQSchema questions={FAQ_ITEMS} />

      {/* ── Page Body ────────────────────────────────────────────────────── */}
      <div className="wkh-wrap">

        {/* Back */}
        <button
          className="wkh-back"
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

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className="wkh-hero">
          <div className="wkh-badge">
            <span className="wkh-badge-dot" aria-hidden="true" />
            Complete Game Guide
          </div>

          <h1 className="wkh-h1">
            <span className="pink">Wingo Kya Hai?</span> — WinGo{" "}
            <span className="indigo">Colour Prediction</span> Game — Complete Guide
          </h1>

          <p className="wkh-subtitle">
            <strong>Wingo kya hai</strong> — yeh India ke sabse common questions mein se ek hai.
            Is page mein WinGo game ki complete jankari milegi: game modes, betting options,
            odds, UPI payment, legality aur best prediction tools — sab kuch ek jagah, clearly
            explained.
          </p>

          <div className="wkh-chips">
            {["Colour Prediction", "WinGo Game", "Big Small", "India Lotto", "Wingo 30s", "TRION AI"].map(chip => (
              <span className="wkh-chip" key={chip}>{chip}</span>
            ))}
          </div>
        </div>

        {/* ── Article Body ─────────────────────────────────────────────── */}
        <div className="wkh-body">

          {/* Intro */}
          <p>
            <strong>Wingo kya hai?</strong> — WinGo, jise <em>Colour Trading</em> bhi kehte
            hain, ek online colour prediction game hai jisme players Red, Green, ya Violet
            colour choose karte hain — ya phir 0 se 9 tak koi number — aur result ke anusaar
            payout milta hai. Yeh game India mein tezi se popular hua hai, especially 30-second
            aur 1-minute fast modes ki wajah se. Is guide mein har aspect clearly explain kiya
            gaya hai: game structure, betting options, odds, payment methods, prediction tools,
            aur legal considerations.
          </p>

          <div className="wkh-notice">
            <strong>Disclaimer:</strong> WinGo results ek certified Random Number Generator
            (RNG) se generate hote hain. Koi bhi prediction tool future outcomes guarantee
            nahi kar sakta. Yeh page sirf informational hai. Apni zimmedari par play karein.
          </div>

          {/* ── Section 1 ───────────────────────────────────────────────── */}
          <div className="wkh-section">
            <h2>WinGo Game Structure — Modes aur Periods</h2>
            <p className="wkh-section-sub">Wingo kya hai iska jawab: game modes aur timing breakdown</p>

            <p>
              <strong>Wingo kya hai</strong> ka sabse basic jawab yeh hai ki yeh ek timer-based
              draw game hai. Har period ek fixed duration mein complete hota hai, jiske end par
              ek RNG-generated number (0–9) reveal hota hai. Woh number corresponding colour
              aur Big/Small category determine karta hai.
            </p>

            <div className="wkh-cards">
              {[
                { icon: "⚡", title: "30 Second (30s)", desc: "Fastest mode. Har 30 seconds mein ek new draw. Quick decisions required." },
                { icon: "⏱️", title: "1 Minute (1Min)", desc: "Most popular mode. Analysis ke liye thoda zyada time milta hai." },
                { icon: "🕒", title: "3 Minute (3Min)", desc: "Medium pace. Pattern observation ke liye comfortable window." },
                { icon: "🕔", title: "5 Min / 10 Min", desc: "Slow modes. Longer streak analysis aur strategy ke liye suited hain." },
              ].map(c => (
                <div className="wkh-card" key={c.title}>
                  <div className="wkh-card-icon">{c.icon}</div>
                  <div className="wkh-card-title">{c.title}</div>
                  <div className="wkh-card-desc">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <hr className="wkh-divider" />

          {/* ── Section 2 ───────────────────────────────────────────────── */}
          <div className="wkh-section">
            <h2>Betting Options aur Odds — Payout Kitna Milta Hai?</h2>
            <p className="wkh-section-sub">Colour, number aur Big/Small par bet karne ke options</p>

            <p>
              WinGo mein teen tarah ke betting options hote hain. Har option ke odds alag hote
              hain kyunki probability alag hoti hai:
            </p>

            <table className="wkh-table">
              <thead>
                <tr>
                  <th>Bet Type</th>
                  <th>Options</th>
                  <th>Payout (Approx.)</th>
                  <th>Condition</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Colour</td>
                  <td><span className="pill-red">Red</span> / <span className="pill-green">Green</span></td>
                  <td>2x</td>
                  <td>Number 1,3,7,9 = Red; 2,4,6,8 = Green</td>
                </tr>
                <tr>
                  <td>Colour</td>
                  <td><span className="pill-violet">Violet</span></td>
                  <td>4.5x</td>
                  <td>Only on number 0 or 5</td>
                </tr>
                <tr>
                  <td>Number</td>
                  <td>0–9 (any)</td>
                  <td>9x – 9.9x</td>
                  <td>Exact number match required</td>
                </tr>
                <tr>
                  <td>Big/Small</td>
                  <td>Big (5–9) / Small (0–4)</td>
                  <td>~2x</td>
                  <td>Number falls in range</td>
                </tr>
              </tbody>
            </table>

            <div className="wkh-highlight">
              Violet ka 4.5x payout isliye zyada hai kyunki woh sirf 2 numbers (0 aur 5) par
              aata hai — yani 10 mein se sirf 2 chances. Higher risk = higher reward, lekin
              RNG ke anusaar har draw independent hota hai.
            </div>
          </div>

          <hr className="wkh-divider" />

          {/* ── Section 3 ───────────────────────────────────────────────── */}
          <div className="wkh-section">
            <h2>Wingo Prediction — AI Tools aur Unki Limitations</h2>
            <p className="wkh-section-sub">Prediction apps kaise kaam karti hain aur kya expect karein</p>

            <p>
              Jab koi poochhe <strong>wingo kya hai</strong> toh ek common follow-up question
              hota hai: "Kya koi prediction trick ya AI tool kaam karta hai?" Yahan honest
              jawab dena zaroori hai.
            </p>
            <p>
              AI-based WinGo prediction tools historical result data — pichle 50 se 200 rounds
              — collect karte hain aur statistical patterns identify karte hain. Woh colour run
              lengths, Big/Small streaks, aur number absence counts track karte hain aur ek
              suggested pick output karte hain. TRION AI ka platform yahi karta hai — live
              data analysis aur AI-based pattern suggestions, responsibly presented.
            </p>
            <p>
              Lekin yeh samajhna zaroori hai: WinGo ek certified RNG system use karta hai.
              Har draw completely independent hota hai. Prediction tools past patterns se
              informed suggestions dete hain — guaranteed future outcomes nahi. Inhe data
              companion ki tarah use karein, not as an income strategy.
            </p>

            {/* Trion promo */}
            <div className="wkh-promo">
              <div className="wkh-promo-title">
                🌐 Best Wingo Prediction &amp; Result Platform
              </div>
              <ul className="wkh-promo-list">
                <li><span className="icon">⚡</span> Fast &amp; easy-to-use Wingo tools</li>
                <li><span className="icon">📊</span> Wingo result history &amp; analysis</li>
                <li><span className="icon">🤖</span> AI-based prediction features</li>
                <li><span className="icon">🔧</span> Wingo Tools • TRION AI Platform</li>
              </ul>
              <a className="wkh-promo-link" href="https://wingo30.com" target="_blank" rel="noopener noreferrer">
                Visit Wingo30.com →
              </a>
            </div>
          </div>

          <hr className="wkh-divider" />

          {/* ── Section 4 ───────────────────────────────────────────────── */}
          <div className="wkh-section">
            <h2>UPI Payment aur India mein Wingo ki Legality</h2>
            <p className="wkh-section-sub">Payment methods aur legal status ke baare mein important jankari</p>

            <p>
              Indian Wingo platforms generally Paytm, PhonePe, aur Google Pay jaise{" "}
              <strong>UPI payment methods</strong> support karte hain. Deposit karte waqt
              platform ka name verify karein, minimum deposit amount samajh lein, aur ensure
              karein ki platform authenticated hai.
            </p>
            <p>
              <strong>Wingo ki India mein legality</strong> platform ke structure par depend
              karti hai. India mein online gaming laws state-by-state different hain aur
              regularly update hote hain:
            </p>

            <div className="wkh-legal">
              <strong>Legal Note:</strong> Real-money gaming platforms aur informational/analytical
              platforms (jaise result history ya prediction tools) ko alag category mein maana
              jaata hai. Kisi bhi platform use karne se pehle uske terms of service padh lein
              aur apne state ke applicable laws check karein. Yeh page sirf informational
              purposes ke liye hai.
            </div>

            <p>
              Agar aap sirf Wingo results dekhna chahte hain ya analysis tools use karna
              chahte hain bina real-money betting ke, toh TRION AI jaisi informational
              platforms is need ko fulfill karti hain without the legal complexity of direct
              gaming platforms.
            </p>
          </div>

        </div>

        <hr className="wkh-divider" />

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <div className="wkh-section">
          <h2>Frequently Asked Questions — Wingo Kya Hai &amp; Related Queries</h2>
          <p className="wkh-section-sub">Sabse common questions ke clear jawab</p>

          {FAQ_ITEMS.map((item, i) => (
            <div className="wkh-faq-item" key={i}>
              <p className="wkh-faq-q">
                <span className="wkh-faq-num" aria-hidden="true">{i + 1}</span>
                {item.question}
              </p>
              <p className="wkh-faq-a">{item.answer}</p>
            </div>
          ))}
        </div>

        {/* ── Conclusion ────────────────────────────────────────────────── */}
        <div className="wkh-conclusion">
          <h2>Conclusion — Wingo Kya Hai, Aur Aage Kya?</h2>
          <p>
            <strong>Wingo kya hai</strong> — is sawaal ka jawab ab clear hai: WinGo ek
            RNG-based colour prediction game hai jisme multiple betting options, varying odds,
            aur multiple game modes hain. Chahe aap 30-second fast mode mein interested hain
            ya 5-minute analysis window prefer karte hain, game mechanics same rehte hain.
            AI prediction tools aur result analysers — jaise TRION AI ka Wingo30.com platform
            — is game ko data ke saath approach karne mein help karte hain, lekin koi bhi tool
            guaranteed outcomes nahi de sakta. Informed raho, responsibly khelo, aur hamesha
            within your limits play karo.
          </p>
        </div>

      </div>
    </>
  );
}
