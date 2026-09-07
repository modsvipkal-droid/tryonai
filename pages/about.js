import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import {
  PageHead,
  BreadcrumbSchema,
  OrganizationSchema,
  WebsiteSchema,
  WebPageSchema,
  FAQSchema,
} from "@/components/SEO";
import SiteFooter from "@/components/SiteFooter";

const PAGE_URL = "https://wingo30.com/about";
const PAGE_TITLE = "About TRION AI | Independent Data Analytics Platform";
const PAGE_DESC =
  "Discover TRION AI, an independent statistical data analytics platform offering real-time period history, PRNG probability matrices, and sequence tools.";

const ABOUT_FAQS = [
  {
    question: "What is TRION AI and what is it used for?",
    answer:
      "TRION AI is an independent statistical data analytics and visualization platform. It is used to track period history, calculate mathematical sequence distributions, and analyze PRNG trend matrices in real time."
  },
  {
    question: "Is TRION AI an online casino, gambling, or betting platform?",
    answer:
      "No. TRION AI is strictly an independent analytical software tool. We do not operate, host, promote, or facilitate any real-money gaming, betting, or lottery services."
  },
  {
    question: "Can TRION AI guarantee 100% accurate prediction outcomes?",
    answer:
      "No software can guarantee deterministic certainty in pseudo-random number generator (PRNG) systems. TRION AI provides mathematical probability indicators for educational and statistical research purposes only."
  },
  {
    question: "What user personal data is collected and stored by TRION AI?",
    answer:
      "TRION AI enforces strict minimal data retention. We only store basic Google OAuth authentication details: Full Name, Email Address, and Profile Picture URL. We never collect or store banking, UPI, phone numbers, or financial details."
  },
  {
    question: "How can I permanently delete my account and data?",
    answer:
      "You can submit a data deletion request anytime through our official Contact Support page. All stored authentication data is permanently wiped within 1–2 business days."
  },
  {
    question: "How does the AI Neural Forecast Engine analyze historical period data?",
    answer:
      "The engine processes continuous 30-second and 1-minute historical period numbers, BIG/SMALL sequence streaks, and parity ratios using mathematical frequency distribution models."
  }
];

