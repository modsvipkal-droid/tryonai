import { useState, useEffect } from "react";
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

const PAGE_URL = "https://wingo30.com/responsible-gambling";
const PAGE_TITLE = "Responsible Gaming & 18+ Policy";
const PAGE_DESC =
  "Learn about TRION AI's 18+ responsible-use policy, legal awareness, financial safety guidance, privacy practices and mental well-being resources for TRION AI users.";

const RESPONSIBLE_FAQS = [
  {
    question: "Is TRION AI an online casino or gambling platform?",
    answer:
      "No. TRION AI is strictly an independent mathematical pattern visualization and data-analysis software tool. We do not operate, organize, host, or support any game, online casino, lottery, or betting operator."
  },
  {
    question: "What is the minimum age requirement to use TRION AI?",
    answer:
      "Access to TRION AI is strictly restricted to adults aged 18 years or older. Minors must not access probabilistic sequence-analysis tools in connection with real-money or gaming activities."
  },
  {
    question: "Can TRION AI guarantee prediction accuracy or profits?",
    answer:
      "No. Statistical and PRNG-based models represent mathematical probabilities and historical distributions. They cannot guarantee outcomes or provide zero-risk results. Probability does not equal certainty."
  },
  {
    question: "Does TRION AI collect or store user bank account or UPI details?",
    answer:
      "No. TRION AI enforces a zero financial data footprint. We do not collect, process, or store bank account numbers, UPI IDs, credit/debit card details, or digital wallet balances."
  },
  {
    question: "Where can I find mental health or responsible gaming support in India?",
    answer:
      "For emotional distress or technology overuse support in India, you can reach the Government of India Tele-MANAS toll-free helpline at 14416 (or 1800-891-4416) or the NIMHANS Bengaluru SHUT Clinic at 080-26995540."
  }
];

const CHECKLIST_ITEMS = [
  { id: "age", text: "Am I 18 years of age or older?" },
  { id: "math", text: "Do I understand that statistical analysis cannot guarantee outcomes?" },
  { id: "budget", text: "Am I using only money I can afford to lose, if money is involved elsewhere?" },
  { id: "time", text: "Have I set a firm time limit for my screen session today?" },
  { id: "calm", text: "Am I calm, rested, and making decisions without emotional pressure?" },
  { id: "laws", text: "Am I fully complying with the local laws and regulations of my state/jurisdiction?" }
];

