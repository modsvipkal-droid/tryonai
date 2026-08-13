import { PageHead, BreadcrumbSchema, SoftwareAppSchema, FAQSchema } from "@/components/SEO";
import LandingPageLayout from "@/components/LandingPageLayout";

const faqs = [
  {
    question: "Which TRION AI model should I choose?",
    answer: "The Korven model (₹749) is the entry-level premium option. The FX1 model (₹1,100) is positioned for faster result convergence. Both include lifetime access after payment verification."
  },
  {
    question: "Can I switch models later?",
    answer: "Contact support through Telegram or the contact page if you need to change your model, and the team will guide you through the upgrade."
  },
  {
    question: "Do both models include dashboard access?",
    answer: "Yes. Both the Korven and FX1 models unlock unlimited predictions and the full analytics dashboard."
  }
];

export default function ModelsPage() {
  return (
    <>
      <PageHead
        title="TRION AI Prediction Models – Korven & FX1"
        description="Compare TRION AI prediction models: the Korven model at ₹749 and the FX1 model at ₹1,100, both with lifetime premium access, unlimited predictions, and dashboard analytics."
        canonical="https://wingo30.com/models"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://wingo30.com/" },
        { name: "Models", url: "https://wingo30.com/models" }
      ]} />
      <SoftwareAppSchema />
      <FAQSchema questions={faqs} />
      <LandingPageLayout>
        <article className="seo-page">
          <div className="seo-meta">Premium models</div>
          <h1>TRION AI Prediction Models</h1>
          <p className="seo-lead">
            TRION AI offers two premium prediction models: Korven and FX1. Each uses its own analysis profile and is available with lifetime access after payment verification.
          </p>

          <h2>Model comparison</h2>
          <table className="seo-table">
            <thead>
              <tr>
                <th></th>
                <th>Korven Model</th>
                <th>FX1 Model</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Price</td>
                <td>₹749</td>
                <td>₹1,100</td>
              </tr>
              <tr>
                <td>Access</td>
                <td>Lifetime</td>
                <td>Lifetime</td>
              </tr>
              <tr>
                <td>Predictions</td>
                <td>Unlimited</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <td>Dashboard analytics</td>
                <td>Included</td>
                <td>Included</td>
              </tr>
              <tr>
                <td>Profile</td>
                <td>Usually fixes the result within 3–4 levels</td>
                <td>Usually fixes the result within 2 levels</td>
              </tr>
            </tbody>
          </table>

          <h2>Korven model</h2>
          <p>
            The Korven model is the standard premium option on TRION AI. It is positioned to fix results within roughly 3–4 levels and is the more affordable entry point at ₹749. See the <a href="/korven-model">Korven model page</a> for details.
          </p>

          <h2>FX1 model</h2>
          <p>
            The FX1 model is TRION AI&apos;s faster profile, positioned to fix results within about 2 levels, available at ₹1,100. Read more on the <a href="/fx1-model">FX1 model page</a>.
          </p>

          <h2>Activation</h2>
          <p>
            After choosing a model on the <a href="/subscription">subscription page</a>, complete the payment and submit your UTR ID for verification. Once activated, the selected model appears on your <a href="/">profile</a>, and you get unlimited predictions plus the full dashboard.
          </p>

          <div className="seo-callout">
            <strong>Responsible use.</strong> Model performance reflects statistical estimation, not guaranteed outcomes. No model can guarantee Wingo results.
          </div>

          <div className="seo-cta-row">
            <a className="landing-cta-primary" style={{ textDecoration: "none" }} href="/subscription">Choose a Model</a>
            <a className="landing-cta-secondary" style={{ textDecoration: "none" }} href="/faq">Read the FAQ</a>
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