const aboutStyles = `
  @font-face {
    font-family: 'TrionAIAbout';
    src: url('/fonts/trionAIabout.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
  *, *::before, *::after { 
    box-sizing: border-box; 
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  html {
    scroll-behavior: smooth !important;
    -webkit-overflow-scrolling: touch !important;
    height: auto !important;
    min-height: 100% !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  body {
    background: #eef7f3 !important;
    color: #17251f !important;
    font-family: 'TrionAIAbout', sans-serif !important;
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
    font-family: 'TrionAIAbout', sans-serif !important;
  }

  .about-page {
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
  .about-page::before {
    content: '';
    position: fixed;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(ellipse at 25% 15%, rgba(0,152,91,0.06) 0%, transparent 50%),
                radial-gradient(ellipse at 75% 85%, rgba(16,185,129,0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  .about-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.18;
    pointer-events: none;
    z-index: 0;
    animation: floatOrb 18s ease-in-out infinite alternate;
  }
  .about-orb-1 { width: 420px; height: 420px; background: #00985b; top: -100px; right: -100px; }
  .about-orb-2 { width: 340px; height: 340px; background: #10b981; bottom: 80px; left: -80px; animation-delay: -7s; }
  @keyframes floatOrb {
    from { transform: translate(0, 0) scale(1); }
    to { transform: translate(25px, 35px) scale(1.08); }
  }

  /* Top sticky navigation */
  .about-nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(255, 255, 255, 0.94);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(0, 152, 91, 0.15);
    padding: 12px 24px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    box-shadow: 0 2px 14px rgba(0, 75, 47, 0.04);
  }
  .about-nav-left {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
  }
  .about-nav-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #007543;
    font-weight: 700;
    font-size: 13px;
    cursor: pointer;
    background: rgba(0, 152, 91, 0.08);
    border: 1px solid rgba(0, 152, 91, 0.22);
    padding: 7px 16px;
    border-radius: 50px;
    outline: none;
    transition: all 0.22s ease;
    font-family: 'TrionAIAbout', sans-serif !important;
    flex-shrink: 0;
  }
  .about-nav-back:hover {
    background: #00985b;
    border-color: #00985b;
    color: #ffffff;
    transform: translateX(-2px);
    box-shadow: 0 4px 14px rgba(0, 152, 91, 0.22);
  }
  .about-nav-brand {
    display: inline-flex;
    align-items: center;
  }

  @media (max-width: 768px) {
    .about-nav {
      padding: 10px 16px;
    }
    .about-nav-left {
      gap: 12px;
    }
    .about-nav-back {
      padding: 6px 12px;
      font-size: 12.5px;
    }
  }

  /* Main Container */
  .about-container {
    max-width: 1040px;
    width: 100%;
    margin: 40px auto 0;
    padding: 0 24px;
    position: relative;
    z-index: 1;
    animation: fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
    flex: 1 0 auto;
  }
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Section Spacing & Layout Rhythm */
  .about-section {
    margin-bottom: 56px;
    width: 100%;
  }
  @media (max-width: 768px) {
    .about-section {
      margin-bottom: 40px;
    }
    .about-container {
      padding: 0 16px;
      margin-top: 24px;
    }
  }

  /* Hero Section */
  .about-hero {
    text-align: center;
    margin-bottom: 52px;
    padding: 12px 0 16px 0;
    width: 100%;
  }
  .about-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: rgba(0, 152, 91, 0.09);
    border: 1px solid rgba(0, 152, 91, 0.24);
    color: #007543;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 6px 18px;
    border-radius: 9999px;
    margin-bottom: 18px;
    font-family: 'TrionAIAbout', sans-serif !important;
    max-width: 100%;
  }
  .about-hero h1 {
    font-size: clamp(26px, 5vw, 44px);
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 12px 0;
    letter-spacing: -0.025em;
    line-height: 1.18;
    font-family: 'TrionAIAbout', sans-serif !important;
    word-break: break-word;
    overflow-wrap: break-word;
  }
  .about-hero h1 span {
    color: #00985b;
  }
  .about-hero-sub {
    font-size: clamp(15.5px, 2.8vw, 19px);
    font-weight: 700;
    color: #007543;
    margin: 0 0 14px 0;
    letter-spacing: -0.01em;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .about-hero-desc {
    font-size: 15.5px;
    line-height: 1.75;
    color: #475569;
    max-width: 720px;
    margin: 0 auto 26px auto;
    font-weight: 400;
    font-family: 'TrionAIAbout', sans-serif !important;
    overflow-wrap: break-word;
  }
  .about-hero-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    flex-wrap: wrap;
    width: 100%;
  }

  /* Buttons */
  .btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: #00985b;
    color: #ffffff !important;
    font-size: 14.5px;
    font-weight: 700;
    padding: 12px 28px;
    border-radius: 14px;
    text-decoration: none;
    min-height: 48px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.22s ease;
    box-shadow: 0 4px 16px rgba(0, 152, 91, 0.24);
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .btn-primary:hover {
    background: #007543;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 152, 91, 0.32);
    color: #ffffff !important;
  }
  .btn-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: #ffffff;
    color: #007543 !important;
    font-size: 14.5px;
    font-weight: 700;
    padding: 12px 24px;
    border-radius: 14px;
    text-decoration: none;
    min-height: 48px;
    border: 1px solid rgba(0, 152, 91, 0.28);
    cursor: pointer;
    transition: all 0.22s ease;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .btn-secondary:hover {
    background: rgba(0, 152, 91, 0.05);
    border-color: #00985b;
    transform: translateY(-2px);
    color: #005537 !important;
  }

  @media (max-width: 480px) {
    .about-hero-actions {
      flex-direction: column;
      gap: 10px;
    }
    .about-hero-actions .btn-primary,
    .about-hero-actions .btn-secondary {
      width: 100%;
    }
  }

  /* Direct Answer Callout Box for AIO & Search Snippets */
  .direct-answer-callout {
    background: linear-gradient(135deg, rgba(0, 152, 91, 0.07) 0%, rgba(16, 185, 129, 0.03) 100%);
    border: 1px solid rgba(0, 152, 91, 0.24);
    border-left: 4px solid #00985b;
    border-radius: 12px;
    padding: 16px 20px;
    margin: 14px 0 20px 0;
    word-break: break-word;
  }
  .direct-answer-callout p {
    margin: 0;
    font-size: 14.5px;
    line-height: 1.65;
    color: #0f2e20;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .direct-answer-callout strong {
    color: #007543;
    font-weight: 800;
  }

  /* External Citation Link */
  .source-link {
    color: #007543;
    text-decoration: underline;
    text-underline-offset: 3px;
    font-weight: 600;
    transition: color 0.2s ease;
  }
  .source-link:hover {
    color: #005537;
  }

  /* Statement Banner / Highlight Box */
  .statement-box {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.22);
    border-left: 5px solid #00985b;
    border-radius: 18px;
    padding: 30px 34px;
    box-shadow: 0 6px 20px rgba(0, 75, 47, 0.04);
    transition: border-color 0.22s ease;
    word-break: break-word;
  }
  @media (max-width: 768px) {
    .statement-box {
      padding: 22px 18px;
    }
  }

  /* Section Headings */
  .section-header {
    margin-bottom: 20px;
  }
  .section-header.centered {
    text-align: center;
  }
  .section-header h2 {
    font-size: clamp(20px, 3.4vw, 26px);
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 8px 0;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 12px;
    line-height: 1.3;
    font-family: 'TrionAIAbout', sans-serif !important;
    word-break: break-word;
  }
  .section-header.centered h2 {
    justify-content: center;
  }
  .section-header-bar {
    width: 4px;
    height: 22px;
    background: linear-gradient(180deg, #10b981, #00985b);
    border-radius: 2px;
    flex-shrink: 0;
    display: inline-block;
  }
  .section-subtext {
    font-size: 14.5px;
    line-height: 1.65;
    color: #475569;
    margin: 0;
    max-width: 740px;
    font-family: 'TrionAIAbout', sans-serif !important;
    word-break: break-word;
  }
  .section-header.centered .section-subtext {
    margin-left: auto;
    margin-right: auto;
  }

  /* Cards System */
  .card-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  .card-grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  @media (max-width: 900px) {
    .card-grid-3, .card-grid-2 {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }

  .clean-card {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.16);
    border-radius: 16px;
    padding: 24px 26px;
    box-shadow: 0 4px 16px rgba(0, 75, 47, 0.03);
    transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
    display: flex;
    flex-direction: column;
    word-break: break-word;
  }
  .clean-card:hover {
    transform: translateY(-2px);
    border-color: rgba(0, 152, 91, 0.35);
    box-shadow: 0 8px 24px rgba(0, 75, 47, 0.06);
  }
  @media (max-width: 768px) {
    .clean-card {
      padding: 20px 18px;
    }
  }

  .card-icon-wrap {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: rgba(0, 152, 91, 0.08);
    border: 1px solid rgba(0, 152, 91, 0.2);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #007543;
    margin-bottom: 14px;
    flex-shrink: 0;
  }
  .card-title {
    font-size: 17.5px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 8px 0;
    line-height: 1.3;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .card-text {
    font-size: 14.5px;
    line-height: 1.65;
    color: #475569;
    margin: 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }

  /* Horizontal Tech Feature Block */
  .tech-horizontal-card {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.18);
    border-radius: 16px;
    padding: 24px 28px;
    display: flex;
    align-items: flex-start;
    gap: 18px;
    box-shadow: 0 4px 16px rgba(0, 75, 47, 0.03);
    transition: transform 0.22s ease, border-color 0.22s ease;
    word-break: break-word;
  }
  .tech-horizontal-card:hover {
    transform: translateY(-2px);
    border-color: rgba(0, 152, 91, 0.36);
    box-shadow: 0 8px 24px rgba(0, 75, 47, 0.06);
  }
  @media (max-width: 768px) {
    .tech-horizontal-card {
      flex-direction: column;
      gap: 14px;
      padding: 20px 18px;
    }
  }

  /* Comparison Table Styles (Structured Data Support) */
  .table-responsive-wrapper {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin: 20px 0 10px 0;
    border-radius: 14px;
    border: 1px solid rgba(0, 152, 91, 0.18);
    box-shadow: 0 4px 16px rgba(0, 75, 47, 0.03);
    background: #ffffff;
    display: block;
  }
  .about-comparison-table {
    width: 100%;
    min-width: 520px;
    border-collapse: collapse;
    text-align: left;
    font-size: 14px;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .about-comparison-table th {
    background: rgba(0, 152, 91, 0.08);
    color: #005537;
    font-weight: 700;
    padding: 14px 16px;
    border-bottom: 1px solid rgba(0, 152, 91, 0.2);
    font-size: 13.5px;
    white-space: nowrap;
  }
  .about-comparison-table td {
    padding: 14px 16px;
    border-bottom: 1px solid rgba(15, 23, 42, 0.06);
    color: #334155;
    line-height: 1.55;
  }
  .about-comparison-table tr:last-child td {
    border-bottom: none;
  }
  .about-comparison-table tr:nth-child(even) {
    background: rgba(240, 253, 244, 0.4);
  }
  .badge-positive {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: #007543;
    font-weight: 700;
  }
  .badge-negative {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: #b91c1c;
    font-weight: 600;
  }

  /* HowTo Structured Steps Layout */
  .howto-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
    margin-top: 18px;
  }
  @media (max-width: 900px) {
    .howto-grid {
      grid-template-columns: 1fr;
      gap: 14px;
    }
  }
  .howto-step-box {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.16);
    border-radius: 14px;
    padding: 20px;
    position: relative;
    word-break: break-word;
  }
  .step-number-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #00985b;
    color: #ffffff;
    font-size: 13px;
    font-weight: 800;
    margin-bottom: 12px;
  }

  /* Mission Container */
  .mission-card {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.18);
    border-radius: 18px;
    padding: 30px 34px;
    box-shadow: 0 6px 20px rgba(0, 75, 47, 0.04);
    word-break: break-word;
  }
  .mission-quote-pill {
    margin-top: 20px;
    padding: 16px 20px;
    background: rgba(0, 152, 91, 0.06);
    border-left: 4px solid #00985b;
    border-radius: 0 12px 12px 0;
    font-size: 14.5px;
    font-weight: 600;
    color: #005537;
    line-height: 1.6;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  @media (max-width: 768px) {
    .mission-card {
      padding: 22px 18px;
    }
  }

  /* Privacy Minimal Data Comparison Layout */
  .privacy-comparison-container {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.18);
    border-radius: 18px;
    padding: 30px 34px;
    box-shadow: 0 6px 20px rgba(0, 75, 47, 0.04);
    word-break: break-word;
  }
  .comparison-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 20px;
  }
  @media (max-width: 768px) {
    .privacy-comparison-container {
      padding: 22px 18px;
    }
    .comparison-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }
  .comparison-box {
    border-radius: 14px;
    padding: 20px 22px;
    border: 1px solid transparent;
    word-break: break-word;
  }
  .comparison-box.stored {
    background: rgba(0, 152, 91, 0.05);
    border-color: rgba(0, 152, 91, 0.22);
  }
  .comparison-box.not-stored {
    background: rgba(239, 68, 68, 0.04);
    border-color: rgba(239, 68, 68, 0.18);
  }
  .comparison-box-title {
    font-size: 15.5px;
    font-weight: 700;
    margin: 0 0 12px 0;
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .comparison-box.stored .comparison-box-title {
    color: #007543;
  }
  .comparison-box.not-stored .comparison-box-title {
    color: #b91c1c;
  }
  .comparison-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .comparison-list li {
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .comparison-box.stored .comparison-list li {
    color: #0f172a;
  }
  .comparison-box.not-stored .comparison-list li {
    color: #334155;
  }
  .icon-check {
    color: #00985b;
    font-weight: 800;
    font-size: 15px;
    flex-shrink: 0;
  }
  .icon-cross {
    color: #ef4444;
    font-weight: 800;
    font-size: 14px;
    flex-shrink: 0;
  }

  /* Right to deletion action card */
  .deletion-card {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.18);
    border-radius: 16px;
    padding: 24px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-top: 20px;
    box-shadow: 0 4px 16px rgba(0, 75, 47, 0.03);
    word-break: break-word;
  }
  @media (max-width: 768px) {
    .deletion-card {
      flex-direction: column;
      align-items: stretch;
      padding: 20px 18px;
      gap: 16px;
    }
    .deletion-card .btn-secondary {
      width: 100%;
    }
  }

  /* FAQ Section Styling */
  .faq-accordion {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 20px;
  }
  .faq-card {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.16);
    border-radius: 14px;
    overflow: hidden;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    word-break: break-word;
  }
  .faq-card.open {
    border-color: rgba(0, 152, 91, 0.35);
    box-shadow: 0 4px 16px rgba(0, 75, 47, 0.05);
  }
  .faq-trigger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    gap: 14px;
    outline: none;
  }
  .faq-question-text {
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.4;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .faq-icon-arrow {
    width: 20px;
    height: 20px;
    color: #007543;
    transition: transform 0.22s ease;
    flex-shrink: 0;
  }
  .faq-icon-arrow.rotated {
    transform: rotate(180deg);
  }
  .faq-answer-panel {
    padding: 0 20px 16px 20px;
    font-size: 14px;
    line-height: 1.65;
    color: #475569;
    border-top: 1px solid rgba(0, 152, 91, 0.08);
    padding-top: 12px;
    font-family: 'TrionAIAbout', sans-serif !important;
  }

  /* Quote Card */
  .quote-highlight-card {
    background: linear-gradient(135deg, rgba(0, 152, 91, 0.08) 0%, rgba(16, 185, 129, 0.04) 100%);
    border: 1px solid rgba(0, 152, 91, 0.25);
    border-radius: 18px;
    padding: 28px 32px;
    text-align: center;
    position: relative;
    margin: 24px 0 12px 0;
    word-break: break-word;
  }
  .quote-main {
    font-size: clamp(16px, 2.6vw, 20px);
    font-weight: 700;
    color: #005537;
    margin: 0 0 8px 0;
    line-height: 1.45;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .quote-sub {
    font-size: 14px;
    color: #475569;
    margin: 0;
    line-height: 1.65;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  @media (max-width: 768px) {
    .quote-highlight-card {
      padding: 20px 16px;
    }
  }

  /* Responsible Use 18+ Badge */
  .age-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(220, 38, 38, 0.08);
    border: 1px solid rgba(220, 38, 38, 0.25);
    color: #b91c1c;
    font-size: 11.5px;
    font-weight: 800;
    padding: 4px 14px;
    border-radius: 9999px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 12px;
    font-family: 'TrionAIAbout', sans-serif !important;
  }

  /* Transparency 3 Pillars */
  .transparency-pillar {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.16);
    border-radius: 16px;
    padding: 24px 26px;
    text-align: center;
    box-shadow: 0 4px 16px rgba(0, 75, 47, 0.03);
    transition: transform 0.22s ease, border-color 0.22s ease;
    word-break: break-word;
  }
  .transparency-pillar:hover {
    transform: translateY(-2px);
    border-color: rgba(0, 152, 91, 0.35);
  }
  .transparency-pillar-icon {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(0, 152, 91, 0.09);
    color: #007543;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 12px auto;
  }
  .transparency-pillar-title {
    font-size: 17.5px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 6px 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .transparency-pillar-desc {
    font-size: 14px;
    line-height: 1.65;
    color: #475569;
    margin: 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }

  /* Final Quote & Final CTA Container */
  .final-section {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.22);
    border-radius: 20px;
    padding: 40px 32px;
    text-align: center;
    box-shadow: 0 8px 24px rgba(0, 75, 47, 0.05);
    margin-bottom: 56px;
    word-break: break-word;
  }
  @media (max-width: 768px) {
    .final-section {
      padding: 28px 18px;
      margin-bottom: 40px;
    }
  }

  /* Standard body typography helper */
  .p-body {
    font-size: 14.5px;
    line-height: 1.72;
    color: #334155;
    margin: 0 0 12px 0;
    font-family: 'TrionAIAbout', sans-serif !important;
    word-break: break-word;
  }
  .p-body:last-child {
    margin-bottom: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`;

