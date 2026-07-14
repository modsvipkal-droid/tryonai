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

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <>
      <PageHead
        title="Privacy Policy"
        description="TryonAI Privacy Policy. Understand how we collect, store, and protect your information."
        canonical="https://wingo30.com/privacy"
      >
        <style dangerouslySetInnerHTML={{ __html: bgStyle }} />
      </PageHead>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://wingo30.com/" },
        { name: "Privacy Policy", url: "https://wingo30.com/privacy" }
      ]} />
      <div className="legal-container">
        <button className="legal-back" onClick={() => router.push("/")} type="button">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Home
        </button>
        <h1>Privacy Policy</h1>
        <p className="meta">Last Updated: July 14, 2026</p>

        <p>At TryonAI, we prioritize the privacy of our visitors. This Privacy Policy document outlines the types of personal data we collect, how we use it, and the security protocols we employ to protect your information.</p>

        <h2>1. Information We Collect</h2>
        <p>We collect information to provide a secure and customized experience. The data we collect includes:</p>
        <ul>
          <li><strong>Authentication Information:</strong> Google account email, name, and profile picture collected via secure Google Sign-In.</li>
          <li><strong>Usage Analytics:</strong> Anonymized click metrics, page views, game data requests, and referral sources to monitor performance.</li>
          <li><strong>Device Metadata:</strong> Browser type, operating system, and IP address for security auditing and rate limiting.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>The collected information is used to:</p>
        <ul>
          <li>Authenticate and maintain your platform access.</li>
          <li>Provide real-time AI Wingo30 predictions tailored to your settings.</li>
          <li>Audit payment UTR IDs to unlock premium subscriptions.</li>
          <li>Monitor for abusive behavior or security threats.</li>
        </ul>

        <h2>3. Data Protection and Security</h2>
        <p>We implement strict security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. We utilize HTTPS encryption, Content Security Policies (CSP), and secure database controls.</p>

        <h2>4. Cookie Policy</h2>
        <p>TryonAI uses local storage and cookies to maintain your active authentication session and save platform interface preferences (such as dashboard layout settings).</p>

        <h2>5. Third-Party Services</h2>
        <p>We work with trusted third-party providers, including Firebase (Authentication & Hosting) and Cloudflare (Turnstile bot prevention). These providers handle data in accordance with their respective privacy policies.</p>

        <h2>6. Contact Us</h2>
        <p>If you have any questions regarding this Privacy Policy, please reach out to us through our official support channel on Telegram or via email.</p>
      </div>
    </>
  );
}
