import { PageHead, BreadcrumbSchema, FAQSchema } from "@/components/SEO";
import LandingPageLayout from "@/components/LandingPageLayout";

const faqs = [
  {
    question: "What does the TRION AI prediction tool show?",
    answer: "It shows a signal for the current Wingo30 period, including the recommended number, color (Green, Violet, Red), and size (Big/Small), based on real-time pattern analysis of recent history."
  },
  {
    question: "Is the TRION AI prediction tool free?",
    answer: "The tool is available to signed-in users. Unlimited predictions and dashboard access are unlocked with the Korven (₹749) or FX1 (₹1,100) premium model."
  },
  {
    question: "How accurate are TRION AI predictions?",
    answer: "TRION AI shares its own live win statistics on the dashboard, but no prediction tool can guarantee results. Signals are statistical estimates and should be used responsibly."
  },
  {
    question: "How do I start using the tool?",
    answer: "Sign in with your Google account, then choose a model on the Subscription page. After activation you can generate a prediction for every 30-second period."
  }
];

export default function AiPredictionPage() {
  return (
    <>
      <PageHead
        title="AI Wingo Prediction Tool"
        description="Use the TRION AI Wingo prediction tool for real-time number, color, and size signals. How it works, its features, and how to start predicting on Wingo 30-second games."
        canonical="https://wingo30.com/ai-prediction"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://wingo30.com/" },
        { name: "AI Prediction Tool", url: "https://wingo30.com/ai-prediction" }
      ]} />
      <FAQSchema questions={faqs} />
      <LandingPageLayout>
        <article className="seo-page">
          <div className="seo-meta">Tool & features</div>
          <h1>TRION AI – AI Wingo Prediction Tool</h1>
          <p className="seo-lead">
            The core TRION AI tool analyzes live Wingo30 history and returns a signal for the current period: the most relevant number, its color, and the Big/Small size.
          </p>

          <h2>How the tool works</h2>
          <p>
            Every 30 seconds a new Wingo period begins. The tool:
          </p>
          <ol>
            <li>Reads the latest published results from the live game history.</li>
            <li>Runs pattern and statistical analysis on recent numbers, colors, and size runs.</li>
            <li>Ranks candidates and presents the strongest signal for the next period.</li>
            <li>Logs your prediction so you can compare it with the settled result.</li>
          </ol>
          <p>
            Signals are estimates, not guarantees. The tool is designed to organize the data into a clear, single recommendation you can reason about.
          </p>

          <h2>What the signal includes</h2>
          <ul>
            <li><strong>Number</strong> – one or more digits (0–9) highlighted from the pattern.</li>
            <li><strong>Color</strong> – Green, Violet, or Red derived from the number mapping.</li>
            <li><strong>Size</strong> – Big (5–9) or Small (0–4).</li>
          </ul>

          <h2>Related tools</h2>
          <ul>
            <li><a href="/wingo-30-second-prediction">Wingo 30-second prediction</a> – how the 30-second cycle and live history work.</li>
            <li><a href="/wingo-signal">Wingo signals</a> – understand trend, hot and cold indicators.</li>
            <li><a href="/ai-dashboard">TRION AI dashboard</a> – win rate, frequency board, and live signals.</li>
            <li><a href="/models">Prediction models</a> – compare Korven and FX1.</li>
          </ul>

          <div className="seo-cta-row">
            <a className="landing-cta-primary" style={{ textDecoration: "none" }} href="/login">Get Started</a>
            <a className="landing-cta-secondary" style={{ textDecoration: "none" }} href="/subscription">View Models & Pricing</a>
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