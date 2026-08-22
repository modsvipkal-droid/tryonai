import { useRouter } from "next/router";
import { PageHead, BreadcrumbSchema, FAQSchema, WebPageSchema } from "@/components/SEO";

// ── Page-scoped styles ────────────────────────────────────────────────────────
const bgStyle = `
  html, body {
    height: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    background: linear-gradient(90deg, rgba(0,126,73,0.12), rgba(255,255,255,0.5), rgba(0,126,73,0.12)), #eef7f3 !important;
    color: #17251f !important;
    font-family: 'Inter', sans-serif;
  }

  #__next {
    height: 100% !important;
    overflow: hidden !important;
  }

  .w30-page-shell {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    -webkit-overflow-scrolling: touch !important;
    scroll-behavior: smooth !important;
    background: linear-gradient(90deg, rgba(0,126,73,0.12), rgba(255,255,255,0.5), rgba(0,126,73,0.12)), #eef7f3;
    z-index: 1;
  }

  .w30-page-shell::-webkit-scrollbar { width: 6px; }
  .w30-page-shell::-webkit-scrollbar-track { background: transparent; }
  .w30-page-shell::-webkit-scrollbar-thumb { background: rgba(0,152,91,0.2); border-radius: 4px; }
  .w30-page-shell::-webkit-scrollbar-thumb:hover { background: rgba(0,152,91,0.35); }

  .w30-wrap {
    max-width: 860px;
    margin: 0 auto;
    padding: 48px 24px 72px;
  }

  /* Back button */
  .w30-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #00985b;
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
  .w30-back:hover { color: #005537; }
  .w30-back:focus-visible { outline: 2px solid #00985b; outline-offset: 4px; border-radius: 4px; }

  /* Hero banner */
  .w30-hero {
    background: linear-gradient(135deg, #e6f7ef 0%, #d4f0e4 100%);
    border: 1px solid #b2dfc8;
    border-radius: 20px;
    padding: 40px 36px;
    margin-bottom: 48px;
    position: relative;
    overflow: hidden;
  }
  .w30-hero::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 220px; height: 220px;
    background: radial-gradient(circle, rgba(0,152,91,0.14) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
  .w30-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(0,152,91,0.12);
    border: 1px solid rgba(0,152,91,0.3);
    color: #00985b;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 100px;
    margin-bottom: 18px;
  }
  .w30-badge-dot {
    width: 6px; height: 6px;
    background: #00985b;
    border-radius: 50%;
    animation: pulse30 1.6s ease-in-out infinite;
  }
  @keyframes pulse30 {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.7); }
  }

  /* Typography */
  h1.w30-h1 {
    font-size: clamp(24px, 4vw, 36px);
    font-weight: 900;
    color: #17251f;
    margin: 0 0 14px;
    line-height: 1.25;
    letter-spacing: -0.5px;
  }
  h1.w30-h1 span { color: #00985b; }

  .w30-subtitle {
    font-size: 15px;
    color: #4a6358;
    margin: 0;
    line-height: 1.65;
    max-width: 640px;
  }

  /* Chips row */
  .w30-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 24px;
  }
  .w30-chip {
    background: rgba(0,152,91,0.08);
    border: 1px solid rgba(0,152,91,0.2);
    color: #00985b;
    font-size: 12px;
    font-weight: 500;
    padding: 4px 12px;
    border-radius: 100px;
  }

  /* Article body */
  .w30-body { line-height: 1.75; color: #2d4a3e; }
  .w30-body p { margin: 0 0 20px; font-size: 15.5px; }
  .w30-body strong { color: #17251f; font-weight: 700; }

  /* Section headings */
  .w30-section { margin: 48px 0 0; }
  .w30-section h2 {
    font-size: clamp(18px, 3vw, 24px);
    font-weight: 800;
    color: #17251f;
    margin: 0 0 6px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .w30-section h2::before {
    content: '';
    display: inline-block;
    width: 4px; height: 22px;
    background: linear-gradient(180deg, #00985b, #005537);
    border-radius: 2px;
    flex-shrink: 0;
  }
  .w30-section-sub {
    font-size: 13px;
    color: #00985b;
    font-weight: 600;
    margin: 0 0 20px;
    padding-left: 14px;
  }

  /* Info cards */
  .w30-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 14px;
    margin-top: 20px;
  }
  .w30-card {
    background: #ffffff;
    border: 1px solid #c9e8d8;
    border-radius: 14px;
    padding: 20px;
    transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
  }
  .w30-card:hover { border-color: #00985b; transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,152,91,0.12); }
  .w30-card-icon { font-size: 22px; margin-bottom: 10px; }
  .w30-card-title { font-size: 13px; font-weight: 700; color: #17251f; margin-bottom: 6px; }
  .w30-card-desc { font-size: 13px; color: #4a6358; line-height: 1.55; }

  /* Divider */
  .w30-divider {
    border: none;
    border-top: 1px solid #d4e8de;
    margin: 48px 0;
  }

  /* Notice box */
  .w30-notice {
    background: #fffbeb;
    border: 1px solid #fcd34d;
    border-radius: 12px;
    padding: 16px 20px;
    color: #92400e;
    font-size: 14px;
    line-height: 1.65;
    margin: 24px 0;
  }
  .w30-notice strong { color: #b45309; }

  /* FAQ */
  .w30-faq { margin-top: 0; }
  .w30-faq-item {
    background: #ffffff;
    border: 1px solid #c9e8d8;
    border-radius: 14px;
    padding: 22px 24px;
    margin-bottom: 12px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .w30-faq-item:hover { border-color: #00985b; box-shadow: 0 2px 12px rgba(0,152,91,0.1); }
  .w30-faq-q {
    font-size: 15px;
    font-weight: 700;
    color: #17251f;
    margin: 0 0 10px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }
  .w30-faq-q-num {
    flex-shrink: 0;
    background: rgba(0,152,91,0.12);
    color: #00985b;
    font-size: 12px;
    font-weight: 800;
    width: 22px; height: 22px;
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    margin-top: 1px;
  }
  .w30-faq-a {
    font-size: 14.5px;
    color: #4a6358;
    line-height: 1.7;
    margin: 0;
    padding-left: 32px;
  }

  /* Conclusion */
  .w30-conclusion {
    background: linear-gradient(135deg, #e9f8f1 0%, #d4f0e4 100%);
    border: 1px solid #b2dfc8;
    border-radius: 16px;
    padding: 28px 30px;
    margin-top: 48px;
  }
  .w30-conclusion h2 {
    font-size: 18px;
    font-weight: 800;
    color: #00985b;
    margin: 0 0 12px;
  }
  .w30-conclusion p {
    font-size: 15px;
    color: #2d4a3e;
    line-height: 1.75;
    margin: 0;
  }

  /* Responsive */
  @media (max-width: 640px) {
    .w30-wrap { padding: 28px 16px 56px; }
    .w30-hero { padding: 28px 20px; }
    .w30-section h2 { font-size: 18px; }
    .w30-faq-q { font-size: 14px; }
  }
`;

