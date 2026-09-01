import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  PageHead,
  BreadcrumbSchema,
  OrganizationSchema,
  WebsiteSchema,
  WebPageSchema,
  FAQSchema,
  HowToSchema,
} from "@/components/SEO";
import SiteFooter from "@/components/SiteFooter";

// ── FAQ Data (visible on page + FAQPage schema) ──────────────────────────────
const CONTACT_FAQS = [
  {
    question: "How can I contact TRION AI?",
    answer:
      "You can contact TRION AI through the official Telegram support channel at t.me/kal_mods or by using the contact form on this page. Your message will be forwarded to the TRION AI support team.",
  },
  {
    question: "What can I contact TRION AI support about?",
    answer:
      "TRION AI support can help with account and sign-in questions, website access issues, tool-related questions, subscription and activation queries, and general technical problems with the platform.",
  },
  {
    question: "What information should I include in a support request?",
    answer:
      "Include a clear description of your issue, the affected TRION AI feature or tool, any error messages you see, the approximate time the problem occurred, and a screenshot if it helps explain the situation.",
  },
  {
    question: "What should I do if I cannot access my account?",
    answer:
      "If you cannot sign in to your TRION AI account, check your internet connection, ensure your browser allows Google sign-in pop-ups, and then contact support via Telegram at t.me/kal_mods with details of the problem.",
  },
  {
    question: "Should I send my password or OTP to TRION AI support?",
    answer:
      "No. Never share your password, OTP, authentication code, or recovery code with anyone, including support. TRION AI support will never ask for this information.",
  },
];

// ── HowTo Steps (visible steps + HowTo schema) ───────────────────────────────
const HOWTO_STEPS = [
  {
    name: "Choose your support channel",
    text: "Use the contact form on this page or reach out directly via the official TRION AI Telegram support channel at t.me/kal_mods.",
  },
  {
    name: "Clearly describe your issue",
    text: "Write a clear, specific description of your question or problem, including which TRION AI feature or tool is affected.",
  },
  {
    name: "Include relevant details",
    text: "Add non-sensitive account details, error messages, the approximate time of the problem, and a screenshot if helpful.",
  },
  {
    name: "Do not share sensitive credentials",
    text: "Never include your password, OTP, authentication code, or recovery code in any support message.",
  },
  {
    name: "Wait for a response",
    text: "The TRION AI support team is available 7 days a week and typically responds within a few hours through the chosen support channel.",
  },
];