const pageStyles = `
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

  .rg-page {
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
  .rg-page::before {
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

  .rg-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.18;
    pointer-events: none;
    z-index: 0;
    animation: floatOrb 18s ease-in-out infinite alternate;
  }
  .rg-orb-1 {
    width: 420px;
    height: 420px;
    background: #00985b;
    top: -100px;
    right: -100px;
  }
  .rg-orb-2 {
    width: 340px;
    height: 340px;
    background: #10b981;
    bottom: 80px;
    left: -80px;
    animation-delay: -7s;
  }
  @keyframes floatOrb {
    from { transform: translate(0, 0) scale(1); }
    to { transform: translate(25px, 35px) scale(1.08); }
  }

  /* Top sticky navigation */
  .rg-nav {
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
  .rg-nav-left {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
  }
  .rg-nav-back {
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
    text-decoration: none;
    flex-shrink: 0;
  }
  .rg-nav-back:hover {
    background: #00985b;
    border-color: #00985b;
    color: #ffffff;
    transform: translateX(-2px);
    box-shadow: 0 4px 14px rgba(0, 152, 91, 0.22);
  }
  .rg-nav-brand-img {
    display: inline-flex;
    align-items: center;
    height: auto;
  }
  .rg-nav-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(0, 152, 91, 0.09);
    border: 1px solid rgba(0, 152, 91, 0.24);
    color: #007543;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 50px;
    font-family: 'TrionAIAbout', sans-serif !important;
  }

  @media (max-width: 640px) {
    .rg-nav {
      padding: 10px 16px;
    }
    .rg-nav-left {
      gap: 10px;
    }
    .rg-nav-back {
      padding: 6px 12px;
      font-size: 12px;
    }
    .rg-nav-pill {
      font-size: 10.5px;
      padding: 4px 10px;
    }
  }

  /* Main Container */
  .rg-container {
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

  /* Section Spacing & Rhythm */
  .rg-section {
    margin-bottom: 52px;
    width: 100%;
  }
  @media (max-width: 768px) {
    .rg-section {
      margin-bottom: 38px;
    }
    .rg-container {
      padding: 0 16px;
      margin-top: 24px;
    }
  }

  /* Hero Section */
  .rg-hero {
    text-align: center;
    margin-bottom: 48px;
    padding: 10px 0 6px 0;
    width: 100%;
  }
  .rg-eyebrow {
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
  }
  .rg-eyebrow-dot {
    width: 6px;
    height: 6px;
    background: #00985b;
    border-radius: 50%;
  }
  .rg-hero h1 {
    font-size: clamp(28px, 4.8vw, 42px);
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 14px 0;
    letter-spacing: -0.025em;
    line-height: 1.2;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .rg-hero h1 span {
    color: #00985b;
  }
  .rg-hero-desc {
    font-size: 15.5px;
    line-height: 1.75;
    color: #475569;
    max-width: 740px;
    margin: 0 auto 22px auto;
    font-weight: 400;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .rg-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.24);
    box-shadow: 0 2px 10px rgba(0, 75, 47, 0.04);
    color: #005537;
    font-size: 13px;
    font-weight: 700;
    padding: 7px 20px;
    border-radius: 50px;
    font-family: 'TrionAIAbout', sans-serif !important;
  }

  /* Notice Callout Box */
  .rg-notice-card {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.22);
    border-left: 5px solid #00985b;
    border-radius: 18px;
    padding: 28px 32px;
    box-shadow: 0 6px 20px rgba(0, 75, 47, 0.04);
    margin-bottom: 44px;
    transition: border-color 0.22s ease;
  }
  .rg-notice-head {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }
  .rg-notice-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(0, 152, 91, 0.1);
    color: #007543;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .rg-notice-title {
    font-size: 18.5px;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
    letter-spacing: -0.01em;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .rg-notice-body {
    font-size: 15px;
    line-height: 1.72;
    color: #334155;
    margin: 0 0 10px 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .rg-notice-body:last-child {
    margin-bottom: 0;
  }
  .rg-notice-highlight {
    color: #007543;
    font-weight: 700;
  }
  @media (max-width: 640px) {
    .rg-notice-card {
      padding: 22px 18px;
    }
    .rg-notice-title {
      font-size: 17px;
    }
  }

  /* Section Headers */
  .section-header {
    margin-bottom: 22px;
  }
  .section-header h2 {
    font-size: clamp(21px, 3.2vw, 26px);
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 8px 0;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 12px;
    line-height: 1.3;
    font-family: 'TrionAIAbout', sans-serif !important;
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
    line-height: 1.68;
    color: #475569;
    margin: 0;
    max-width: 760px;
    font-family: 'TrionAIAbout', sans-serif !important;
  }

  /* 2-Column Responsive Grid */
  .rg-grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  @media (max-width: 840px) {
    .rg-grid-2 {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }

  /* Standard Card */
  .rg-card {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.16);
    border-radius: 18px;
    padding: 28px 30px;
    box-shadow: 0 4px 18px rgba(0, 75, 47, 0.03);
    transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .rg-card:hover {
    transform: translateY(-2px);
    border-color: rgba(0, 152, 91, 0.35);
    box-shadow: 0 8px 24px rgba(0, 75, 47, 0.06);
  }
  @media (max-width: 640px) {
    .rg-card {
      padding: 22px 18px;
    }
  }

  .rg-card-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: rgba(0, 152, 91, 0.08);
    border: 1px solid rgba(0, 152, 91, 0.2);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #007543;
    margin-bottom: 16px;
    flex-shrink: 0;
  }
  .rg-card-title {
    font-size: 17.5px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 10px 0;
    line-height: 1.35;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .rg-card-text {
    font-size: 14.5px;
    line-height: 1.7;
    color: #475569;
    margin: 0 0 12px 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .rg-card-text:last-child {
    margin-bottom: 0;
  }
  .rg-badge-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(0, 152, 91, 0.07);
    border: 1px solid rgba(0, 152, 91, 0.18);
    color: #007543;
    font-size: 12px;
    font-weight: 700;
    padding: 5px 14px;
    border-radius: 50px;
    margin-top: 14px;
    width: fit-content;
    font-family: 'TrionAIAbout', sans-serif !important;
  }

  /* 18+ Barrier Banner */
  .rg-age-banner {
    background: linear-gradient(135deg, rgba(0, 152, 91, 0.08) 0%, rgba(255, 255, 255, 0.96) 50%, rgba(16, 185, 129, 0.06) 100%);
    border: 1.5px solid rgba(0, 152, 91, 0.25);
    border-radius: 20px;
    padding: 32px 36px;
    display: flex;
    align-items: center;
    gap: 26px;
    box-shadow: 0 6px 20px rgba(0, 75, 47, 0.04);
  }
  .rg-age-badge-huge {
    width: 80px;
    height: 80px;
    border-radius: 18px;
    background: #00985b;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 23px;
    line-height: 1;
    flex-shrink: 0;
    box-shadow: 0 4px 16px rgba(0, 152, 91, 0.28);
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .rg-age-badge-huge span {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.08em;
    margin-top: 4px;
    text-transform: uppercase;
    opacity: 0.95;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .rg-age-content {
    flex: 1;
  }
  .rg-age-tag {
    font-size: 11.5px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #007543;
    margin-bottom: 6px;
    display: block;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .rg-age-content h2 {
    font-size: 20px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 10px 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .rg-age-content p {
    font-size: 14.5px;
    line-height: 1.7;
    color: #334155;
    margin: 0 0 8px 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .rg-age-content p:last-child {
    margin-bottom: 0;
  }
  @media (max-width: 768px) {
    .rg-age-banner {
      flex-direction: column;
      align-items: flex-start;
      padding: 24px 20px;
      gap: 16px;
    }
    .rg-age-badge-huge {
      width: 68px;
      height: 68px;
      font-size: 19px;
    }
  }

  /* Numbered Legal Framework Cards */
  .rg-legal-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .rg-legal-item {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.16);
    border-radius: 16px;
    padding: 24px 28px;
    display: flex;
    align-items: flex-start;
    gap: 18px;
    box-shadow: 0 4px 16px rgba(0, 75, 47, 0.03);
    transition: border-color 0.22s ease, transform 0.22s ease;
  }
  .rg-legal-item:hover {
    border-color: rgba(0, 152, 91, 0.35);
    transform: translateY(-2px);
  }
  .rg-legal-num {
    font-size: 15px;
    font-weight: 800;
    color: #007543;
    background: rgba(0, 152, 91, 0.1);
    border: 1px solid rgba(0, 152, 91, 0.2);
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .rg-legal-item-content {
    flex: 1;
  }
  .rg-legal-item-title {
    font-size: 16.5px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 8px 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .rg-legal-item-desc {
    font-size: 14.5px;
    line-height: 1.7;
    color: #475569;
    margin: 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  @media (max-width: 640px) {
    .rg-legal-item {
      flex-direction: column;
      padding: 20px 18px;
      gap: 12px;
    }
  }

  .rg-state-note {
    background: rgba(0, 152, 91, 0.05);
    border: 1px dashed rgba(0, 152, 91, 0.3);
    border-radius: 14px;
    padding: 16px 20px;
    margin-top: 16px;
    font-size: 13.5px;
    line-height: 1.68;
    color: #334155;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .rg-state-note strong {
    color: #007543;
  }

  /* Zero Financial Data Footprint Box */
  .rg-privacy-box {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.18);
    border-radius: 18px;
    padding: 30px 34px;
    box-shadow: 0 4px 18px rgba(0, 75, 47, 0.03);
  }
  .rg-privacy-checklist {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 14px;
    margin: 22px 0 20px 0;
    padding: 0;
    list-style: none;
  }
  .rg-privacy-check-item {
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(0, 152, 91, 0.05);
    border: 1px solid rgba(0, 152, 91, 0.18);
    border-radius: 12px;
    padding: 13px 18px;
    font-size: 14px;
    font-weight: 700;
    color: #005537;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .rg-check-icon {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #00985b;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 900;
    flex-shrink: 0;
  }
  @media (max-width: 640px) {
    .rg-privacy-box {
      padding: 22px 18px;
    }
    .rg-privacy-checklist {
      grid-template-columns: 1fr;
      gap: 10px;
    }
  }

  /* 4 Pillars Habits Grid */
  .rg-habits-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  @media (max-width: 840px) {
    .rg-habits-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }
  .rg-habit-card {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.16);
    border-radius: 18px;
    padding: 28px 30px;
    box-shadow: 0 4px 18px rgba(0, 75, 47, 0.03);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: transform 0.22s ease, border-color 0.22s ease;
  }
  .rg-habit-card:hover {
    transform: translateY(-2px);
    border-color: rgba(0, 152, 91, 0.35);
  }
  .rg-habit-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .rg-habit-num {
    font-size: 12px;
    font-weight: 800;
    color: #007543;
    background: rgba(0, 152, 91, 0.09);
    padding: 4px 12px;
    border-radius: 50px;
    letter-spacing: 0.05em;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .rg-habit-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: rgba(0, 152, 91, 0.08);
    color: #007543;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .rg-habit-title {
    font-size: 17px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 10px 0;
    line-height: 1.35;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .rg-habit-desc {
    font-size: 14.5px;
    line-height: 1.7;
    color: #475569;
    margin: 0 0 16px 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .rg-habit-highlight {
    background: linear-gradient(135deg, rgba(0, 152, 91, 0.08) 0%, rgba(16, 185, 129, 0.04) 100%);
    border: 1px solid rgba(0, 152, 91, 0.2);
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 13px;
    font-weight: 800;
    color: #007543;
    margin-top: auto;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  @media (max-width: 640px) {
    .rg-habit-card {
      padding: 22px 18px;
    }
  }

  /* Scannable Self-Assessment Checklist */
  .rg-checklist-card {
    background: linear-gradient(135deg, #ffffff 0%, #f8fdfa 100%);
    border: 1.5px solid rgba(0, 152, 91, 0.22);
    border-radius: 18px;
    padding: 30px 34px;
    box-shadow: 0 6px 20px rgba(0, 75, 47, 0.04);
  }
  .rg-checklist-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 20px;
  }
  .rg-check-row {
    display: flex;
    align-items: center;
    gap: 14px;
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.16);
    border-radius: 12px;
    padding: 14px 18px;
    cursor: pointer;
    user-select: none;
    transition: all 0.2s ease;
  }
  .rg-check-row:hover {
    border-color: #00985b;
    background: rgba(0, 152, 91, 0.02);
  }
  .rg-check-row.active {
    background: rgba(0, 152, 91, 0.06);
    border-color: rgba(0, 152, 91, 0.35);
  }
  .rg-check-box {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    border: 2px solid #00985b;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 12px;
    font-weight: 900;
    background: #ffffff;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }
  .rg-check-row.active .rg-check-box {
    background: #00985b;
  }
  .rg-check-label {
    font-size: 14.5px;
    color: #1e293b;
    font-weight: 600;
    line-height: 1.5;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  @media (max-width: 640px) {
    .rg-checklist-card {
      padding: 22px 18px;
    }
    .rg-check-row {
      padding: 12px 14px;
      gap: 12px;
    }
    .rg-check-label {
      font-size: 13.5px;
    }
  }

  /* Mental Well-Being Calm Section */
  .rg-wellbeing-card {
    background: linear-gradient(135deg, rgba(0, 152, 91, 0.06) 0%, rgba(255, 255, 255, 0.96) 50%, rgba(16, 185, 129, 0.04) 100%);
    border: 1px solid rgba(0, 152, 91, 0.22);
    border-radius: 18px;
    padding: 34px 38px;
    text-align: center;
    box-shadow: 0 6px 20px rgba(0, 75, 47, 0.03);
  }
  .rg-wellbeing-heart {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(0, 152, 91, 0.1);
    color: #007543;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }
  .rg-wellbeing-card h2 {
    font-size: clamp(22px, 3.4vw, 27px);
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 14px 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .rg-wellbeing-text {
    font-size: 15.5px;
    line-height: 1.75;
    color: #334155;
    max-width: 740px;
    margin: 0 auto 12px auto;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .rg-wellbeing-highlight {
    font-size: 15px;
    font-weight: 800;
    color: #007543;
    margin-top: 14px;
    display: block;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  @media (max-width: 640px) {
    .rg-wellbeing-card {
      padding: 24px 20px;
    }
  }

  /* India Helplines Grid */
  .rg-helpline-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  @media (max-width: 800px) {
    .rg-helpline-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }
  .rg-helpline-card {
    background: #ffffff;
    border: 1.5px solid rgba(0, 152, 91, 0.2);
    border-radius: 18px;
    padding: 28px 30px;
    box-shadow: 0 4px 18px rgba(0, 75, 47, 0.04);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
  }
  .rg-helpline-card:hover {
    transform: translateY(-2px);
    border-color: #00985b;
    box-shadow: 0 8px 24px rgba(0, 152, 91, 0.12);
  }
  .rg-helpline-badge {
    font-size: 11.5px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #007543;
    background: rgba(0, 152, 91, 0.08);
    padding: 4px 12px;
    border-radius: 50px;
    width: fit-content;
    margin-bottom: 12px;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .rg-helpline-name {
    font-size: 19px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 6px 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .rg-helpline-desc {
    font-size: 14px;
    line-height: 1.68;
    color: #475569;
    margin: 0 0 18px 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .rg-call-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: auto;
  }
  .rg-call-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: #00985b;
    color: #ffffff !important;
    font-size: 15px;
    font-weight: 800;
    padding: 13px 20px;
    border-radius: 14px;
    text-decoration: none;
    min-height: 50px;
    transition: all 0.22s ease;
    box-shadow: 0 4px 14px rgba(0, 152, 91, 0.24);
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .rg-call-btn:hover {
    background: #007543;
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 152, 91, 0.32);
    color: #ffffff !important;
  }
  .rg-call-btn-alt {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: rgba(0, 152, 91, 0.06);
    border: 1px solid rgba(0, 152, 91, 0.22);
    color: #007543 !important;
    font-size: 13.5px;
    font-weight: 700;
    padding: 10px 16px;
    border-radius: 12px;
    text-decoration: none;
    transition: all 0.22s ease;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .rg-call-btn-alt:hover {
    background: rgba(0, 152, 91, 0.12);
    border-color: #00985b;
    color: #005537 !important;
  }
  @media (max-width: 640px) {
    .rg-helpline-card {
      padding: 22px 18px;
    }
  }

  /* FAQ Accordion */
  .rg-faq-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .rg-faq-item {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.16);
    border-radius: 16px;
    overflow: hidden;
    transition: border-color 0.22s ease;
  }
  .rg-faq-item.open {
    border-color: rgba(0, 152, 91, 0.35);
  }
  .rg-faq-btn {
    width: 100%;
    padding: 18px 22px;
    text-align: left;
    background: transparent;
    border: none;
    outline: none;
    font-family: 'TrionAIAbout', sans-serif !important;
    font-size: 15.5px;
    font-weight: 700;
    color: #0f172a;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    cursor: pointer;
  }
  .rg-faq-btn svg {
    transition: transform 0.25s ease;
    flex-shrink: 0;
    color: #007543;
  }
  .rg-faq-item.open .rg-faq-btn svg {
    transform: rotate(180deg);
  }
  .rg-faq-ans {
    padding: 0 22px 18px 22px;
    font-size: 14.5px;
    line-height: 1.7;
    color: #475569;
    font-family: 'TrionAIAbout', sans-serif !important;
  }

  /* Help-First Bottom CTA Section */
  .rg-help-cta {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.2);
    border-radius: 18px;
    padding: 34px 38px;
    text-align: center;
    box-shadow: 0 4px 18px rgba(0, 75, 47, 0.04);
  }
  .rg-help-cta h2 {
    font-size: clamp(21px, 3.2vw, 26px);
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 10px 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .rg-help-cta p {
    font-size: 15px;
    line-height: 1.7;
    color: #475569;
    max-width: 640px;
    margin: 0 auto 22px auto;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .rg-cta-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  .btn-primary-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: #00985b;
    color: #ffffff !important;
    font-size: 14.5px;
    font-weight: 700;
    padding: 12px 26px;
    border-radius: 14px;
    text-decoration: none;
    min-height: 48px;
    transition: all 0.22s ease;
    box-shadow: 0 4px 14px rgba(0, 152, 91, 0.25);
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .btn-primary-action:hover {
    background: #007543;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 152, 91, 0.32);
    color: #ffffff !important;
  }
  .btn-secondary-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: #ffffff;
    color: #007543 !important;
    font-size: 14.5px;
    font-weight: 700;
    padding: 12px 22px;
    border-radius: 14px;
    text-decoration: none;
    min-height: 48px;
    border: 1px solid rgba(0, 152, 91, 0.28);
    transition: all 0.22s ease;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .btn-secondary-action:hover {
    background: rgba(0, 152, 91, 0.05);
    border-color: #00985b;
    transform: translateY(-2px);
    color: #005537 !important;
  }
  @media (max-width: 640px) {
    .rg-help-cta {
      padding: 24px 18px;
    }
    .rg-cta-actions {
      flex-direction: column;
      gap: 10px;
    }
    .btn-primary-action, .btn-secondary-action {
      width: 100%;
    }
  }

  /* Final Quote Statement */
  .rg-quote-box {
    margin: 36px auto 12px auto;
    text-align: center;
    max-width: 800px;
    padding: 20px 16px;
  }
  .rg-quote-text {
    font-size: clamp(16px, 2.5vw, 20px);
    font-weight: 800;
    color: #005537;
    line-height: 1.6;
    margin: 0 0 10px 0;
    letter-spacing: -0.01em;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .rg-quote-sub {
    font-size: 13.5px;
    font-weight: 700;
    color: #64748b;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    font-family: 'TrionAIAbout', sans-serif !important;
  }

  /* Internal Link References */
  .rg-inline-link {
    color: #007543;
    text-decoration: underline;
    text-underline-offset: 3px;
    font-weight: 700;
    transition: color 0.2s ease;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .rg-inline-link:hover {
    color: #00985b;
  }

  /* Accessibility and reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .rg-orb, .rg-container, .rg-card, .rg-legal-item, .rg-habit-card, .rg-helpline-card {
      animation: none !important;
      transition: none !important;
      transform: none !important;
    }
  }
`;

