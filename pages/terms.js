import { useRouter } from "next/router";
import { PageHead, BreadcrumbSchema } from "@/components/SEO";

const bgStyle = `
  html, body { background: #f8fafc !important; color: #1e293b !important; font-family: 'Inter', sans-serif; overflow: auto !important; }
  .legal-container { max-width: 800px; margin: 40px auto; padding: 40px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
  .legal-back { display: inline-flex; align-items: center; gap: 8px; color: #2e7d32; font-weight: 600; font-size: 14px; margin-bottom: 24px; cursor: pointer; background: none; border: none; padding: 0; outline: none; }
  .legal-back:focus-visible { outline: 2px solid #2e7d32; outline-offset: 4px; border-radius: 4px; }
  .legal-back:hover { color: #1e5e22; }
  h1 { font-size: 28px; font-weight: 800; color: #0f172a; margin: 0 0 16px 0; }
  p.meta { font-size: 14px; color: #64748b; margin-bottom: 32px; }
  h2 { font-size: 20px; font-weight: 700; color: #1e293b; margin: 32px 0 16px 0; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; }
  p { font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 16px 0; }
  ul { margin: 0 0 24px 0; padding-left: 20px; color: #475569; }
  li { font-size: 15px; line-height: 1.6; margin-bottom: 8px; }
`;

export default function TermsAndConditions() {
  const router = useRouter();

  return (
    <>
      <PageHead
        title="Terms & Conditions"
        description="TryonAI Terms and Conditions. Review the rules and guidelines governing user access to the AI platform."
        canonical="https://wingo30.com/terms"
      >
        <style dangerouslySetInnerHTML={{ __html: bgStyle }} />
      </PageHead>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://wingo30.com/" },
        { name: "Terms & Conditions", url: "https://wingo30.com/terms" }
      ]} />
      <div className="legal-container">
        <button className="legal-back" onClick={() => router.push("/")} type="button">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Home
        </button>
        <h1>Terms & Conditions</h1>
        <p className="meta">Last Updated: July 14, 2026</p>

        <p>Welcome to TryonAI. By accessing or using our website, you agree to comply with and be bound by the following Terms and Conditions. Please review them carefully.</p>

        <h2>1. Acceptance of Terms</h2>
        <p>By registering, subscribing, or using any services provided by TryonAI, you agree to these terms in full. If you do not agree with any part of these terms, you must cease using the platform immediately.</p>

        <h2>2. Intellectual Property</h2>
        <p>The code, custom prediction models, pattern definitions, algorithms, brand logos, layouts, and graphics displayed on TryonAI are the exclusive property of TryonAI and are protected under copyright laws. You may not copy, reverse-engineer, or redistribute any assets without prior written consent.</p>

        <h2>3. Disclaimer of Prediction Accuracy</h2>
        <p>TryonAI utilizes advanced statistical and pattern analysis algorithms to generate predictions for the Wingo30 game. However:</p>
        <ul>
          <li>All predictions are generated for informational and statistical analysis purposes only.</li>
          <li>We do not guarantee 100% accuracy, and we are not liable for any financial or recreational losses resulting from using our forecasts.</li>
          <li>Users assume full personal and financial responsibility when participating in any third-party gaming activities.</li>
        </ul>

        <h2>4. Permitted Use & Account Sharing</h2>
        <p>Your subscription is personal and non-transferable. You may not share your account login, developer API keys, or custom logic configurations with third parties. Any detected account sharing or scraping operations will result in immediate suspension without refund.</p>

        <h2>5. Payment & Activation</h2>
        <p>Subscription activation requires the manual submission of a valid Transaction UTR ID. We reserve the right to audit and deny activation requests if transaction codes are determined to be fraudulent or duplicate.</p>

        <h2>6. Modifications to Service</h2>
        <p>TryonAI reserves the right to modify, suspend, or discontinue any feature, endpoint, or subscription tier at any time without notice.</p>
      </div>
    </>
  );
}
