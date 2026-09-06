import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import {
  PageHead,
  BreadcrumbSchema,
  OrganizationSchema,
  WebsiteSchema,
  WebPageSchema,
} from "@/components/SEO";
import SiteFooter from "@/components/SiteFooter";

const PAGE_URL = "https://wingo30.com/about";
const PAGE_TITLE = "About TRION AI | Independent Data Analytics Platform";
const PAGE_DESC =
  "Learn about TRION AI and TrionAi, an independent statistical data analytics platform focused on period history, mathematical sequence analysis, visual trend research and transparent data practices.";

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
    padding: 14px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 2px 14px rgba(0, 75, 47, 0.04);
  }
  .about-nav-left {
    display: flex;
    align-items: center;
    gap: 14px;
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
    padding: 8px 16px;
    border-radius: 50px;
    outline: none;
    transition: all 0.22s ease;
    font-family: 'TrionAIAbout', sans-serif !important;
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
    gap: 10px;
  }
  .about-nav-title {
    font-size: 12px;
    font-weight: 700;
    color: #005537;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .about-nav-cta {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #00985b;
    color: #ffffff !important;
    font-size: 13px;
    font-weight: 700;
    padding: 8px 18px;
    border-radius: 50px;
    text-decoration: none;
    transition: all 0.22s ease;
    box-shadow: 0 3px 10px rgba(0, 152, 91, 0.25);
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .about-nav-cta:hover {
    background: #007543;
    transform: translateY(-1px);
    box-shadow: 0 5px 14px rgba(0, 152, 91, 0.32);
    color: #ffffff !important;
  }

  /* Main Container */
  .about-container {
    max-width: 1040px;
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
    margin-bottom: 64px;
  }
  @media (max-width: 768px) {
    .about-section {
      margin-bottom: 48px;
    }
    .about-container {
      padding: 0 18px;
      margin-top: 28px;
    }
  }

  /* Hero Section */
  .about-hero {
    text-align: center;
    margin-bottom: 56px;
    padding: 16px 0;
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
    margin-bottom: 20px;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .about-hero h1 {
    font-size: clamp(30px, 5.2vw, 46px);
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 14px 0;
    letter-spacing: -0.025em;
    line-height: 1.18;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .about-hero h1 span {
    color: #00985b;
  }
  .about-hero-sub {
    font-size: clamp(17px, 2.8vw, 20px);
    font-weight: 700;
    color: #007543;
    margin: 0 0 16px 0;
    letter-spacing: -0.01em;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .about-hero-desc {
    font-size: 16px;
    line-height: 1.75;
    color: #475569;
    max-width: 720px;
    margin: 0 auto 28px auto;
    font-weight: 400;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .about-hero-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    flex-wrap: wrap;
  }

  /* Buttons */
  .btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: #00985b;
    color: #ffffff !important;
    font-size: 15px;
    font-weight: 700;
    padding: 14px 32px;
    border-radius: 16px;
    text-decoration: none;
    min-height: 50px;
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
    font-size: 15px;
    font-weight: 700;
    padding: 14px 28px;
    border-radius: 16px;
    text-decoration: none;
    min-height: 50px;
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

  /* Statement Banner / Highlight Box */
  .statement-box {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.22);
    border-left: 5px solid #00985b;
    border-radius: 20px;
    padding: 32px 36px;
    box-shadow: 0 8px 24px rgba(0, 75, 47, 0.04);
    transition: border-color 0.22s ease, transform 0.22s ease;
  }
  .statement-box:hover {
    border-color: rgba(0, 152, 91, 0.38);
  }
  @media (max-width: 768px) {
    .statement-box {
      padding: 24px 20px;
    }
  }

  /* Section Headings */
  .section-header {
    margin-bottom: 24px;
  }
  .section-header.centered {
    text-align: center;
  }
  .section-header h2 {
    font-size: clamp(24px, 3.8vw, 30px);
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 10px 0;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .section-header.centered h2 {
    justify-content: center;
  }
  .section-header-bar {
    width: 4px;
    height: 24px;
    background: linear-gradient(180deg, #10b981, #00985b);
    border-radius: 2px;
    flex-shrink: 0;
    display: inline-block;
  }
  .section-subtext {
    font-size: 15px;
    line-height: 1.7;
    color: #475569;
    margin: 0;
    max-width: 740px;
    font-family: 'TrionAIAbout', sans-serif !important;
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
    .card-grid-3 {
      grid-template-columns: 1fr;
    }
    .card-grid-2 {
      grid-template-columns: 1fr;
    }
  }

  .clean-card {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.16);
    border-radius: 18px;
    padding: 26px 28px;
    box-shadow: 0 4px 18px rgba(0, 75, 47, 0.03);
    transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
    display: flex;
    flex-direction: column;
  }
  .clean-card:hover {
    transform: translateY(-2px);
    border-color: rgba(0, 152, 91, 0.35);
    box-shadow: 0 8px 24px rgba(0, 75, 47, 0.06);
  }
  @media (max-width: 768px) {
    .clean-card {
      padding: 22px 20px;
    }
  }

  .card-icon-wrap {
    width: 46px;
    height: 46px;
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
  .card-title {
    font-size: 19px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 10px 0;
    line-height: 1.3;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .card-text {
    font-size: 14.5px;
    line-height: 1.68;
    color: #475569;
    margin: 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }

  /* Horizontal Tech Feature Block */
  .tech-horizontal-card {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.18);
    border-radius: 18px;
    padding: 28px 32px;
    display: flex;
    align-items: flex-start;
    gap: 22px;
    box-shadow: 0 4px 18px rgba(0, 75, 47, 0.03);
    transition: transform 0.22s ease, border-color 0.22s ease;
  }
  .tech-horizontal-card:hover {
    transform: translateY(-2px);
    border-color: rgba(0, 152, 91, 0.36);
    box-shadow: 0 8px 24px rgba(0, 75, 47, 0.06);
  }
  @media (max-width: 768px) {
    .tech-horizontal-card {
      flex-direction: column;
      gap: 16px;
      padding: 22px 20px;
    }
  }

  /* Mission Container */
  .mission-card {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.18);
    border-radius: 20px;
    padding: 34px 38px;
    box-shadow: 0 6px 20px rgba(0, 75, 47, 0.04);
  }
  .mission-quote-pill {
    margin-top: 24px;
    padding: 16px 22px;
    background: rgba(0, 152, 91, 0.06);
    border-left: 4px solid #00985b;
    border-radius: 0 12px 12px 0;
    font-size: 15px;
    font-weight: 600;
    color: #005537;
    line-height: 1.6;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  @media (max-width: 768px) {
    .mission-card {
      padding: 24px 20px;
    }
  }

  /* Privacy Minimal Data Comparison Layout */
  .privacy-comparison-container {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.18);
    border-radius: 20px;
    padding: 32px 36px;
    box-shadow: 0 6px 20px rgba(0, 75, 47, 0.04);
  }
  .comparison-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-top: 24px;
  }
  @media (max-width: 768px) {
    .privacy-comparison-container {
      padding: 24px 20px;
    }
    .comparison-grid {
      grid-template-columns: 1fr;
      gap: 18px;
    }
  }
  .comparison-box {
    border-radius: 14px;
    padding: 22px 24px;
    border: 1px solid transparent;
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
    font-size: 16px;
    font-weight: 700;
    margin: 0 0 14px 0;
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
    gap: 10px;
  }
  .comparison-list li {
    font-size: 14.5px;
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
    font-size: 16px;
  }
  .icon-cross {
    color: #ef4444;
    font-weight: 800;
    font-size: 15px;
  }

  /* Right to deletion action card */
  .deletion-card {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.18);
    border-radius: 18px;
    padding: 26px 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-top: 20px;
    box-shadow: 0 4px 18px rgba(0, 75, 47, 0.03);
  }
  @media (max-width: 768px) {
    .deletion-card {
      flex-direction: column;
      align-items: flex-start;
      padding: 22px 20px;
    }
  }

  /* Quote Card */
  .quote-highlight-card {
    background: linear-gradient(135deg, rgba(0, 152, 91, 0.08) 0%, rgba(16, 185, 129, 0.04) 100%);
    border: 1px solid rgba(0, 152, 91, 0.25);
    border-radius: 20px;
    padding: 34px 38px;
    text-align: center;
    position: relative;
    margin: 28px 0 16px 0;
  }
  .quote-main {
    font-size: clamp(17px, 2.8vw, 22px);
    font-weight: 700;
    color: #005537;
    margin: 0 0 10px 0;
    line-height: 1.45;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .quote-sub {
    font-size: 14.5px;
    color: #475569;
    margin: 0;
    line-height: 1.65;
    font-family: 'TrionAIAbout', sans-serif !important;
  }

  /* Responsible Use 18+ Badge */
  .age-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(220, 38, 38, 0.08);
    border: 1px solid rgba(220, 38, 38, 0.25);
    color: #b91c1c;
    font-size: 12px;
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
    border-radius: 18px;
    padding: 26px 28px;
    text-align: center;
    box-shadow: 0 4px 18px rgba(0, 75, 47, 0.03);
    transition: transform 0.22s ease, border-color 0.22s ease;
  }
  .transparency-pillar:hover {
    transform: translateY(-2px);
    border-color: rgba(0, 152, 91, 0.35);
  }
  .transparency-pillar-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(0, 152, 91, 0.09);
    color: #007543;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 14px;
  }
  .transparency-pillar-title {
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 8px 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .transparency-pillar-desc {
    font-size: 14.5px;
    line-height: 1.65;
    color: #475569;
    margin: 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }

  /* Final Quote & Final CTA Container */
  .final-section {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.22);
    border-radius: 24px;
    padding: 48px 36px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0, 75, 47, 0.05);
    margin-bottom: 64px;
  }
  @media (max-width: 768px) {
    .final-section {
      padding: 36px 20px;
      margin-bottom: 48px;
    }
  }

  /* Standard body typography helper */
  .p-body {
    font-size: 15px;
    line-height: 1.75;
    color: #334155;
    margin: 0 0 14px 0;
    font-family: 'TrionAIAbout', sans-serif !important;
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

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
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
              <span>ABOUT TRION AI</span>
            </div>

            <h1 id="hero-heading">
              Independent Data <span>Analytics Platform</span>
            </h1>

            <div className="about-hero-sub">About TrionAi</div>

            <p className="about-hero-desc">
              TrionAi is a specialized statistical data research and
              analytical software platform designed to provide real-time period
              history data, visual trend matrices and mathematical sequence analysis
              tools.
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
            </div>
          </section>

          {/* 2. Independent Software Statement */}
          <section className="about-section" aria-labelledby="independent-statement-heading">
            <div className="statement-box">
              <div className="section-header">
                <h2 id="independent-statement-heading">
                  <span className="section-header-bar" />
                  Independent Software Statement
                </h2>
              </div>
              <p className="p-body">
                TrionAi is strictly an independent data visualization software
                tool. We do not operate, host, promote or support any game, online
                casino or real-money betting platform.
              </p>
              <p className="p-body">
                Our software is designed purely for numerical probability analysis,
                mathematical period sequence research and educational data analysis.
              </p>
            </div>
          </section>

          {/* 3. What We Do */}
          <section className="about-section" aria-labelledby="what-we-do-heading">
            <div className="section-header">
              <h2 id="what-we-do-heading">
                <span className="section-header-bar" />
                What We Do
              </h2>
              <p className="section-subtext">
                TrionAi focuses on structured data observation, statistical
                analysis and visual interpretation of historical period information.
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
                <h3 className="card-title">Real-Time Data</h3>
                <p className="card-text">
                  Track period history and numerical information in an organized,
                  structured interface.
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
                <h3 className="card-title">Visual Analytics</h3>
                <p className="card-text">
                  Transform historical data into readable trend matrices and
                  statistical visualizations.
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
                  Provide analytical tools for studying sequences, frequency
                  distributions and probability-based patterns.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Platform Mission */}
          <section className="about-section" aria-labelledby="mission-heading">
            <div className="mission-card">
              <div className="section-header">
                <h2 id="mission-heading">
                  <span className="section-header-bar" />
                  Our Mission
                </h2>
              </div>
              <p className="p-body">
                TrionAi was developed by a data science research team to
                make WinGo 1-Minute and 30-Second period history tracking easier and
                more structured.
              </p>
              <p className="p-body">
                Traditional manual tracking can be time-consuming and may introduce
                human errors. Our automated analytical engine organizes period
                numbers, BIG/SMALL ratios and color distribution patterns into
                visual analytical dashboards.
              </p>
              <div className="mission-quote-pill">
                Our goal is not to promise certainty — it is to make numerical data
                easier to observe, understand and research.
              </div>
            </div>
          </section>

          {/* 5. Core Technology */}
          <section className="about-section" aria-labelledby="technology-heading">
            <div className="section-header">
              <h2 id="technology-heading">
                <span className="section-header-bar" />
                Core Technology
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
                  <h3 className="card-title">PRNG Trend Matrices</h3>
                  <p className="card-text">
                    Visual representation of historical sequence patterns, frequency
                    balance metrics and numerical distribution trends.
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
                  <h3 className="card-title">Sub-Second Signal Latency</h3>
                  <p className="card-text">
                    Period-based data updates are processed and displayed with
                    minimal delay after the relevant countdown cycle completes.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 6. Core Analytical Modules */}
          <section className="about-section" aria-labelledby="modules-heading">
            <div className="section-header">
              <h2 id="modules-heading">
                <span className="section-header-bar" />
                Core Analytical Modules
              </h2>
              <p className="section-subtext">
                Our platform contains specialized analytical modules designed for
                different types of statistical observation.
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
                  Continuous probability-trend observation and period-history
                  tracking across 30-second cycles.
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
                  60-second period analysis with confidence scoring, color-parity
                  breakdown and streak-based notifications.
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
                  Matrix-based visualization of BIG/SMALL streak lengths, numerical
                  sequences and odd/even distribution patterns.
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
                  Mathematical and statistical model-based trend forecasting designed
                  to visualize possible patterns within historical data.
                </p>
              </div>
            </div>
          </section>

          {/* 7. Privacy & Minimal Data Storage */}
          <section className="about-section" aria-labelledby="privacy-storage-heading">
            <div className="privacy-comparison-container">
              <div className="section-header">
                <h2 id="privacy-storage-heading">
                  <span className="section-header-bar" />
                  Minimal Data Storage
                </h2>
                <p className="section-subtext">
                  Your basic account information is kept minimal. We store only three
                  basic authentication details required for account functionality:
                </p>
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
                    <span>Data We Store</span>
                  </div>
                  <ul className="comparison-list">
                    <li>
                      <span className="icon-check">✓</span> Full Name
                    </li>
                    <li>
                      <span className="icon-check">✓</span> Email Address
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
                    <span>We Do NOT Store</span>
                  </div>
                  <ul className="comparison-list">
                    <li>
                      <span className="icon-cross">✕</span> Banking details
                    </li>
                    <li>
                      <span className="icon-cross">✕</span> UPI IDs
                    </li>
                    <li>
                      <span className="icon-cross">✕</span> Phone numbers
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 8. Right to Deletion */}
          <section className="about-section" aria-labelledby="deletion-heading">
            <div className="deletion-card">
              <div>
                <h2
                  id="deletion-heading"
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#0f172a",
                    margin: "0 0 8px 0",
                  }}
                >
                  Your Right to Delete Your Data
                </h2>
                <p className="p-body" style={{ maxWidth: "600px", margin: 0 }}>
                  Users can contact our support team at any time to request permanent
                  deletion of their stored account information. Deletion requests are
                  processed within approximately 1–2 business days.
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

          {/* 9. Educational & Statistical Research */}
          <section className="about-section" aria-labelledby="education-heading">
            <div className="clean-card" style={{ padding: "32px 36px" }}>
              <div className="section-header">
                <h2 id="education-heading">
                  <span className="section-header-bar" />
                  Educational &amp; Statistical Research
                </h2>
              </div>
              <p className="p-body">
                All signals and analytics are based on mathematical probability
                models and statistical analysis.
              </p>
              <p className="p-body">
                No software can guarantee a specific outcome from a PRNG-based
                system. Our analytical tools are therefore intended primarily for
                educational study, sequence-pattern visualization and statistical
                research.
              </p>

              <div className="quote-highlight-card">
                <div className="quote-main">
                  “Data analysis is about understanding probabilities, not
                  predicting absolute certainty.”
                </div>
                <p className="quote-sub">
                  Our goal is to empower users with clean visual metrics, minimal
                  personal data retention and complete transparency.
                </p>
              </div>
            </div>
          </section>

          {/* 10. Advertising Disclaimer */}
          <section className="about-section" aria-labelledby="ads-heading">
            <div className="clean-card" style={{ padding: "32px 36px" }}>
              <div className="section-header">
                <h2 id="ads-heading">
                  <span className="section-header-bar" />
                  Revenue Model &amp; Third-Party Advertising
                </h2>
                <p className="section-subtext">
                  To keep our services available to users at no direct software-access
                  cost, the website may display third-party advertisements from
                  advertising providers such as Adsterra or Google Ads.
                </p>
              </div>

              <div className="card-grid-3" style={{ marginTop: "20px" }}>
                <div
                  style={{
                    background: "rgba(0, 152, 91, 0.03)",
                    border: "1px solid rgba(0, 152, 91, 0.14)",
                    borderRadius: "14px",
                    padding: "20px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#0f172a",
                      margin: "0 0 8px 0",
                    }}
                  >
                    User Responsibility
                  </h3>
                  <p className="p-body" style={{ fontSize: "14px", margin: 0 }}>
                    Clicking advertisement banners or visiting sponsored links is
                    entirely the user&apos;s responsibility.
                  </p>
                </div>

                <div
                  style={{
                    background: "rgba(0, 152, 91, 0.03)",
                    border: "1px solid rgba(0, 152, 91, 0.14)",
                    borderRadius: "14px",
                    padding: "20px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#0f172a",
                      margin: "0 0 8px 0",
                    }}
                  >
                    Third-Party Responsibility
                  </h3>
                  <p className="p-body" style={{ fontSize: "14px", margin: 0 }}>
                    TrionAi is not responsible for the offers, products,
                    services or content provided by external advertisers.
                  </p>
                </div>

                <div
                  style={{
                    background: "rgba(0, 152, 91, 0.03)",
                    border: "1px solid rgba(0, 152, 91, 0.14)",
                    borderRadius: "14px",
                    padding: "20px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#0f172a",
                      margin: "0 0 8px 0",
                    }}
                  >
                    External Websites
                  </h3>
                  <p className="p-body" style={{ fontSize: "14px", margin: 0 }}>
                    Users should perform their own due diligence before interacting
                    with or purchasing anything from an external website.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 11. Legal & Responsible Use */}
          <section className="about-section" aria-labelledby="legal-heading">
            <div className="clean-card" style={{ padding: "32px 36px" }}>
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
                <span>18+ Only</span>
              </div>

              <div className="section-header">
                <h2 id="legal-heading">
                  <span className="section-header-bar" />
                  Legal &amp; Responsible Use
                </h2>
              </div>
              <p className="p-body">
                TrionAi is an independent statistical data analytics and
                visualization software platform. It does not operate, host or
                facilitate real-money gaming or betting services.
              </p>
              <p className="p-body">
                Users must be at least 18 years old to use the platform.
              </p>
              <p className="p-body" style={{ color: "#64748b", fontSize: "14px" }}>
                Users are responsible for complying with the laws and regulations
                applicable to their own location.
              </p>
            </div>
          </section>

          {/* 12. Transparency Section */}
          <section className="about-section" aria-labelledby="transparency-heading">
            <div className="section-header centered">
              <h2 id="transparency-heading">
                <span className="section-header-bar" />
                Built Around Transparency
              </h2>
              <p className="section-subtext">
                We design our analytical tools around three simple, uncompromising
                principles.
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
                <h3 className="transparency-pillar-title">Independent</h3>
                <p className="transparency-pillar-desc">
                  We operate as an independent analytical software platform.
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
                <h3 className="transparency-pillar-title">Data-Minimal</h3>
                <p className="transparency-pillar-desc">
                  We limit stored account information to basic authentication
                  requirements.
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
                <h3 className="transparency-pillar-title">Probability-Based</h3>
                <p className="transparency-pillar-desc">
                  Our analytics represent statistical observations and probabilities,
                  not certainty.
                </p>
              </div>
            </div>
          </section>

          {/* 13. Final Quote & 14. Final CTA */}
          <section className="final-section" aria-labelledby="cta-heading">
            <div style={{ maxWidth: "700px", margin: "0 auto 32px auto" }}>
              <div
                style={{
                  fontSize: "clamp(20px, 3.2vw, 26px)",
                  fontWeight: 800,
                  color: "#0f172a",
                  lineHeight: 1.35,
                  marginBottom: "12px",
                }}
              >
                “Data analysis is about understanding probabilities, not predicting
                absolute certainty.”
              </div>
              <p
                style={{
                  fontSize: "15px",
                  color: "#007543",
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                TRION AI is committed to building clean, transparent and
                research-oriented analytical tools.
              </p>
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(0, 152, 91, 0.15)",
                paddingTop: "32px",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              <h2
                id="cta-heading"
                style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  color: "#0f172a",
                  margin: "0 0 8px 0",
                }}
              >
                Explore TRION AI
              </h2>
              <p
                style={{
                  fontSize: "15px",
                  color: "#475569",
                  margin: "0 0 24px 0",
                }}
              >
                Explore our analytical tools, dashboards and statistical research
                features.
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
