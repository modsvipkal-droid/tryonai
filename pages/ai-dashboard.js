import { PageHead, BreadcrumbSchema, FAQSchema } from "@/components/SEO";
import LandingPageLayout from "@/components/LandingPageLayout";

const faqs = [
  {
    question: "What does the TRION AI dashboard show?",
    answer: "The dashboard shows your win rate, total predictions, wins and losses, the current period timer, hot signal, number frequency board, and a live signal panel."
  },
  {
    question: "Who can access the dashboard?",
    answer: "The analytics dashboard is part of premium access. Sign in with Google and activate the Korven or FX1 model to unlock unlimited predictions and dashboard statistics."
  },
  {
    question: "Does the dashboard use real data?",
    answer: "Yes. Dashboard metrics are computed from the live Wingo30 history and your own prediction log, matched against settled results. TRION AI never displays fake accuracy."
  }
];

export default function AiDashboardPage() {
  return (
    <>
      <PageHead
        title="TRION AI Dashboard – Live Analytics"
        description="Explore the TRION AI analytics dashboard: live win rate, prediction wins and losses, number frequency board, hot signals, and the current period timer."
        canonical="https://wingo30.com/ai-dashboard"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://wingo30.com/" },
        { name: "AI Dashboard", url: "https://wingo30.com/ai-dashboard" }
      ]} />
      <FAQSchema questions={faqs} />
      <LandingPageLayout>
        <article className="seo-page">
          <div className="seo-meta">Analytics</div>
          <h1>TRION AI Dashboard – Live Analytics</h1>
          <p className="seo-lead">
            The TRION AI dashboard puts your prediction performance and live game data in one place: win rate, round metrics, frequency board, and the current signal.
          </p>

          <h2>What you can track</h2>
          <ul>
            <li><strong>Win accuracy</strong> – the percentage of your settled predictions that matched the result.</li>
            <li><strong>Prediction totals</strong> – total predictions, wins, and losses during the session.</li>
            <li><strong>Current period timer</strong> – live countdown to the next Wingo30 result.</li>
            <li><strong>Hot signal</strong> – the number with the highest recent frequency.</li>
            <li><strong>Number frequency board</strong> – how often each digit (0–9) has appeared in the sample.</li>
            <li><strong>Latest result</strong> – the most recent settled number and size for reference.</li>
          </ul>

          <h2>Why honest statistics matter</h2>
          <p>
            The dashboard is transparent: your win rate is real and recalculated from actual results and your prediction log. This keeps the tools honest and helps you evaluate the Korven or FX1 <a href="/models">model</a> you are using.
          </p>

          <h2>Using the dashboard</h2>
          <ol>
            <li>Open the app and switch to the Chart/Dashboard view.</li>
            <li>Review the win rate and latest signal for the current period.</li>
            <li>Check the frequency board to see which numbers are hot.</li>
            <li>Return to the <a href="/ai-prediction">prediction tool</a> and generate a signal with that context.</li>
          </ol>

          <div className="seo-cta-row">
            <a className="landing-cta-primary" style={{ textDecoration: "none" }} href="/login">Open the Dashboard</a>
            <a className="landing-cta-secondary" style={{ textDecoration: "none" }} href="/wingo-signal">Learn About Signals</a>
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