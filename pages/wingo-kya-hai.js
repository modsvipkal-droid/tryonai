import { useRouter } from "next/router";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PageHead,
  BreadcrumbSchema,
  FAQSchema,
  WebPageSchema,
  OrganizationSchema,
  ArticleSchema,
  HowToSchema,
} from "@/components/SEO";
import ContentCard, { smartCardStyles } from "@/components/ContentCard";
import SiteFooter from "@/components/SiteFooter";

// ── Premium Soft SVG Icons ───────────────────────────────────────────────────
const IconZap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const IconTimer = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="10" y1="2" x2="14" y2="2"/>
    <line x1="12" y1="14" x2="12" y2="8"/>
    <circle cx="12" cy="14" r="8"/>
  </svg>
);

const IconClock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconHourglass = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 22h14"/>
    <path d="M5 2h14"/>
    <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/>
    <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/>
  </svg>
);

const IconGlobe = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const IconBarChart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
    <line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);

const IconBot = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 8V4H8"/>
    <rect width="16" height="12" x="4" y="8" rx="2"/>
    <path d="M2 14h2"/>
    <path d="M20 14h2"/>
    <path d="M15 13v2"/>
    <path d="M9 13v2"/>
  </svg>
);

const IconWrench = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
);

const IconArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const IconUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconCheckCircle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00985b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const IconKey = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="7.5" cy="15.5" r="4.5"/>
    <path d="M10.7 12.3L19 4"/>
    <path d="M15.5 7.5l2 2"/>
    <path d="M18 5l2 2"/>
  </svg>
);

const IconTarget = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#008751" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const IconBuilding = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#008751" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="2" width="16" height="20" rx="2"/>
    <path d="M9 22v-4h6v4"/>
    <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/>
  </svg>
);

const IconLightbulb = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#008751" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="9" y1="18" x2="15" y2="18"/>
    <line x1="10" y1="22" x2="14" y2="22"/>
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
  </svg>
);

const IconScale = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#008751" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1zM2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/>
    <path d="M7 21h10M12 3v18M3 7h18"/>
  </svg>
);