// ── FAQ data (also fed to FAQSchema structured data) ─────────────────────────
const FAQ_ITEMS = [
  {
    question: "What is a Wingo 30 second predictor and how does it work?",
    answer:
      "A Wingo 30 predictor is a pattern-analysis tool that studies historical result data from the WinGo 30-second game round on colour prediction platforms. It identifies repeating sequences in colour (Red/Green/Violet) and number outcomes and generates a suggested prediction for the next round. It does not connect to the game server; it processes publicly visible historical data only."
  },
  {
    question: "Is the Wingo 30s AI prediction accurate?",
    answer:
      "No AI or algorithm can predict a future round with certainty because WinGo results are determined by a random number generator (RNG). A Wingo 30 AI prediction tool surfaces statistical trends and frequencies, which may slightly inform pattern-based decisions, but outcomes remain inherently unpredictable. Always treat these tools as informational aids, not reliable profit systems."
  },
  {
    question: "What is the difference between Wingo 1 minute and Wingo 30 second modes?",
    answer:
      "Wingo 30 second rounds complete twice as fast as the 1-minute variant. This means patterns change more frequently and analysis windows are shorter. The Wingo 30-second colour prediction cycle demands quicker decision-making, and any analyser must refresh its data at a higher cadence to remain relevant."
  },
  {
    question: "Can a Wingo 30 free prediction tool replace a paid one?",
    answer:
      "Free and paid Wingo 30 prediction tools fundamentally perform the same type of statistical analysis. Differences usually lie in data refresh speed, additional filters (e.g., big/small streaks, number hotspots), and the quality of the underlying algorithm. Neither a free nor a paid tool removes the element of chance from the game."
  },
  {
    question: "What is 'Big Small' prediction in Wingo 30?",
    answer:
      "In WinGo, each number from 0-9 is classified as 'Small' (0-4) or 'Big' (5-9). A Wingo 30 Second Big Small prediction strategy tracks how many consecutive Big or Small results have appeared and uses that streak data to suggest which side is statistically more likely to appear next — though this is never a guarantee."
  }
];

// ─────────────────────────────────────────────────────────────────────────────

