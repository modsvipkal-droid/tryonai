import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { PageHead, BreadcrumbSchema, WebPageSchema, OrganizationSchema } from "@/components/SEO";
import SiteFooter from "@/components/SiteFooter";

/* ─────────────────────────────────────────────────────────────────────────────
   SCOPED STYLES — TrionAIAbout typography, soft SaaS design & responsive tokens
───────────────────────────────────────────────────────────────────────────── */
const disclaimerStyles = `
  @font-face {
    font-family: 'TrionAIAbout';
    src: url('/fonts/trionAIabout.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  *, *::before, *::after {
    box-sizing: border-box;
    font-family: 'TrionAIAbout', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  }

  html {
    scroll-behavior: smooth !important;
    -webkit-overflow-scrolling: touch !important;
    height: auto !important;
    min-height: 100% !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    font-family: 'TrionAIAbout', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  }

  body {
    background: #eef7f3 !important;
    color: #17251f !important;
    font-family: 'TrionAIAbout', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
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
    font-family: 'TrionAIAbout', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  }

  /* Page wrapper */
  .disc-page {
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
    font-family: 'TrionAIAbout', sans-serif !important;
  }

  .disc-page::before {
    content: '';
    position: fixed;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background:
      radial-gradient(ellipse at 25% 15%, rgba(0, 152, 91, 0.06) 0%, transparent 50%),
      radial-gradient(ellipse at 75% 85%, rgba(16, 185, 129, 0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  /* Floating Orbs */
  .disc-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.16;
    pointer-events: none;
    z-index: 0;
    animation: discFloatOrb 16s ease-in-out infinite alternate;
  }
  .disc-orb-1 {
    width: 400px;
    height: 400px;
    background: #00985b;
    top: -100px;
    right: -100px;
  }
  .disc-orb-2 {
    width: 320px;
    height: 320px;
    background: #10b981;
    bottom: 80px;
    left: -80px;
    animation-delay: -6s;
  }
  @keyframes discFloatOrb {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(25px, 32px) scale(1.06); }
  }

  /* Sticky Top Nav */
  .disc-nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(255, 255, 255, 0.94);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(0, 152, 91, 0.14);
    padding: 14px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 2px 14px rgba(0, 75, 47, 0.03);
  }
  .disc-nav-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #007543;
    font-weight: 700;
    font-size: 13.5px;
    cursor: pointer;
    background: rgba(0, 152, 91, 0.08);
    border: 1px solid rgba(0, 152, 91, 0.22);
    padding: 7px 18px;
    border-radius: 50px;
    outline: none;
    transition: all 0.22s ease;
    font-family: 'TrionAIAbout', sans-serif !important;
    text-decoration: none;
  }
  .disc-nav-back:hover, .disc-nav-back:focus-visible {
    background: #00985b;
    border-color: #00985b;
    color: #ffffff;
    transform: translateX(-2px);
    box-shadow: 0 4px 14px rgba(0, 152, 91, 0.22);
  }
  .disc-nav-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(0, 152, 91, 0.08);
    border: 1px solid rgba(0, 152, 91, 0.22);
    color: #007543;
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 50px;
  }

  /* Main Container */
  .disc-container {
    max-width: 980px;
    width: 100%;
    margin: 32px auto 0;
    padding: 0 24px 48px;
    position: relative;
    z-index: 1;
    animation: discFadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
    flex: 1 0 auto;
  }
  @keyframes discFadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Breadcrumb */
  .disc-breadcrumb {
    padding: 0 0 18px 0;
    font-size: 13px;
    color: #64748b;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .disc-breadcrumb-a {
    color: #007543;
    text-decoration: none;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: color 0.2s;
  }
  .disc-breadcrumb-a:hover {
    color: #00985b;
    text-decoration: underline;
  }
  .disc-breadcrumb-sep {
    color: #94a3b8;
    display: flex;
    align-items: center;
  }
  .disc-breadcrumb-current {
    color: #334155;
    font-weight: 600;
  }

  /* Hero */
  .disc-hero {
    text-align: center;
    margin-bottom: 38px;
    padding-top: 4px;
  }
  .disc-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: rgba(0, 152, 91, 0.09);
    border: 1px solid rgba(0, 152, 91, 0.24);
    color: #007543;
    font-size: 11.5px;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 6px 16px;
    border-radius: 50px;
    margin-bottom: 16px;
  }
  .disc-eyebrow-dot {
    width: 6px;
    height: 6px;
    background: #00985b;
    border-radius: 50%;
  }
  .disc-hero h1 {
    font-size: clamp(30px, 5vw, 44px);
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 12px 0;
    letter-spacing: -0.025em;
    line-height: 1.18;
  }
  .disc-hero-sub {
    font-size: clamp(14.5px, 2vw, 16px);
    color: #475569;
    max-width: 680px;
    margin: 0 auto;
    line-height: 1.72;
    font-weight: 400;
  }

  /* Notice Card */
  .disc-notice-card {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.22);
    border-left: 4px solid #00985b;
    border-radius: 18px;
    padding: 26px 30px;
    margin-bottom: 22px;
    box-shadow: 0 4px 18px rgba(0, 75, 47, 0.04);
  }
  .disc-notice-head {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
  }
  .disc-notice-icon-box {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(0, 152, 91, 0.1);
    color: #007543;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .disc-notice-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #00985b;
    color: #ffffff;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 50px;
  }
  .disc-notice-title {
    font-size: 17.5px;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
  }
  .disc-notice-text {
    font-size: 15px;
    line-height: 1.74;
    color: #244136;
    margin: 0;
    font-weight: 500;
  }

  /* Section Card */
  .disc-card {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.16);
    border-radius: 18px;
    padding: 28px 32px;
    margin-bottom: 20px;
    box-shadow: 0 4px 18px rgba(0, 75, 47, 0.035), 0 1px 3px rgba(0, 0, 0, 0.02);
    transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
  }
  .disc-card:hover {
    border-color: rgba(0, 152, 91, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 75, 47, 0.07);
  }

  /* Section Card Title Header */
  .disc-section-head {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }
  .disc-icon-badge {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(0, 152, 91, 0.08);
    border: 1px solid rgba(0, 152, 91, 0.2);
    color: #007543;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .disc-icon-badge.disc-icon-alert {
    background: rgba(220, 38, 38, 0.08);
    border-color: rgba(220, 38, 38, 0.2);
    color: #dc2626;
  }
  h2.disc-section-title {
    font-size: 18.5px;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
    line-height: 1.35;
    letter-spacing: -0.01em;
  }

  /* Body text */
  p.disc-p {
    font-size: 15px;
    line-height: 1.76;
    color: #334155;
    margin: 0 0 14px 0;
  }
  p.disc-p:last-child {
    margin-bottom: 0;
  }
  p.disc-p strong {
    color: #0f172a;
    font-weight: 700;
  }

  /* Highlight callout box */
  .disc-highlight {
    background: rgba(0, 152, 91, 0.06);
    border-left: 3.5px solid #00985b;
    border-radius: 0 12px 12px 0;
    padding: 14px 18px;
    margin: 16px 0;
    font-size: 15px;
    font-weight: 700;
    color: #005537;
    line-height: 1.6;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .disc-highlight svg {
    flex-shrink: 0;
    color: #00985b;
  }

  /* Modern SVG Feature List (Green Theme) */
  ul.disc-svg-list {
    margin: 14px 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  ul.disc-svg-list li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 14.5px;
    line-height: 1.65;
    color: #334155;
  }
  .disc-list-icon {
    width: 20px;
    height: 20px;
    border-radius: 6px;
    background: rgba(0, 152, 91, 0.1);
    color: #007543;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
  }

  /* Modern SVG Cross-List (Negative / What TRION AI does NOT do) */
  ul.disc-cross-grid {
    margin: 14px 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  ul.disc-cross-grid li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 14.5px;
    line-height: 1.65;
    color: #334155;
    padding: 10px 14px;
    border-radius: 10px;
    background: rgba(248, 113, 113, 0.04);
    border: 1px solid rgba(248, 113, 113, 0.14);
    transition: background 0.2s;
  }
  ul.disc-cross-grid li:hover {
    background: rgba(248, 113, 113, 0.08);
  }
  .disc-cross-icon {
    width: 20px;
    height: 20px;
    border-radius: 6px;
    background: rgba(220, 38, 38, 0.12);
    color: #dc2626;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }

  /* Modern Checklist with SVG (User Responsibilities) */
  ul.disc-check-grid {
    margin: 14px 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  ul.disc-check-grid li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 14.5px;
    line-height: 1.65;
    color: #334155;
    padding: 10px 14px;
    border-radius: 10px;
    background: rgba(0, 152, 91, 0.04);
    border: 1px solid rgba(0, 152, 91, 0.12);
    transition: background 0.2s;
  }
  ul.disc-check-grid li:hover {
    background: rgba(0, 152, 91, 0.08);
  }
  .disc-check-icon {
    width: 20px;
    height: 20px;
    border-radius: 6px;
    background: rgba(0, 152, 91, 0.12);
    color: #007543;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }

  /* Modern Security List with SVG */
  ul.disc-security-grid {
    margin: 14px 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  ul.disc-security-grid li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 14.5px;
    line-height: 1.65;
    color: #334155;
    padding: 10px 14px;
    border-radius: 10px;
    background: rgba(15, 23, 42, 0.02);
    border: 1px solid rgba(0, 152, 91, 0.12);
    transition: background 0.2s;
  }
  ul.disc-security-grid li:hover {
    background: rgba(0, 152, 91, 0.05);
  }
  .disc-security-icon {
    width: 20px;
    height: 20px;
    border-radius: 6px;
    background: rgba(0, 152, 91, 0.1);
    color: #007543;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }

  /* Flow visual diagram (Correct vs Incorrect) */
  .disc-flow {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    margin: 16px 0;
    background: rgba(0, 152, 91, 0.05);
    border: 1px solid rgba(0, 152, 91, 0.18);
    border-radius: 12px;
    padding: 14px 18px;
  }
  .disc-flow-label {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 800;
    color: #007543;
    background: rgba(0, 152, 91, 0.12);
    padding: 4px 10px;
    border-radius: 50px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-right: 4px;
  }
  .disc-flow-step {
    font-size: 13.5px;
    font-weight: 700;
    color: #005537;
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.22);
    padding: 6px 14px;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 75, 47, 0.04);
  }
  .disc-flow-arrow {
    display: flex;
    align-items: center;
    color: #00985b;
  }

  .disc-not-flow {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    margin: 12px 0 0;
    background: rgba(248, 113, 113, 0.05);
    border: 1px solid rgba(248, 113, 113, 0.18);
    border-radius: 12px;
    padding: 14px 18px;
  }
  .disc-not-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 800;
    background: #dc2626;
    color: #ffffff;
    padding: 4px 10px;
    border-radius: 50px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-right: 4px;
  }
  .disc-not-flow-step {
    font-size: 13.5px;
    font-weight: 700;
    color: #7f1d1d;
    background: #ffffff;
    border: 1px solid rgba(248, 113, 113, 0.22);
    padding: 6px 14px;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(220, 38, 38, 0.04);
  }
  .disc-not-flow-arrow {
    display: flex;
    align-items: center;
    color: #dc2626;
  }

  /* Analytics ≠ Certainty Callout Box */
  .disc-certainty-box {
    margin: 18px 0 0;
    padding: 16px 22px;
    background: rgba(0, 152, 91, 0.06);
    border: 1.5px solid rgba(0, 152, 91, 0.22);
    border-radius: 14px;
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
  }
  .disc-certainty-lhs {
    font-size: 20px;
    font-weight: 800;
    color: #00985b;
  }
  .disc-certainty-neq {
    font-size: 24px;
    color: #dc2626;
    font-weight: 900;
    line-height: 1;
  }
  .disc-certainty-rhs {
    font-size: 20px;
    font-weight: 800;
    color: #334155;
  }

  /* Age 18+ Badge Box with SVG */
  .disc-age-box {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: #0f172a;
    border: 1.5px solid #10b981;
    border-radius: 12px;
    padding: 10px 20px;
    margin: 14px 0;
    font-weight: 800;
    font-size: 14.5px;
    color: #10b981;
    letter-spacing: 0.03em;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  }
  .disc-age-icon-svg {
    display: inline-flex;
    align-items: center;
    color: #10b981;
  }

  /* Summary Card (In Simple Terms) */
  .disc-summary-card {
    background: #0f172a;
    border: 1px solid rgba(16, 185, 129, 0.25);
    border-radius: 18px;
    padding: 30px 34px;
    margin-bottom: 22px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.14);
  }
  .disc-summary-title {
    font-size: 12px;
    font-weight: 800;
    color: #10b981;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .disc-summary-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .disc-summary-row {
    display: grid;
    grid-template-columns: 200px 20px 1fr;
    align-items: start;
    gap: 8px;
  }
  .disc-summary-key {
    font-size: 14px;
    font-weight: 700;
    color: #10b981;
  }
  .disc-summary-eq {
    font-size: 14px;
    font-weight: 700;
    color: #64748b;
    text-align: center;
  }
  .disc-summary-val {
    font-size: 14px;
    color: #cbd5e1;
    font-weight: 500;
    line-height: 1.5;
  }

  /* Related Policies Grid */
  .disc-policy-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 14px;
    margin-top: 14px;
  }
  .disc-policy-link {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.18);
    border-radius: 14px;
    padding: 16px 18px;
    transition: all 0.22s ease;
    box-shadow: 0 2px 10px rgba(0, 75, 47, 0.03);
  }
  .disc-policy-link:hover, .disc-policy-link:focus-visible {
    border-color: #00985b;
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 152, 91, 0.12);
  }
  .disc-policy-head {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14.5px;
    font-weight: 700;
    color: #007543;
    margin-bottom: 6px;
  }
  .disc-policy-icon-box {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: rgba(0, 152, 91, 0.09);
    color: #007543;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .disc-policy-link-desc {
    font-size: 12.5px;
    color: #64748b;
    line-height: 1.5;
    margin: 0;
  }

  /* Footer Notice */
  .disc-footer-notice {
    margin-top: 14px;
    padding: 20px 26px;
    background: rgba(0, 152, 91, 0.06);
    border: 1px solid rgba(0, 152, 91, 0.2);
    border-radius: 16px;
    text-align: center;
    color: #334155;
    font-size: 14px;
    line-height: 1.72;
    font-weight: 400;
  }
  .disc-last-updated {
    text-align: center;
    font-size: 13px;
    color: #94a3b8;
    margin-top: 18px;
    font-weight: 500;
  }

  /* Inline links */
  .disc-inline-link {
    color: #007543;
    text-decoration: underline;
    font-weight: 600;
    transition: color 0.2s;
  }
  .disc-inline-link:hover, .disc-inline-link:focus-visible {
    color: #00985b;
  }

  /* Responsive Balance */
  @media (max-width: 640px) {
    .disc-nav { padding: 10px 16px; }
    .disc-container { padding: 0 16px 36px; margin-top: 20px; }
    .disc-card { padding: 22px 18px; border-radius: 16px; margin-bottom: 16px; }
    .disc-notice-card { padding: 20px 18px; border-radius: 16px; }
    .disc-hero h1 { font-size: 26px; }
    .disc-hero-sub { font-size: 14px; }
    h2.disc-section-title { font-size: 16.5px; }
    p.disc-p { font-size: 14px; }
    ul.disc-svg-list li,
    ul.disc-cross-grid li,
    ul.disc-check-grid li,
    ul.disc-security-grid li { font-size: 13.5px; padding: 8px 12px; }
    .disc-summary-card { padding: 22px 18px; border-radius: 16px; }
    .disc-summary-row { grid-template-columns: 1fr; gap: 4px; }
    .disc-summary-eq { display: none; }
    .disc-summary-val::before { content: '= '; color: #64748b; font-weight: 700; }
    .disc-policy-grid { grid-template-columns: 1fr; }
    .disc-flow, .disc-not-flow { padding: 12px 14px; gap: 8px; }
    .disc-certainty-box { flex-direction: column; align-items: flex-start; gap: 4px; padding: 14px 16px; }
    .disc-certainty-lhs, .disc-certainty-rhs { font-size: 17px; }
    .disc-certainty-neq { font-size: 20px; }
  }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   REUSABLE SVG ICONS (Clean, strokeWidth 2, matching scale)
───────────────────────────────────────────────────────────────────────────── */
const Icons = {
  BackArrow: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  ChevronRight: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Shield: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  ShieldAlert: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  AlertTriangle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Cpu: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  ),
  Ban: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  ),
  Activity: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  History: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  ),
  Database: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  Globe: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  LinkIcon: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  UserCheck: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <polyline points="17 11 19 13 23 9" />
    </svg>
  ),
  Scale: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z" />
      <path d="M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h18" />
    </svg>
  ),
  Lock: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Smartphone: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  FileText: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Info: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  Mail: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Check: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  CheckCircle: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  XIcon: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  ArrowRight: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  EighteenPlus: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 8v8" />
      <circle cx="16" cy="10" r="2" />
      <circle cx="16" cy="14" r="2" />
      <path d="M12 8v2m-1-1h2" />
    </svg>
  ),
};

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function DisclaimerPage() {
  const router = useRouter();

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const next = document.getElementById("__next");

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

    try { sessionStorage.setItem("trion_intro_seen", "1"); } catch {}

    return () => {
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
    try { sessionStorage.setItem("trion_intro_seen", "1"); } catch {}
    router.push("/");
  };

  const PAGE_URL   = "https://wingo30.com/disclaimer";
  const PAGE_TITLE = "Disclaimer & Legal Notice | TRION AI";
  const PAGE_DESC  =
    "Read the TRION AI disclaimer covering analytics, historical data, predictions, third-party services, user responsibility, applicable laws and responsible use.";

  return (
    <>
      {/* SEO HEAD */}
      <PageHead title={PAGE_TITLE} description={PAGE_DESC} canonical={PAGE_URL}>
        <style dangerouslySetInnerHTML={{ __html: disclaimerStyles }} />
      </PageHead>

      {/* STRUCTURED DATA */}
      <BreadcrumbSchema items={[
        { name: "Home",       url: "https://wingo30.com/" },
        { name: "Disclaimer", url: PAGE_URL },
      ]} />
      <WebPageSchema
        title={PAGE_TITLE}
        description={PAGE_DESC}
        url={PAGE_URL}
        datePublished="2026-09-13"
        dateModified="2026-09-13"
      />
      <OrganizationSchema />

      {/* PAGE */}
      <div className="disc-page">
        <div className="disc-orb disc-orb-1" aria-hidden="true" />
        <div className="disc-orb disc-orb-2" aria-hidden="true" />

        {/* TOP STICKY NAV */}
        <nav className="disc-nav" aria-label="Page navigation">
          <button
            id="disc-back-home"
            className="disc-nav-back"
            onClick={handleBack}
            type="button"
            aria-label="Go back to home page"
          >
            <Icons.BackArrow />
            Back to Home
          </button>
          <span className="disc-nav-pill">
            <Icons.Shield />
            Legal &amp; Transparency
          </span>
        </nav>

        {/* MAIN CONTAINER */}
        <main id="main-content" className="disc-container">

          {/* BREADCRUMB */}
          <nav aria-label="Breadcrumb" className="disc-breadcrumb">
            <Link href="/" className="disc-breadcrumb-a">Home</Link>
            <span className="disc-breadcrumb-sep" aria-hidden="true">
              <Icons.ChevronRight />
            </span>
            <span className="disc-breadcrumb-current" aria-current="page">Disclaimer</span>
          </nav>

          {/* HERO */}
          <header className="disc-hero">
            <div className="disc-eyebrow" aria-label="Section: Legal and Transparency">
              <span className="disc-eyebrow-dot" aria-hidden="true" />
              Legal &amp; Transparency
            </div>
            <h1>Disclaimer</h1>
            <p className="disc-hero-sub">
              Important information about TRION AI, its analytical tools, third-party services,
              historical data, predictions and user responsibilities.
            </p>
          </header>

          {/* QUICK NOTICE CARD */}
          <section className="disc-notice-card" aria-label="Important notice">
            <div className="disc-notice-head">
              <div className="disc-notice-icon-box" aria-hidden="true">
                <Icons.AlertTriangle />
              </div>
              <div className="disc-notice-badge">Important Notice</div>
            </div>
            <h2 className="disc-notice-title">Please Read Before Using TRION AI</h2>
            <p className="disc-notice-text">
              TRION AI provides analytical and data-visualization tools. Information, historical data,
              signals, predictions and statistical observations available through the platform should
              not be interpreted as guaranteed future outcomes, guaranteed profits or financial advice.
            </p>
          </section>

          {/* 1. WHAT IS TRION AI */}
          <section className="disc-card" aria-labelledby="what-is-trion-ai">
            <div className="disc-section-head">
              <div className="disc-icon-badge">
                <Icons.Cpu />
              </div>
              <h2 id="what-is-trion-ai" className="disc-section-title">What Is TRION AI?</h2>
            </div>
            <p className="disc-p">
              TRION AI is an independent data analytics and visualization software platform designed
              to organize, display and analyze available historical and statistical information.
            </p>
            <p className="disc-p">The platform may provide tools and features including, but not limited to:</p>
            <ul className="disc-svg-list" aria-label="TRION AI platform features">
              {[
                "Historical data visualization and display",
                "Statistical observations and distribution analysis",
                "Sequence analysis of available data records",
                "Pattern visualization based on historical records",
                "Probability-based indicators derived from statistical models",
                "Analytical dashboards and data summaries",
                "Data-based tools for exploring historical information",
              ].map((feat, idx) => (
                <li key={idx}>
                  <div className="disc-list-icon">
                    <Icons.Check />
                  </div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
            <p className="disc-p" style={{ marginTop: "16px" }}>
              <strong>These tools do not claim, and cannot claim, that future results will match
              historical patterns or that any outcome can be predicted with certainty.</strong>
            </p>
          </section>

          {/* 2. WHAT TRION AI DOES NOT DO */}
          <section className="disc-card" aria-labelledby="what-trion-ai-does-not-do">
            <div className="disc-section-head">
              <div className="disc-icon-badge disc-icon-alert">
                <Icons.Ban />
              </div>
              <h2 id="what-trion-ai-does-not-do" className="disc-section-title">What TRION AI Does Not Do</h2>
            </div>
            <p className="disc-p">TRION AI does not:</p>
            <ul className="disc-cross-grid" aria-label="Things TRION AI does not do">
              {[
                "Operate third-party games or gaming platforms",
                "Own or manage any third-party gaming or casino platform",
                "Manage casino, lottery or betting operations",
                "Control or influence third-party game results",
                "Guarantee predictions, signals or analytical outputs",
                "Guarantee profits, income or financial returns",
                "Guarantee future outcomes of any kind",
                "Provide financial investment advice or advisory services",
                "Control, process or manage third-party financial transactions",
                "Represent third-party platforms as official TRION AI services",
              ].map((item, idx) => (
                <li key={idx}>
                  <div className="disc-cross-icon">
                    <Icons.XIcon />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 3. PREDICTIONS & SIGNALS */}
          <section className="disc-card" aria-labelledby="predictions-signals">
            <div className="disc-section-head">
              <div className="disc-icon-badge">
                <Icons.Activity />
              </div>
              <h2 id="predictions-signals" className="disc-section-title">Predictions, Signals &amp; Statistical Analysis</h2>
            </div>
            <p className="disc-p">
              Any prediction, signal, probability indicator, confidence indicator, pattern observation
              or analytical output displayed by TRION AI is generated or presented for
              informational and analytical purposes only.
            </p>
            <p className="disc-p">
              <strong>These outputs are not guarantees of future results.</strong>
            </p>
            <p className="disc-p">
              Statistical analysis is based on available data and mathematical observations. Past
              patterns or historical results cannot guarantee future outcomes. The nature of
              statistical analysis means that outcomes can and do deviate from historical
              distributions, and no analytical model can eliminate uncertainty.
            </p>
            <div className="disc-highlight" role="note">
              <Icons.Info />
              <span>Past results do not guarantee future results.</span>
            </div>
            <div className="disc-certainty-box" role="note" aria-label="Analytics does not equal certainty">
              <span className="disc-certainty-lhs">Analytics</span>
              <span className="disc-certainty-neq">&ne;</span>
              <span className="disc-certainty-rhs">Certainty</span>
            </div>
          </section>

          {/* 4. HISTORICAL DATA */}
          <section className="disc-card" aria-labelledby="historical-data">
            <div className="disc-section-head">
              <div className="disc-icon-badge">
                <Icons.History />
              </div>
              <h2 id="historical-data" className="disc-section-title">Historical Data &amp; Results</h2>
            </div>
            <p className="disc-p">
              Historical results and datasets are provided to help users observe previous sequences,
              distributions and statistical patterns. Historical information is a record of the
              past&thinsp;&mdash;&thinsp;it is not a forecast, promise or guarantee of future outcomes.
            </p>
            <p className="disc-p">Historical information available through the platform may be:</p>
            <ul className="disc-svg-list" aria-label="Limitations of historical data">
              {[
                "Incomplete due to source limitations",
                "Delayed relative to real-time events",
                "Temporarily unavailable due to technical issues",
                "Subject to correction if errors are identified",
                "Affected by limitations of external data sources",
              ].map((lim, idx) => (
                <li key={idx}>
                  <div className="disc-list-icon">
                    <Icons.ArrowRight />
                  </div>
                  <span>{lim}</span>
                </li>
              ))}
            </ul>
            <p className="disc-p" style={{ marginTop: "14px" }}>
              <strong>Historical information should not be interpreted as a promise, forecast or
              guarantee of future results.</strong>
            </p>
            <div className="disc-flow" role="note" aria-label="Correct interpretation: historical data leads to analysis leads to statistical observation">
              <span className="disc-flow-label">
                <Icons.Check /> Correct
              </span>
              <span className="disc-flow-step">Historical Data</span>
              <span className="disc-flow-arrow"><Icons.ArrowRight /></span>
              <span className="disc-flow-step">Analysis</span>
              <span className="disc-flow-arrow"><Icons.ArrowRight /></span>
              <span className="disc-flow-step">Statistical Observation</span>
            </div>
            <div className="disc-not-flow" role="note" aria-label="Incorrect: historical data does not lead to guaranteed future result">
              <span className="disc-not-badge">
                <Icons.XIcon /> NOT
              </span>
              <span className="disc-not-flow-step">Historical Data</span>
              <span className="disc-not-flow-arrow"><Icons.ArrowRight /></span>
              <span className="disc-not-flow-step">Guaranteed Future Result</span>
            </div>
          </section>

          {/* 5. DATA ACCURACY */}
          <section className="disc-card" aria-labelledby="data-accuracy">
            <div className="disc-section-head">
              <div className="disc-icon-badge">
                <Icons.Database />
              </div>
              <h2 id="data-accuracy" className="disc-section-title">Data Accuracy &amp; Availability</h2>
            </div>
            <p className="disc-p">
              TRION AI aims to present analytical information in a clear and useful manner; however,
              data may sometimes be delayed, incomplete, unavailable or affected by technical issues
              or limitations in external data sources.
            </p>
            <p className="disc-p">
              TRION AI does not guarantee that all data available on the platform is real-time,
              error-free or continuously available.
            </p>
            <p className="disc-p">
              <strong>Users should independently verify important information before relying on it.</strong>
            </p>
          </section>

          {/* 6. THIRD-PARTY SERVICES */}
          <section className="disc-card" aria-labelledby="third-party-services">
            <div className="disc-section-head">
              <div className="disc-icon-badge">
                <Icons.Globe />
              </div>
              <h2 id="third-party-services" className="disc-section-title">Third-Party Websites, Apps &amp; Services</h2>
            </div>
            <p className="disc-p">
              TRION AI may reference or link to third-party websites, applications, services or
              resources. These third parties operate independently from TRION AI.
            </p>
            <p className="disc-p">
              TRION AI does not control and is not responsible for the availability, security,
              accuracy, content, terms, privacy practices, transactions, promotions or services of
              third-party websites or applications.
            </p>
            <p className="disc-p">
              Before using any external service, users should independently verify its domain,
              authenticity, terms and privacy information. TRION AI does not represent any
              third-party service as an official, authorized or verified TRION AI partner unless
              such a relationship can be independently confirmed.
            </p>
          </section>

          {/* 7. EXTERNAL LINKS */}
          <section className="disc-card" aria-labelledby="external-links">
            <div className="disc-section-head">
              <div className="disc-icon-badge">
                <Icons.LinkIcon />
              </div>
              <h2 id="external-links" className="disc-section-title">External Links</h2>
            </div>
            <p className="disc-p">
              Links to external websites are provided for informational or navigational purposes
              where applicable. The presence of a link does not automatically mean that TRION AI
              endorses, owns, operates or officially represents that third-party service.
            </p>
            <p className="disc-p">
              Users are encouraged to review the privacy policies and terms of any external website
              they visit. TRION AI bears no responsibility for the content or practices of external
              websites.
            </p>
          </section>

          {/* 8. USER RESPONSIBILITY */}
          <section className="disc-card" aria-labelledby="user-responsibility">
            <div className="disc-section-head">
              <div className="disc-icon-badge">
                <Icons.UserCheck />
              </div>
              <h2 id="user-responsibility" className="disc-section-title">User Responsibility</h2>
            </div>
            <p className="disc-p">Users are responsible for:</p>
            <ul className="disc-check-grid" aria-label="User responsibilities">
              {[
                "Reviewing information carefully before acting on it",
                "Independently verifying third-party websites and their authenticity",
                "Protecting their own account credentials and login information",
                "Protecting OTPs, passwords and payment PINs from unauthorized disclosure",
                "Understanding applicable terms of any service they choose to use",
                "Following applicable local and national laws and regulations",
                "Complying with applicable age restrictions in their jurisdiction",
                "Making their own informed decisions regarding third-party services",
              ].map((resp, idx) => (
                <li key={idx}>
                  <div className="disc-check-icon">
                    <Icons.Check />
                  </div>
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
            <p className="disc-p" style={{ marginTop: "16px" }}>
              <strong>Users should never rely solely on an analytical signal or prediction when
              making decisions involving money or other personal resources.</strong>
            </p>
          </section>

          {/* 9. APPLICABLE LAWS */}
          <section className="disc-card" aria-labelledby="applicable-laws">
            <div className="disc-section-head">
              <div className="disc-icon-badge">
                <Icons.Scale />
              </div>
              <h2 id="applicable-laws" className="disc-section-title">Applicable Laws &amp; Regulations</h2>
            </div>
            <p className="disc-p">
              Laws and regulations relating to gaming, betting, online services, financial
              transactions and related activities may vary by country, state or jurisdiction and
              may change over time.
            </p>
            <p className="disc-p">
              Users are responsible for determining and complying with the laws and regulations
              applicable to their own location and circumstances. TRION AI does not make
              representations about the legal status of any specific activity in any specific
              jurisdiction.
            </p>
            <p className="disc-p">
              For advice on applicable laws in your specific jurisdiction, we recommend consulting a
              qualified legal professional.
            </p>
          </section>

          {/* 10. AGE RESTRICTION & RESPONSIBLE USE */}
          <section className="disc-card" aria-labelledby="age-responsible-use">
            <div className="disc-section-head">
              <div className="disc-icon-badge">
                <Icons.ShieldAlert />
              </div>
              <h2 id="age-responsible-use" className="disc-section-title">Age &amp; Responsible Use</h2>
            </div>
            <p className="disc-p">
              Users should comply with all applicable age restrictions and legal requirements in
              their jurisdiction. TRION AI&rsquo;s analytical tools are intended for adult use.
            </p>
            <div className="disc-age-box" role="note" aria-label="18 plus Responsible Use notice">
              <span className="disc-age-icon-svg" aria-hidden="true">
                <Icons.EighteenPlus />
              </span>
              <span>18+ &mdash; Responsible Use</span>
            </div>
            <p className="disc-p">
              For detailed responsible-use and age-awareness information, please review our{" "}
              <Link href="/responsible-gambling" className="disc-inline-link">
                Responsible Use &amp; 18+ Policy
              </Link>
              .
            </p>
          </section>

          {/* 11. NO FINANCIAL GUARANTEE */}
          <section className="disc-card" aria-labelledby="no-financial-guarantee">
            <div className="disc-section-head">
              <div className="disc-icon-badge disc-icon-alert">
                <Icons.AlertTriangle />
              </div>
              <h2 id="no-financial-guarantee" className="disc-section-title">No Financial or Profit Guarantee</h2>
            </div>
            <div className="disc-highlight" role="note">
              <Icons.Info />
              <span>
                TRION AI does not guarantee profits, income, winnings, financial returns or successful
                outcomes from the use of its analytical tools.
              </span>
            </div>
            <p className="disc-p">
              Any decision involving money or financial risk remains the user&rsquo;s sole
              responsibility. TRION AI&rsquo;s tools are analytical aids, not investment products or
              financial advisory services.
            </p>
          </section>

          {/* 12. NO GUARANTEED OUTCOME */}
          <section className="disc-card" aria-labelledby="no-guaranteed-outcome">
            <div className="disc-section-head">
              <div className="disc-icon-badge">
                <Icons.Activity />
              </div>
              <h2 id="no-guaranteed-outcome" className="disc-section-title">No Guaranteed Outcome</h2>
            </div>
            <p className="disc-p">
              Mathematical models, historical patterns, statistical analysis and probability
              indicators cannot eliminate uncertainty or guarantee the outcome of a future event.
              This is a fundamental principle of statistical science.
            </p>
            <div className="disc-certainty-box" role="note" aria-label="Analytics does not equal certainty">
              <span className="disc-certainty-lhs">Analytics</span>
              <span className="disc-certainty-neq">&ne;</span>
              <span className="disc-certainty-rhs">Certainty</span>
            </div>
          </section>

          {/* 13. PRIVACY & PERSONAL INFO */}
          <section className="disc-card" aria-labelledby="privacy-personal-info">
            <div className="disc-section-head">
              <div className="disc-icon-badge">
                <Icons.Lock />
              </div>
              <h2 id="privacy-personal-info" className="disc-section-title">Privacy &amp; Personal Information</h2>
            </div>
            <p className="disc-p">
              Users should review TRION AI&rsquo;s{" "}
              <Link href="/privacy" className="disc-inline-link">Privacy Policy</Link>{" "}
              before providing personal information through the platform.
            </p>
            <p className="disc-p">
              Providing personal information to any third-party service is subject to that
              service&rsquo;s own privacy policy and terms&thinsp;&mdash;&thinsp;not TRION AI&rsquo;s.
              Users should review applicable policies independently.
            </p>
            <p className="disc-p">
              For platform terms and conditions, see our{" "}
              <Link href="/terms" className="disc-inline-link">Terms &amp; Conditions</Link>.
            </p>
          </section>

          {/* 14. SECURITY NOTICE */}
          <section className="disc-card" aria-labelledby="security-notice">
            <div className="disc-section-head">
              <div className="disc-icon-badge">
                <Icons.Shield />
              </div>
              <h2 id="security-notice" className="disc-section-title">Security Notice</h2>
            </div>
            <p className="disc-p">To help protect your account and personal information:</p>
            <ul className="disc-security-grid" aria-label="Security best practices">
              {[
                "Never share your password with anyone",
                "Never share OTPs (one-time passwords) with anyone",
                "Never share payment PINs or banking credentials",
                "Verify the domain name carefully before logging into any service",
                "Avoid installing APK files from unknown or unofficial sources",
                "Avoid clicking suspicious or unverified external links",
                "Keep your devices, browsers and apps updated",
              ].map((sec, idx) => (
                <li key={idx}>
                  <div className="disc-security-icon">
                    <Icons.Lock />
                  </div>
                  <span>{sec}</span>
                </li>
              ))}
            </ul>
            <p className="disc-p" style={{ marginTop: "16px" }}>
              TRION AI will not ask users to disclose confidential authentication credentials
              through unofficial channels.
            </p>
          </section>

          {/* 15. THIRD-PARTY APK */}
          <section className="disc-card" aria-labelledby="third-party-apk">
            <div className="disc-section-head">
              <div className="disc-icon-badge disc-icon-alert">
                <Icons.Smartphone />
              </div>
              <h2 id="third-party-apk" className="disc-section-title">Third-Party Applications &amp; APK Files</h2>
            </div>
            <p className="disc-p">
              TRION AI does not automatically verify or endorse third-party APK files or
              applications referenced outside the official TRION AI platform. Users should verify
              the source, publisher, permissions and authenticity of any application before
              installation.
            </p>
            <p className="disc-p">Be particularly cautious of:</p>
            <ul className="disc-svg-list" aria-label="APK risks to avoid">
              {[
                "Modified or patched APK files distributed outside official channels",
                "Cracked applications claiming to offer premium access for free",
                "Applications downloaded from unknown or unverified sources",
                "Applications requesting excessive or unnecessary permissions",
              ].map((risk, idx) => (
                <li key={idx}>
                  <div className="disc-list-icon">
                    <Icons.AlertTriangle />
                  </div>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 16. LIMITATION OF RESPONSIBILITY */}
          <section className="disc-card" aria-labelledby="limitation-of-responsibility">
            <div className="disc-section-head">
              <div className="disc-icon-badge">
                <Icons.Scale />
              </div>
              <h2 id="limitation-of-responsibility" className="disc-section-title">Limitation of Responsibility</h2>
            </div>
            <p className="disc-p">
              To the extent permitted by applicable law, TRION AI is not responsible for losses,
              damages, decisions or consequences arising from reliance on third-party services,
              external websites, inaccurate or unavailable data, or the use or interpretation of
              analytical information.
            </p>
            <p className="disc-p">
              This limitation does not affect any statutory or consumer rights that may apply under
              the laws of your jurisdiction and should not be construed as overriding mandatory
              legal protections.
            </p>
          </section>

          {/* 17. INFORMATIONAL PURPOSE */}
          <section className="disc-card" aria-labelledby="informational-purpose">
            <div className="disc-section-head">
              <div className="disc-icon-badge">
                <Icons.Info />
              </div>
              <h2 id="informational-purpose" className="disc-section-title">Informational &amp; Analytical Purpose</h2>
            </div>
            <p className="disc-p">
              Content and analytical information provided by TRION AI are intended to help users
              understand available data and statistical observations. They should not be interpreted
              as professional legal, financial or investment advice.
            </p>
            <p className="disc-p">
              For specific legal, financial or regulatory advice, please consult a qualified
              professional in the relevant field.
            </p>
          </section>

          {/* SUMMARY CARD (IN SIMPLE TERMS) */}
          <section className="disc-summary-card" aria-labelledby="summary-heading">
            <div id="summary-heading" className="disc-summary-title">
              <Icons.CheckCircle />
              In Simple Terms
            </div>
            <div className="disc-summary-grid" role="list">
              {[
                ["TRION AI",              "Independent Analytics & Data Visualization Software"],
                ["Historical Data",       "Information About the Past"],
                ["Prediction / Signal",   "Statistical Analysis — Not a Guarantee of Future Results"],
                ["Third-Party Services",  "Independently Operated — Not Managed by TRION AI"],
                ["Future Outcome",        "Not Guaranteed by Any Analytical Tool"],
                ["User",                  "Responsible for Applicable Laws & Their Own Decisions"],
              ].map(([key, val]) => (
                <div key={key} className="disc-summary-row" role="listitem">
                  <span className="disc-summary-key">{key}</span>
                  <span className="disc-summary-eq">=</span>
                  <span className="disc-summary-val">{val}</span>
                </div>
              ))}
            </div>
          </section>

          {/* RELATED POLICIES */}
          <section className="disc-card" aria-labelledby="related-policies">
            <div className="disc-section-head">
              <div className="disc-icon-badge">
                <Icons.FileText />
              </div>
              <h2 id="related-policies" className="disc-section-title">Related Policies</h2>
            </div>
            <nav className="disc-policy-grid" aria-label="Related legal pages">
              {[
                { href: "/privacy",             IconComponent: Icons.Lock,         title: "Privacy Policy",         desc: "How TRION AI handles applicable user information." },
                { href: "/terms",               IconComponent: Icons.FileText,     title: "Terms & Conditions",     desc: "Platform terms and conditions of use." },
                { href: "/responsible-gambling",IconComponent: Icons.ShieldAlert,  title: "Responsible Use & 18+", desc: "Responsible-use and age-awareness information." },
                { href: "/about",               IconComponent: Icons.Info,         title: "About TRION AI",         desc: "Information about the platform and its purpose." },
                { href: "/contact",             IconComponent: Icons.Mail,         title: "Contact",                desc: "Contact information for questions or support." },
              ].map(({ href, IconComponent, title, desc }) => (
                <Link key={href} href={href} className="disc-policy-link" aria-label={`Navigate to ${title}`}>
                  <div className="disc-policy-head">
                    <div className="disc-policy-icon-box">
                      <IconComponent />
                    </div>
                    <span>{title}</span>
                  </div>
                  <p className="disc-policy-link-desc">{desc}</p>
                </Link>
              ))}
            </nav>
          </section>

          {/* FINAL NOTICE */}
          <div className="disc-footer-notice" role="note" aria-label="Final disclaimer acknowledgement">
            By using TRION AI, users acknowledge that analytical information and historical data do
            not guarantee future outcomes and that users are responsible for understanding and
            complying with applicable laws and the terms of any third-party service they independently
            choose to access.
          </div>

          {/* LAST UPDATED */}
          <p className="disc-last-updated">
            <time dateTime="2026-09">Last Updated: September 2026</time>
          </p>

        </main>

        <SiteFooter />
      </div>
    </>
  );
}
