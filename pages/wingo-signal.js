import { PageHead, BreadcrumbSchema, FAQSchema } from "@/components/SEO";
import LandingPageLayout from "@/components/LandingPageLayout";

const faqs = [
  {
    question: "What is a Wingo signal?",
    answer: "A Wingo signal is a statistical indicator derived from recent game history. TRION AI produces number, color, and size signals plus hot & cold indicators for the current period."
  },
  {
    question: "What are hot and cold numbers in Wingo?",
    answer: "Hot numbers are digits that have appeared frequently in recent periods; cold numbers are those that appear less often. TRION AI tracks this frequency live on the signal panel and dashboard."
  },
  {
    question: "Are Wingo signals guaranteed to win?",
    answer: "No. Signals are statistical estimates based on past data. They help organize your analysis, but Wingo results are random. Always play responsibly."
  }
];

export default function WingoSignalPage() {
  return (
    <>
      <PageHead
        title="Wingo Signal – Number, Color & Size Signals"
        description="Understand TRION AI Wingo signals: number, color, and size indicators, hot & cold numbers, trend signals, and how to read the live signal panel."
        canonical="https://wingo30.com/wingo-signal"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://wingo30.com/" },
        { name: "Wingo Signals", url: "https://wingo30.com/wingo-signal" }
      ]} />
      <FAQSchema questions={faqs} />
      <LandingPageLayout>
        <article className="seo-page">
          <div className="seo-meta">Signals & indicators</div>
          <h1>Wingo Signals from TRION AI</h1>
          <p className="seo-lead">
            TRION AI turns Wingo30 history into readable signals: which numbers are hot, which colors are trending, and whether the pattern favors Big or Small.
          </p>

          <h2>Signal types</h2>
          <ul>
            <li><strong>Number signal</strong> – the most relevant digit (0–9) for the current period.</li>
            <li><strong>Color signal</strong> – Green, Violet, or Red prediction from the number mapping.</li>
            <li><strong>Size signal</strong> – Big (5–9) or Small (0–4) estimate.</li>
            <li><strong>Hot signal</strong> – the number appearing most frequently in recent rounds.</li>
            <li><strong>Cold signal</strong> – numbers that have stayed quiet and may appear in trend analysis.</li>
          </ul>

          <h2>How signals are built</h2>
          <p>
            Signals come from pattern analysis of the live history: frequency counts, streak length for colors and sizes, and the latest candlestick-style trend data. TRION AI ranks the most consistent candidates and highlights one as the primary signal, while the dashboard shows the full context.
          </p>

          <h2>Reading the signal panel</h2>
          <p>
            Inside the app, the signal panel shows the top repeat signal with its frequency count, plus the latest settled result for comparison. The <a href="/ai-dashboard">dashboard</a> adds a frequency board with all ten digits, the win rate, and prediction history.
          </p>

          <h2>Signal vs prediction</h2>
          <p>
            A <a href="/ai-prediction">prediction</a> is the complete recommendation (number, color, size) for the next period. Signals are the individual indicators behind it. Use both together: check the trend, confirm the hot number, then generate the prediction for the current period.
          </p>

          <div className="seo-cta-row">
            <a className="landing-cta-primary" style={{ textDecoration: "none" }} href="/login">Open the Signal Panel</a>
            <a className="landing-cta-secondary" style={{ textDecoration: "none" }} href="/ai-dashboard">View the Dashboard</a>
          </div>

          <h2>Frequently asked questions</h2>
          <div className="faq-list">
            {faqs.map((faq, idx) => (
              <div className="faq-item" key={idx}>
                <strong className="faq-trigger" style={{ display: "flex" }}>{faq.question}</strong>
                <div className="faq-content">{faq.answer}</div>
              </div>
            ))}
          </div>
        </article>
      </LandingPageLayout>
    </>
  );
}