// ── Page-scoped styles (Soft Modern UX/UI Design) ─────────────────────────────
const bgStyle = `
  html {
    height: auto !important;
    min-height: 100% !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    scroll-behavior: smooth !important;
    -webkit-overflow-scrolling: touch !important;
  }

  body {
    height: auto !important;
    min-height: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    background-color: #fbfdfc !important;
    color: #1e293b !important;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    overscroll-behavior-y: auto !important;
    -webkit-overflow-scrolling: touch !important;
  }

  #__next {
    height: auto !important;
    min-height: 100% !important;
    overflow: visible !important;
  }

  .wkh-page-shell {
    min-height: 100vh;
    width: 100%;
    background: radial-gradient(120% 50% at 50% 0%, #f0f7f3 0%, #fbfdfc 100%);
    color: #1e293b;
    overflow-x: hidden;
    overflow-y: visible;
  }

  .wkh-wrap {
    max-width: 880px;
    margin: 0 auto;
    padding: 40px 24px 80px;
  }

  /* Back Button */
  .wkh-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #475569;
    font-weight: 500;
    font-size: 13.5px;
    margin-bottom: 28px;
    cursor: pointer;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    padding: 8px 16px;
    border-radius: 12px;
    outline: none;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
  }
  .wkh-back:hover {
    color: #00985b;
    border-color: #d1eedf;
    background: #f4fbf7;
    transform: translateX(-2px);
    box-shadow: 0 2px 6px rgba(0, 152, 91, 0.08);
  }
  .wkh-back:focus-visible {
    outline: 2px solid #00985b;
    outline-offset: 2px;
  }

  /* Hero */
  .wkh-hero {
    background: #ffffff;
    border: 1px solid #e8f0ec;
    border-radius: 24px;
    padding: 38px 34px;
    margin-bottom: 36px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.015), 0 12px 32px rgba(0,152,91,0.035);
    position: relative;
  }

  /* Badge */
  .wkh-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: #eef8f3;
    border: 1px solid #d1eedf;
    color: #008751;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    padding: 5px 14px;
    border-radius: 9999px;
    margin-bottom: 18px;
  }
  .wkh-badge-dot {
    width: 6px; height: 6px;
    background: #00985b;
    border-radius: 50%;
  }

  /* H1 */
  h1.wkh-h1 {
    font-size: clamp(25px, 4.5vw, 35px);
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 14px;
    line-height: 1.25;
    letter-spacing: -0.02em;
  }
  h1.wkh-h1 .pink   { color: #00985b; }
  h1.wkh-h1 .indigo { color: #007043; }

  /* Metadata Byline (GEO Ownership & Freshness) */
  .wkh-meta-byline {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 12px;
    font-size: 12.5px;
    color: #64748b;
    margin: 0 0 18px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f1f5f9;
  }
  .wkh-meta-byline strong {
    color: #334155;
    font-weight: 600;
  }

  /* Chips */
  .wkh-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 22px;
  }
  .wkh-chip {
    background: #f6faf8;
    border: 1px solid #e2ece6;
    color: #008751;
    font-size: 12px;
    font-weight: 600;
    padding: 5px 13px;
    border-radius: 9999px;
    transition: background 0.15s ease;
  }
  .wkh-chip:hover {
    background: #edf7f1;
  }

  /* Answer-first summary */
  .wkh-answer-summary {
    background: #f0f9f4;
    border: 1px solid #cceade;
    border-left: 4px solid #00985b;
    border-radius: 0 16px 16px 0;
    padding: 20px 22px;
    margin: 18px 0 0;
    font-size: 14.8px;
    color: #1e4a30;
    line-height: 1.7;
    box-shadow: 0 1px 3px rgba(0, 152, 91, 0.02);
  }
  .wkh-answer-summary strong {
    color: #006b38;
    font-weight: 700;
  }

  /* Soft Key Takeaway */
  .wkh-takeaway {
    background: #fffdf5;
    border: 1px solid #fef08a;
    border-left: 4px solid #eab308;
    border-radius: 0 16px 16px 0;
    padding: 18px 22px;
    margin: 18px 0 0;
    font-size: 14.5px;
    color: #78350f;
    line-height: 1.65;
  }
  .wkh-takeaway-header {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #92400e;
    font-weight: 700;
    margin-bottom: 6px;
    font-size: 14.5px;
  }

  /* Guide image */
  .wkh-guide-img {
    width: 100%;
    height: auto;
    border-radius: 18px;
    border: 1px solid #e2e8f0;
    margin: 22px 0 8px;
    display: block;
    box-shadow: 0 3px 12px rgba(0,0,0,0.03);
  }
  .wkh-img-caption {
    font-size: 12.5px;
    color: #64748b;
    text-align: center;
    margin: 0 0 22px;
    font-style: italic;
  }

  /* Audience & Use-Case Modern Soft Card */
  .wkh-audience {
    background: #f8faff;
    border: 1px solid #dfe7fb;
    border-radius: 20px;
    padding: 24px 24px;
    margin: 28px 0;
    box-shadow: 0 2px 8px rgba(30, 58, 138, 0.02);
  }
  .wkh-audience-title {
    font-size: 15.5px;
    font-weight: 800;
    color: #1e3a8a;
    margin: 0 0 18px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .wkh-audience-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .wkh-audience-card {
    background: #ffffff;
    border: 1px solid #e5edff;
    border-radius: 14px;
    padding: 14px 18px;
    font-size: 13.5px;
    line-height: 1.6;
    color: #334155;
    transition: border-color 0.15s ease, transform 0.15s ease;
  }
  .wkh-audience-card:hover {
    border-color: #cbdcfc;
    transform: translateY(-1px);
  }
  .wkh-audience-card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #1e293b;
    font-weight: 700;
    margin-bottom: 4px;
    font-size: 13.8px;
  }
  .wkh-audience-card p {
    margin: 0;
    font-size: 13.5px;
    color: #475569;
  }

  /* Body */
  .wkh-body {
    line-height: 1.75;
    color: #334155;
  }
  .wkh-body p {
    margin: 0 0 18px;
    font-size: 15px;
    color: #334155;
  }
  .wkh-body strong {
    color: #0f172a;
    font-weight: 600;
  }
  .wkh-body em {
    color: #008751;
    font-style: normal;
    font-weight: 600;
  }

  /* Sections */
  .wkh-section {
    margin: 48px 0 0;
  }
  .wkh-section h2 {
    font-size: clamp(19px, 3.5vw, 24px);
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 6px;
    letter-spacing: -0.015em;
    line-height: 1.3;
  }
  .wkh-section h3 {
    font-size: 16.5px;
    font-weight: 700;
    color: #1e293b;
    margin: 24px 0 10px;
    line-height: 1.4;
  }
  .wkh-section-sub {
    font-size: 14px;
    color: #64748b;
    font-weight: 400;
    margin: 0 0 18px;
  }

  /* Direct answer block */
  .wkh-direct-answer {
    background: #f8faf9;
    border-left: 3.5px solid #00985b;
    border-radius: 0 12px 12px 0;
    padding: 15px 18px;
    margin: 0 0 20px;
    font-size: 14.5px;
    color: #1e293b;
    line-height: 1.65;
  }
  .wkh-direct-answer strong { color: #006b38; }

  /* Info cards */
  .wkh-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 16px;
    margin: 20px 0 24px;
  }
  .wkh-card {
    background: #ffffff;
    border: 1px solid #e6ede9;
    border-radius: 18px;
    padding: 22px 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.015);
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .wkh-card:hover {
    border-color: #cbd5e1;
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
  }
  .wkh-icon-badge {
    width: 44px;
    height: 44px;
    border-radius: 13px;
    background: #eef8f3;
    border: 1px solid #d1eedf;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #008751;
    margin-bottom: 14px;
    transition: transform 0.2s ease, background-color 0.2s ease;
  }
  .wkh-card:hover .wkh-icon-badge {
    background: #e0f4ea;
    transform: scale(1.04);
    color: #00985b;
  }
  .wkh-card-title { font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
  .wkh-card-desc  { font-size: 13px; color: #475569; line-height: 1.55; }

  /* Example Box */
  .wkh-example-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 20px 22px;
    margin: 20px 0 24px;
  }
  .wkh-example-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13.5px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 12px;
  }
  .wkh-example-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 10px;
  }
  .wkh-example-item {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 13px;
  }
  .wkh-example-item span.label {
    display: block;
    color: #64748b;
    font-size: 11.5px;
    margin-bottom: 2px;
  }
  .wkh-example-item span.value {
    color: #0f172a;
    font-weight: 700;
    font-size: 14px;
  }

  /* Step-by-step How-To list */
  .wkh-steps-list {
    list-style: none;
    padding: 0;
    margin: 20px 0 28px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    counter-reset: wkh-step-counter;
  }
  .wkh-step-item {
    display: flex;
    gap: 16px;
    background: #ffffff;
    border: 1px solid #e6ede9;
    border-radius: 16px;
    padding: 18px 20px;
    position: relative;
    transition: border-color 0.15s ease, transform 0.15s ease;
  }
  .wkh-step-item:hover {
    border-color: #cbd5e1;
    transform: translateY(-1px);
  }
  .wkh-step-num {
    counter-increment: wkh-step-counter;
    width: 32px;
    height: 32px;
    background: #eef8f3;
    border: 1px solid #d1eedf;
    color: #008751;
    font-weight: 800;
    font-size: 14px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .wkh-step-title {
    font-size: 14.5px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 4px;
  }
  .wkh-step-desc {
    font-size: 13.5px;
    color: #475569;
    line-height: 1.55;
    margin: 0;
  }

  /* Odds table */
  .wkh-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0 24px;
    font-size: 14px;
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
  }
  .wkh-table th {
    background: #f8faf9;
    color: #0f172a;
    font-weight: 700;
    text-align: left;
    padding: 14px 18px;
    border-bottom: 1px solid #e2e8f0;
  }
  .wkh-table td {
    padding: 13px 18px;
    border-bottom: 1px solid #f1f5f9;
    color: #475569;
  }
  .wkh-table tr:last-child td { border-bottom: none; }
  .wkh-table tr:hover td { background: #fafcfb; }
  .wkh-table td:first-child { color: #0f172a; font-weight: 600; }
  .pill-red    { color: #dc2626; font-weight: 700; }
  .pill-green  { color: #16a34a; font-weight: 700; }
  .pill-violet { color: #9333ea; font-weight: 700; }

  /* Internal link list */
  .wkh-link-list {
    list-style: none;
    padding: 0;
    margin: 18px 0 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .wkh-link-list li {
    font-size: 14.5px;
    color: #334155;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    line-height: 1.55;
    background: #ffffff;
    border: 1px solid #e6ede9;
    border-radius: 14px;
    padding: 14px 18px;
    transition: all 0.15s ease;
  }
  .wkh-link-list li:hover {
    border-color: #cbd5e1;
    background: #fbfdfc;
    transform: translateX(2px);
  }
  .wkh-link-list li svg {
    flex-shrink: 0;
    margin-top: 3px;
    color: #00985b;
  }
  .wkh-link-list a {
    color: #008751;
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .wkh-link-list a:hover {
    color: #006038;
  }

  /* External source link */
  .wkh-ext-link {
    color: #008751;
    text-decoration: underline;
    text-underline-offset: 2px;
    font-weight: 600;
  }
  .wkh-ext-link:hover {
    color: #005f37;
  }

  /* Promo Box */
  .wkh-promo {
    background: #ffffff;
    border: 1px solid #d1eedf;
    border-radius: 20px;
    padding: 28px 26px;
    margin: 28px 0;
    box-shadow: 0 2px 10px rgba(0, 152, 91, 0.04);
  }
  .wkh-promo-title {
    font-size: 16px;
    font-weight: 800;
    color: #007043;
    margin: 0 0 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .wkh-promo-list {
    list-style: none;
    padding: 0; margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .wkh-promo-list li {
    font-size: 14px;
    color: #334155;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .wkh-promo-list li span.icon-wrap {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: #eef8f3;
    border: 1px solid #d1eedf;
    color: #008751;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .wkh-promo-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 18px;
    background: #00985b;
    color: #ffffff;
    font-size: 13.5px;
    font-weight: 700;
    padding: 10px 22px;
    border-radius: 12px;
    text-decoration: none;
    transition: background 0.15s, transform 0.15s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  }
  .wkh-promo-link:hover { background: #00804c; transform: translateY(-1px); }

  /* Divider */
  .wkh-divider {
    border: none;
    border-top: 1px solid #eef2f0;
    margin: 48px 0;
  }

  /* FAQ */
  .wkh-faq-item {
    background: #ffffff;
    border: 1px solid #e6ede9;
    border-radius: 16px;
    padding: 20px 22px;
    margin-bottom: 12px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.015);
    transition: border-color 0.15s ease;
  }
  .wkh-faq-item:hover {
    border-color: #cbd5e1;
  }
  .wkh-faq-q {
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 8px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  .wkh-faq-num {
    flex-shrink: 0;
    background: #eef8f3;
    color: #008751;
    font-size: 12px;
    font-weight: 700;
    width: 24px;
    height: 24px;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1px;
  }
  .wkh-faq-a {
    font-size: 14.5px;
    color: #475569;
    line-height: 1.65;
    margin: 0;
    padding-left: 36px;
  }

  /* Conclusion */
  .wkh-conclusion {
    background: linear-gradient(180deg, #ffffff 0%, #f4fbf7 100%);
    border: 1px solid #d1eedf;
    border-radius: 20px;
    padding: 32px 28px;
    margin-top: 48px;
    box-shadow: 0 2px 8px rgba(0, 152, 91, 0.03);
  }
  .wkh-conclusion h2 {
    font-size: 19px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 10px;
  }
  .wkh-conclusion p {
    font-size: 15px;
    color: #334155;
    line-height: 1.7;
    margin: 0;
  }

  /* Responsive */
  @media (max-width: 640px) {
    .wkh-wrap { padding: 24px 20px 60px; }
    .wkh-hero { padding: 24px 20px; border-radius: 18px; margin-bottom: 30px; }
    .wkh-table th, .wkh-table td { padding: 10px 12px; font-size: 13px; }
    .wkh-audience { padding: 18px 18px; border-radius: 16px; }
  }
`;