const PAGE_URL = "https://wingo30.com/contact";
const PAGE_TITLE = "Contact TRION AI – Support & Help";
const PAGE_DESC =
  "Contact TRION AI for account, tool and website support. Reach the support team via Telegram or the contact form for questions and technical issues.";

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

  /* ── AEO Content Sections ── */
  .contact-hero h1 {
    font-size: clamp(22px, 4vw, 34px);
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 12px 0;
    letter-spacing: -0.02em;
    line-height: 1.25;
  }
  .contact-hero h1 span { color: #00985b; }
  .contact-hero-desc {
    font-size: 14.5px;
    color: #475569;
    max-width: 560px;
    margin: 0 auto 14px;
    line-height: 1.65;
    font-weight: 400;
  }
  .contact-quick-answer {
    display: inline-block;
    background: rgba(0,152,91,0.07);
    border: 1px solid rgba(0,152,91,0.2);
    border-radius: 10px;
    padding: 12px 18px;
    font-size: 13.5px;
    color: #134e36;
    max-width: 560px;
    line-height: 1.6;
    text-align: left;
    margin: 0 auto;
  }
  .contact-quick-answer strong {
    display: block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: #007543;
    margin-bottom: 5px;
  }
  .aeo-ext-link {
    color: #007543;
    font-weight: 600;
    text-underline-offset: 3px;
    text-decoration: underline;
  }
  .aeo-ext-link:hover { color: #005537; }
  .aeo-sections {
    margin-top: 48px;
    display: flex;
    flex-direction: column;
    gap: 28px;
    padding-bottom: 48px;
  }
  .aeo-section {
    background: #ffffff;
    border: 1px solid rgba(0,152,91,0.14);
    border-radius: 20px;
    padding: 26px 28px;
    box-shadow: 0 4px 16px rgba(0,75,47,0.04);
  }
  .aeo-section h2 {
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 10px;
    line-height: 1.3;
    letter-spacing: -0.01em;
  }
  .aeo-section p {
    font-size: 13.5px;
    color: #475569;
    line-height: 1.65;
    margin: 0 0 10px;
  }
  .aeo-section p:last-child { margin-bottom: 0; }
  .aeo-checklist {
    list-style: none;
    padding: 0;
    margin: 8px 0 0;
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
  .aeo-checklist li {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    font-size: 13.5px;
    color: #334155;
    line-height: 1.5;
  }
  .aeo-dot {
    color: #00985b;
    font-weight: 800;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .aeo-steps {
    list-style: none;
    padding: 0;
    margin: 8px 0 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .aeo-steps li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 13.5px;
    color: #334155;
    line-height: 1.55;
  }
  .aeo-step-num {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #00985b;
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1px;
  }
  .aeo-template {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 16px 18px;
    margin-top: 12px;
    font-size: 13px;
    color: #334155;
    line-height: 1.75;
    font-family: 'Inter', monospace;
  }
  .aeo-template strong { color: #0f172a; font-weight: 700; }
  .aeo-security-note {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background: rgba(239,68,68,0.05);
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 10px;
    padding: 13px 16px;
    margin-top: 14px;
    font-size: 13px;
    color: #b91c1c;
    line-height: 1.55;
  }
  .aeo-internal-links {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
    margin-top: 10px;
  }
  .aeo-link-tag {
    font-size: 12.5px;
    font-weight: 600;
    color: #007543;
    background: #f0fbf5;
    border: 1px solid #c8e8d8;
    padding: 6px 13px;
    border-radius: 8px;
    text-decoration: none;
    transition: all 0.15s ease;
  }
  .aeo-link-tag:hover {
    background: #e0f4ea;
    color: #005537;
    transform: translateY(-1px);
  }
  .faq-item {
    border-bottom: 1px solid #f1f5f9;
    padding: 11px 0;
  }
  .faq-item:last-child { border-bottom: none; padding-bottom: 0; }
  .faq-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    text-align: left;
    font-size: 13.5px;
    font-weight: 600;
    color: #0f172a;
    gap: 8px;
    font-family: 'TrionAI', 'Inter', sans-serif;
  }
  .faq-btn:focus-visible { outline: 2px solid #00985b; outline-offset: 2px; border-radius: 4px; }
  .faq-icon { flex-shrink: 0; color: #64748b; transition: transform 0.2s ease; }
  .faq-icon.open { transform: rotate(180deg); color: #00985b; }
  .faq-ans { font-size: 13px; color: #475569; line-height: 1.6; margin: 7px 0 0; }

  @media (max-width: 640px) {
    .form-card, .sidebar-card { padding: 22px 18px; border-radius: 16px; }
    .contact-nav { padding: 12px 16px; }
    .aeo-section { padding: 18px 16px; border-radius: 14px; }
    .aeo-section h2 { font-size: 14.5px; }
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
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => setOpenFaq(openFaq === idx ? null : idx);

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
      {/* ── SEO Head ────────────────────────────────────────────────── */}
      <PageHead
        title={PAGE_TITLE}
        description={PAGE_DESC}
        canonical={PAGE_URL}
      >
        <style dangerouslySetInnerHTML={{ __html: contactStyles }} />
      </PageHead>

      {/* ── Structured Data ─────────────────────────────────────────── */}
      <OrganizationSchema />
      <WebsiteSchema />
      <WebPageSchema
        title={PAGE_TITLE}
        description={PAGE_DESC}
        url={PAGE_URL}
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://wingo30.com/" },
        { name: "Contact Support", url: PAGE_URL }
      ]} />
      <FAQSchema questions={CONTACT_FAQS} />
      <HowToSchema
        name="How to Contact TRION AI Support"
        description="Steps to submit an effective support request to the TRION AI team."
        steps={HOWTO_STEPS}
      />

      <div className="contact-page">
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        {/* Sticky Nav */}
        <nav className="contact-nav" aria-label="Contact page navigation">
          <button className="contact-nav-back" onClick={handleBack} type="button" aria-label="Go back to home page">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Home
          </button>
          <span className="contact-nav-title">Contact Us</span>
        </nav>

        <div className="contact-container">
          {/* ── Hero ─────────────────────────────────────────────────── */}
          <header className="contact-hero">
            <div className="contact-badge" aria-hidden="true">✉️ Get In Touch</div>
            <h1>Contact <span>TRION AI</span> Support</h1>
            <p className="contact-hero-desc">
              Need help with your TRION AI account, tools, or website access? This page provides
              the available ways to reach the TRION AI support team. Choose the option that best
              matches your request or use the contact form below.
            </p>
            <div className="contact-quick-answer" role="note" aria-label="Quick answer">
              <strong>Quick Answer</strong>
              The fastest way to reach TRION AI is through the official Telegram support channel at{" "}
              <a href="https://t.me/kal_mods" target="_blank" rel="noopener noreferrer" className="aeo-ext-link">t.me/kal_mods</a>.
              For general queries, use the contact form below and your message will be forwarded to the support team.
            </div>
          </header>

          <div className="contact-grid">
            {/* ── Contact Form ─────────────────────────────────────── */}
            <div className="form-card">
              <p className="form-card-title">Send Us a Message</p>
              <p className="form-card-sub">Fill in the form below and your message will be forwarded to our Telegram support team.</p>

              {submitted && (
                <div className="toast toast-success" role="status" aria-live="polite">
                  <span aria-hidden="true">✅</span>
                  Message sent! Redirecting to Telegram so you can confirm delivery.
                </div>
              )}
              {error && (
                <div className="toast toast-error" role="alert" aria-live="assertive">
                  <span aria-hidden="true">⚠️</span>
                  {error}
                </div>
              )}

              <form className="form-contact" onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label className="form-label" htmlFor="contactName">Your Name <span aria-hidden="true">*</span></label>
                  <input
                    id="contactName"
                    className="form-input"
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    aria-required="true"
                    autoComplete="name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contactEmail">Email Address <span aria-hidden="true">*</span></label>
                  <input
                    id="contactEmail"
                    className="form-input"
                    type="email"
                    placeholder="e.g. rahul@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-required="true"
                    autoComplete="email"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contactMessage">Message / Query <span aria-hidden="true">*</span></label>
                  <textarea
                    id="contactMessage"
                    className="form-textarea"
                    placeholder="Describe your issue or question..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    aria-required="true"
                  />
                </div>

                <button className="submit-btn" type="submit" disabled={submitting} aria-label={submitting ? "Sending message" : "Send message to TRION AI support via Telegram"}>
                  {submitting ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }} aria-hidden="true">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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

            {/* ── Telegram Sidebar ─────────────────────────────────── */}
            <div className="sidebar-card">
              <div>
                <div className="sidebar-icon-box" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="#00985b" aria-hidden="true">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.49.97-.74 3.79-1.65 6.32-2.73 7.57-3.25 3.61-1.48 4.36-1.74 4.85-1.75.11 0 .35.03.5.16.13.12.17.28.18.42z" />
                  </svg>
                </div>
                <h2 className="sidebar-title" style={{ marginTop: 14 }}>Telegram VIP Support</h2>
                <p className="sidebar-desc">For the fastest resolution — UTR activations, license updates, live signals — reach the TRION AI team directly on Telegram.</p>
                <a
                  href="https://t.me/kal_mods"
                  className="tg-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Join TRION AI Telegram support channel"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.49.97-.74 3.79-1.65 6.32-2.73 7.57-3.25 3.61-1.48 4.36-1.74 4.85-1.75.11 0 .35.03.5.16.13.12.17.28.18.42z" />
                  </svg>
                  Join Telegram Support
                </a>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div className="info-item">
                  <div className="info-icon" aria-hidden="true">⏱️</div>
                  <div>
                    <p className="info-label">Response Time</p>
                    <p className="info-val">Within a few hours</p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon" aria-hidden="true">🌐</div>
                  <div>
                    <p className="info-label">Support Channel</p>
                    <p className="info-val">t.me/kal_mods</p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon" aria-hidden="true">📅</div>
                  <div>
                    <p className="info-label">Availability</p>
                    <p className="info-val">7 days a week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ══ AEO / SEO Informational Sections ══════════════════════════ */}
          <div className="aeo-sections">

            {/* How Can I Contact TRION AI */}
            <section className="aeo-section" aria-labelledby="sec-how-contact">
              <h2 id="sec-how-contact">How Can I Contact TRION AI?</h2>
              <p>
                You can contact TRION AI using two available channels: the{" "}
                <strong>official Telegram support</strong> at{" "}
                <a href="https://t.me/kal_mods" target="_blank" rel="noopener noreferrer" className="aeo-ext-link">t.me/kal_mods</a>,
                or the <strong>contact form</strong> above. The form forwards your message directly to the Telegram support team.
                Choose the channel that best suits your request and include enough detail for the team to respond effectively.
              </p>
            </section>

            {/* What Can TRION AI Support Help With */}
            <section className="aeo-section" aria-labelledby="sec-help-with">
              <h2 id="sec-help-with">What Can TRION AI Support Help With?</h2>
              <p>The TRION AI support team can assist with:</p>
              <ul className="aeo-checklist" role="list">
                <li><span className="aeo-dot" aria-hidden="true">•</span><span>Account sign-in and access questions</span></li>
                <li><span className="aeo-dot" aria-hidden="true">•</span><span>Subscription activation and UTR-related queries</span></li>
                <li><span className="aeo-dot" aria-hidden="true">•</span><span>Questions about TRION AI tools and live prediction features</span></li>
                <li><span className="aeo-dot" aria-hidden="true">•</span><span>Website access and technical issues</span></li>
                <li><span className="aeo-dot" aria-hidden="true">•</span><span>General questions about the platform and available services</span></li>
              </ul>
            </section>

            {/* How Should I Contact Support — HowTo visible steps */}
            <section className="aeo-section" aria-labelledby="sec-howto">
              <h2 id="sec-howto">How Should I Contact TRION AI Support?</h2>
              <p>Follow these steps to submit a clear and effective support request:</p>
              <ol className="aeo-steps" role="list">
                {HOWTO_STEPS.map((step, i) => (
                  <li key={i}>
                    <span className="aeo-step-num" aria-hidden="true">{i + 1}</span>
                    <span><strong>{step.name}.</strong> {step.text}</span>
                  </li>
                ))}
              </ol>
            </section>

            {/* What Information Should I Include */}
            <section className="aeo-section" aria-labelledby="sec-info">
              <h2 id="sec-info">What Information Should I Include in a Support Request?</h2>
              <p>A complete request helps the team respond faster. Include:</p>
              <ul className="aeo-checklist" role="list">
                <li><span className="aeo-dot" aria-hidden="true">•</span><span>A clear description of your issue or question</span></li>
                <li><span className="aeo-dot" aria-hidden="true">•</span><span>The affected TRION AI feature or tool</span></li>
                <li><span className="aeo-dot" aria-hidden="true">•</span><span>Any error message shown on screen</span></li>
                <li><span className="aeo-dot" aria-hidden="true">•</span><span>The approximate time the problem occurred</span></li>
                <li><span className="aeo-dot" aria-hidden="true">•</span><span>A screenshot if it helps explain the situation</span></li>
              </ul>
              <div className="aeo-template" role="note" aria-label="Example support request template">
                <strong>Example Support Request Template</strong><br />
                <strong>Issue:</strong> [Describe the problem]<br />
                <strong>Affected feature:</strong> [e.g. WinGo Prediction, Login, Subscription]<br />
                <strong>What happened:</strong> [Steps that led to the issue]<br />
                <strong>Error message:</strong> [Exact message if shown]<br />
                <strong>Approximate time:</strong> [When did it occur]<br />
                <strong>Screenshot:</strong> [Attach if useful]
              </div>
              <div className="aeo-security-note" role="note" aria-label="Security warning">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }} aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>
                  <strong>Security reminder:</strong> Never send your password, OTP, authentication code, or recovery code to support.
                  TRION AI support will never ask for this information.
                </span>
              </div>
            </section>

            {/* Is It Safe to Share Password/OTP */}
            <section className="aeo-section" aria-labelledby="sec-security">
              <h2 id="sec-security">Is It Safe to Share My Password or OTP With Support?</h2>
              <p>
                <strong>No.</strong> Never share your password, OTP (one-time password), authentication code, or any recovery
                credential with anyone — including the TRION AI support team. TRION AI uses{" "}
                <a
                  href="https://developers.google.com/identity/protocols/oauth2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aeo-ext-link"
                >
                  Google OAuth 2.0
                </a>{" "}
                for authentication, which means the platform never sees or stores your Google password.
                If you are ever asked for such information by someone claiming to be support, do not share it.
              </p>
            </section>

            {/* Account Access Issues */}
            <section className="aeo-section" aria-labelledby="sec-account">
              <h2 id="sec-account">What Should I Do If I Cannot Access My Account?</h2>
              <p>If you cannot sign in to your TRION AI account, try these steps:</p>
              <ul className="aeo-checklist" role="list">
                <li><span className="aeo-dot" aria-hidden="true">•</span>
                  <span>Check your internet connection and try refreshing the page.</span>
                </li>
                <li><span className="aeo-dot" aria-hidden="true">•</span>
                  <span>Ensure your browser allows Google sign-in pop-up windows.</span>
                </li>
                <li><span className="aeo-dot" aria-hidden="true">•</span>
                  <span>
                    Visit the{" "}
                    <Link href="/login" className="aeo-ext-link">TRION AI sign-in page</Link>{" "}
                    and try logging in again.
                  </span>
                </li>
                <li><span className="aeo-dot" aria-hidden="true">•</span>
                  <span>
                    If the problem persists, contact support via Telegram at{" "}
                    <a href="https://t.me/kal_mods" target="_blank" rel="noopener noreferrer" className="aeo-ext-link">t.me/kal_mods</a>{" "}
                    with a description of the error.
                  </span>
                </li>
              </ul>
            </section>

            {/* Explore TRION AI — Internal Links */}
            <section className="aeo-section" aria-labelledby="sec-explore">
              <h2 id="sec-explore">Explore TRION AI Platform</h2>
              <p>Looking for prediction tools, live signals, or your account? Navigate directly to the relevant section:</p>
              <nav className="aeo-internal-links" aria-label="TRION AI platform quick links">
                <Link href="/login" className="aeo-link-tag">Sign in to your account</Link>
                <Link href="/wingo-ai-prediction" className="aeo-link-tag">WinGo AI Prediction Tool</Link>
                <Link href="/wingosignal" className="aeo-link-tag">Live WinGo Signal Dashboard</Link>
                <Link href="/subscription" className="aeo-link-tag">Plans &amp; Subscription</Link>
              </nav>
            </section>

            {/* FAQ Accordion */}
            <section className="aeo-section" aria-labelledby="sec-faq">
              <h2 id="sec-faq">Frequently Asked Questions</h2>
              <div role="list">
                {CONTACT_FAQS.map((item, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div className="faq-item" key={item.question} role="listitem">
                      <button
                        className="faq-btn"
                        type="button"
                        onClick={() => toggleFaq(idx)}
                        aria-expanded={isOpen}
                        id={`faq-btn-${idx}`}
                        aria-controls={`faq-ans-${idx}`}
                      >
                        <span>{item.question}</span>
                        <span className={`faq-icon${isOpen ? " open" : ""}`} aria-hidden="true">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </span>
                      </button>
                      {isOpen && (
                        <p className="faq-ans" id={`faq-ans-${idx}`} role="region" aria-labelledby={`faq-btn-${idx}`}>
                          {item.answer}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

          </div>
          {/* ══ End AEO Sections ══════════════════════════════════════════ */}

        </div>
        <SiteFooter />
      </div>
    </>
  );
}