export default function AboutPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState(0);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? -1 : index);
  };

  return (
    <>
      <PageHead
        title={PAGE_TITLE}
        description={PAGE_DESC}
        canonical={PAGE_URL}
      >
        <style dangerouslySetInnerHTML={{ __html: aboutStyles }} />
      </PageHead>

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wingo30.com/" },
          { name: "About TRION AI", url: PAGE_URL },
        ]}
      />
      <OrganizationSchema />
      <WebsiteSchema />
      <WebPageSchema
        title={PAGE_TITLE}
        description={PAGE_DESC}
        url={PAGE_URL}
      />
      <FAQSchema questions={ABOUT_FAQS} />

      <div className="about-page">
        {/* Ambient background orbs */}
        <div className="about-orb about-orb-1" aria-hidden="true" />
        <div className="about-orb about-orb-2" aria-hidden="true" />

        {/* ── Top Navigation Bar ────────────────────────────────────────────── */}
        <nav className="about-nav" aria-label="About Navigation">
          <div className="about-nav-left">
            <button
              className="about-nav-back"
              onClick={handleBack}
              type="button"
              aria-label="Back to previous page"
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Back</span>
            </button>
            <div className="about-nav-brand">
              <Image
                src="/trionai.png"
                alt="TRION AI"
                width={204}
                height={32}
                priority
              />
            </div>
          </div>
        </nav>

        {/* ── Page Content Container ───────────────────────────────────────── */}
        <main className="about-container" id="main-content">
          {/* 1. About Hero Section */}
          <section className="about-hero" aria-labelledby="hero-heading">
            <div className="about-eyebrow">
              <svg
                viewBox="0 0 24 24"
                width="12"
                height="12"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>ABOUT TRION AI PLATFORM</span>
            </div>

            <h1 id="hero-heading">
              Independent Data <span>Analytics Platform</span>
            </h1>

            <div className="about-hero-sub">What is TRION AI?</div>

            <p className="about-hero-desc">
              TRION AI is a dedicated statistical research and probability modeling platform engineered to deliver real-time period history tracking, visual trend matrices, and mathematical sequence analysis.
            </p>

            <div className="about-hero-actions">
              <Link href="/login" className="btn-primary">
                <span>Explore Platform</span>
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link href="/contact" className="btn-secondary">
                <span>Contact Support</span>
              </Link>
            </div>
          </section>

          {/* 2. Conversational Heading: What is TRION AI and how does it work? */}
          <section className="about-section" aria-labelledby="what-is-trion-heading">
            <div className="statement-box">
              <div className="section-header">
                <h2 id="what-is-trion-heading">
                  <span className="section-header-bar" />
                  What is TRION AI and how does the platform work?
                </h2>
              </div>

              {/* Direct Answer Signal */}
              <div className="direct-answer-callout">
                <p>
                  <strong>Direct Answer:</strong> TRION AI is an automated statistical observation software tool designed to track historical period draw records, calculate sequence frequencies, and visualize{" "}
                  <a
                    href="https://en.wikipedia.org/wiki/Pseudorandom_number_generator"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="source-link"
                  >
                    pseudo-random number generator (PRNG)
                  </a>{" "}
                  trend distributions in real time for research purposes.
                </p>
              </div>

              <p className="p-body">
                Traditional manual tracking can be tedious and prone to human recording errors. TRION AI standardizes high-frequency numerical data into structured visual dashboards, parity matrices, and color streak calculations without engaging in financial transactions.
              </p>
            </div>
          </section>

          {/* 3. Question Heading: Is TRION AI associated with real-money betting or gambling? */}
          <section className="about-section" aria-labelledby="independent-statement-heading">
            <div className="statement-box">
              <div className="section-header">
                <h2 id="independent-statement-heading">
                  <span className="section-header-bar" />
                  Is TRION AI affiliated with online casinos or betting operators?
                </h2>
              </div>

              {/* Direct Answer Signal */}
              <div className="direct-answer-callout">
                <p>
                  <strong>Direct Answer:</strong> No. TRION AI does not host, operate, promote, or accept wagers for any online casino or real-money betting service. The platform is strictly an independent data visualization and mathematical research tool.
                </p>
              </div>

              <p className="p-body">
                Our analytical tools are designed solely for numerical probability study, period sequence pattern recognition, and educational statistical research.
              </p>
            </div>
          </section>

          {/* 4. Structured Comparison Table (Structured Answer Support) */}
          <section className="about-section" aria-labelledby="comparison-table-heading">
            <div className="clean-card" style={{ padding: "28px 30px" }}>
              <div className="section-header">
                <h2 id="comparison-table-heading">
                  <span className="section-header-bar" />
                  How does TRION AI differ from gaming operators?
                </h2>
                <p className="section-subtext">
                  A side-by-side comparison illustrating our software&apos;s independent analytical role versus commercial gaming platforms:
                </p>
              </div>

              <div className="table-responsive-wrapper">
                <table className="about-comparison-table" aria-label="TRION AI vs Gaming Operators Comparison Table">
                  <thead>
                    <tr>
                      <th scope="col">Feature / Aspect</th>
                      <th scope="col">TRION AI (Analytics Tool)</th>
                      <th scope="col">Gaming &amp; Casino Platforms</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row" style={{ fontWeight: 700, color: "#0f172a" }}>Primary Objective</th>
                      <td>
                        <span className="badge-positive">✓</span> Statistical trend &amp; PRNG sequence visualization
                      </td>
                      <td>
                        <span className="badge-negative">✕</span> Hosting real-money wagers and gaming
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" style={{ fontWeight: 700, color: "#0f172a" }}>Financial Deposits / Bets</th>
                      <td>
                        <span className="badge-positive">✓</span> Zero betting, no financial transactions accepted
                      </td>
                      <td>
                        <span className="badge-negative">✕</span> Takes cash deposits and wagers
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" style={{ fontWeight: 700, color: "#0f172a" }}>Mathematical Model</th>
                      <td>
                        <span className="badge-positive">✓</span> Open frequency and parity probability metrics
                      </td>
                      <td>
                        <span className="badge-negative">✕</span> Proprietary house edge calculations
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" style={{ fontWeight: 700, color: "#0f172a" }}>User Data Storage</th>
                      <td>
                        <span className="badge-positive">✓</span> Minimal OAuth details only (No banking / UPI)
                      </td>
                      <td>
                        <span className="badge-negative">✕</span> Extensive KYC, banking &amp; payment data
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" style={{ fontWeight: 700, color: "#0f172a" }}>Outcome Guarantees</th>
                      <td>
                        <span className="badge-positive">✓</span> Transparent: No certainty in PRNG systems
                      </td>
                      <td>
                        <span className="badge-negative">✕</span> Profit promises or variable pay-out odds
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 5. What We Do: Core Research Capabilities */}
          <section className="about-section" aria-labelledby="what-we-do-heading">
            <div className="section-header">
              <h2 id="what-we-do-heading">
                <span className="section-header-bar" />
                What data analytics and research tools are provided?
              </h2>
              <p className="section-subtext">
                TRION AI provides structured numerical observation tools across historical period cycles:
              </p>
            </div>

            <div className="card-grid-3">
              <div className="clean-card">
                <div className="card-icon-wrap" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <h3 className="card-title">Real-Time Data Feeds</h3>
                <p className="card-text">
                  Track 30-second and 1-minute period history and numerical information in an organized, structured interface.
                </p>
              </div>

              <div className="clean-card">
                <div className="card-icon-wrap" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="21" x2="9" y2="9" />
                  </svg>
                </div>
                <h3 className="card-title">Visual Trend Analytics</h3>
                <p className="card-text">
                  Transform numerical history into intuitive trend matrices, BIG/SMALL ratios, and color distributions.
                </p>
              </div>

              <div className="clean-card">
                <div className="card-icon-wrap" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M14.83 14.83a4 4 0 1 1 0-5.66" />
                    <line x1="12" y1="12" x2="16" y2="12" />
                  </svg>
                </div>
                <h3 className="card-title">Mathematical Research</h3>
                <p className="card-text">
                  Analyze sequence patterns, streak lengths, and statistical probability metrics according to standard mathematical models.
                </p>
              </div>
            </div>
          </section>

          {/* 6. Step-by-Step HowTo Guide (Conversational 'How to') */}
          <section className="about-section" aria-labelledby="howto-heading">
            <div className="clean-card" style={{ padding: "28px 30px" }}>
              <div className="section-header">
                <h2 id="howto-heading">
                  <span className="section-header-bar" />
                  How to use TRION AI for statistical trend observation
                </h2>
                <p className="section-subtext">
                  Follow these 3 simple steps to observe and research historical numerical sequences:
                </p>
              </div>

              <div className="howto-grid">
                <div className="howto-step-box">
                  <div className="step-number-badge">1</div>
                  <h3 className="card-title" style={{ fontSize: "16px" }}>Select Period Mode</h3>
                  <p className="card-text" style={{ fontSize: "13.5px" }}>
                    Choose between 30-Second Rapid or 1-Minute period analytical dashboards based on your research preference.
                  </p>
                </div>

                <div className="howto-step-box">
                  <div className="step-number-badge">2</div>
                  <h3 className="card-title" style={{ fontSize: "16px" }}>Observe PRNG Matrices</h3>
                  <p className="card-text" style={{ fontSize: "13.5px" }}>
                    Inspect real-time BIG/SMALL distributions, color streaks, and statistical parity indicators updated each cycle.
                  </p>
                </div>

                <div className="howto-step-box">
                  <div className="step-number-badge">3</div>
                  <h3 className="card-title" style={{ fontSize: "16px" }}>Evaluate Probabilities</h3>
                  <p className="card-text" style={{ fontSize: "13.5px" }}>
                    Compare historical frequency distributions against mathematical expectations to observe sequence variations.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 7. Platform Mission */}
          <section className="about-section" aria-labelledby="mission-heading">
            <div className="mission-card">
              <div className="section-header">
                <h2 id="mission-heading">
                  <span className="section-header-bar" />
                  Our Research Mission
                </h2>
              </div>
              <p className="p-body">
                TRION AI was created by a dedicated data science team to provide clear structure to fast-paced period sequence tracking.
              </p>
              <p className="p-body">
                Our analytical engine aggregates sequence lengths, color-parity ratios, and statistical distributions into high-visibility dashboards.
              </p>
              <div className="mission-quote-pill">
                “Our goal is not to promise certainty — it is to make numerical data transparent, structured, and accessible for research.”
              </div>
            </div>
          </section>

          {/* 8. Core Technology */}
          <section className="about-section" aria-labelledby="technology-heading">
            <div className="section-header">
              <h2 id="technology-heading">
                <span className="section-header-bar" />
                How does the TRION AI technology stack operate?
              </h2>
            </div>

            <div className="card-grid-2">
              <div className="tech-horizontal-card">
                <div className="card-icon-wrap" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                    <line x1="6" y1="6" x2="6.01" y2="6" />
                    <line x1="6" y1="18" x2="6.01" y2="18" />
                  </svg>
                </div>
                <div>
                  <h3 className="card-title">PRNG Sequence Matrices</h3>
                  <p className="card-text">
                    Mathematical algorithms compute frequency balance metrics and sequence streak lengths across historical periods.
                  </p>
                </div>
              </div>

              <div className="tech-horizontal-card">
                <div className="card-icon-wrap" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="card-title">Sub-Second Signal Processing</h3>
                  <p className="card-text">
                    Period data updates are processed and displayed with minimal latency immediately upon conclusion of each cycle.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 9. Core Analytical Modules */}
          <section className="about-section" aria-labelledby="modules-heading">
            <div className="section-header">
              <h2 id="modules-heading">
                <span className="section-header-bar" />
                Specialized Analytical Modules
              </h2>
              <p className="section-subtext">
                Explore our purpose-built engines designed for distinct statistical observation needs:
              </p>
            </div>

            <div className="card-grid-2">
              <div className="clean-card">
                <div className="card-icon-wrap" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <h3 className="card-title">WinGo 30s Rapid Engine</h3>
                <p className="card-text">
                  Continuous probability-trend observation and period-history tracking across 30-second cycles.
                </p>
              </div>

              <div className="clean-card">
                <div className="card-icon-wrap" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 20V10" />
                    <path d="M12 20V4" />
                    <path d="M6 20v-6" />
                  </svg>
                </div>
                <h3 className="card-title">WinGo 1-Min Tools</h3>
                <p className="card-text">
                  60-second period analysis with confidence scoring, color-parity breakdown, and streak-based notifications.
                </p>
              </div>

              <div className="clean-card">
                <div className="card-icon-wrap" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="6" cy="6" r="3" />
                    <circle cx="18" cy="18" r="3" />
                    <line x1="8.59" y1="8.59" x2="15.42" y2="15.42" />
                  </svg>
                </div>
                <h3 className="card-title">Sequence Pattern Analyzer</h3>
                <p className="card-text">
                  Matrix-based visualization of BIG/SMALL streak lengths, numerical sequences, and odd/even distribution patterns.
                </p>
              </div>

              <div className="clean-card">
                <div className="card-icon-wrap" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="4" y="4" width="16" height="16" rx="2" />
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
                </div>
                <h3 className="card-title">AI Neural Forecast Engine</h3>
                <p className="card-text">
                  Mathematical model-based trend forecasting designed to visualize potential statistical patterns within historical data.
                </p>
              </div>
            </div>
          </section>

          {/* 10. Privacy & Minimal Data Storage */}
          <section className="about-section" aria-labelledby="privacy-storage-heading">
            <div className="privacy-comparison-container">
              <div className="section-header">
                <h2 id="privacy-storage-heading">
                  <span className="section-header-bar" />
                  How does TRION AI protect user privacy and account data?
                </h2>

                {/* Direct Answer Signal */}
                <div className="direct-answer-callout">
                  <p>
                    <strong>Direct Answer:</strong> TRION AI adheres to the principle of data minimization as outlined in modern{" "}
                    <a
                      href="https://en.wikipedia.org/wiki/General_Data_Protection_Regulation"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="source-link"
                    >
                      privacy frameworks (GDPR)
                    </a>
                    . We only store basic Google OAuth profile info (name, email, avatar) and never store banking or financial credentials.
                  </p>
                </div>
              </div>

              <div className="comparison-grid">
                <div className="comparison-box stored">
                  <div className="comparison-box-title">
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Account Data We Store</span>
                  </div>
                  <ul className="comparison-list">
                    <li>
                      <span className="icon-check">✓</span> Full Name (OAuth)
                    </li>
                    <li>
                      <span className="icon-check">✓</span> Email Address (OAuth)
                    </li>
                    <li>
                      <span className="icon-check">✓</span> Profile Picture URL
                    </li>
                  </ul>
                </div>

                <div className="comparison-box not-stored">
                  <div className="comparison-box-title">
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    <span>Data We NEVER Store</span>
                  </div>
                  <ul className="comparison-list">
                    <li>
                      <span className="icon-cross">✕</span> Banking details &amp; card numbers
                    </li>
                    <li>
                      <span className="icon-cross">✕</span> UPI IDs or payment wallets
                    </li>
                    <li>
                      <span className="icon-cross">✕</span> Phone numbers or government IDs
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 11. Right to Deletion */}
          <section className="about-section" aria-labelledby="deletion-heading">
            <div className="deletion-card">
              <div>
                <h3
                  id="deletion-heading"
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#0f172a",
                    margin: "0 0 6px 0",
                  }}
                >
                  How to request permanent account data deletion?
                </h3>
                <p className="p-body" style={{ maxWidth: "600px", margin: 0 }}>
                  Users have the fundamental right to delete their stored profile information at any time. Simply submit a deletion request via our support desk, and all records will be permanently purged within 1–2 business days.
                </p>
              </div>
              <Link href="/contact" className="btn-secondary" style={{ flexShrink: 0 }}>
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span>Contact Support</span>
              </Link>
            </div>
          </section>

          {/* 12. Frequently Asked Questions (FAQ Section) */}
          <section className="about-section" aria-labelledby="faq-section-heading">
            <div className="clean-card" style={{ padding: "30px 34px" }}>
              <div className="section-header">
                <h2 id="faq-section-heading">
                  <span className="section-header-bar" />
                  Frequently Asked Questions (FAQ) About TRION AI
                </h2>
                <p className="section-subtext">
                  Direct answers to common questions regarding TRION AI software, analytical models, and security:
                </p>
              </div>

              <div className="faq-accordion" role="region" aria-label="FAQ Accordion">
                {ABOUT_FAQS.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={idx} className={`faq-card ${isOpen ? "open" : ""}`}>
                      <button
                        className="faq-trigger"
                        onClick={() => toggleFaq(idx)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-answer-${idx}`}
                        id={`faq-question-${idx}`}
                        type="button"
                      >
                        <span className="faq-question-text">{faq.question}</span>
                        <svg
                          className={`faq-icon-arrow ${isOpen ? "rotated" : ""}`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                      {isOpen && (
                        <div
                          id={`faq-answer-${idx}`}
                          className="faq-answer-panel"
                          role="region"
                          aria-labelledby={`faq-question-${idx}`}
                        >
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 13. Educational & Statistical Research */}
          <section className="about-section" aria-labelledby="education-heading">
            <div className="clean-card" style={{ padding: "30px 34px" }}>
              <div className="section-header">
                <h2 id="education-heading">
                  <span className="section-header-bar" />
                  Statistical &amp; Probability Research Disclaimer
                </h2>
              </div>
              <p className="p-body">
                All historical indicators and pattern matrices generated by TRION AI represent mathematical probabilities derived from historical distributions.
              </p>
              <p className="p-body">
                Because draw sequences are determined by pseudo-random number generator (PRNG) algorithms, deterministic prediction is mathematically impossible. Our analytical tools are created purely for educational study, sequence observation, and statistical modeling.
              </p>

              <div className="quote-highlight-card">
                <div className="quote-main">
                  “Data analysis is about understanding probabilities, not predicting absolute certainty.”
                </div>
                <p className="quote-sub">
                  Our commitment is providing clean visual metrics, minimal personal data retention, and complete operational transparency.
                </p>
              </div>
            </div>
          </section>

          {/* 14. Advertising Disclaimer */}
          <section className="about-section" aria-labelledby="ads-heading">
            <div className="clean-card" style={{ padding: "30px 34px" }}>
              <div className="section-header">
                <h2 id="ads-heading">
                  <span className="section-header-bar" />
                  Revenue Model &amp; Third-Party Advertising
                </h2>
                <p className="section-subtext">
                  To keep our services accessible without direct software fees, the website may display third-party advertisements from advertising networks such as Google Ads or Adsterra.
                </p>
              </div>

              <div className="card-grid-3" style={{ marginTop: "18px" }}>
                <div
                  style={{
                    background: "rgba(0, 152, 91, 0.03)",
                    border: "1px solid rgba(0, 152, 91, 0.14)",
                    borderRadius: "14px",
                    padding: "18px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "15.5px",
                      fontWeight: 700,
                      color: "#0f172a",
                      margin: "0 0 6px 0",
                    }}
                  >
                    User Responsibility
                  </h3>
                  <p className="p-body" style={{ fontSize: "13.5px", margin: 0 }}>
                    Clicking advertisement banners or visiting sponsored external links is entirely the user&apos;s choice and responsibility.
                  </p>
                </div>

                <div
                  style={{
                    background: "rgba(0, 152, 91, 0.03)",
                    border: "1px solid rgba(0, 152, 91, 0.14)",
                    borderRadius: "14px",
                    padding: "18px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "15.5px",
                      fontWeight: 700,
                      color: "#0f172a",
                      margin: "0 0 6px 0",
                    }}
                  >
                    Third-Party Responsibility
                  </h3>
                  <p className="p-body" style={{ fontSize: "13.5px", margin: 0 }}>
                    TRION AI is not responsible for the offers, products, services, or claims made on external third-party advertiser websites.
                  </p>
                </div>

                <div
                  style={{
                    background: "rgba(0, 152, 91, 0.03)",
                    border: "1px solid rgba(0, 152, 91, 0.14)",
                    borderRadius: "14px",
                    padding: "18px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "15.5px",
                      fontWeight: 700,
                      color: "#0f172a",
                      margin: "0 0 6px 0",
                    }}
                  >
                    External Websites
                  </h3>
                  <p className="p-body" style={{ fontSize: "13.5px", margin: 0 }}>
                    Users should practice proper due diligence and verify terms before providing information on external sites.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 15. Legal & Responsible Use */}
          <section className="about-section" aria-labelledby="legal-heading">
            <div className="clean-card" style={{ padding: "30px 34px" }}>
              <div className="age-pill">
                <svg
                  viewBox="0 0 24 24"
                  width="12"
                  height="12"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>18+ Age Requirement</span>
              </div>

              <div className="section-header">
                <h2 id="legal-heading">
                  <span className="section-header-bar" />
                  Legal &amp; Responsible Use Guidelines
                </h2>
              </div>
              <p className="p-body">
                TRION AI is an independent data analysis tool. It does not operate, facilitate, or host gaming or betting services.
              </p>
              <p className="p-body">
                Users must be at least 18 years of age to access and use the platform.
              </p>
              <p className="p-body" style={{ color: "#64748b", fontSize: "13.5px" }}>
                Users are solely responsible for ensuring that their use of analytical research tools complies with all local laws and regulatory guidelines in their home jurisdiction.
              </p>
            </div>
          </section>

          {/* 16. Transparency Section */}
          <section className="about-section" aria-labelledby="transparency-heading">
            <div className="section-header centered">
              <h2 id="transparency-heading">
                <span className="section-header-bar" />
                Built Around Three Core Pillars
              </h2>
              <p className="section-subtext">
                Our analytical software is developed around three uncompromising standards:
              </p>
            </div>

            <div className="card-grid-3">
              <div className="transparency-pillar">
                <div className="transparency-pillar-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3 className="transparency-pillar-title">1. Independent</h3>
                <p className="transparency-pillar-desc">
                  We operate as an autonomous research platform with zero ties to commercial gaming houses.
                </p>
              </div>

              <div className="transparency-pillar">
                <div className="transparency-pillar-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h3 className="transparency-pillar-title">2. Data-Minimal</h3>
                <p className="transparency-pillar-desc">
                  We collect strictly essential OAuth profile data, preserving your privacy and personal security.
                </p>
              </div>

              <div className="transparency-pillar">
                <div className="transparency-pillar-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                    <path d="M22 12A10 10 0 0 0 12 2v10z" />
                  </svg>
                </div>
                <h3 className="transparency-pillar-title">3. Probability-Based</h3>
                <p className="transparency-pillar-desc">
                  All metrics illustrate statistical pattern probabilities rather than unscientific claims of certainty.
                </p>
              </div>
            </div>
          </section>

          {/* 17. Final Quote & CTA Container */}
          <section className="final-section" aria-labelledby="cta-heading">
            <div style={{ maxWidth: "700px", margin: "0 auto 28px auto" }}>
              <div
                style={{
                  fontSize: "clamp(19px, 3vw, 24px)",
                  fontWeight: 800,
                  color: "#0f172a",
                  lineHeight: 1.35,
                  marginBottom: "10px",
                }}
              >
                “Data analysis is about understanding probabilities, not predicting absolute certainty.”
              </div>
              <p
                style={{
                  fontSize: "14.5px",
                  color: "#007543",
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                TRION AI is committed to building clean, transparent, and research-oriented analytical tools.
              </p>
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(0, 152, 91, 0.15)",
                paddingTop: "28px",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              <h2
                id="cta-heading"
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "#0f172a",
                  margin: "0 0 8px 0",
                }}
              >
                Explore TRION AI Analytics
              </h2>
              <p
                style={{
                  fontSize: "14.5px",
                  color: "#475569",
                  margin: "0 0 22px 0",
                }}
              >
                Start exploring our period history dashboards, trend matrices, and mathematical sequence tools today.
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "14px",
                  flexWrap: "wrap",
                }}
              >
                <Link href="/login" className="btn-primary">
                  <span>Explore Platform</span>
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Link href="/contact" className="btn-secondary">
                  <span>Contact Support</span>
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <SiteFooter />
      </div>
    </>
  );
}