// ── Game Modes Cards ──────────────────────────────────────────────────────────
const MODE_CARDS = [
  { icon: <IconZap />,       title: "30 Second (30s)", desc: "Fastest mode (120 draws/hour). Har 30s mein ek new draw. Quick decision-making required." },
  { icon: <IconTimer />,     title: "1 Minute (1Min)", desc: "Most popular mode (60 draws/hour). Analysis aur trend observation ke liye balanced pace." },
  { icon: <IconClock />,     title: "3 Minute (3Min)", desc: "Medium pace (20 draws/hour). Streak observation aur detailed calculation ke liye suited." },
  { icon: <IconHourglass />, title: "5 Min / 10 Min",   desc: "Strategic modes (12/6 draws/hour). Deep pattern research aur variance evaluation ke liye." },
];

// ── How-To Step Items (Synchronized with HowToSchema) ──────────────────────────
const HOWTO_STEPS = [
  {
    name: "Understand the Active Round Timer",
    text: "Check the active draw countdown (30s, 1Min, 3Min, 5Min) to determine available observation and decision windows before the round lock.",
  },
  {
    name: "Examine the Unique Period Number",
    text: "Review the sequential Period identifier (e.g., #20260905001) to verify chronological order and reference earlier streak logs.",
  },
  {
    name: "Identify Number, Colour and BIG/SMALL Outcomes",
    text: "Observe the resulting number (0–9), corresponding colour (Red, Green, Violet), and binary classification (0–4 as SMALL, 5–9 as BIG).",
  },
  {
    name: "Evaluate Streak Patterns with Analytical Tools",
    text: "Use TRION AI pattern analysis and historical trend logs to study distribution data objectively without assuming guaranteed outcomes.",
  },
];

