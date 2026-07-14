import { useState } from "react";
import { useRouter } from "next/router";
import { PageHead, BreadcrumbSchema } from "@/components/SEO";

const bgStyle = `
  html, body { background: #f8fafc !important; color: #1e293b !important; font-family: 'Inter', sans-serif; overflow: auto !important; }
  .contact-container { max-width: 800px; margin: 40px auto; padding: 40px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
  .contact-back { display: inline-flex; align-items: center; gap: 8px; color: #2e7d32; font-weight: 600; font-size: 14px; margin-bottom: 24px; cursor: pointer; background: none; border: none; padding: 0; outline: none; }
  .contact-back:focus-visible { outline: 2px solid #2e7d32; outline-offset: 4px; border-radius: 4px; }
  .contact-back:hover { color: #1e5e22; }
  h1 { font-size: 28px; font-weight: 800; color: #0f172a; margin: 0 0 16px 0; }
  p.meta { font-size: 15px; color: #64748b; margin-bottom: 32px; line-height: 1.6; }
  .contact-grid { display: grid; grid-template-columns: 1fr; gap: 32px; }
  @media (min-width: 768px) {
    .contact-grid { grid-template-columns: 1.2fr 0.8fr; }
  }
  .contact-form { display: flex; flex-direction: column; gap: 20px; }
  .form-group { display: flex; flex-direction: column; gap: 8px; }
  .form-group label { font-size: 14px; font-weight: 600; color: #334155; }
  .form-group input, .form-group textarea { padding: 12px 16px; font-size: 14px; color: #1e293b; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; transition: border-color 0.2s, background-color 0.2s; }
  .form-group input:focus-visible, .form-group textarea:focus-visible { border-color: #2e7d32; background: #ffffff; outline: 2px solid #2e7d32; outline-offset: -2px; }
  .form-group textarea { resize: vertical; min-height: 120px; }
  .submit-btn { background: #2e7d32; color: #ffffff; font-weight: 600; font-size: 14px; padding: 14px; border: none; border-radius: 8px; cursor: pointer; transition: background-color 0.2s; outline: none; }
  .submit-btn:focus-visible { outline: 3px solid #2e7d32; outline-offset: 2px; }
  .submit-btn:hover { background: #1e5e22; }
  .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .support-card { background: #f8fffe; border: 1px solid #d1fae5; border-radius: 12px; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
  .support-title { font-size: 18px; font-weight: 700; color: #065f46; margin: 0; }
  .support-desc { font-size: 14px; line-height: 1.5; color: #047857; margin: 0; }
  .tg-link { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: #0088cc; color: #ffffff; font-weight: 600; font-size: 14px; padding: 12px; border-radius: 8px; text-decoration: none; transition: background-color 0.2s; outline: none; }
  .tg-link:focus-visible { outline: 3px solid #0088cc; outline-offset: 2px; }
  .tg-link:hover { background: #0077b3; }
  .success-toast { background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; font-size: 14px; font-weight: 600; padding: 12px 16px; border-radius: 8px; text-align: center; }
`;

export default function ContactUs() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitting(true);

    try {
      // Simulate API submit
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHead
        title="Contact Us"
        description="Contact TryonAI customer support. Reach out through our support email, Telegram channel, or send a request."
        canonical="https://wingo30.com/contact"
      >
        <style dangerouslySetInnerHTML={{ __html: bgStyle }} />
      </PageHead>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://wingo30.com/" },
        { name: "Contact Us", url: "https://wingo30.com/contact" }
      ]} />
      <div className="contact-container">
        <button className="contact-back" onClick={() => router.push("/")} type="button">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Home
        </button>
        <h1>Contact Us</h1>
        <p className="meta">Have questions or need assistance with your subscription verification? Get in touch with us using the form below or join our Telegram support channel.</p>

        <div className="contact-grid">
          <div>
            {submitted && (
              <div className="success-toast" style={{ marginBottom: 20 }}>
                Thank you! Your message has been received. We will respond soon.
              </div>
            )}
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="contactName">Your Name</label>
                <input
                  id="contactName"
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactEmail">Email Address</label>
                <input
                  id="contactEmail"
                  type="email"
                  placeholder="e.g. john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactMessage">Message / Payment Query</label>
                <textarea
                  id="contactMessage"
                  placeholder="Write your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button className="submit-btn" type="submit" disabled={submitting}>
                {submitting ? "Sending..." : "Submit Message"}
              </button>
            </form>
          </div>

          <div className="contact-sidebar">
            <div className="support-card">
              <h2 className="support-title">Telegram VIP Channel</h2>
              <p className="support-desc">For the fastest response regarding UTR activations, license updates, and direct live support, join our Telegram portal.</p>
              <a href="https://t.me/kal_mods" className="tg-link" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.49.97-.74 3.79-1.65 6.32-2.73 7.57-3.25 3.61-1.48 4.36-1.74 4.85-1.75.11 0 .35.03.5.16.13.12.17.28.18.42z"/>
                </svg>
                Join Telegram Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
