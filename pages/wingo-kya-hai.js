import { useRouter } from "next/router";
import { PageHead, BreadcrumbSchema, FAQSchema, WebPageSchema } from "@/components/SEO";

// ── Page-scoped styles ────────────────────────────────────────────────────────
const bgStyle = `
  html, body {
    min-height: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    background-color: #fbfdfc !important;
    color: #1e293b !important;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    -webkit-font-smoothing: antialiased;
  }

  #__next {
    min-height: 100% !important;
  }

  .wkh-page-shell {
    min-height: 100vh;
    width: 100%;
    background: radial-gradient(100% 40% at 50% 0%, #f0f7f3 0%, #fbfdfc 100%);
    color: #1e293b;
    overflow-x: hidden;
  }

  .wkh-wrap {
    max-width: 880px;
    margin: 0 auto;
    padding: 40px 24px 80px;
  }

  /* Back */
  .wkh-back {
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
  .wkh-back:hover {
    color: #00985b;
    border-color: #d1eedf;
    background: #f4fbf7;
    transform: translateX(-2px);
  }
  .wkh-back:focus-visible {
    outline: 2px solid #00985b;
    outline-offset: 2px;
  }

  /* Hero */
  .wkh-hero {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 20px;
    padding: 36px 32px;
    margin-bottom: 40px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.03), 0 4px 20px rgba(0,152,91,0.03);
    position: relative;
  }

  /* Badge */
  .wkh-badge {
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
  .wkh-badge-dot {
    width: 6px; height: 6px;
    background: #00985b;
    border-radius: 50%;
  }

  /* H1 */
  h1.wkh-h1 {
    font-size: clamp(24px, 4.5vw, 34px);
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 12px;
    line-height: 1.25;
    letter-spacing: -0.02em;
  }
  h1.wkh-h1 .pink   { color: #00985b; }
  h1.wkh-h1 .indigo { color: #007043; }

  .wkh-subtitle {
    font-size: 15.5px;
    color: #475569;
    margin: 0;
    line-height: 1.65;
    max-width: 680px;
  }

  /* Chips */
  .wkh-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 20px;
  }
  .wkh-chip {
    background: #f8faf9;
    border: 1px solid #e6ede9;
    color: #008751;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 9999px;
  }

  /* Body */
  .wkh-body {
    line-height: 1.75;
    color: #334155;
  }
  .wkh-body p {
    margin: 0 0 18px;
    font-size: 15px;
    color: #334155;
  }
  .wkh-body strong {
    color: #0f172a;
    font-weight: 600;
  }
  .wkh-body em {
    color: #008751;
    font-style: normal;
    font-weight: 600;
  }

  /* Sections */
  .wkh-section {
    margin: 48px 0 0;
  }
  .wkh-section h2 {
    font-size: clamp(19px, 3.5vw, 24px);
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 6px;
    letter-spacing: -0.015em;
    line-height: 1.3;
  }
  .wkh-section-sub {
    font-size: 14px;
    color: #64748b;
    font-weight: 400;
    margin: 0 0 20px;
  }

  /* Info cards */
  .wkh-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 16px;
    margin-top: 20px;
  }
  .wkh-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
  }
  .wkh-card:hover {
    border-color: #cbd5e1;
    transform: translateY(-2px);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
  }
  .wkh-card-icon  { font-size: 24px; margin-bottom: 12px; }
  .wkh-card-title { font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
  .wkh-card-desc  { font-size: 13px; color: #475569; line-height: 1.55; }

  /* Odds table */
  .wkh-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    font-size: 14px;
    background: #ffffff;
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
  }
  .wkh-table th {
    background: #f8faf9;
    color: #0f172a;
    font-weight: 700;
    text-align: left;
    padding: 14px 18px;
    border-bottom: 1px solid #e2e8f0;
  }
  .wkh-table td {
    padding: 13px 18px;
    border-bottom: 1px solid #f1f5f9;
    color: #475569;
  }
  .wkh-table tr:last-child td { border-bottom: none; }
  .wkh-table tr:hover td { background: #fafcfb; }
  .wkh-table td:first-child { color: #0f172a; font-weight: 600; }
  .pill-red    { color: #dc2626; font-weight: 700; }
  .pill-green  { color: #16a34a; font-weight: 700; }
  .pill-violet { color: #9333ea; font-weight: 700; }

  /* Highlight */
  .wkh-highlight {
    background: #f8faf9;
    border-left: 3px solid #00985b;
    border-radius: 0 12px 12px 0;
    padding: 16px 20px;
    margin: 24px 0;
    font-size: 14.5px;
    color: #1e293b;
    line-height: 1.65;
  }

  /* Trion promo card */
  .wkh-promo {
    background: linear-gradient(180deg, #ffffff 0%, #f4fbf7 100%);
    border: 1px solid #d1eedf;
    border-radius: 18px;
    padding: 28px 28px;
    margin: 32px 0;
    box-shadow: 0 2px 10px rgba(0, 152, 91, 0.04);
  }
  .wkh-promo-title {
    font-size: 16px;
    font-weight: 800;
    color: #007043;
    margin: 0 0 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .wkh-promo-list {
    list-style: none;
    padding: 0; margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .wkh-promo-list li {
    font-size: 14px;
    color: #334155;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .wkh-promo-list li span.icon { font-size: 15px; }
  .wkh-promo-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 18px;
    background: #00985b;
    color: #ffffff;
    font-size: 13.5px;
    font-weight: 700;
    padding: 10px 22px;
    border-radius: 12px;
    text-decoration: none;
    transition: background 0.15s, transform 0.15s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  }
  .wkh-promo-link:hover { background: #00804c; transform: translateY(-1px); }

  /* Notice */
  .wkh-notice {
    background: #fefce8;
    border: 1px solid #fef08a;
    border-radius: 12px;
    padding: 16px 20px;
    color: #854d0e;
    font-size: 14px;
    line-height: 1.6;
    margin: 24px 0;
  }
  .wkh-notice strong { color: #713f12; }

  /* Legal box */
  .wkh-legal {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 12px;
    padding: 16px 20px;
    color: #991b1b;
    font-size: 14px;
    line-height: 1.6;
    margin: 24px 0;
  }
  .wkh-legal strong { color: #7f1d1d; }

  /* Divider */
  .wkh-divider {
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 48px 0;
  }

  /* FAQ */
  .wkh-faq-item {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 20px 22px;
    margin-bottom: 12px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
    transition: border-color 0.15s ease;
  }
  .wkh-faq-item:hover {
    border-color: #cbd5e1;
  }
  .wkh-faq-q {
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 8px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  .wkh-faq-num {
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
    margin-top: 1px;
  }
  .wkh-faq-a {
    font-size: 14.5px;
    color: #475569;
    line-height: 1.65;
    margin: 0;
    padding-left: 36px;
  }

  /* Conclusion */
  .wkh-conclusion {
    background: linear-gradient(180deg, #ffffff 0%, #f4fbf7 100%);
    border: 1px solid #d1eedf;
    border-radius: 18px;
    padding: 32px 28px;
    margin-top: 48px;
    box-shadow: 0 2px 8px rgba(0, 152, 91, 0.03);
  }
  .wkh-conclusion h2 {
    font-size: 19px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 10px;
  }
  .wkh-conclusion p {
    font-size: 15px;
    color: #334155;
    line-height: 1.7;
    margin: 0;
  }

  /* Responsive */
  @media (max-width: 640px) {
    .wkh-wrap { padding: 24px 20px 60px; }
    .wkh-hero { padding: 24px 20px; border-radius: 16px; margin-bottom: 32px; }
    .wkh-section h2 { font-size: 18px; }
    .wkh-faq-q { font-size: 14.5px; }
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
      <div className="wkh-page-shell">
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
    </div>
  </>
);
}
