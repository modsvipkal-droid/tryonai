import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { PageHead, BreadcrumbSchema } from "@/components/SEO";
import SiteFooter from "@/components/SiteFooter";

const contactStyles = `
  @font-face {
    font-family: 'TrionAI';
    src: url('/fonts/trionAIofficial.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
  *, *::before, *::after { box-sizing: border-box; }
  html {
    scroll-behavior: smooth !important;
    -webkit-overflow-scrolling: touch !important;
    height: auto !important;
    min-height: 100% !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
  }
  body {
    background: #eef7f3 !important;
    color: #17251f !important;
    font-family: 'TrionAI', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    overscroll-behavior-y: auto !important;
    -webkit-overflow-scrolling: touch !important;
    margin: 0 !important;
    padding: 0 !important;
    min-height: 100vh !important;
    height: auto !important;
    -webkit-font-smoothing: antialiased;
  }
  #__next {
    height: auto !important;
    min-height: 100% !important;
    overflow: visible !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .contact-page {
    min-height: 100vh;
    width: 100%;
    background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 40%, #ecfdf5 100%);
    padding: 0 !important;
    margin: 0 !important;
    position: relative;
    overflow-x: hidden;
    overflow-y: visible;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .contact-page::before {
    content: '';
    position: fixed;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(ellipse at 30% 20%, rgba(0,152,91,0.07) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 80%, rgba(16,185,129,0.06) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
  .orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.2;
    pointer-events: none;
    z-index: 0;
    animation: floatOrb 18s ease-in-out infinite alternate;
  }
  .orb-1 { width: 420px; height: 420px; background: #00985b; top: -120px; right: -120px; }
  .orb-2 { width: 300px; height: 300px; background: #10b981; bottom: 100px; left: -80px; animation-delay: -7s; }
  @keyframes floatOrb {
    from { transform: translate(0, 0) scale(1); }
    to { transform: translate(30px, 40px) scale(1.1); }
  }

  /* Nav */
  .contact-nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(0,152,91,0.15);
    padding: 16px 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 2px 12px rgba(0,75,47,0.04);
  }
  .contact-nav-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #007543;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    background: rgba(0,152,91,0.08);
    border: 1px solid rgba(0,152,91,0.25);
    padding: 8px 18px;
    border-radius: 50px;
    outline: none;
    transition: all 0.25s ease;
    font-family: 'TrionAI', 'Inter', sans-serif;
  }
  .contact-nav-back:hover {
    background: #00985b;
    border-color: #00985b;
    color: #ffffff;
    transform: translateX(-2px);
    box-shadow: 0 4px 14px rgba(0,152,91,0.25);
  }
  .contact-nav-title {
    font-size: 12px;
    font-weight: 700;
    color: #005537;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  /* Container */
  .contact-container {
    max-width: 920px;
    margin: 40px auto 0;
    padding: 0 20px;
    position: relative;
    z-index: 1;
    animation: fadeSlideUp 0.6s ease both;
    flex: 1 0 auto;
  }
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Hero */
  .contact-hero {
    text-align: center;
    margin-bottom: 40px;
  }
  .contact-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(0,152,91,0.1);
    border: 1px solid rgba(0,152,91,0.25);
    color: #007543;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 6px 16px;
    border-radius: 50px;
    margin-bottom: 16px;
  }
  .contact-hero h1 {
    font-size: clamp(28px, 5vw, 44px);
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 12px 0;
    letter-spacing: -0.02em;
    line-height: 1.15;
  }
  .contact-hero h1 span { color: #00985b; }
  .contact-hero-desc {
    font-size: 16px;
    color: #475569;
    max-width: 540px;
    margin: 0 auto;
    line-height: 1.65;
    font-weight: 500;
  }

  /* Two-col grid */
  .contact-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
  }
  @media (min-width: 768px) {
    .contact-grid { grid-template-columns: 1.3fr 1fr; }
  }

  /* Form Card */
  .form-card {
    background: #ffffff;
    border: 1px solid rgba(0,152,91,0.18);
    border-radius: 24px;
    padding: 36px;
    box-shadow: 0 10px 30px rgba(0,75,47,0.06), 0 1px 3px rgba(0,0,0,0.02);
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    animation: fadeSlideUp 0.6s ease 0.1s both;
  }
  .form-card:hover {
    border-color: rgba(0,152,91,0.38);
    box-shadow: 0 14px 36px rgba(0,75,47,0.09);
  }
  .form-card-title {
    font-size: 20px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 6px 0;
  }
  .form-card-sub {
    font-size: 14px;
    color: #64748b;
    margin: 0 0 24px 0;
  }

  /* Form fields */
  .form-contact { display: flex; flex-direction: column; gap: 18px; }
  .form-group { display: flex; flex-direction: column; gap: 7px; }
  .form-label {
    font-size: 13px;
    font-weight: 700;
    color: #1e293b;
    letter-spacing: 0.02em;
  }
  .form-input, .form-textarea {
    padding: 13px 16px;
    font-size: 14px;
    color: #0f172a;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    outline: none;
    transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
    font-family: 'TrionAI', 'Inter', sans-serif;
    width: 100%;
  }
  .form-input::placeholder, .form-textarea::placeholder { color: #94a3b8; }
  .form-input:focus, .form-textarea:focus {
    border-color: #00985b;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(0,152,91,0.15);
  }
  .form-textarea { resize: vertical; min-height: 130px; }

  /* Submit button */
  .submit-btn {
    background: linear-gradient(135deg, #00985b, #007543);
    color: #ffffff;
    font-weight: 700;
    font-size: 15px;
    padding: 14px;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.25s ease;
    outline: none;
    font-family: 'TrionAI', 'Inter', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    letter-spacing: 0.02em;
    box-shadow: 0 4px 14px rgba(0,152,91,0.28);
  }
  .submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,152,91,0.38);
    background: linear-gradient(135deg, #00a864, #00874e);
  }
  .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }

  /* Toast */
  .toast {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 20px;
    animation: fadeSlideUp 0.4s ease both;
  }
  .toast-success {
    background: rgba(0,152,91,0.1);
    border: 1px solid rgba(0,152,91,0.3);
    color: #007543;
  }
  .toast-error {
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.25);
    color: #b91c1c;
  }

  /* Sidebar */
  .sidebar-card {
    background: #ffffff;
    border: 1px solid rgba(0,152,91,0.18);
    border-radius: 24px;
    padding: 32px 28px;
    box-shadow: 0 10px 30px rgba(0,75,47,0.06), 0 1px 3px rgba(0,0,0,0.02);
    display: flex;
    flex-direction: column;
    gap: 24px;
    animation: fadeSlideUp 0.6s ease 0.2s both;
    height: fit-content;
  }
  .sidebar-icon-box {
    width: 50px;
    height: 50px;
    background: rgba(0,152,91,0.1);
    border: 1px solid rgba(0,152,91,0.25);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .sidebar-title {
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 6px 0;
  }
  .sidebar-desc {
    font-size: 14px;
    color: #475569;
    line-height: 1.6;
    margin: 0 0 16px 0;
  }
  .tg-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: linear-gradient(135deg, #0088cc, #006699);
    color: #ffffff;
    font-weight: 700;
    font-size: 14px;
    padding: 13px 20px;
    border-radius: 12px;
    text-decoration: none;
    transition: all 0.25s ease;
    outline: none;
    font-family: 'TrionAI', 'Inter', sans-serif;
    box-shadow: 0 4px 14px rgba(0,136,204,0.28);
  }
  .tg-link:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,136,204,0.38);
  }

  /* Info items */
  .info-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px;
    background: #f8fafc;
    border: 1px solid rgba(0,152,91,0.12);
    border-radius: 12px;
  }
  .info-icon {
    width: 36px;
    height: 36px;
    background: rgba(0,152,91,0.1);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }
  .info-label { font-size: 12px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 3px 0; }
  .info-val { font-size: 14px; color: #0f172a; font-weight: 600; margin: 0; }

  @media (max-width: 640px) {
    .form-card, .sidebar-card { padding: 22px 18px; border-radius: 16px; }
    .contact-nav { padding: 12px 16px; }
    .contact-hero h1 { font-size: 26px; }
    .contact-hero-desc { font-size: 14px; }
  }
`;