export default function ResponsibleGamblingPage() {
  const router = useRouter();
  const [checkedItems, setCheckedItems] = useState({});
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const next = document.getElementById("__next");

    html.classList.add("rg-page");
    body.classList.add("rg-page");

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
      html.classList.remove("rg-page");
      body.classList.remove("rg-page");

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

  const toggleCheck = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  return (
    <>
      <PageHead
        title={PAGE_TITLE}
        description={PAGE_DESC}
        canonical={PAGE_URL}
      >
        <style dangerouslySetInnerHTML={{ __html: pageStyles }} />
      </PageHead>

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wingo30.com/" },
          { name: "Responsible Gaming (18+)", url: PAGE_URL }
        ]}
      />
      <OrganizationSchema />
      <WebsiteSchema />
      <WebPageSchema
        title={PAGE_TITLE}
        description={PAGE_DESC}
        url={PAGE_URL}
        datePublished="2026-09-07T00:00:00+05:30"
        dateModified="2026-09-07T09:30:00+05:30"
      />
      <FAQSchema questions={RESPONSIBLE_FAQS} />

      <div className="rg-page">
        <div className="rg-orb rg-orb-1" aria-hidden="true" />
        <div className="rg-orb rg-orb-2" aria-hidden="true" />

        {/* 1. Header & Navigation */}
        <header className="rg-nav" role="banner">
          <div className="rg-nav-left">
            <button
              className="rg-nav-back"
              onClick={handleBack}
              type="button"
              aria-label="Navigate back to TRION AI home page"
            >
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Home
            </button>
            <Link href="/" className="rg-nav-brand-img" aria-label="TRION AI Home">
              <Image
                src="/trionai.png"
                alt="TRION AI"
                width={204}
                height={32}
                priority
              />
            </Link>
          </div>
        </header>

        <main className="rg-container" id="main-content">
          {/* 3. Hero Section */}
          <section className="rg-hero" aria-labelledby="hero-title">
            <div className="rg-eyebrow">
              <span className="rg-eyebrow-dot" aria-hidden="true" />
              RESPONSIBLE USE • 18+
            </div>
            <h1 id="hero-title">
              18+ Responsible Gaming &amp; <span>Legal Compliance</span>
            </h1>
            <p className="rg-hero-desc">
              TRION AI prioritizes responsible analytical usage, strict 18+ age protection, legal awareness, minimal personal data collection and user well-being.
            </p>
            <div className="rg-status-badge" role="status">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#00985b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Adults Only · Use Responsibly
            </div>
          </section>

          {/* 4. Important Notice Container */}
          <section className="rg-notice-card" aria-label="Responsible Gaming & Legal Advisory">
            <div className="rg-notice-head">
              <div className="rg-notice-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h2 className="rg-notice-title">Responsible Gaming &amp; Legal Advisory</h2>
            </div>
            <p className="rg-notice-body">
              TRION AI is designed with responsible analytical usage, strict 18+ age requirements, awareness of applicable Indian laws and user well-being in mind.
            </p>
            <p className="rg-notice-body rg-notice-highlight">
              Users are responsible for understanding and complying with the laws and regulations applicable to their own location.
            </p>
          </section>

          {/* 5 & 6. Independent Data Science Declaration & Third-Party Ad Links */}
          <section className="rg-section">
            <div className="rg-grid-2">
              {/* 5. Independent Data Science Declaration */}
              <div className="rg-card">
                <div>
                  <div className="rg-card-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </div>
                  <h3 className="rg-card-title">Independent Data Science &amp; Probability Tool</h3>
                  <p className="rg-card-text">
                    TRION AI is an independent mathematical pattern visualization and data-analysis software tool.
                  </p>
                  <p className="rg-card-text">
                    We do not operate, organize, host or support any game, online casino or betting operator.
                  </p>
                  <p className="rg-card-text">
                    The software is designed for mathematical distribution analysis, historical PRNG period-sequence visualization and educational statistical study.
                  </p>
                </div>
                <div className="rg-badge-pill">
                  Independent software · Statistical analysis · Educational research
                </div>
              </div>

              {/* 6. Third-Party Ad Disclaimer */}
              <div className="rg-card">
                <div>
                  <div className="rg-card-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </div>
                  <h3 className="rg-card-title">Third-Party Ad Links &amp; User Discretion</h3>
                  <p className="rg-card-text">
                    Our website may display third-party advertising banners. Clicking an advertisement or visiting an external website through a sponsored link is entirely the user&apos;s own responsibility.
                  </p>
                  <p className="rg-card-text">
                    Users should exercise caution, maintain self-discipline and independently verify the credentials and reliability of any external website before interacting with it.
                  </p>
                </div>
                <div className="rg-badge-pill">
                  External links · Independent verification required
                </div>
              </div>
            </div>
          </section>

          {/* 7. 18+ Age Barrier & Minor Protection */}
          <section className="rg-section" aria-labelledby="age-barrier-title">
            <div className="rg-age-banner">
              <div className="rg-age-badge-huge" aria-label="18 plus only badge">
                18+
                <span>ONLY</span>
              </div>
              <div className="rg-age-content">
                <span className="rg-age-tag">18+ AGE PROTECTION</span>
                <h2 id="age-barrier-title">Strict 18+ Age Barrier &amp; Minor Protection</h2>
                <p>
                  Access to the platform is intended strictly for adults aged 18 years or older.
                </p>
                <p>
                  Minors should not use probabilistic sequence-analysis tools in connection with gaming or real-money activities. Parents and guardians are encouraged to use appropriate parental-control and content-filtering tools on devices used by minors.
                </p>
              </div>
            </div>
          </section>

          {/* 8. Indian Laws & State Regulations */}
          <section className="rg-section" aria-labelledby="legal-laws-title">
            <div className="section-header">
              <h2 id="legal-laws-title">
                <span className="section-header-bar" aria-hidden="true" />
                Indian Gaming Laws &amp; State Regulations
              </h2>
              <p className="section-subtext">
                India has a multi-level legal framework relating to gaming, gambling and real-money activities. Applicable rules can vary by state and by the nature of the activity.
              </p>
            </div>

            <div className="rg-legal-list">
              <div className="rg-legal-item">
                <div className="rg-legal-num" aria-hidden="true">01</div>
                <div className="rg-legal-item-content">
                  <h3 className="rg-legal-item-title">Central Legal Framework</h3>
                  <p className="rg-legal-item-desc">
                    Historical legislation such as the Public Gambling Act, 1867 forms part of India&apos;s broader legal background concerning gambling activities. Its applicability and interaction with later laws must be assessed in the relevant legal context.
                  </p>
                </div>
              </div>

              <div className="rg-legal-item">
                <div className="rg-legal-num" aria-hidden="true">02</div>
                <div className="rg-legal-item-content">
                  <h3 className="rg-legal-item-title">State-Specific Regulations</h3>
                  <p className="rg-legal-item-desc">
                    Different Indian states have enacted or applied their own rules concerning gaming and real-money activities. Users should independently verify the laws applicable in their state or territory before participating in any regulated activity.
                  </p>
                </div>
              </div>

              <div className="rg-legal-item">
                <div className="rg-legal-num" aria-hidden="true">03</div>
                <div className="rg-legal-item-content">
                  <h3 className="rg-legal-item-title">Educational &amp; Analytical Use</h3>
                  <p className="rg-legal-item-desc">
                    Analytical or educational software should not be interpreted as automatically exempt from applicable laws. Users remain responsible for complying with the regulations applicable to their location and intended use.
                  </p>
                </div>
              </div>
            </div>

            <div className="rg-state-note">
              <strong>State Regulatory Context:</strong> Specific jurisdictions (for example, Telangana, Andhra Pradesh, Tamil Nadu, Odisha, Assam, Nagaland, and Sikkim) have enacted distinct state-level gaming and betting regulations or licensing frameworks. This is presented as an illustrative example, not an exhaustive legal list.
              <div style={{ marginTop: "6px", color: "#64748b", fontSize: "12.5px" }}>
                ⚖️ <em>This page provides general informational guidance and is not legal advice. Laws and judicial interpretations may change.</em>
              </div>
            </div>
          </section>

          {/* 9. Zero Financial Data Footprint */}
          <section className="rg-section" aria-labelledby="financial-safety-title">
            <div className="rg-privacy-box">
              <div className="section-header">
                <h2 id="financial-safety-title">
                  <span className="section-header-bar" aria-hidden="true" />
                  Zero Financial Data Footprint
                </h2>
                <p className="section-subtext">
                  TRION AI does not store financial information such as bank-account details, UPI IDs or credit/debit card numbers.
                </p>
              </div>

              <ul className="rg-privacy-checklist" aria-label="Financial privacy checklist">
                <li className="rg-privacy-check-item">
                  <span className="rg-check-icon" aria-hidden="true">✓</span>
                  <span>No bank account details</span>
                </li>
                <li className="rg-privacy-check-item">
                  <span className="rg-check-icon" aria-hidden="true">✓</span>
                  <span>No UPI IDs</span>
                </li>
                <li className="rg-privacy-check-item">
                  <span className="rg-check-icon" aria-hidden="true">✓</span>
                  <span>No credit/debit card numbers</span>
                </li>
                <li className="rg-privacy-check-item">
                  <span className="rg-check-icon" aria-hidden="true">✓</span>
                  <span>No deposit wallet</span>
                </li>
                <li className="rg-privacy-check-item">
                  <span className="rg-check-icon" aria-hidden="true">✓</span>
                  <span>No financial transaction storage</span>
                </li>
              </ul>

              <p style={{ margin: 0, fontSize: "14.5px", lineHeight: "1.7", color: "#475569" }}>
                The platform is designed as an account-based analytical software service without requiring the storage of financial credentials. Learn more about our minimal data retention on our{" "}
                <Link href="/privacy" className="rg-inline-link">
                  Privacy Policy
                </Link>{" "}
                page.
              </p>
            </div>
          </section>

          {/* 10. Healthy Personal Habits & Self-Discipline */}
          <section className="rg-section" aria-labelledby="habits-title">
            <div className="section-header">
              <h2 id="habits-title">
                <span className="section-header-bar" aria-hidden="true" />
                Healthy Personal Habits &amp; Self-Discipline
              </h2>
              <p className="section-subtext">
                Responsible use means understanding limitations, setting personal boundaries and never treating statistical analysis as guaranteed income.
              </p>
            </div>

            <div className="rg-habits-grid">
              {/* 01 */}
              <div className="rg-habit-card">
                <div>
                  <div className="rg-habit-top">
                    <span className="rg-habit-num">PRINCIPLE 01</span>
                    <div className="rg-habit-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10" />
                        <line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="rg-habit-title">Do Not Treat Predictions as Guaranteed Income</h3>
                  <p className="rg-habit-desc">
                    Statistical and PRNG-based models represent mathematical probabilities and patterns. They cannot guarantee a particular outcome or provide zero-risk results.
                  </p>
                </div>
                <div className="rg-habit-highlight">
                  Probability ≠ Certainty
                </div>
              </div>

              {/* 02 */}
              <div className="rg-habit-card">
                <div>
                  <div className="rg-habit-top">
                    <span className="rg-habit-num">PRINCIPLE 02</span>
                    <div className="rg-habit-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="rg-habit-title">Protect Essential Expenses</h3>
                  <p className="rg-habit-desc">
                    Never put rent, household bills, tuition fees, medical expenses, emergency savings or other essential funds at risk.
                  </p>
                </div>
                <div className="rg-habit-highlight">
                  Essential funds must remain strictly untouched
                </div>
              </div>

              {/* 03 */}
              <div className="rg-habit-card">
                <div>
                  <div className="rg-habit-top">
                    <span className="rg-habit-num">PRINCIPLE 03</span>
                    <div className="rg-habit-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="rg-habit-title">Never Chase Losses</h3>
                  <p className="rg-habit-desc">
                    Do not continue activity simply because of previous losses. Stress, frustration and fatigue can negatively affect decision-making. Taking a break is always appropriate.
                  </p>
                </div>
                <div className="rg-habit-highlight">
                  Losses should never determine your next decision.
                </div>
              </div>

              {/* 04 */}
              <div className="rg-habit-card">
                <div>
                  <div className="rg-habit-top">
                    <span className="rg-habit-num">PRINCIPLE 04</span>
                    <div className="rg-habit-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="rg-habit-title">Set Time &amp; Budget Limits</h3>
                  <p className="rg-habit-desc">
                    Set clear personal limits for screen time and any financial activity. Stop immediately when your predefined limit is reached.
                  </p>
                </div>
                <div className="rg-habit-highlight">
                  Always pause when your predefined limit is reached
                </div>
              </div>
            </div>
          </section>

          {/* 11. Responsible Use Checklist */}
          <section className="rg-section" aria-labelledby="checklist-title">
            <div className="rg-checklist-card">
              <div className="section-header" style={{ marginBottom: "12px" }}>
                <h2 id="checklist-title" style={{ fontSize: "20px" }}>
                  <span className="section-header-bar" aria-hidden="true" />
                  Before You Continue, Ask Yourself
                </h2>
                <p className="section-subtext">
                  Take a moment to review this quick self-assessment before engaging in any analytical or digital activity:
                </p>
              </div>

              <div className="rg-checklist-grid" role="group" aria-label="Responsible self-assessment checklist">
                {CHECKLIST_ITEMS.map((item) => {
                  const isChecked = !!checkedItems[item.id];
                  return (
                    <div
                      key={item.id}
                      className={`rg-check-row ${isChecked ? "active" : ""}`}
                      onClick={() => toggleCheck(item.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleCheck(item.id);
                        }
                      }}
                      role="checkbox"
                      aria-checked={isChecked}
                      tabIndex={0}
                    >
                      <div className="rg-check-box" aria-hidden="true">
                        {isChecked ? "✓" : ""}
                      </div>
                      <span className="rg-check-label">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 12. Mental Well-Being */}
          <section className="rg-section" aria-labelledby="wellbeing-title">
            <div className="rg-wellbeing-card">
              <div className="rg-wellbeing-heart" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <h2 id="wellbeing-title">Your Well-Being Comes First</h2>
              <p className="rg-wellbeing-text">
                If you feel stressed, pressured, unable to stop, or concerned about your own or someone else&apos;s gaming-related behavior, step away from the activity and consider speaking with someone you trust or a qualified professional.
              </p>
              <p className="rg-wellbeing-text">
                Your mental health, financial safety and family well-being are more important than any software analysis.
              </p>
              <span className="rg-wellbeing-highlight">
                Take regular breaks · Prioritize peace of mind · Seek support when needed
              </span>
            </div>
          </section>

          {/* 13. India Mental Health & Support Resources */}
          <section className="rg-section" aria-labelledby="resources-title">
            <div className="section-header">
              <h2 id="resources-title">
                <span className="section-header-bar" aria-hidden="true" />
                Emergency Mental Health &amp; Support Resources — India
              </h2>
              <p className="section-subtext">
                If you or someone you know is experiencing significant emotional distress, gaming-related stress or difficulty controlling impulses, consider contacting an appropriate professional or recognized support service.
              </p>
            </div>

            <div className="rg-helpline-grid">
              {/* Tele-MANAS */}
              <div className="rg-helpline-card">
                <div>
                  <span className="rg-helpline-badge">Government of India Mental Health Support</span>
                  <h3 className="rg-helpline-name">Tele-MANAS</h3>
                  <p className="rg-helpline-desc">
                    National mental-health support service. Availability and service details may change; verify current information through official government sources.
                  </p>
                </div>
                <div className="rg-call-group">
                  <a
                    href="tel:14416"
                    className="rg-call-btn"
                    aria-label="Call Tele-MANAS toll-free at 14416"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    Call Toll-Free: 14416
                  </a>
                  <a
                    href="tel:18008914416"
                    className="rg-call-btn-alt"
                    aria-label="Call Tele-MANAS alternative toll-free number 1800-891-4416"
                  >
                    Alternative: 1800-891-4416
                  </a>
                </div>
              </div>

              {/* NIMHANS SHUT Clinic */}
              <div className="rg-helpline-card">
                <div>
                  <span className="rg-helpline-badge">Technology De-addiction Support</span>
                  <h3 className="rg-helpline-name">NIMHANS SHUT Clinic</h3>
                  <p className="rg-helpline-desc">
                    Service for Healthy Use of Technology by NIMHANS Bengaluru, addressing technology over-involvement, digital impulses, and mental wellness.
                  </p>
                </div>
                <div className="rg-call-group">
                  <a
                    href="tel:08026995540"
                    className="rg-call-btn"
                    aria-label="Call NIMHANS SHUT Clinic at 080-26995540"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    Call: 080-26995540
                  </a>
                  <div style={{ textAlign: "center", fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                    National Institute of Mental Health and Neuro-Sciences
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Frequently Asked Questions */}
          <section className="rg-section" aria-labelledby="faqs-title">
            <div className="section-header">
              <h2 id="faqs-title">
                <span className="section-header-bar" aria-hidden="true" />
                Frequently Asked Responsible Use Questions
              </h2>
              <p className="section-subtext">
                Direct answers regarding our 18+ policy, legal disclaimers, data collection boundaries, and support resources.
              </p>
            </div>

            <div className="rg-faq-list">
              {RESPONSIBLE_FAQS.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={index} className={`rg-faq-item ${isOpen ? "open" : ""}`}>
                    <button
                      className="rg-faq-btn"
                      onClick={() => toggleFaq(index)}
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="rg-faq-ans">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* 14. Help-First Contact Section */}
          <section className="rg-section" aria-labelledby="help-title">
            <div className="rg-help-cta">
              <h2 id="help-title">Need Help or Have a Concern?</h2>
              <p>
                If you have a concern about responsible use, privacy or platform functionality, contact our support team. We are committed to transparency and user safety.
              </p>
              <div className="rg-cta-actions">
                <Link href="/contact" className="btn-primary-action">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Contact Support
                </Link>
                <Link href="/about" className="btn-secondary-action">
                  About Platform
                </Link>
                <Link href="/privacy" className="btn-secondary-action">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="btn-secondary-action">
                  Terms of Service
                </Link>
              </div>
            </div>
          </section>

          {/* 15. Final Responsible-Use Statement & Quote */}
          <div className="rg-quote-box">
            <p className="rg-quote-text">
              «&ldquo;Your mental health, financial safety, and family well-being are always more important than any software analysis.&rdquo;»
            </p>
            <div className="rg-quote-sub">
              Stay safe · Stay informed · Stay responsible
            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