// ── FAQ data ──────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    question: "Wingo kya hai? (What is WinGo?)",
    answer:
      "WinGo ek number-based fast-round game format hai jisme har round ke end par ek result generate hota hai — number (0–9), colour (Red, Green, Violet), aur Big/Small classification ke saath. Players pichle results ko dekhkar patterns analyze kar sakte hain. Results ek random number generator (RNG) se determine hote hain, aur har draw statistically independent hota hai."
  },
  {
    question: "WinGo game mein kaunse round modes hote hain?",
    answer:
      "WinGo platforms par commonly multiple timer modes milte hain: 30 Second (30s), 1 Minute (1Min), 3 Minute (3Min), 5 Minute (5Min), aur 10 Minute (10Min). Shorter periods (30s, 1Min) fast-paced hote hain, jabke longer periods (5Min, 10Min) relatively zyada analysis window dete hain. TRION AI ka Wingo 30 Second Predictor tool fast-mode analysis ke liye optimised hai."
  },
  {
    question: "WinGo mein BIG aur SMALL ka matlab kya hai?",
    answer:
      "WinGo result mein numbers 5 se 9 ko BIG category mein classify kiya jaata hai, aur numbers 0 se 4 ko SMALL category mein. Yeh ek simple binary classification hai jo players ko result history aur streak patterns analyse karne mein help karta hai. BIG/SMALL par approximately 2x payout milta hai."
  },
  {
    question: "WinGo result history kaise useful hai?",
    answer:
      "WinGo result history pichle rounds ke number, colour, aur Big/Small outcomes ka record hota hai. Players is history ko dekhkar streaks, frequency patterns, aur colour runs analyze karte hain. TRION AI platform par live result history aur trend charts available hain. Lekin yeh samajhna zaroori hai ki past history future results guarantee nahi karti — kyunki har draw RNG-based aur independent hai."
  },
  {
    question: "Wingo prediction tools kaise kaam karte hain?",
    answer:
      "AI-based WinGo prediction tools historical result data collect karte hain aur statistical patterns identify karte hain — jaise colour run lengths, Big/Small streaks, aur number frequency. TRION AI ka platform yahi karta hai: live data analysis aur AI-based pattern suggestions, responsibly presented. Lekin koi bhi tool guaranteed future outcomes nahi de sakta, kyunki WinGo ek certified RNG system use karta hai."
  },
  {
    question: "Wingo mein betting options aur odds kya hain?",
    answer:
      "Players teen tarah se bet laga sakte hain: (1) Colour — Red ya Green par 2x payout, Violet par 4.5x payout. (2) Number — 0 se 9 tak kisi bhi number par, jiske odds alag hote hain (9x–9.9x). (3) Big/Small — numbers 5–9 = Big, 0–4 = Small, dono par approximately 2x odds. Violet sirf number 0 aur 5 par aata hai, isliye uska payout zyada hota hai (20% probability)."
  },
  {
    question: "Kya WinGo India mein legal hai?",
    answer:
      "WinGo games ki legality is baat par depend karti hai ki platform kaise operate karta hai aur real-money gaming involved hai ya nahi. India mein online gaming laws alag-alag states mein different hain aur samay ke saath change bhi ho sakte hain. Kisi bhi platform use karne se pehle uske terms, applicable laws aur apne state ke rules zaroor check karein. Informational result/history services aur real-money gaming platforms ko ek jaisa nahi maana jaana chahiye."
  }
];

// ─────────────────────────────────────────────────────────────────────────────

