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

  .wt-page-shell {
    min-height: 100vh;
    width: 100%;
    background: radial-gradient(100% 40% at 50% 0%, #f0f7f3 0%, #fbfdfc 100%);
    color: #1e293b;
    overflow-x: hidden;
  }

  .wt-wrap {
    max-width: 880px;
    margin: 0 auto;
    padding: 40px 24px 80px;
  }

  /* Back */
  .wt-back {
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
  .wt-back:hover {
    color: #00985b;
    border-color: #d1eedf;
    background: #f4fbf7;
    transform: translateX(-2px);
  }
  .wt-back:focus-visible {
    outline: 2px solid #00985b;
    outline-offset: 2px;
  }

  /* Hero */
  .wt-hero {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 20px;
    padding: 36px 32px;
    margin-bottom: 40px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.03), 0 4px 20px rgba(0,152,91,0.03);
    position: relative;
  }

  /* Badge */
  .wt-badge {
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
  .wt-badge-dot {
    width: 6px; height: 6px;
    background: #00985b;
    border-radius: 50%;
  }

  /* H1 */
  h1.wt-h1 {
    font-size: clamp(24px, 4.5vw, 34px);
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 12px;
    line-height: 1.25;
    letter-spacing: -0.02em;
  }
  h1.wt-h1 .gold  { color: #00985b; }
  h1.wt-h1 .teal  { color: #007043; }

  .wt-subtitle {
    font-size: 15.5px;
    color: #475569;
    margin: 0;
    line-height: 1.65;
    max-width: 680px;
  }

  /* Tool chips */
  .wt-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 20px;
  }
  .wt-chip {
    background: #f8faf9;
    border: 1px solid #e6ede9;
    color: #008751;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 9999px;
  }

  /* Body */
  .wt-body {
    line-height: 1.75;
    color: #334155;
  }
  .wt-body p {
    margin: 0 0 18px;
    font-size: 15px;
    color: #334155;
  }
  .wt-body strong {
    color: #0f172a;
    font-weight: 600;
  }

  /* Sections */
  .wt-section {
    margin: 48px 0 0;
  }
  .wt-section h2 {
    font-size: clamp(19px, 3.5vw, 24px);
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 6px;
    letter-spacing: -0.015em;
    line-height: 1.3;
  }
  .wt-section-sub {
    font-size: 14px;
    color: #64748b;
    font-weight: 400;
    margin: 0 0 20px;
  }

  /* Tool cards */
  .wt-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 16px;
    margin-top: 20px;
  }
  .wt-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
  }
  .wt-card:hover {
    border-color: #cbd5e1;
    transform: translateY(-2px);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
  }
  .wt-card-icon  { font-size: 24px; margin-bottom: 12px; }
  .wt-card-title { font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
  .wt-card-desc  { font-size: 13px; color: #475569; line-height: 1.55; }

  /* Step list */
  .wt-steps { margin-top: 20px; }
  .wt-step {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    padding: 16px 18px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    margin-bottom: 12px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .wt-step:hover {
    border-color: #cbd5e1;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .wt-step-num {
    flex-shrink: 0;
    width: 28px; height: 28px;
    background: #eef8f3;
    color: #008751;
    font-size: 13px;
    font-weight: 800;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
  }
  .wt-step-content { flex: 1; }
  .wt-step-title { font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
  .wt-step-desc  { font-size: 13.5px; color: #475569; line-height: 1.6; margin: 0; }

  /* Comparison table */
  .wt-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    font-size: 14px;
    background: #ffffff;
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
  }
  .wt-table th {
    background: #f8faf9;
    color: #0f172a;
    font-weight: 700;
    text-align: left;
    padding: 14px 18px;
    border-bottom: 1px solid #e2e8f0;
  }
  .wt-table td {
    padding: 13px 18px;
    border-bottom: 1px solid #f1f5f9;
    color: #475569;
    vertical-align: top;
  }
  .wt-table tr:last-child td { border-bottom: none; }
  .wt-table tr:hover td { background: #fafcfb; }
  .wt-table td:first-child { color: #0f172a; font-weight: 600; }

  /* Info highlight */
  .wt-highlight {
    background: #f8faf9;
    border-left: 3px solid #00985b;
    border-radius: 0 12px 12px 0;
    padding: 16px 20px;
    margin: 24px 0;
    font-size: 14.5px;
    color: #1e293b;
    line-height: 1.65;
  }

  /* Notice */
  .wt-notice {
    background: #fefce8;
    border: 1px solid #fef08a;
    border-radius: 12px;
    padding: 16px 20px;
    color: #854d0e;
    font-size: 14px;
    line-height: 1.6;
    margin: 24px 0;
  }
  .wt-notice strong { color: #713f12; }

  /* Divider */
  .wt-divider {
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 48px 0;
  }

  /* FAQ */
  .wt-faq-item {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 20px 22px;
    margin-bottom: 12px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
    transition: border-color 0.15s ease;
  }
  .wt-faq-item:hover {
    border-color: #cbd5e1;
  }
  .wt-faq-q {
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 8px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  .wt-faq-num {
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
  .wt-faq-a {
    font-size: 14.5px;
    color: #475569;
    line-height: 1.65;
    margin: 0;
    padding-left: 36px;
  }

  /* Conclusion */
  .wt-conclusion {
    background: linear-gradient(180deg, #ffffff 0%, #f4fbf7 100%);
    border: 1px solid #d1eedf;
    border-radius: 18px;
    padding: 32px 28px;
    margin-top: 48px;
    box-shadow: 0 2px 8px rgba(0, 152, 91, 0.03);
  }
  .wt-conclusion h2 {
    font-size: 19px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 10px;
  }
  .wt-conclusion p {
    font-size: 15px;
    color: #334155;
    line-height: 1.7;
    margin: 0;
  }

  /* Responsive */
  @media (max-width: 640px) {
    .wt-wrap { padding: 24px 20px 60px; }
    .wt-hero { padding: 24px 20px; border-radius: 16px; margin-bottom: 32px; }
    .wt-section h2 { font-size: 18px; }
    .wt-faq-q { font-size: 14.5px; }
    .wt-table th, .wt-table td { padding: 10px 12px; font-size: 13px; }
  }
`;

// ── FAQ data ──────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    question: "What is a WinGo tool and what does it actually do?",
    answer:
      "A WinGo tool is a web-based or app-based utility that collects recent WinGo game result data and processes it through mathematical or AI-based logic to generate pattern-based suggestions. Common tool types include lottery predictors, master calculators, and AI chat engines. None of these tools can override the game's RNG — they analyse past results to suggest statistically probable next outcomes."
  },
  {
    question: "How does the Wingo Master calculator tool work?",
    answer:
      "The Wingo Master calculator tool applies weighted mathematical formulas to recent round data — typically tracking colour run-lengths, number frequencies, and Big/Small ratios over a defined window (e.g., last 50 rounds). It then calculates which outcome has the highest historical match rate for the current pattern and presents it as a suggested pick. The 'master' in the name refers to its multi-variable calculation, not guaranteed accuracy."
  },
  {
    question: "Is the AI Chat with WinGo prediction engine reliable?",
    answer:
      "An AI Chat with WinGo prediction engine is a conversational interface layered on top of a statistical analysis model. You can ask it questions like 'What colour appeared most in the last 20 rounds?' or 'Show me the current Big/Small streak.' It responds using live data. Its reliability depends entirely on the quality of its underlying data feed and algorithm — not on the chat format itself. Always verify outputs against the live result board."
  },
  {
    question: "What is Wingo math logic and how does AI tracking improve it?",
    answer:
      "Wingo math logic refers to frequency analysis, probability weighting, and streak detection applied to round history. Basic math logic counts raw occurrences. AI tracking improves on this by learning conditional patterns — for example, what colour tends to follow a specific 3-round sequence — using training data from millions of simulated or historical draws. This makes predictions more contextually aware, though still not deterministic."
  },
  {
    question: "What separates a Wingo Lottery Predictor tool from a random picker?",
    answer:
      "A Wingo Lottery Predictor tool is data-driven: it scans the current result history and scores outcomes based on how frequently similar patterns produced each possible result in historical data. A random picker ignores history entirely. The predictor does not guarantee better outcomes — RNG produces each draw independently — but it provides a structured, data-informed basis for decision-making rather than pure chance."
  }
];

// ─────────────────────────────────────────────────────────────────────────────

export default function WingoToolPage() {
  const router = useRouter();

  const PAGE_URL   = "https://wingo30.com/wingo-tool";
  const PAGE_TITLE = "WinGo Tool - AI Predictor, Calculator & Math Logic Guide";
  const PAGE_DESC  =
    "Understand how the WinGo tool works: AI chat engine, master calculator, lottery predictor & math logic tracking — explained clearly without false claims.";

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
        { name: "Home",       url: "https://wingo30.com/" },
        { name: "WinGo Tool", url: PAGE_URL }
      ]} />
      <FAQSchema questions={FAQ_ITEMS} />

      {/* ── Page Body ────────────────────────────────────────────────────── */}
      <div className="wt-page-shell">
        <div className="wt-wrap">

          {/* Back */}
        <button
          className="wt-back"
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
        <div className="wt-hero">
          <div className="wt-badge">
            <span className="wt-badge-dot" aria-hidden="true" />
            AI-Powered Analysis
          </div>

          <h1 className="wt-h1">
            <span className="gold">WinGo Tool</span> — AI Predictor,{" "}
            <span className="teal">Master Calculator</span> &amp; Math Logic Guide
          </h1>

          <p className="wt-subtitle">
            A clear, factual guide to every type of <strong>WinGo tool</strong> — from lottery
            predictors and master calculators to AI chat engines and math-based tracking methods.
            Understand what each tool does, how it works, and where its limits lie.
          </p>

          <div className="wt-chips">
            {[
              "WinGo Lottery Predictor",
              "Wingo Master Calculator",
              "AI Chat Engine",
              "Math Logic Tracking",
              "Big Small Predictor",
              "TryonAI"
            ].map(chip => (
              <span className="wt-chip" key={chip}>{chip}</span>
            ))}
          </div>
        </div>

        {/* ── Article Body ─────────────────────────────────────────────── */}
        <div className="wt-body">

          {/* Intro */}
          <p>
            The term <strong>WinGo tool</strong> covers a broad category of utilities built to
            help players navigate the WinGo colour prediction game with data-driven support.
            From the <strong>Wingo Master calculator tool</strong> that applies weighted math
            formulas to recent results, to the <strong>AI Chat with WinGo</strong> prediction
            engine that lets users query live data conversationally — each tool type has a
            specific methodology, a specific use case, and specific limitations that every user
            should understand before relying on any output.
          </p>

          <div className="wt-notice">
            <strong>Important:</strong> WinGo is an RNG-based game. No tool — regardless of
            how advanced — can predict future draws with certainty. All outputs are
            pattern-informed suggestions. Play responsibly and within your personal limits.
          </div>

          {/* ── Section 1 ───────────────────────────────────────────────── */}
          <div className="wt-section">
            <h2>Types of WinGo Tools — What Each One Does</h2>
            <p className="wt-section-sub">A structured overview of the WinGo tool ecosystem</p>

            <p>
              The <strong>WinGo tool</strong> landscape broadly divides into four categories.
              Each serves a different user need and uses a different technical approach:
            </p>

            <div className="wt-cards">
              {[
                {
                  icon: "🧮",
                  title: "Wingo Master Calculator",
                  desc: "Applies multi-variable math formulas (frequency, streak weight, ratio) to recent rounds and outputs a ranked colour or number suggestion."
                },
                {
                  icon: "🤖",
                  title: "AI Chat with WinGo",
                  desc: "A conversational AI prediction engine. Users ask questions about live game data — streaks, frequency, Big/Small ratio — and receive instant answers."
                },
                {
                  icon: "🎰",
                  title: "Wingo Lottery Predictor",
                  desc: "Focused on number-range prediction. Tracks which digits (0–9) are statistically due based on their absence count across recent rounds."
                },
                {
                  icon: "📐",
                  title: "Math Logic & AI Tracker",
                  desc: "Combines rule-based wingo math logic with AI pattern recognition for contextual suggestions — more nuanced than single-variable frequency tools."
                },
              ].map(c => (
                <div className="wt-card" key={c.title}>
                  <div className="wt-card-icon">{c.icon}</div>
                  <div className="wt-card-title">{c.title}</div>
                  <div className="wt-card-desc">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <hr className="wt-divider" />

          {/* ── Section 2 ───────────────────────────────────────────────── */}
          <div className="wt-section">
            <h2>Wingo Math Logic &amp; AI Tracking — How the Engine Thinks</h2>
            <p className="wt-section-sub">Inside the methodology that powers modern WinGo tools</p>

            <p>
              At the core of any credible <strong>WinGo tool</strong> is a combination of{" "}
              <strong>wingo math logic</strong> and AI tracking. Here is how a well-built tool
              processes data from the moment a new round result is published:
            </p>

            <div className="wt-steps">
              {[
                {
                  title: "Ingest Latest Result",
                  desc: "The tool reads the new round outcome (colour + number) and appends it to a rolling history buffer of the last 50–200 rounds."
                },
                {
                  title: "Recalculate Frequency Tables",
                  desc: "Colour hit rates (Red / Green / Violet) and number hit rates (0–9) are recomputed. Big/Small totals are updated. Streak counters are incremented or reset."
                },
                {
                  title: "Apply Wingo Math Logic Weights",
                  desc: "Outcomes that have been absent longer receive higher weight. Streaks that exceed a statistical threshold trigger a contrarian flag. Ratios outside the expected range are scored as signal-worthy."
                },
                {
                  title: "AI Layer: Conditional Pattern Lookup",
                  desc: "The AI tracker cross-references the current 3–5 round sequence against learned historical sequences to find the most statistically common successor outcome."
                },
                {
                  title: "Output Signal",
                  desc: "The tool emits its top suggestion — colour, number range, and a match-rate score — and optionally updates the AI chat interface with the new context."
                },
              ].map((s, i) => (
                <div className="wt-step" key={i}>
                  <div className="wt-step-num">{i + 1}</div>
                  <div className="wt-step-content">
                    <div className="wt-step-title">{s.title}</div>
                    <p className="wt-step-desc">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="wt-highlight">
              The key difference between basic wingo math logic and AI tracking is
              conditionality. Math logic asks "how often did Red appear?" — AI tracking asks
              "how often did Red appear <em>after this specific sequence</em>?" The latter is
              far more contextually accurate.
            </div>
          </div>

          <hr className="wt-divider" />

          {/* ── Section 3 ───────────────────────────────────────────────── */}
          <div className="wt-section">
            <h2>Wingo Lottery Predictor Tool — Numbers, Ranges &amp; Coverage</h2>
            <p className="wt-section-sub">How number-focused prediction differs from colour prediction</p>

            <p>
              While most players focus on colour outcomes, the <strong>Wingo Lottery Predictor
              tool</strong> targets the number dimension (0–9) with greater specificity. Here
              is how the two compare:
            </p>

            <table className="wt-table">
              <thead>
                <tr>
                  <th>Dimension</th>
                  <th>Colour Predictor</th>
                  <th>Lottery Number Predictor</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Output",       "Red / Green / Violet",        "Number 0–9 suggestion"],
                  ["Complexity",   "3 possible outcomes",         "10 possible outcomes"],
                  ["Signal Basis", "Colour frequency & streak",   "Number absence count & hotspot"],
                  ["Use Case",     "Fast, high-frequency rounds", "Specific number targeting"],
                  ["Accuracy",     "Pattern-based estimate",      "Pattern-based estimate"],
                ].map(([dim, col, lot]) => (
                  <tr key={dim}>
                    <td>{dim}</td>
                    <td>{col}</td>
                    <td>{lot}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p style={{ marginTop: "20px" }}>
              A number predictor{"'"}s core logic tracks "cold" numbers — those that have not
              appeared in an unusually long streak — and surfaces them as statistically overdue.
              This is a well-understood frequency heuristic, but it carries the same caveat as
              all RNG-based analysis: each draw is independent.
            </p>
          </div>

          <hr className="wt-divider" />

          {/* ── Section 4 ───────────────────────────────────────────────── */}
          <div className="wt-section">
            <h2>AI Chat with WinGo — The Conversational Prediction Engine</h2>
            <p className="wt-section-sub">What makes an AI chat interface different from a standard dashboard</p>

            <p>
              The <strong>AI Chat with WinGo</strong> prediction engine represents the most
              interactive form of a <strong>WinGo tool</strong>. Instead of presenting a static
              dashboard, it allows users to ask natural-language questions directly:
            </p>
            <p>
              <em>"What is the current Big/Small ratio for the last 30 rounds?"</em><br />
              <em>"Has Green appeared more than Red this session?"</em><br />
              <em>"What number has been absent the longest?"</em>
            </p>
            <p>
              The AI engine interprets these queries, pulls the relevant statistics from its
              live data buffer, and responds in plain language. This makes it accessible to
              players who do not want to manually read frequency tables. However, the quality
              of the answers is entirely dependent on the freshness of the data feed and the
              accuracy of the underlying model — the conversational format does not add
              predictive power, only usability.
            </p>
            <p>
              When evaluating an AI Chat WinGo tool, ask whether it discloses its data source,
              how frequently it refreshes, and whether it shows historical accuracy logs. A
              transparent tool is always more trustworthy than one that presents outputs
              without methodology.
            </p>
          </div>

        </div>

        <hr className="wt-divider" />

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <div className="wt-section">
          <h2>Frequently Asked Questions</h2>
          <p className="wt-section-sub">Common questions about WinGo tool types and methodologies</p>

          {FAQ_ITEMS.map((item, i) => (
            <div className="wt-faq-item" key={i}>
              <p className="wt-faq-q">
                <span className="wt-faq-num" aria-hidden="true">{i + 1}</span>
                {item.question}
              </p>
              <p className="wt-faq-a">{item.answer}</p>
            </div>
          ))}
        </div>

        {/* ── Conclusion ────────────────────────────────────────────────── */}
        <div className="wt-conclusion">
          <h2>Conclusion</h2>
          <p>
            Every <strong>WinGo tool</strong> — whether it is a <strong>Wingo Master calculator
            tool</strong>, a <strong>Wingo Lottery Predictor</strong>, or an{" "}
            <strong>AI Chat with WinGo</strong> prediction engine — is built on the same
            foundation: pattern detection in historical data using wingo math logic and AI
            tracking methods. These tools can make your interaction with the game more
            structured and data-aware, but they cannot eliminate the inherent randomness of
            an RNG system. Use them as analytical companions, maintain clear stop-loss
            boundaries, and always approach colour prediction gaming with informed, responsible
            expectations.
          </p>
        </div>

      </div>
    </div>
  </>
);
}
