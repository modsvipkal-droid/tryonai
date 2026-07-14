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

export default function RefundPolicy() {
  const router = useRouter();

  return (
    <>
      <PageHead
        title="Refund Policy"
        description="TryonAI Refund Policy. Understand the terms and conditions regarding digital subscriptions and payment refunds."
        canonical="https://wingo30.com/refund"
      >
        <style dangerouslySetInnerHTML={{ __html: bgStyle }} />
      </PageHead>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://wingo30.com/" },
        { name: "Refund Policy", url: "https://wingo30.com/refund" }
      ]} />
      <div className="legal-container">
        <button className="legal-back" onClick={() => router.push("/")} type="button">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Home
        </button>
        <h1>Refund Policy</h1>
        <p className="meta">Last Updated: July 14, 2026</p>

        <p>At TryonAI, we strive to deliver top-tier AI analysis and smart signals. Due to the digital nature of our subscription services, we maintain a clear policy regarding cancellations and refunds.</p>

        <h2>1. No-Refund Policy</h2>
        <p>TryonAI provides immediate digital access to real-time predictive signals and analytics upon subscription activation. As such, **all sales are final**, and we do not issue refunds for any reason, including change of mind, perceived lack of accuracy, or underutilization of the tool.</p>

        <h2>2. Activation Issues</h2>
        <p>If you have paid for a subscription but experience delays in activation (e.g. if your UTR ID is taking longer to verify), please contact us immediately on Telegram. We will verify your transaction code and manually credit your license key as needed. Under no circumstances should duplicate payments be submitted.</p>

        <h2>3. Subscription Cancellations</h2>
        <p>Your subscription is purchased on a month-to-month basis and does not auto-renew. Once your paid period (30 days) expires, your premium status will revert to free status. To prevent loss of premium features, you must manually purchase a renewal.</p>

        <h2>4. Account Suspensions</h2>
        <p>No refunds will be granted for accounts suspended or terminated due to violation of our Terms & Conditions (such as botting, scraping, API key resale, or system abuse).</p>
      </div>
    </>
  );
}