const TG_BOT_TOKEN = "";
const TG_CHAT_ID = "@kal_mods";

export default function ContactUs() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const next = document.getElementById("__next");

    html.classList.add("contact-page");
    body.classList.add("contact-page");

    html.style.setProperty("height", "auto", "important");
    html.style.setProperty("min-height", "100%", "important");
    html.style.setProperty("overflow-y", "auto", "important");
    html.style.setProperty("overflow-x", "hidden", "important");
    html.style.setProperty("scroll-behavior", "smooth", "important");
    html.style.setProperty("-webkit-overflow-scrolling", "touch", "important");

    body.style.setProperty("height", "auto", "important");
    body.style.setProperty("min-height", "100%", "important");
    body.style.setProperty("overflow-y", "auto", "important");
    body.style.setProperty("overflow-x", "hidden", "important");
    body.style.setProperty("overscroll-behavior-y", "auto", "important");
    body.style.setProperty("-webkit-overflow-scrolling", "touch", "important");

    if (next) {
      next.style.setProperty("height", "auto", "important");
      next.style.setProperty("min-height", "100%", "important");
      next.style.setProperty("overflow", "visible", "important");
    }

    try {
      sessionStorage.setItem("trion_intro_seen", "1");
    } catch {}

    return () => {
      html.classList.remove("contact-page");
      body.classList.remove("contact-page");

      html.style.removeProperty("height");
      html.style.removeProperty("min-height");
      html.style.removeProperty("overflow-y");
      html.style.removeProperty("overflow-x");
      html.style.removeProperty("scroll-behavior");
      html.style.removeProperty("-webkit-overflow-scrolling");

      body.style.removeProperty("height");
      body.style.removeProperty("min-height");
      body.style.removeProperty("overflow-y");
      body.style.removeProperty("overflow-x");
      body.style.removeProperty("overscroll-behavior-y");
      body.style.removeProperty("-webkit-overflow-scrolling");

      if (next) {
        next.style.removeProperty("height");
        next.style.removeProperty("min-height");
        next.style.removeProperty("overflow");
      }
    };
  }, []);

  const handleBack = () => {
    try {
      sessionStorage.setItem("trion_intro_seen", "1");
    } catch {}
    router.push("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitting(true);
    setError("");

    const text = `📩 *New Contact Message — TryonAI*\n\n👤 *Name:* ${name}\n📧 *Email:* ${email}\n\n💬 *Message:*\n${message}\n\n🌐 _Sent from wingo30.com/contact_`;

    try {
      if (TG_BOT_TOKEN) {
        const res = await fetch(
          `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: TG_CHAT_ID,
              text,
              parse_mode: "Markdown",
            }),
          }
        );
        if (!res.ok) throw new Error("API error");
      } else {
        const encodedText = encodeURIComponent(
          `📩 New Message from TryonAI\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        );
        window.open(`https://t.me/kal_mods?text=${encodedText}`, "_blank", "noopener,noreferrer");
      }

      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError("⚠️ Could not send your message. Please try Telegram directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHead
        title="Contact Us"
        description="Contact TryonAI customer support. Reach out through our Telegram channel or send us a message directly."
        canonical="https://wingo30.com/contact"
      >
        <style dangerouslySetInnerHTML={{ __html: contactStyles }} />
      </PageHead>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://wingo30.com/" },
        { name: "Contact Us", url: "https://wingo30.com/contact" }
      ]} />

      <div className="contact-page">
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        {/* Sticky Nav */}
        <nav className="contact-nav">
          <button className="contact-nav-back" onClick={handleBack} type="button">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Home
          </button>
          <span className="contact-nav-title">Contact Us</span>
        </nav>

        <div className="contact-container">
          {/* Hero */}
          <div className="contact-hero">
            <div className="contact-badge">✉️ Get In Touch</div>
            <h1>Contact <span>Support</span></h1>
            <p className="contact-hero-desc">Have questions, payment issues, or need subscription help? Reach us directly — we typically respond within a few hours.</p>
          </div>

          <div className="contact-grid">
            {/* Form */}
            <div className="form-card">
              <p className="form-card-title">Send Us a Message</p>
              <p className="form-card-sub">Fill in the form below and your message will be forwarded to our Telegram support team.</p>

              {submitted && (
                <div className="toast toast-success">
                  <span>✅</span>
                  Message sent! Redirecting to Telegram so you can confirm delivery.
                </div>
              )}
              {error && (
                <div className="toast toast-error">
                  <span>⚠️</span>
                  {error}
                </div>
              )}

              <form className="form-contact" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="contactName">Your Name</label>
                  <input
                    id="contactName"
                    className="form-input"
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contactEmail">Email Address</label>
                  <input
                    id="contactEmail"
                    className="form-input"
                    type="email"
                    placeholder="e.g. rahul@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contactMessage">Message / Query</label>
                  <textarea
                    id="contactMessage"
                    className="form-textarea"
                    placeholder="Describe your issue or question..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>

                <button className="submit-btn" type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                      Send to Telegram
                    </>
                  )}
                </button>
              </form>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>

            {/* Sidebar */}
            <div className="sidebar-card">
              <div>
                <div className="sidebar-icon-box">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="#00985b">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.49.97-.74 3.79-1.65 6.32-2.73 7.57-3.25 3.61-1.48 4.36-1.74 4.85-1.75.11 0 .35.03.5.16.13.12.17.28.18.42z" />
                  </svg>
                </div>
                <h2 className="sidebar-title" style={{ marginTop: 14 }}>Telegram VIP Support</h2>
                <p className="sidebar-desc">For the fastest resolution — UTR activations, license updates, live signals — contact us directly on Telegram.</p>
                <a
                  href="https://t.me/kal_mods"
                  className="tg-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.49.97-.74 3.79-1.65 6.32-2.73 7.57-3.25 3.61-1.48 4.36-1.74 4.85-1.75.11 0 .35.03.5.16.13.12.17.28.18.42z" />
                  </svg>
                  Join Telegram Support
                </a>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div className="info-item">
                  <div className="info-icon">⏱️</div>
                  <div>
                    <p className="info-label">Response Time</p>
                    <p className="info-val">Within a few hours</p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon">🌐</div>
                  <div>
                    <p className="info-label">Support Channel</p>
                    <p className="info-val">t.me/kal_mods</p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon">📅</div>
                  <div>
                    <p className="info-label">Availability</p>
                    <p className="info-val">7 days a week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <SiteFooter />
      </div>
    </>
  );
}
