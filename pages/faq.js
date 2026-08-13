import { useState } from "react";
import { PageHead, OrganizationSchema, WebsiteSchema, BreadcrumbSchema, FAQSchema } from "@/components/SEO";
import LandingPageLayout from "@/components/LandingPageLayout";

const faqs = [
  {
    question: "What is TRION AI?",
    answer: "TRION AI is an AI-powered prediction and signals platform for the Wingo 30-second game. It analyzes real-time drawing history and statistical patterns to generate number, color, and size signals for each new period."
  },
  {
    question: "How does the TRION AI prediction tool work?",
    answer: "The tool fetches the latest Wingo30 game history, runs pattern and statistical analysis, and returns a signal for the current period. Signals are shown as number (0-9), color (Green, Violet, Red), and size (Big/Small) on the prediction screen."
  },
  {
    question: "What is the difference between the Korven and FX1 models?",
    answer: "The Korven model (₹749) and FX1 model (₹1,100) use different analysis approaches. FX1 is positioned for faster result convergence. Both include lifetime premium access after payment verification. See the models page for details."
  },
  {
    question: "How much does TRION AI cost?",
    answer: "Premium access costs ₹749 (Korven model) or ₹1,100 (FX1 model), both lifetime. Payments are made and verified through the Subscription page with your UTR ID."
  },
  {
    question: "How do I activate my premium access after paying?",
    answer: "Pay on the Subscription page, then submit the 12-digit UTR ID from your payment receipt (GPay, Paytm, PhonePe). Our team verifies the transaction and unlocks your account."
  },
  {
    question: "Do I need a Google account to use the tool?",
    answer: "Yes. TRION AI uses Google OAuth for secure sign-in. You never create a password on the platform."
  },
  {
    question: "Does TRION AI guarantee wins?",
    answer: "No. Predictions are statistical estimates based on history and patterns. No platform can guarantee Wingo results. TRION AI focuses on transparent signals and responsible play."
  },
  {
    question: "Is there a developer API?",
    answer: "Yes. TRION AI provides a developer portal with real-time Wingo30 game data, API keys, and endpoint documentation. Visit the Developer API page."
  },
  {
    question: "How can I contact support?",
    answer: "Use the contact page or join the official Telegram channel linked in the footer. Support covers activation, payments, and product questions."
  },
  {
    question: "Where can I read the legal terms?",
    answer: "Our privacy policy, terms and conditions, and refund policy are linked in the footer of every page."
  }
];

export default function FaqPage() {
  const [open, setOpen] = useState(0);

  return (
    <>
      <PageHead
        title="TRION AI FAQ"
        description="Frequently asked questions about TRION AI: how the Wingo prediction tool works, Korven and FX1 model pricing, activation via UTR, and responsible use."
        canonical="https://wingo30.com/faq"
      />
      <OrganizationSchema />
      <WebsiteSchema />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://wingo30.com/" },
        { name: "FAQ", url: "https://wingo30.com/faq" }
      ]} />
      <FAQSchema questions={faqs} />
      <LandingPageLayout>
        <article className="seo-page">
          <div className="seo-meta">Help & support</div>
          <h1>TRION AI FAQ</h1>
          <p className="seo-lead">
            Answers to the most common questions about the TRION AI prediction tool, premium models, payments, and activation.
          </p>

          <div className="faq-list">
            {faqs.map((faq, idx) => (
              <div className="faq-item" key={idx}>
                <button
                  className="faq-trigger"
                  onClick={() => setOpen(open === idx ? null : idx)}
                  aria-expanded={open === idx}
                >
                  {faq.question}
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    style={{ transform: open === idx ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                {open === idx && <div className="faq-content">{faq.answer}</div>}
              </div>
            ))}
          </div>

          <h2>Still have questions?</h2>
          <p>
            Read the <a href="/about">about page</a> for platform details, visit the
            {" "}<a href="/contact">contact page</a> to send a request, or join the Telegram channel for live support.
            Legal documents: <a href="/privacy">privacy policy</a>, <a href="/terms">terms & conditions</a>, <a href="/refund">refund policy</a>.
          </p>
        </article>
      </LandingPageLayout>
    </>
  );
}