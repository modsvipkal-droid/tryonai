import { PageHead, BreadcrumbSchema, FAQSchema } from "@/components/SEO";
import LandingPageLayout from "@/components/LandingPageLayout";

const faqs = [
  {
    question: "What is the TRION AI FX1 model?",
    answer: "The FX1 model is TRION AI's faster premium prediction profile at ₹1,100 with lifetime access, usually positioned to fix its result within about 2 levels."
  },
  {
    question: "How do I activate the FX1 model?",
    answer: "Select FX1 on the subscription page, pay ₹1,100, and submit your UTR ID for verification. Once activated, the model appears on your profile with unlimited predictions."
  },
  {
    question: "Is the FX1 model better than Korven?",
    answer: "FX1 is positioned for faster result convergence and is priced higher at ₹1,100. Neither model guarantees results; choose based on your own experience and budget."
  }
];

export default function Fx1ModelPage() {
  return (
    <>
      <PageHead
        title="TRION AI FX1 Model – ₹1,100 Lifetime"
        description="The TRION AI FX1 model at ₹1,100 with lifetime premium access, unlimited Wingo predictions, and dashboard analytics. How it works and how to activate it."
        canonical="https://wingo30.com/fx1-model"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://wingo30.com/" },
        { name: "Models", url: "https://wingo30.com/models" },
        { name: "FX1 Model", url: "https://wingo30.com/fx1-model" }
      ]} />
      <FAQSchema questions={faqs} />
      <LandingPageLayout>
        <article className="seo-page">
          <div className="seo-meta">Premium model</div>
          <h1>TRION AI FX1 Model</h1>
          <p className="seo-lead">
            The FX1 model is TRION AI&apos;s faster premium prediction profile, available at ₹1,100 with lifetime access, unlimited predictions, and the full analytics dashboard.
          </p>

          <h2>Overview</h2>
          <p>
            The FX1 model is built for a faster read on the Wingo30 pattern. It is usually positioned to fix its result within about 2 levels of analysis, making it the quickest profile TRION AI offers. It costs ₹1,100 and is the premium option for users who want a more aggressive signal speed.
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
            The FX1 model costs ₹1,100. Open the <a href="/subscription?model=fx1">subscription page</a>, complete the payment, and submit the 12-digit UTR ID from your receipt. Once verified, FX1 appears as your current plan on your <a href="/">profile</a>, with the flame logo in the model selector.
          </p>

          <h2>FX1 vs Korven</h2>
          <p>
            FX1 is positioned for faster convergence (about 2 levels) versus the <a href="/korven-model">Korven model</a> (about 3–4 levels). See the full <a href="/models">model comparison</a> to decide which fits your approach and budget.
          </p>

          <div className="seo-callout">
            <strong>Honest note.</strong> &ldquo;Levels&rdquo; describe typical estimation behavior, not guaranteed wins. Faster signals still face random Wingo outcomes.
          </div>

          <div className="seo-cta-row">
            <a className="landing-cta-primary" style={{ textDecoration: "none" }} href="/subscription?model=fx1">Get FX1 – ₹1,100</a>
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