export default function Wingo30Page() {
  const router = useRouter();

  const PAGE_URL = "https://wingo30.com/wingo30";
  const PAGE_TITLE = "Wingo 30 Second Predictor - AI Prediction & Analyser Guide";
  const PAGE_DESC =
    "Learn how the Wingo 30 predictor and AI analyser works. Understand Wingo 30s colour & big/small prediction strategies - no exaggerated claims, just facts.";

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

      {/* ── Structured Data ───────────────────────────────────────────────── */}
      <WebPageSchema
        title={PAGE_TITLE}
        description={PAGE_DESC}
        url={PAGE_URL}
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://wingo30.com/" },
        { name: "Wingo 30", url: PAGE_URL }
      ]} />
      <FAQSchema questions={FAQ_ITEMS} />

      {/* ── Page body ────────────────────────────────────────────────────── */}
      <div className="w30-page-shell">
        <div className="w30-wrap">

          {/* Back */}
          <button
            className="w30-back"
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
          <div className="w30-hero">
            <div className="w30-badge">
              <span className="w30-badge-dot" aria-hidden="true" />
              Live Analyser
            </div>

            <h1 className="w30-h1">
              <span>Wingo 30</span> Second Predictor —{" "}
              AI Analyser &amp; Colour Prediction Guide
            </h1>

            <p className="w30-subtitle">
              A complete, factual guide to understanding how the <strong>Wingo 30 predictor</strong> works,
              what AI-based analysis can and cannot tell you, and how to interpret pattern data
              from the WinGo 30-second game round responsibly.
            </p>

            <div className="w30-chips">
              {[
                "Wingo 30s Live Predictor",
                "Wingo 30 AI Prediction",
                "Colour Prediction",
                "Big Small Strategy",
                "Pattern Analyser",
                "Free Prediction"
              ].map(chip => (
                <span className="w30-chip" key={chip}>{chip}</span>
              ))}
            </div>
          </div>

          {/* ── Article body ─────────────────────────────────────────────── */}
          <div className="w30-body">

            {/* Intro */}
            <p>
              The <strong>Wingo 30 predictor</strong> has become one of the most searched tools among
              colour-prediction gaming enthusiasts. WinGo{"'"}s 30-second variant runs at double the speed
              of its standard 1-minute mode, making pattern-recognition both more challenging and more
              appealing for players who rely on statistical analysis. This guide explains what a{" "}
              <strong>Wingo 30 second prediction</strong> tool actually does, how AI-powered analysers
              process historical data, and what realistic expectations you should have before using any
              such tool.
            </p>

            <div className="w30-notice">
              <strong>Disclaimer:</strong> All content on this page is informational only.
              WinGo results are generated by a certified random number generator (RNG). No
              tool — free or paid — can guarantee a future outcome. Play responsibly.
            </div>

            {/* ── Section 1 ───────────────────────────────────────────────── */}
            <div className="w30-section">
              <h2>What Is a Wingo 30 Analyser?</h2>
              <p className="w30-section-sub">Understanding the core technology behind pattern tools</p>

              <p>
                A <strong>Wingo 30 analyser</strong> is a data-processing application that ingests
                recent game results — typically the last 50 to 200 rounds — and looks for
                statistical patterns. These patterns may include colour streaks (e.g., three
                consecutive Reds), alternating sequences, or hot/cold number frequencies.
              </p>
              <p>
                When a <strong>Wingo 30s prediction</strong> is generated, the tool is not
                communicating with the game server or peeking at future draws. It is purely
                inferring a probable outcome based on historical distribution. This distinction
                is critical: past performance in an RNG-driven system does not statistically
                predict future outcomes with certainty.
              </p>

              <div className="w30-cards">
                {[
                  { icon: "📊", title: "Historical Analysis", desc: "Scans recent round results to find colour and number frequency trends." },
                  { icon: "🤖", title: "AI Pattern Engine", desc: "Machine-learning models rank which sequence types appeared most before similar run-lengths." },
                  { icon: "🎨", title: "Colour Prediction", desc: "Outputs a suggested colour (Red / Green / Violet) for the next 30-second round." },
                  { icon: "🔢", title: "Big / Small Filter", desc: "Tracks Big (5-9) vs Small (0-4) streaks to add a secondary prediction layer." },
                ].map(c => (
                  <div className="w30-card" key={c.title}>
                    <div className="w30-card-icon">{c.icon}</div>
                    <div className="w30-card-title">{c.title}</div>
                    <div className="w30-card-desc">{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="w30-divider" />

            {/* ── Section 2 ───────────────────────────────────────────────── */}
            <div className="w30-section">
              <h2>How Wingo 30 AI Prediction Works</h2>
              <p className="w30-section-sub">Inside the algorithm — from raw data to a suggested result</p>

              <p>
                A modern <strong>Wingo 30 AI prediction</strong> pipeline typically runs through
                three stages:
              </p>
              <p>
                <strong>1. Data Collection.</strong> The tool fetches the most recent WinGo 30-second
                results from the platform{"'"}s public API or display feed. Frequency tables for each
                colour and each number (0-9) are computed over a rolling window.
              </p>
              <p>
                <strong>2. Pattern Scoring.</strong> Statistical weights are assigned to recurring
                sequences. For example, if Green has appeared 7 of the last 10 rounds, the engine
                will down-weight another Green prediction — the "regression to mean" heuristic.
                Advanced <strong>Wingo 30 predictor AI</strong> systems use lightweight neural
                networks trained on millions of simulated draws to detect subtler patterns.
              </p>
              <p>
                <strong>3. Output &amp; Confidence.</strong> The system outputs a top prediction
                (colour + number range) alongside a confidence percentage. It is important to
                understand that a "72% confidence" score means the pattern matched 72% of similar
                historical windows — not that the next result has a 72% chance of being correct.
              </p>
            </div>

            <hr className="w30-divider" />

            {/* ── Section 3 ───────────────────────────────────────────────── */}
            <div className="w30-section">
              <h2>Wingo 30 Second Colour Prediction Strategies</h2>
              <p className="w30-section-sub">Common approaches players use — and their limitations</p>

              <p>
                Several pattern-based approaches circulate in the colour prediction community for
                the 30-second mode. Here is a factual overview of each:
              </p>
              <p>
                <strong>Streak-break strategy:</strong> After 4-5 consecutive results of the same
                colour, some players predict a switch. Statistical theory (Gambler{"'"}s Fallacy caution
                aside) does show reversion in bounded data sets, but RNG systems reset probability
                for every draw regardless of history.
              </p>
              <p>
                <strong>Big/Small alternation:</strong> The <strong>Wingo 30 Second Big Small
                  prediction</strong> method tracks whether numbers have been predominantly Big (5-9)
                or Small (0-4) and switches the bet accordingly after long runs. Like colour
                streaks, this is a heuristic observation, not a mechanical law.
              </p>
              <p>
                <strong>Number hotspot approach:</strong> Some <strong>Wingo 30 free prediction</strong>{" "}
                tools highlight numbers that have appeared more frequently in the last 20 rounds —
                so-called "hot numbers." This can be directionally useful for framing decisions but
                should never be treated as deterministic.
              </p>
            </div>

            <hr className="w30-divider" />

            {/* ── Section 4 ───────────────────────────────────────────────── */}
            <div className="w30-section">
              <h2>WinGo 30s Live Predictor — What to Look For in a Tool</h2>
              <p className="w30-section-sub">Evaluating quality before you rely on any analyser</p>

              <p>
                Not all <strong>WinGo 30s live predictor</strong> tools are built equally. When
                evaluating one, consider the following:
              </p>
              <p>
                <strong>Data freshness:</strong> A 30-second game needs near-real-time data. If the
                tool refreshes every 5 minutes, its analysis may already be irrelevant by the time
                you act.
              </p>
              <p>
                <strong>Transparency:</strong> A reliable <strong>Wingo 30 colour prediction</strong>{" "}
                tool should clearly state the size of its analysis window (e.g., "last 100 rounds")
                and what methodology it applies. Black-box tools that promise impossible accuracy
                without explanation should be approached cautiously.
              </p>
              <p>
                <strong>No false guarantees:</strong> Avoid any platform that advertises a "hack,"
                "cheat code," or "100% winning formula." The term <em>Wingo 30-Second Prediction
                  Hack</em> is commonly used in clickbait titles; legitimate analysers do not make
                such claims. Statistical tools surface patterns — they do not override RNG.
              </p>
              <p>
                <strong>Responsible use prompts:</strong> A trustworthy tool will remind users that
                all predictions are probabilistic estimates and that responsible play is paramount.
              </p>
            </div>

          </div>

          <hr className="w30-divider" />

          {/* ── FAQ ──────────────────────────────────────────────────────── */}
          <div className="w30-section w30-faq">
            <h2>Frequently Asked Questions</h2>
            <p className="w30-section-sub">Common questions about Wingo 30 prediction tools</p>

            {FAQ_ITEMS.map((item, i) => (
              <div className="w30-faq-item" key={i}>
                <p className="w30-faq-q">
                  <span className="w30-faq-q-num" aria-hidden="true">{i + 1}</span>
                  {item.question}
                </p>
                <p className="w30-faq-a">{item.answer}</p>
              </div>
            ))}
          </div>

          {/* ── Conclusion ────────────────────────────────────────────────── */}
          <div className="w30-conclusion">
            <h2>Conclusion</h2>
            <p>
              The <strong>Wingo 30 predictor</strong> is a pattern-analysis aid that can make
              historical data more readable and help players approach the WinGo 30-second game
              with a structured mindset. Whether you use a free prediction tool, a paid{" "}
              <strong>Wingo 30 AI prediction</strong> engine, or a live analyser, remember that
              every round is an independent random event. Use these tools to stay informed and
              organised — not as a substitute for sound judgment and responsible play.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
