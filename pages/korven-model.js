import { PageHead, BreadcrumbSchema, FAQSchema } from "@/components/SEO";
import LandingPageLayout from "@/components/LandingPageLayout";

const faqs = [
  {
    question: "What is the TRION AI Korven model?",
    answer: "The Korven model is TRION AI's entry-level premium prediction profile at ₹749 with lifetime access. It is usually positioned to fix its result within 3–4 levels."
  },
  {
    question: "How do I activate the Korven model?",
    answer: "Select Korven on the subscription page, pay ₹749, and submit your UTR ID for verification. Once activated, the model appears on your profile with unlimited predictions."
  },
  {
    question: "Does the Korven model include the dashboard?",
    answer: "Yes. The Korven model unlocks unlimited predictions and full dashboard analytics including win rate and frequency board."
  }
];

export default function KorvenModelPage() {
  return (
    <>
      <PageHead
        title="TRION AI Korven Model – ₹749 Lifetime"
        description="The TRION AI Korven model at ₹749 with lifetime premium access, unlimited Wingo predictions, and dashboard analytics. How it works and how to activate it."
        canonical="https://wingo30.com/korven-model"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://wingo30.com/" },
        { name: "Models", url: "https://wingo30.com/models" },
        { name: "Korven Model", url: "https://wingo30.com/korven-model" }
      ]} />
      <FAQSchema questions={faqs} />
      <LandingPageLayout>
        <article className="seo-page">
          <div className="seo-meta">Premium model</div>
          <h1>TRION AI Korven Model</h1>
          <p className="seo-lead">
            The Korven model is TRION AI&apos;s standard premium prediction profile, available at ₹749 with lifetime access, unlimited predictions, and the full analytics dashboard.
          </p>

          <h2>Overview</h2>
          <p>
            The Korven model is the entry point into TRION AI&apos;s premium tools. It is usually positioned to fix its result within 3–4 levels of analysis, giving a more deliberate, methodical read on the current Wingo30 pattern. It is the most affordable way to unlock unlimited predictions.
          </p>

          <h2>What you get</h2>
          <ul>
            <li>Lifetime premium access after payment verification.</li>
            <li>Unlimited predictions for the <a href="/wingo-30-second-prediction">Wingo 30-second cycle</a>.</li>
            <li>Full <a href="/ai-dashboard">analytics dashboard</a> with win rate and frequency board.</li>
            <li>Number, color, and size <a href="/wingo-signal">signals</a> for every period.</li>
          </ul>

          <h2>Pricing and activation</h2>
          <p>
            The Korven model costs ₹749. Open the <a href="/subscription?model=korven">subscription page</a>, complete the payment, and submit the 12-digit UTR ID from your receipt. Once verified, Korven appears as your current plan on your <a href="/">profile</a>, and the hatch logo shows in the model selector.
          </p>

          <h2>Korven vs FX1</h2>
          <p>
            If you want a faster profile, compare the Korven with the <a href="/fx1-model">FX1 model</a> (₹1,100), which is usually positioned to fix results within roughly 2 levels. See the full <a href="/models">model comparison</a>.
          </p>

          <div className="seo-callout">
            <strong>Honest note.</strong> &ldquo;Levels&rdquo; describe typical estimation behavior, not guaranteed wins. Prediction outcomes remain random.
          </div>

          <div className="seo-cta-row">
            <a className="landing-cta-primary" style={{ textDecoration: "none" }} href="/subscription?model=korven">Get Korven – ₹749</a>
            <a className="landing-cta-secondary" style={{ textDecoration: "none" }} href="/models">Compare Models</a>
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