export default function WingoKyaHaiPage() {
  const router = useRouter();

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const nextEl = document.getElementById("__next");

    const prevHtmlOverflow = html.style.overflow;
    const prevHtmlHeight = html.style.height;
    const prevHtmlScrollBehavior = html.style.scrollBehavior;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyHeight = body.style.height;
    const prevNextOverflow = nextEl ? nextEl.style.overflow : "";
    const prevNextHeight = nextEl ? nextEl.style.height : "";

    html.style.overflowY = "auto";
    html.style.height = "auto";
    html.style.scrollBehavior = "smooth";
    body.style.overflowY = "auto";
    body.style.height = "auto";
    if (nextEl) {
      nextEl.style.overflow = "visible";
      nextEl.style.height = "auto";
    }

    return () => {
      html.style.overflow = prevHtmlOverflow;
      html.style.height = prevHtmlHeight;
      html.style.scrollBehavior = prevHtmlScrollBehavior;
      body.style.overflow = prevBodyOverflow;
      body.style.height = prevBodyHeight;
      if (nextEl) {
        nextEl.style.overflow = prevNextOverflow;
        nextEl.style.height = prevNextHeight;
      }
    };
  }, []);

  const PAGE_URL   = "https://wingo30.com/wingo-kya-hai";
  const PAGE_TITLE = "Wingo Kya Hai? WinGo Game Ko Samjhein | TRION AI";
  // Benefit-driven meta description (145 characters, strictly within 110-165 range)
  const PAGE_DESC  =
    "Wingo kya hai? WinGo game format, timer modes, BIG/SMALL rules, result calculation aur TRION AI analysis tools ki complete guide hindi mein janein.";

  return (
    <>
      {/* ── SEO Head ─────────────────────────────────────────────────────── */}
      <PageHead
        title={PAGE_TITLE}
        description={PAGE_DESC}
        canonical={PAGE_URL}
      >
        <meta name="keywords" content="Wingo kya hai, what is wingo game, wingo rules, wingo big small, wingo result history, wingo 30s, wingo prediction tool, TRION AI" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESC} />
        <meta property="og:url" content={PAGE_URL} />
        <link rel="canonical" href={PAGE_URL} />
        <style dangerouslySetInnerHTML={{ __html: bgStyle + smartCardStyles }} />
      </PageHead>

      {/* ── Structured Data (Entity Graph) ───────────────────────────────── */}
      <OrganizationSchema />
      <WebPageSchema
        title={PAGE_TITLE}
        description={PAGE_DESC}
        url={PAGE_URL}
        datePublished="2026-08-20T10:00:00+05:30"
        dateModified="2026-09-05T10:30:00+05:30"
      />
      <ArticleSchema
        title={PAGE_TITLE}
        description={PAGE_DESC}
        url={PAGE_URL}
        image="https://wingo30.com/what-is-wingo-game-guide.webp"
        datePublished="2026-08-20T10:00:00+05:30"
        dateModified="2026-09-05T10:30:00+05:30"
        about={[
          {
            "@type": "Thing",
            "name": "WinGo Game",
            "description": "Fast-round number and color prediction game format based on certified Random Number Generation (RNG)"
          },
          {
            "@type": "Thing",
            "name": "Random Number Generation",
            "sameAs": "https://en.wikipedia.org/wiki/Random_number_generation"
          }
        ]}
      />
      <BreadcrumbSchema items={[
        { name: "Home",          url: "https://wingo30.com/" },
        { name: "Wingo Kya Hai", url: PAGE_URL }
      ]} />
      <HowToSchema
        name="How to Read and Analyze WinGo Game Results"
        description="Step-by-step practical guide to understanding WinGo timers, period numbers, number/color outcomes, and pattern trends."
        steps={HOWTO_STEPS}
      />
      <FAQSchema questions={FAQ_ITEMS} />

      {/* ── Main Semantic Container ──────────────────────────────────────── */}
      <div className="wkh-page-shell">
        <main id="main-content" role="main" className="wkh-wrap">
          <article className="wkh-article" itemScope itemType="https://schema.org/Article">

            {/* Back to Home Button */}
            <button
              className="wkh-back"
              onClick={() => router.push("/")}
              type="button"
              aria-label="Back to Home"
            >
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Home
            </button>

            {/* ── Hero & Headline Section ─────────────────────────────────── */}
            <header className="wkh-hero">
              <div className="wkh-badge">
                <span className="wkh-badge-dot" aria-hidden="true" />
                Complete Game &amp; Analysis Guide
              </div>

              {/* Exact H1 Title Alignment */}
              <h1 className="wkh-h1" itemProp="headline">
                <span className="pink">Wingo Kya Hai?</span> <span className="indigo">WinGo Game Ko Samjhein</span>
              </h1>

              {/* GEO Ownership, Author & Freshness Signal */}
              <div className="wkh-meta-byline">
                <span>Published by <strong itemProp="author">TRION AI Research &amp; Editorial Team</strong></span>
                <span>•</span>
                <span>Technically Reviewed by <strong>Lead Systems Analyst</strong></span>
                <span>•</span>
                <span>Last Updated: <time dateTime="2026-09-05" itemProp="dateModified">September 5, 2026</time></span>
              </div>

              {/* Step 3: Top-Level Quick Answer Box */}
              <div className="wkh-answer-summary" itemProp="description">
                <strong>Quick Answer (WinGo Kya Hai?):</strong> WinGo ek fast-round number aur colour prediction format hai jisme certified Random Number Generator (RNG) se har 30s se 10m ke interval par 0 se 9 tak ka number draw hota hai. Yeh guide beginners, analytical players aur casual enthusiasts ke liye design ki gayi hai taaki aap WinGo game mechanics, timer modes, BIG/SMALL classification aur TRION AI pattern tools ko step-by-step samajh sakein.
              </div>

              {/* Soft Key Takeaway with SVG Icon */}
              <div className="wkh-takeaway">
                <div className="wkh-takeaway-header">
                  <IconKey /> Key Takeaway for Users:
                </div>
                WinGo draws certified PRNG algorithms se generate hote hain aur har round mathematically independent hota hai. Pehle game format, round timing, BIG/SMALL classification aur odds structure ko samjhein. TRION AI analytical tools historical data analyze karte hain, guaranteed results nahi dete.
              </div>

              <div className="wkh-chips">
                {["WinGo Game", "Result History", "BIG / SMALL", "Round Timing", "Colour Prediction", "TRION AI"].map(chip => (
                  <span className="wkh-chip" key={chip}>{chip}</span>
                ))}
              </div>
            </header>

            {/* ── Article Content Body ───────────────────────────────────── */}
            <div className="wkh-body" itemProp="articleBody">

              {/* Guide image 1 with Descriptive Alt and Dimensions */}
              <Image
                src="/what-is-wingo-game-guide.webp"
                alt="What is WinGo game explained with round timing, number 0 to 9, color and Big Small classification guide"
                title="What Is WinGo? WinGo Game Guide"
                width={880}
                height={460}
                className="wkh-guide-img"
                priority
              />
              <p className="wkh-img-caption">Figure 1: What Is WinGo? Complete Structure and Round Mechanics</p>

              <ContentCard type="warning" title="Critical RNG & Fairness Notice">
                WinGo results certified Random Number Generator (RNG) se generate hote hain. Koi bhi prediction tool future outcomes guarantee
                nahi kar sakta. Yeh page sirf informational aur educational exploration ke liye hai. Apni zimmedari par play karein.
              </ContentCard>

              {/* ── Dedicated Target Audience, Industry Context & Use-Case Card (Soft UI & SVG Icons) ── */}
              <div className="wkh-audience" id="audience-and-use-cases">
                <div className="wkh-audience-title">
                  <IconUsers /> Target Audience, Industry Context &amp; Core Use Cases
                </div>
                <div className="wkh-audience-grid">
                  <div className="wkh-audience-card">
                    <div className="wkh-audience-card-header">
                      <IconTarget /> Target Audience (Yeh Content Kiske Liye Hai?):
                    </div>
                    <p>Beginners jo WinGo game format aur RNG rules pehli baar samajh rahe hain, active players jo 30s–5m timing modes evaluate kar rahe hain, aur data analysts jo historical streak patterns study karte hain.</p>
                  </div>
                  <div className="wkh-audience-card">
                    <div className="wkh-audience-card-header">
                      <IconBuilding /> Industry Context &amp; Category:
                    </div>
                    <p>Online statistical gaming analytics, Pseudo-Random Number Generation (PRNG) research, and fast-round mathematical probability models.</p>
                  </div>
                  <div className="wkh-audience-card">
                    <div className="wkh-audience-card-header">
                      <IconLightbulb /> Primary Use Cases (Key Use Cases Supported):
                    </div>
                    <p>1) Understanding period numbers and round intervals (30s to 5Min). 2) Analyzing BIG/SMALL and Colour payout odds. 3) Cross-referencing draw histories with TRION AI algorithmic signal tools.</p>
                  </div>
                  <div className="wkh-audience-card">
                    <div className="wkh-audience-card-header">
                      <IconClock /> When to Use This Advice (Usage Timing):
                    </div>
                    <p>WinGo platform par kisi bhi draw mode mein participate karne se pehle, historical streak trends verify karte samay, aur disciplined bankroll boundaries set karte waqt.</p>
                  </div>
                  <div className="wkh-audience-card">
                    <div className="wkh-audience-card-header">
                      <IconScale /> Decision Context (Decision Guidance):
                    </div>
                    <p>30-Second fast mode (high frequency, 120 draws/hr) chunein ya 5-Minute strategic mode (low frequency, 12 draws/hr) chunein — apni analysis capacity aur risk preference ke anusar.</p>
                  </div>
                </div>
              </div>

              {/* ── Section 1: Question-Style Heading H2 ─────────────────── */}
              <section className="wkh-section">
                <h2>Wingo Kya Hai?</h2>
                <p className="wkh-section-sub">Game format, core components aur conceptual definition</p>

                <div className="wkh-direct-answer">
                  <strong>Direct answer:</strong> WinGo ek digital number-based prediction game format hai jisme har fixed round duration ke baad 0 se 9 ke beech ek random outcome number draw hota hai. Har number ke sath uska specific colour (Red, Green ya Violet) aur category (BIG ya SMALL) associate hoti hai.
                </div>

                <h3>WinGo Game Ka Basic Definition Aur Core Concept Kya Hai?</h3>
                <p>
                  WinGo game ek fast-round draw system par operate karta hai. Har round ka ek unique <strong>Period Number</strong> hota hai jo public result ledger mein chronologically record hota hai. Is format ki sabse badi khasiyat iska fast pace aur structured classification hai — jahan players outcomes ko mathematical probability aur historical distribution ke sath analyze kar sakte hain.
                </p>
                <p>
                  <strong>TRION AI</strong> ek third-party analytical platform hai jo is game data ko live tracking, historical trend charts aur pattern recognition models ke roop mein users ke samne present karta hai.
                </p>
              </section>

              <hr className="wkh-divider" />

              {/* ── Section 2: Question-Style Heading H2 ─────────────────── */}
              <section className="wkh-section">
                <h2>Wingo Game Kaise Khela Jata Hai?</h2>
                <p className="wkh-section-sub">Round cycle, selection process aur draw execution</p>

                <div className="wkh-direct-answer">
                  <strong>Direct answer:</strong> WinGo khelne ke liye player active round timer ke dauran colour (Red/Green/Violet), number (0–9), ya BIG/SMALL category select karta hai. Round countdown end hone par certified algorithm result generate karta hai aur matching selections par pre-defined odds ke hisaab se payout milta hai.
                </div>

                <h3>Har Round Ka Draw Process Step-by-Step Kaise Hota Hai?</h3>
                <p>
                  Har WinGo round ek structured 3-step cycle mein pura hota hai:
                </p>
                <ol className="wkh-steps-list">
                  <li className="wkh-step-item">
                    <div className="wkh-step-num">1</div>
                    <div>
                      <div className="wkh-step-title">Active Selection Window</div>
                      <div className="wkh-step-desc">Round shuru hone par countdown chalta hai jahan user options (Number, Colour, Big/Small) choose karta hai.</div>
                    </div>
                  </li>
                  <li className="wkh-step-item">
                    <div className="wkh-step-num">2</div>
                    <div>
                      <div className="wkh-step-title">Lockout &amp; RNG Computation</div>
                      <div className="wkh-step-desc">Round ke last 5 seconds mein selections lock ho jaate hain aur certified algorithm ek random number choose karta hai.</div>
                    </div>
                  </li>
                  <li className="wkh-step-item">
                    <div className="wkh-step-num">3</div>
                    <div>
                      <div className="wkh-step-title">Result Publication &amp; Ledger Update</div>
                      <div className="wkh-step-desc">Final number, colour aur Big/Small classification public screen par reveal hoti hai aur table update hota hai.</div>
                    </div>
                  </li>
                </ol>
              </section>

              <hr className="wkh-divider" />

              {/* ── Section 3: Question-Style Heading H2 ─────────────────── */}
              <section className="wkh-section">
                <h2>Wingo Mein Result Kaise Decide Hota Hai?</h2>
                <p className="wkh-section-sub">Certified Random Number Generation, draw independence aur classification rules</p>

                <div className="wkh-direct-answer">
                  <strong>Direct answer:</strong> WinGo results ek certified Pseudo-Random Number Generator (PRNG) ke through mathematically determine hote hain. Draw hone wala number hi decide karta hai ki outcome Red, Green, ya Violet hoga aur BIG (5–9) ya SMALL (0–4) category mein aayega.
                </div>

                {/* Proof & Real Data Walkthrough Example (GEO Benchmark) */}
                <div className="wkh-example-box">
                  <div className="wkh-example-header">
                    <IconCheckCircle /> Real-World Result Ledger Example (Sample Round):
                  </div>
                  <div className="wkh-example-grid">
                    <div className="wkh-example-item">
                      <span className="label">Period Number:</span>
                      <span className="value">#20260905001</span>
                    </div>
                    <div className="wkh-example-item">
                      <span className="label">Result Number:</span>
                      <span className="value">7</span>
                    </div>
                    <div className="wkh-example-item">
                      <span className="label">Colour Outcome:</span>
                      <span className="value" style={{ color: "#dc2626" }}>Red</span>
                    </div>
                    <div className="wkh-example-item">
                      <span className="label">Classification:</span>
                      <span className="value">BIG (5–9)</span>
                    </div>
                  </div>
                </div>

                {/* Guide image 2 with Descriptive Alt and Dimensions */}
                <Image
                  src="/wingo-round-result-history-guide.webp"
                  alt="WinGo round and result history diagram showing period number, winning number, color and streak pattern"
                  title="How WinGo Round and Result History Works"
                  width={880}
                  height={460}
                  className="wkh-guide-img"
                />
                <p className="wkh-img-caption">Figure 2: Structure of WinGo Period History and Round Outcomes</p>

                <h3>Random Number Generator (RNG) Se Result Kaise Generate Hota Hai?</h3>
                <p>
                  Random Number Generator (RNG) systems ke technical standards ke baare mein detailed reference ke liye padhein:{" "}
                  <a href="https://en.wikipedia.org/wiki/Random_number_generation" target="_blank" rel="noopener noreferrer" className="wkh-ext-link">
                    Wikipedia — Random Number Generation (RNG)
                  </a>. WinGo jaise standard digital formats certified PRNG algorithms use karte hain jahan har draw statistically independent hota hai — yani pichla outcome aage aane wale draw ke outcome ko mathematically force nahi karta.
                </p>
              </section>

              <hr className="wkh-divider" />

              {/* ── Section 4: Question-Style Heading H2 ─────────────────── */}
              <section className="wkh-section">
                <h2>Wingo Game Mein Kaunse Features Aur Timer Modes Hote Hain?</h2>
                <p className="wkh-section-sub">Timer intervals, draw frequencies aur analysis tools</p>

                <div className="wkh-direct-answer">
                  <strong>Direct answer:</strong> WinGo game mein 4 main timer intervals (30s, 1Min, 3Min, 5Min), real-time history charts, streak tracking, hot/cold number stats aur multiple betting combinations (Colour, Exact Number, BIG/SMALL) available hote hain.
                </div>

                <h3>WinGo 30s, 1Min, 3Min Aur 5Min Timer Modes Mein Kya Antar Hai?</h3>
                <p>
                  Alag-alag timer modes players ko unki preferred calculation speed ke anusar flexibility dete hain:
                </p>

                <div className="wkh-cards">
                  {MODE_CARDS.map(c => (
                    <div className="wkh-card" key={c.title}>
                      <div className="wkh-icon-badge">{c.icon}</div>
                      <div className="wkh-card-title">{c.title}</div>
                      <div className="wkh-card-desc">{c.desc}</div>
                    </div>
                  ))}
                </div>

                {/* Trion AI promo */}
                <div className="wkh-promo">
                  <div className="wkh-promo-title">
                    <IconGlobe /> TRION AI — WinGo Analysis &amp; Prediction Platform
                  </div>
                  <ul className="wkh-promo-list">
                    <li>
                      <span className="icon-wrap"><IconZap /></span>
                      Fast &amp; easy-to-use Wingo analytical dashboards
                    </li>
                    <li>
                      <span className="icon-wrap"><IconBarChart /></span>
                      Live Wingo result history &amp; real-time trend charts
                    </li>
                    <li>
                      <span className="icon-wrap"><IconBot /></span>
                      AI-based pattern suggestion models (Korven &amp; FX1)
                    </li>
                    <li>
                      <span className="icon-wrap"><IconWrench /></span>
                      Multiple analysis utilities in one synchronized suite
                    </li>
                  </ul>
                  <a className="wkh-promo-link" href="https://wingo30.com" target="_blank" rel="noopener noreferrer">
                    Visit Wingo30.com Official <IconArrowRight />
                  </a>
                </div>
              </section>

              <hr className="wkh-divider" />

              {/* ── Section 5: Question-Style Heading H2 ─────────────────── */}
              <section className="wkh-section">
                <h2>Wingo Khelne Se Pehle Kin Baaton Ka Dhyan Rakhna Chahiye?</h2>
                <p className="wkh-section-sub">Mathematical odds, probability distribution aur risk management</p>

                <div className="wkh-direct-answer">
                  <strong>Direct answer:</strong> WinGo khelne se pehle mathematical odds, probabilities (Big/Small 50%, Violet 20%, Number 10%), RNG draw independence aur responsible budget limits ko samajhna sabse zaruri hai. Koi bhi tool 100% guaranteed outcome nahi de sakta.
                </div>

                {/* Guide image 3 with Descriptive Alt and Dimensions */}
                <Image
                  src="/wingo-big-vs-small-result-classification.webp"
                  alt="WinGo BIG vs SMALL result classification chart showing numbers 5 to 9 as Big and numbers 0 to 4 as Small"
                  title="WinGo BIG vs SMALL Result Classification"
                  width={880}
                  height={460}
                  className="wkh-guide-img"
                />
                <p className="wkh-img-caption">Figure 3: WinGo BIG vs SMALL – Binary Classification &amp; Number Ranges</p>

                <h3>BIG Aur SMALL Numbers Ka Distribution Aur Payout Odds Kya Hain?</h3>
                <p>
                  WinGo format mein har bet type ki exact mathematical probability aur payout ratio:
                </p>

                {/* Structured Comparison Table (AEO / GEO) */}
                <table className="wkh-table">
                  <thead>
                    <tr>
                      <th>Bet Type</th>
                      <th>Options</th>
                      <th>Probability</th>
                      <th>Payout (Approx.)</th>
                      <th>Winning Condition</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Colour (Pure)</td>
                      <td><span className="pill-red">Red</span> / <span className="pill-green">Green</span></td>
                      <td>~40% (pure)</td>
                      <td>2x</td>
                      <td>Number 1,3,7,9 = Red; 2,4,6,8 = Green</td>
                    </tr>
                    <tr>
                      <td>Colour (Violet)</td>
                      <td><span className="pill-violet">Violet</span></td>
                      <td>20%</td>
                      <td>4.5x</td>
                      <td>Only on numbers 0 or 5 (split)</td>
                    </tr>
                    <tr>
                      <td>Number Match</td>
                      <td>0–9 (Exact)</td>
                      <td>10%</td>
                      <td>9x – 9.9x</td>
                      <td>Exact single number match required</td>
                    </tr>
                    <tr>
                      <td>Big / Small</td>
                      <td>Big (5–9) / Small (0–4)</td>
                      <td>50%</td>
                      <td>~2x</td>
                      <td>Result falls in 0–4 (Small) or 5–9 (Big)</td>
                    </tr>
                  </tbody>
                </table>

                <ContentCard type="key-point" title="Violet Payout vs. Probability Calculation">
                  Violet ka <strong>4.5x payout</strong> isliye zyada hota hai kyunki woh sirf 2 numbers (0 aur 5) par
                  aata hai — yani 10 mein se sirf 2 numbers (20% mathematical probability). Higher potential payout hamesha higher mathematical variance ke saath aata hai.
                </ContentCard>

                <h3>TRION AI Ke WinGo Prediction Aur Analysis Tools Kaise Kaam Karte Hain?</h3>
                <p>
                  Agar aap game format samajh gaye hain aur structured data analysis tools explore karna chahte hain, toh in dedicated resources ko dekhein:
                </p>

                {/* High-Intent Internal Content Links with Descriptive Anchors */}
                <ul className="wkh-link-list">
                  <li>
                    <IconArrowRight />
                    <div>
                      <Link href="/wingo-ai-prediction">Explore the Wingo AI Prediction Tool</Link> — AI-driven statistical pattern analysis and confidence score engine.
                    </div>
                  </li>
                  <li>
                    <IconArrowRight />
                    <div>
                      <Link href="/wingo-tool">Access the Wingo Master Calculator</Link> — Advanced mathematical odds calculation and streak probability analyzer.
                    </div>
                  </li>
                  <li>
                    <IconArrowRight />
                    <div>
                      <Link href="/wingosignal">Check the Live Wingo Signal Tracker</Link> — Real-time period update tracker and streak momentum radar.
                    </div>
                  </li>
                  <li>
                    <IconArrowRight />
                    <div>
                      <Link href="/wingo30">Use the Dedicated Wingo 30 Second Predictor</Link> — Optimized analytics specifically designed for the 30-second rapid mode.
                    </div>
                  </li>
                  <li>
                    <IconArrowRight />
                    <div>
                      <Link href="/wingotips">Read WinGo Tips &amp; Analysis Strategies</Link> — Responsible bankroll management rules and disciplined data analysis methods.
                    </div>
                  </li>
                </ul>

                <p className="wkh-source">
                  Probability theory and independent event modeling ke mathematical foundation ke liye dekhein:{" "}
                  <a href="https://en.wikipedia.org/wiki/Probability_theory" target="_blank" rel="noopener noreferrer" className="wkh-ext-link">
                    Wikipedia — Probability Theory &amp; Independent Trials
                  </a>.
                </p>

                <ContentCard type="important" title="Legal & Compliance Notice">
                  Real-money gaming platforms aur informational/analytical platforms (jaise result history ya prediction tools) ko alag category mein maana
                  jaata hai. Kisi bhi platform ko use karne se pehle uske terms of service padh lein aur apne state ke applicable laws check karein.
                </ContentCard>
              </section>

              <hr className="wkh-divider" />

              {/* ── Section 6: Question-Style Heading H2 ─────────────────── */}
              <section className="wkh-section">
                <h2>Wingo Ke Baare Mein Frequently Asked Questions Kya Hain?</h2>
                <p className="wkh-section-sub">WinGo game ke baare mein sabse common questions ke clear, direct jawab</p>

                {FAQ_ITEMS.map((item, i) => (
                  <div className="wkh-faq-item" key={i}>
                    <p className="wkh-faq-q">
                      <span className="wkh-faq-num" aria-hidden="true">{i + 1}</span>
                      {item.question}
                    </p>
                    <p className="wkh-faq-a">{item.answer}</p>
                  </div>
                ))}
              </section>

              {/* ── Section 7: Question-Style Heading H2 ─────────────────── */}
              <div className="wkh-conclusion">
                <h2>Wingo Game Ka Summary Aur Conclusion Kya Hai?</h2>
                <p>
                  <strong>Wingo kya hai</strong> — is sawaal ka jawab ab poori tarah clear hai: WinGo ek
                  RNG-based fast-round game format hai jisme har round ke end par ek number result generate hota hai — colour aur BIG/SMALL classification ke saath. Game ka structure samajhna — round timing, result history, BIG/SMALL classification, aur prediction tools ka purpose — ek informed user ke liye pehla step hai.
                  TRION AI ka platform — <a href="https://wingo30.com" target="_blank" rel="noopener noreferrer" style={{ color: "#00804c", fontWeight: 700, textDecoration: "underline" }}>Wingo30.com</a> — is game ko data ke saath approach karne mein help karta hai, lekin koi bhi tool guaranteed outcomes nahi de sakta. Informed raho, responsibly analyze karo.
                </p>
              </div>

            </div>
          </article>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
