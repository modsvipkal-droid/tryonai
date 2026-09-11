import { useState, useEffect, useId, useRef } from "react";
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
import {
  calculateFundManagement,
  formatCurrency,
  validateFundManagementInputs,
} from "@/lib/fundManagement";

const PAGE_URL = "https://wingo30.com/fund-management";
const PAGE_TITLE = "Fund Management Calculator | TRION AI";
const PAGE_DESC =
  "Use the TRION AI Fund Management Calculator to enter an amount, select 1–9 levels and generate a structured level-wise allocation plan.";

const FM_FAQS = [
  {
    question: "What is the TRION AI Fund Management Calculator?",
    answer:
      "Direct Answer: The TRION AI Fund Management Calculator is a deterministic mathematical budgeting utility that divides an entered capital amount across 1 to 9 levels based on the standard geometric progression framework."
  },
  {
    question: "How do management levels (1 to 9) work in capital allocation?",
    answer:
      "Direct Answer: Management levels configure how many progressive stages your capital is partitioned into. Selecting Level 3 creates 3 stages (1x, 2x, 4x), whereas Level 9 distributes capital across 9 progressive stages (1x up to 256x) for extended risk tolerance and multi-stage buffer depth."
  },
  {
    question: "Which management level is best for my available budget?",
    answer:
      "Direct Answer: Choose Levels 1–3 for short-horizon or minimal-stage budgeting, Levels 4–6 for balanced risk and progression, and Levels 7–9 when maximum multi-tier capital preservation and deeper step coverage are needed."
  },
  {
    question: "Does the fund management calculator guarantee profits or eliminate risk?",
    answer:
      "Direct Answer: No. This calculator is strictly an educational budgeting and allocation simulator. It does not predict future outcomes, eliminate risk, or guarantee profits."
  },
  {
    question: "How does the calculator ensure 100% mathematical reconciliation?",
    answer:
      "Direct Answer: The algorithm computes exact unit proportions across all stages and reconciles any fractional rounding differences back into the baseline stage so that the sum of all stages matches your entered amount precisely."
  },
  {
    question: "Can I use this calculator on mobile devices?",
    answer:
      "Direct Answer: Yes. The TRION AI Fund Management Calculator is fully responsive and optimized for mobile screens from 360px width upward with smooth touch controls."
  }
];

const PRESET_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const LEVEL_CONFIG = [
  { level: 1, tag: "L1", desc: "1 Stage", depthLabel: "Single Allocation (1x)", multiplier: "1x" },
  { level: 2, tag: "L2", desc: "2 Stages", depthLabel: "2-Tier Allocation (1x, 2x)", multiplier: "1x, 2x" },
  { level: 3, tag: "L3", desc: "3 Stages", depthLabel: "3-Tier Allocation (1x, 2x, 4x)", multiplier: "1x...4x" },
  { level: 4, tag: "L4", desc: "4 Stages", depthLabel: "4-Tier Allocation (1x...8x)", multiplier: "1x...8x" },
  { level: 5, tag: "L5", desc: "5 Stages", depthLabel: "5-Tier Allocation (1x...16x)", multiplier: "1x...16x" },
  { level: 6, tag: "L6", desc: "6 Stages", depthLabel: "6-Tier Allocation (1x...32x)", multiplier: "1x...32x" },
  { level: 7, tag: "L7", desc: "7 Stages", depthLabel: "7-Tier Allocation (1x...64x)", multiplier: "1x...64x" },
  { level: 8, tag: "L8", desc: "8 Stages", depthLabel: "8-Tier Allocation (1x...128x)", multiplier: "1x...128x" },
  { level: 9, tag: "L9", desc: "9 Stages", depthLabel: "9-Tier Allocation (1x...256x)", multiplier: "1x...256x" }
];

/* ── Scoped CSS: Soft, Clean, Premium SaaS Style ── */
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
    background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 40%, #ecfdf5 100%) !important;
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

  /* ── Page Layout (Matched to About Screen) ── */
  .fm-page {
    min-height: 100vh;
    width: 100%;
    position: relative;
    background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 40%, #ecfdf5 100%);
    padding: 0 !important;
    margin: 0 !important;
    overflow-x: hidden;
    overflow-y: visible;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-page::before {
    content: '';
    position: fixed;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(ellipse at 25% 15%, rgba(0, 152, 91, 0.06) 0%, transparent 50%),
                radial-gradient(ellipse at 75% 85%, rgba(16, 185, 129, 0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  /* Ambient Soft Atmospheric Orbs */
  .fm-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.18;
    pointer-events: none;
    z-index: 0;
    animation: floatOrb 18s ease-in-out infinite alternate;
  }
  .fm-orb-1 {
    width: 420px;
    height: 420px;
    background: #00985b;
    top: -100px;
    right: -100px;
  }
  .fm-orb-2 {
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

  /* ── Top Header Navigation (Enlarged & Centered Logo) ── */
  .fm-nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(0, 152, 91, 0.16);
    padding: 18px 32px;
    min-height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(0, 75, 47, 0.06);
    width: 100%;
    box-sizing: border-box;
  }
  .fm-nav-inner {
    max-width: 1200px;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 16px;
  }
  .fm-nav-side-left {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .fm-nav-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .fm-nav-side-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .fm-nav-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #007543;
    font-weight: 700;
    font-size: 13.5px;
    cursor: pointer;
    background: rgba(0, 152, 91, 0.08);
    border: 1.5px solid rgba(0, 152, 91, 0.22);
    padding: 9px 18px;
    border-radius: 50px;
    outline: none;
    transition: all 0.22s ease;
    font-family: 'TrionAIAbout', sans-serif !important;
    text-decoration: none;
    flex-shrink: 0;
  }
  .fm-nav-back:hover {
    background: #00985b;
    border-color: #00985b;
    color: #ffffff;
    transform: translateX(-2px);
    box-shadow: 0 4px 14px rgba(0, 152, 91, 0.22);
  }
  .fm-nav-back:focus-visible {
    box-shadow: 0 0 0 3px rgba(0, 152, 91, 0.30);
  }
  .fm-nav-brand-img {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: auto;
    text-decoration: none;
  }
  .fm-nav-brand-img img {
    height: 42px;
    width: 270px;
    max-width: 285px;
    object-fit: contain;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    display: block;
  }
  @media (max-width: 640px) {
    .fm-nav {
      padding: 14px 16px;
      min-height: 68px;
    }
    .fm-nav-inner {
      grid-template-columns: auto 1fr;
      gap: 10px;
    }
    .fm-nav-side-right {
      display: none;
    }
    .fm-nav-center {
      justify-content: center;
      padding-right: 6px;
    }
    .fm-nav-back {
      padding: 7px 13px;
      font-size: 12px;
      gap: 4px;
    }
    .fm-nav-back svg {
      width: 14px;
      height: 14px;
    }
    .fm-nav-brand-img img {
      height: 35px;
      width: auto;
      max-width: 195px;
    }
  }

  /* ── Main Container ── */
  .fm-container {
    max-width: 880px;
    margin: 0 auto;
    padding: 32px 20px 80px 20px;
    position: relative;
    z-index: 1;
    width: 100%;
    box-sizing: border-box;
  }
  @media (max-width: 640px) {
    .fm-container {
      padding: 18px 12px 60px 12px;
      max-width: 100%;
      overflow-x: hidden;
    }
  }

  /* ── Spacing Rhythm between Sections ── */
  .fm-section {
    margin-bottom: 28px;
  }
  @media (max-width: 640px) {
    .fm-section {
      margin-bottom: 22px;
    }
  }

  /* ── Eyebrow Badge ── */
  .fm-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: rgba(0, 152, 91, 0.08);
    border: 1px solid rgba(0, 152, 91, 0.24);
    color: #007543;
    font-size: 11.5px;
    font-weight: 700;
    padding: 4px 13px;
    border-radius: 50px;
    margin-bottom: 12px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-eyebrow-icon {
    display: flex;
    align-items: center;
    color: #00985b;
  }

  /* ── Hero Section ── */
  .fm-hero {
    text-align: center;
    margin-bottom: 26px;
  }
  .fm-hero h1 {
    font-size: clamp(21px, 4vw, 34px);
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 8px 0;
    letter-spacing: -0.025em;
    line-height: 1.2;
    font-family: 'TrionAIAbout', sans-serif !important;
    word-break: break-word;
  }
  .fm-hero-desc {
    font-size: 13.5px;
    line-height: 1.65;
    color: #475569;
    max-width: 580px;
    margin: 0 auto;
    font-weight: 400;
    font-family: 'TrionAIAbout', sans-serif !important;
  }

  /* ── Calculator Main Card ── */
  .fm-calc-card {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.16);
    border-radius: 20px;
    padding: 30px 32px;
    box-shadow: 0 4px 20px -2px rgba(0, 50, 30, 0.04);
    word-break: break-word;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }
  @media (max-width: 768px) {
    .fm-calc-card {
      padding: 20px 14px;
      border-radius: 18px;
    }
  }

  /* ── Field Groups ── */
  .fm-field-group {
    margin-bottom: 24px;
  }
  .fm-field-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    gap: 8px;
    flex-wrap: wrap;
  }
  .fm-label {
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-label-hint {
    font-size: 11.5px;
    color: #64748b;
    font-weight: 500;
    font-family: 'TrionAIAbout', sans-serif !important;
  }

  /* ── Amount Input ── */
  .fm-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    background: #ffffff;
    border: 1.5px solid rgba(0, 152, 91, 0.20);
    border-radius: 14px;
    transition: all 0.2s ease;
    overflow: hidden;
  }
  .fm-input-wrapper:focus-within {
    border-color: #00985b;
    box-shadow: 0 0 0 4px rgba(0, 152, 91, 0.10);
  }
  .fm-input-wrapper.has-error {
    border-color: #dc2626;
    background: #fef2f2;
  }
  .fm-currency-symbol {
    padding-left: 16px;
    font-size: 19px;
    font-weight: 800;
    color: #007543;
    user-select: none;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-amount-input {
    flex: 1;
    height: 48px;
    padding: 0 12px;
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
    background: transparent;
    border: none;
    outline: none;
    letter-spacing: -0.01em;
    width: 100%;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-amount-input::placeholder {
    color: #94a3b8;
    font-weight: 500;
    font-size: 13.5px;
  }
  .fm-input-clear {
    margin-right: 12px;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.05);
    color: #64748b;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.18s ease;
    border: none;
    padding: 0;
  }
  .fm-input-clear:hover {
    background: rgba(0, 0, 0, 0.10);
    color: #0f172a;
  }
  .fm-helper {
    margin: 7px 0 0 0;
    font-size: 12.5px;
    color: #64748b;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-quick-row {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    margin-top: 10px;
  }
  .fm-quick-label {
    font-size: 11.5px;
    color: #64748b;
    font-weight: 700;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-quick-chip {
    background: rgba(0, 152, 91, 0.06);
    border: 1px solid rgba(0, 152, 91, 0.18);
    color: #007543;
    font-size: 11px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.18s ease;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-quick-chip:hover {
    background: rgba(0, 152, 91, 0.12);
    border-color: #00985b;
  }
  .fm-quick-chip.active {
    background: #00985b;
    color: #ffffff;
    border-color: #00985b;
  }

  /* ═════════════════════════════════════════════════════════
     ── CLEAN & UNIQUE "SELECT LEVELS" SECTION ──
     ═════════════════════════════════════════════════════════ */
  .fm-levels-wrapper {
    background: linear-gradient(180deg, #f8fcfa 0%, #f3faf6 100%);
    border: 1px solid rgba(0, 152, 91, 0.16);
    border-radius: 18px;
    padding: 20px 18px 18px 18px;
    margin-bottom: 24px;
    position: relative;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 2px 10px rgba(0, 75, 47, 0.02);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .fm-levels-wrapper:hover {
    border-color: rgba(0, 152, 91, 0.30);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 4px 16px rgba(0, 152, 91, 0.04);
  }

  .fm-level-header-title {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .fm-level-icon-badge {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: rgba(0, 152, 91, 0.10);
    color: #007543;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s ease;
  }
  .fm-levels-wrapper:hover .fm-level-icon-badge {
    transform: scale(1.05);
    background: rgba(0, 152, 91, 0.16);
  }
  .fm-level-subtitle {
    display: block;
    font-size: 11.5px;
    color: #64748b;
    font-weight: 500;
    margin-top: 1px;
    font-family: 'TrionAIAbout', sans-serif !important;
  }

  .fm-levels-current-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.22);
    padding: 5px 12px;
    border-radius: 9999px;
    font-size: 12.5px;
    color: #007543;
    font-family: 'TrionAIAbout', sans-serif !important;
    box-shadow: 0 1px 4px rgba(0, 75, 47, 0.03);
    transition: all 0.2s ease;
  }
  .fm-levels-current-badge strong {
    color: #00985b;
    font-weight: 800;
  }
  .fm-levels-badge-pulse {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #00985b;
    box-shadow: 0 0 0 0 rgba(0, 152, 91, 0.6);
    animation: fmBadgePulse 2.2s infinite cubic-bezier(0.4, 0, 0.6, 1);
  }
  @keyframes fmBadgePulse {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(0, 152, 91, 0.6);
    }
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 5px rgba(0, 152, 91, 0);
    }
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(0, 152, 91, 0);
    }
  }

  /* ── 9-Step Micro Visual Track ── */
  .fm-level-track {
    display: flex;
    align-items: center;
    gap: 5px;
    margin: 16px 0 14px 0;
    padding: 0 2px;
  }
  .fm-track-step {
    flex: 1;
    height: 4px;
    border-radius: 9999px;
    background: rgba(0, 152, 91, 0.12);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .fm-track-step:hover {
    height: 6px;
    background: rgba(0, 152, 91, 0.25);
  }
  .fm-track-step-bar {
    position: absolute;
    inset: 0;
    width: 0%;
    background: linear-gradient(90deg, #00985b, #00b86c);
    border-radius: 9999px;
    transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .fm-track-step.filled .fm-track-step-bar {
    width: 100%;
  }
  .fm-track-step.exact {
    box-shadow: 0 0 6px rgba(0, 152, 91, 0.5);
  }

  /* ── Level Cards Grid ── */
  .fm-level-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 16px;
  }
  @media (min-width: 640px) {
    .fm-level-grid {
      grid-template-columns: repeat(9, 1fr);
      gap: 7px;
    }
  }

  .fm-level-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 10px 4px 8px 4px;
    min-height: 90px;
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.16);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    outline: none;
    user-select: none;
    font-family: 'TrionAIAbout', sans-serif !important;
    overflow: hidden;
  }
  .fm-level-card:hover {
    background: #ffffff;
    border-color: rgba(0, 152, 91, 0.40);
    transform: translateY(-2px);
    box-shadow: 0 4px 14px rgba(0, 75, 47, 0.06);
  }
  .fm-level-card:focus-visible {
    box-shadow: 0 0 0 3px rgba(0, 152, 91, 0.30);
  }
  .fm-level-card.in-range {
    border-color: rgba(0, 152, 91, 0.24);
    background: rgba(0, 152, 91, 0.02);
  }

  /* Card Top Row */
  .fm-card-top {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 3px;
    height: 14px;
  }
  .fm-card-tag {
    font-size: 9.5px;
    font-weight: 800;
    color: #007543;
    letter-spacing: 0.03em;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-card-check {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.28);
    color: #ffffff;
    animation: fmCheckPop 0.24s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  @keyframes fmCheckPop {
    0% { transform: scale(0); opacity: 0; }
    80% { transform: scale(1.15); }
    100% { transform: scale(1); opacity: 1; }
  }

  /* Card Number */
  .fm-card-number {
    font-size: 20px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1;
    margin: 3px 0 1px 0;
    transition: color 0.18s ease, transform 0.18s ease;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-level-card:hover .fm-card-number {
    transform: scale(1.06);
  }

  /* Card Desc */
  .fm-card-desc {
    font-size: 9.5px;
    font-weight: 700;
    color: #64748b;
    letter-spacing: 0.02em;
    margin-bottom: 4px;
    font-family: 'TrionAIAbout', sans-serif !important;
  }

  /* Micro Depth Pip Meter */
  .fm-card-meter {
    display: flex;
    align-items: center;
    gap: 2px;
    height: 2.5px;
    width: 80%;
  }
  .fm-meter-pip {
    flex: 1;
    height: 100%;
    border-radius: 2px;
    background: rgba(0, 0, 0, 0.06);
    transition: background 0.18s ease;
  }
  .fm-meter-pip.active {
    background: rgba(0, 152, 91, 0.40);
  }

  /* Selected Card State */
  .fm-level-card.selected {
    background: linear-gradient(145deg, #00985b 0%, #007543 100%);
    border-color: #005a33;
    box-shadow: 0 6px 18px rgba(0, 152, 91, 0.32), 0 2px 4px rgba(0, 152, 91, 0.15);
    transform: translateY(-3px);
  }
  .fm-level-card.selected .fm-card-tag,
  .fm-level-card.selected .fm-card-number,
  .fm-level-card.selected .fm-card-desc {
    color: #ffffff;
  }
  .fm-level-card.selected .fm-meter-pip.active {
    background: #ffffff;
  }
  .fm-level-card.selected .fm-meter-pip:not(.active) {
    background: rgba(255, 255, 255, 0.20);
  }

  /* Subtle shimmer sweep on selected card */
  .fm-level-card.selected::after {
    content: '';
    position: absolute;
    top: 0;
    left: -120%;
    width: 80%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.18), transparent);
    transform: skewX(-20deg);
    animation: fmCardShimmer 4s infinite ease-in-out;
  }
  @keyframes fmCardShimmer {
    0% { left: -120%; }
    25% { left: 160%; }
    100% { left: 160%; }
  }

  /* ── Interactive Range Slider Scrub ── */
  .fm-slider-container {
    margin: 6px 2px 14px 2px;
    padding: 4px 2px;
  }
  .fm-slider-track-wrap {
    position: relative;
    width: 100%;
  }
  .fm-level-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 6px;
    border-radius: 9999px;
    background: linear-gradient(to right, #00985b 0%, #00985b var(--slider-pct, 25%), #e2e8f0 var(--slider-pct, 25%), #e2e8f0 100%);
    outline: none;
    cursor: pointer;
    transition: background 0.15s ease;
    margin: 0;
    padding: 0;
  }
  .fm-level-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ffffff;
    border: 2.5px solid #00985b;
    box-shadow: 0 2px 8px rgba(0, 152, 91, 0.35);
    cursor: grab;
    transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s ease;
  }
  .fm-level-slider::-webkit-slider-thumb:hover {
    transform: scale(1.15);
    box-shadow: 0 3px 12px rgba(0, 152, 91, 0.45);
  }
  .fm-level-slider::-webkit-slider-thumb:active {
    cursor: grabbing;
    transform: scale(1.20);
    box-shadow: 0 0 0 5px rgba(0, 152, 91, 0.18);
  }
  .fm-level-slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ffffff;
    border: 2.5px solid #00985b;
    box-shadow: 0 2px 8px rgba(0, 152, 91, 0.35);
    cursor: grab;
  }
  .fm-slider-markers {
    display: flex;
    justify-content: space-between;
    margin-top: 6px;
    padding: 0 6px;
  }
  .fm-slider-marker {
    font-size: 11px;
    font-weight: 700;
    color: #94a3b8;
    cursor: pointer;
    transition: all 0.18s ease;
    user-select: none;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-slider-marker:hover {
    color: #007543;
    transform: translateY(-1px);
  }
  .fm-slider-marker.passed {
    color: #007543;
  }
  .fm-slider-marker.active {
    color: #007543;
    font-weight: 800;
    transform: scale(1.20);
  }

  /* ── Live Insight Banner (SVG Icon Driven) ── */
  .fm-level-insight-banner {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.16);
    border-radius: 12px;
    padding: 12px 14px;
    box-shadow: 0 2px 6px rgba(0, 75, 47, 0.02);
    transition: all 0.2s ease;
  }
  .fm-insight-icon {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: rgba(0, 152, 91, 0.08);
    color: #007543;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .fm-insight-content {
    flex: 1;
    min-width: 0;
  }
  .fm-insight-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 2px;
  }
  .fm-insight-title {
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-insight-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 700;
    color: #007543;
    background: rgba(0, 152, 91, 0.08);
    border: 1px solid rgba(0, 152, 91, 0.18);
    padding: 2px 8px;
    border-radius: 9999px;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-insight-badge svg {
    display: block;
  }
  .fm-insight-desc {
    font-size: 12px;
    color: #475569;
    line-height: 1.5;
    margin: 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }

  /* ── Validation Alert ── */
  .fm-validation {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(220, 38, 38, 0.06);
    border: 1px solid rgba(220, 38, 38, 0.22);
    color: #b91c1c;
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 13.5px;
    font-weight: 700;
    margin-bottom: 18px;
    animation: fadeSlideUp 0.25s ease;
    font-family: 'TrionAIAbout', sans-serif !important;
  }

  /* ── Action Buttons ── */
  .fm-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 10px;
    width: 100%;
  }
  .fm-btn-calc {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: linear-gradient(135deg, #00ab66 0%, #008f55 50%, #007342 100%);
    color: #ffffff !important;
    font-size: 16px;
    font-weight: 800;
    padding: 16px 28px;
    min-height: 58px;
    border-radius: 14px;
    text-decoration: none;
    border: 1.5px solid rgba(255, 255, 255, 0.25);
    cursor: pointer;
    transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 8px 24px rgba(0, 152, 91, 0.35), 0 2px 6px rgba(0, 75, 47, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.35);
    font-family: 'TrionAIAbout', sans-serif !important;
    outline: none;
    letter-spacing: 0.02em;
    text-shadow: 0 1px 2px rgba(0, 40, 20, 0.35);
    box-sizing: border-box;
  }
  .fm-btn-calc svg {
    width: 18px;
    height: 18px;
    stroke-width: 2.8;
    filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.2));
  }
  .fm-btn-calc:hover:not(:disabled) {
    background: linear-gradient(135deg, #009658 0%, #007a47 50%, #006037 100%);
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(0, 152, 91, 0.42), 0 4px 10px rgba(0, 152, 91, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.4);
  }
  .fm-btn-calc:active:not(:disabled) {
    transform: translateY(1px) scale(0.99);
    box-shadow: 0 4px 12px rgba(0, 152, 91, 0.28);
  }
  .fm-btn-calc:focus-visible {
    box-shadow: 0 0 0 3px rgba(0, 152, 91, 0.4);
  }
  .fm-btn-calc:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  .fm-btn-reset {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: #ffffff;
    border: 1.5px solid rgba(0, 152, 91, 0.25);
    color: #007543;
    font-size: 13.5px;
    font-weight: 700;
    padding: 0 18px;
    min-height: 58px;
    border-radius: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'TrionAIAbout', sans-serif !important;
    outline: none;
    box-sizing: border-box;
  }
  .fm-btn-reset:hover {
    background: rgba(0, 152, 91, 0.05);
    border-color: #00985b;
    transform: translateY(-2px);
  }

  /* ── Empty State ── */
  .fm-empty {
    text-align: center;
    padding: 38px 20px;
    background: #ffffff;
    border: 1.5px dashed rgba(0, 152, 91, 0.20);
    border-radius: 18px;
  }
  .fm-empty-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: rgba(0, 152, 91, 0.08);
    color: #007543;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 12px auto;
  }
  .fm-empty h3 {
    font-size: 17px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 5px 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-empty p {
    font-size: 13.5px;
    color: #64748b;
    margin: 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }

  /* ── Result Card ── */
  .fm-result-card {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.16);
    border-radius: 20px;
    padding: 28px 30px;
    box-shadow: 0 4px 20px -2px rgba(0, 50, 30, 0.04);
    word-break: break-word;
    animation: fadeSlideUp 0.3s ease;
    width: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
  }
  @media (max-width: 768px) {
    .fm-result-card {
      padding: 20px 14px;
      border-radius: 18px;
    }
  }

  .fm-result-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(0, 152, 91, 0.10);
    flex-wrap: wrap;
  }
  .fm-result-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(0, 152, 91, 0.08);
    border: 1px solid rgba(0, 152, 91, 0.20);
    color: #007543;
    font-size: 11px;
    font-weight: 700;
    padding: 3px 9px;
    border-radius: 50px;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-result-badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #00985b;
  }
  .fm-result-title {
    font-size: 20px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 4px 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-result-sub {
    font-size: 13.5px;
    color: #64748b;
    margin: 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-verified-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #eef7f3;
    border: 1px solid rgba(0, 152, 91, 0.22);
    color: #007543;
    font-size: 12px;
    font-weight: 700;
    padding: 5px 12px;
    border-radius: 50px;
    flex-shrink: 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }

  /* ── Metric Summary Grid ── */
  .fm-summary-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin: 20px 0 24px 0;
  }
  @media (min-width: 640px) {
    .fm-summary-grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
  }
  .fm-summary-item {
    background: #f8fcfa;
    border: 1px solid rgba(0, 152, 91, 0.14);
    border-radius: 12px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    transition: transform 0.18s ease;
  }
  .fm-summary-item:hover {
    transform: translateY(-2px);
  }
  .fm-summary-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11.5px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-summary-val {
    font-size: 19px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.01em;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-val-green {
    color: #007543 !important;
  }

  /* ── Breakdown Heading ── */
  .fm-breakdown-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    gap: 10px;
    flex-wrap: wrap;
  }
  .fm-breakdown-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 17px;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-bar {
    width: 3.5px;
    height: 16px;
    background: #00985b;
    border-radius: 2px;
    display: inline-block;
  }
  .fm-stages-badge {
    font-size: 11.5px;
    font-weight: 700;
    color: #007543;
    background: rgba(0, 152, 91, 0.08);
    border: 1px solid rgba(0, 152, 91, 0.18);
    padding: 3px 9px;
    border-radius: 50px;
    font-family: 'TrionAIAbout', sans-serif !important;
  }

  /* ═════════════════════════════════════════════════════════
     ── UNIQUE & PREMIUM FUND MANAGEMENT PLAN CARDS LIST ──
     ═════════════════════════════════════════════════════════ */
  .fm-plan-list {
    display: flex;
    flex-direction: column;
    gap: 11px;
    margin-bottom: 22px;
    width: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
  }
  .fm-plan-card {
    background: linear-gradient(180deg, #ffffff 0%, #f9fcfa 100%);
    border: 1px solid rgba(0, 152, 91, 0.16);
    border-radius: 14px;
    padding: 16px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    box-shadow: 0 2px 8px rgba(0, 75, 47, 0.02);
    transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    animation: fadeSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: var(--anim-delay, 0ms);
    position: relative;
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;
    min-width: 0;
  }
  .fm-plan-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 3.5px;
    background: linear-gradient(180deg, #00985b 0%, #007543 100%);
    opacity: 0.85;
    transition: width 0.2s ease, opacity 0.2s ease;
  }
  .fm-plan-card:hover {
    border-color: rgba(0, 152, 91, 0.38);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 75, 47, 0.05);
    background: #ffffff;
  }
  .fm-plan-card:hover::before {
    width: 5px;
    opacity: 1;
  }

  /* Plan Card Left Column */
  .fm-plan-card-left {
    display: flex;
    align-items: center;
    gap: 14px;
    flex: 1;
    min-width: 0;
  }
  .fm-plan-badge-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 52px;
    padding: 7px 5px;
    background: rgba(0, 152, 91, 0.08);
    border: 1px solid rgba(0, 152, 91, 0.20);
    border-radius: 10px;
    flex-shrink: 0;
  }
  .fm-plan-stage-num {
    font-size: 14.5px;
    font-weight: 800;
    color: #007543;
    line-height: 1;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-plan-stage-title {
    font-size: 8.5px;
    font-weight: 800;
    color: #64748b;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-top: 2px;
    font-family: 'TrionAIAbout', sans-serif !important;
  }

  .fm-plan-meta {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .fm-plan-sequence-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .fm-plan-seq-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.06);
    color: #334155;
    font-size: 11.5px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 6px;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-plan-stage-tag {
    font-size: 11px;
    color: #64748b;
    font-weight: 500;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-plan-bar-track {
    width: 100%;
    max-width: 240px;
    height: 4.5px;
    background: rgba(0, 152, 91, 0.10);
    border-radius: 9999px;
    overflow: hidden;
    position: relative;
  }
  .fm-plan-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #00985b 0%, #00b86c 100%);
    border-radius: 9999px;
    transition: width 0.35s ease;
  }

  /* Plan Card Right Column (Metrics) */
  .fm-plan-card-right {
    display: flex;
    align-items: center;
    gap: 18px;
    flex-shrink: 0;
    max-width: 100%;
  }
  .fm-plan-metric-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .fm-plan-alloc-group {
    text-align: right;
  }
  .fm-plan-cumul-group {
    text-align: right;
    min-width: 100px;
    max-width: 140px;
    border-left: 1px solid rgba(0, 152, 91, 0.12);
    padding-left: 16px;
  }
  .fm-plan-metric-label {
    font-size: 10px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-family: 'TrionAIAbout', sans-serif !important;
    white-space: nowrap;
  }
  .fm-plan-alloc-wrap {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
    flex-wrap: wrap;
  }
  .fm-plan-alloc-val {
    font-size: 15.5px;
    font-weight: 800;
    color: #007543;
    letter-spacing: -0.01em;
    font-family: 'TrionAIAbout', sans-serif !important;
    word-break: break-all;
    overflow-wrap: anywhere;
  }
  .fm-plan-pct-badge {
    font-size: 10px;
    font-weight: 700;
    color: #007543;
    background: rgba(0, 152, 91, 0.08);
    border: 1px solid rgba(0, 152, 91, 0.18);
    padding: 1px 5px;
    border-radius: 4px;
    font-family: 'TrionAIAbout', sans-serif !important;
    white-space: nowrap;
  }
  .fm-plan-cumul-val {
    font-size: 14.5px;
    font-weight: 800;
    color: #0f172a;
    font-family: 'TrionAIAbout', sans-serif !important;
    word-break: break-all;
    overflow-wrap: anywhere;
  }

  @media (max-width: 680px) {
    .fm-plan-card {
      flex-direction: column;
      align-items: stretch;
      gap: 10px;
      padding: 12px 12px 10px 12px;
    }
    .fm-plan-card-left {
      width: 100%;
    }
    .fm-plan-bar-track {
      max-width: 100%;
    }
    .fm-plan-card-right {
      width: 100%;
      justify-content: space-between;
      border-top: 1px solid rgba(0, 152, 91, 0.10);
      padding-top: 8px;
      gap: 8px;
    }
    .fm-plan-cumul-group {
      border-left: 1px solid rgba(0, 152, 91, 0.12);
      padding-left: 10px;
      min-width: unset;
      max-width: unset;
      flex: 1;
    }
    .fm-plan-alloc-group {
      flex: 1;
      text-align: left;
    }
    .fm-plan-alloc-wrap {
      justify-content: flex-start;
    }
  }

  /* ── Verification Box ── */
  .fm-verify-card {
    background: #f8fcfa;
    border: 1px solid rgba(0, 152, 91, 0.18);
    border-radius: 12px;
    padding: 16px 18px;
  }
  .fm-verify-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 10px;
    flex-wrap: wrap;
  }
  .fm-verify-title-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .fm-verify-icon {
    width: 28px;
    height: 28px;
    border-radius: 7px;
    background: rgba(0, 152, 91, 0.10);
    color: #007543;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .fm-verify-title {
    font-size: 13.5px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 2px 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-verify-desc {
    font-size: 12px;
    color: #64748b;
    margin: 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-verify-badge {
    font-size: 11px;
    font-weight: 700;
    color: #007543;
    background: rgba(0, 152, 91, 0.08);
    border: 1px solid rgba(0, 152, 91, 0.18);
    padding: 3px 9px;
    border-radius: 50px;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-verify-stats {
    display: flex;
    align-items: center;
    gap: 14px;
    padding-top: 10px;
    border-top: 1px solid rgba(0, 152, 91, 0.08);
    flex-wrap: wrap;
  }
  .fm-v-stat {
    font-size: 12.5px;
    color: #475569;
    display: flex;
    align-items: center;
    gap: 5px;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-v-stat strong {
    color: #0f172a;
    font-weight: 800;
  }
  .fm-v-div {
    width: 1px;
    height: 12px;
    background: rgba(0, 152, 91, 0.18);
  }

  /* ── Notice Card ── */
  .fm-notice {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.16);
    border-left: 3.5px solid #00985b;
    border-radius: 14px;
    padding: 22px 24px;
    box-shadow: 0 2px 12px rgba(0, 75, 47, 0.02);
  }
  @media (max-width: 640px) {
    .fm-notice {
      padding: 16px;
    }
  }
  .fm-notice-head {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }
  .fm-notice-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(0, 152, 91, 0.10);
    color: #007543;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .fm-notice-head h2 {
    font-size: 15.5px;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-notice p {
    font-size: 13px;
    line-height: 1.65;
    color: #475569;
    margin: 0 0 8px 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-notice p:last-of-type {
    margin-bottom: 12px;
  }
  .fm-notice-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12.5px;
    font-weight: 700;
    color: #007543;
    text-decoration: none;
    font-family: 'TrionAIAbout', sans-serif !important;
    transition: all 0.18s ease;
  }
  .fm-notice-link:hover {
    color: #00985b;
    gap: 8px;
  }

  /* ── Top Takeaway Card ── */
  .fm-top-takeaway {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.22);
    border-left: 4px solid #00985b;
    border-radius: 16px;
    padding: 22px 24px;
    margin-bottom: 26px;
    box-shadow: 0 4px 16px rgba(0, 75, 47, 0.04);
  }
  .fm-top-takeaway-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }
  .fm-top-takeaway-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(0, 152, 91, 0.10);
    color: #007543;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .fm-top-takeaway h2 {
    font-size: 16px;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-top-takeaway-desc {
    font-size: 13.5px;
    line-height: 1.65;
    color: #334155;
    margin: 0 0 14px 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-takeaways-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .fm-takeaway-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 13px;
    line-height: 1.55;
    color: #475569;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-takeaway-item svg {
    color: #00985b;
    margin-top: 3px;
    flex-shrink: 0;
  }

  /* ── Section Cards ── */
  .fm-section-card {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.16);
    border-radius: 18px;
    padding: 28px 30px;
    box-shadow: 0 2px 14px rgba(0, 75, 47, 0.02);
  }
  @media (max-width: 640px) {
    .fm-section-card {
      padding: 20px 16px;
    }
  }

  /* ── Audience Grid ── */
  .fm-audience-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 18px;
    margin-top: 18px;
  }
  .fm-audience-card {
    background: #f8fcfa;
    border: 1px solid rgba(0, 152, 91, 0.14);
    border-radius: 14px;
    padding: 20px;
  }
  .fm-audience-card-head {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }
  .fm-audience-card-icon {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: rgba(0, 152, 91, 0.10);
    color: #007543;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .fm-audience-card h3 {
    font-size: 15px;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-audience-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .fm-audience-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 13px;
    line-height: 1.55;
    color: #475569;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-audience-item svg {
    color: #00985b;
    margin-top: 3px;
    flex-shrink: 0;
  }

  /* ── Comparison Table ── */
  .fm-decision-table-wrap {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin: 18px 0 16px 0;
    border: 1px solid rgba(0, 152, 91, 0.16);
    border-radius: 12px;
  }
  .fm-decision-table {
    width: 100%;
    border-collapse: collapse;
    font-family: 'TrionAIAbout', sans-serif !important;
    font-size: 13px;
    min-width: 600px;
  }
  .fm-decision-table th {
    background: #f0fdf4;
    color: #007543;
    font-weight: 800;
    text-align: left;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(0, 152, 91, 0.16);
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-decision-table td {
    padding: 13px 16px;
    border-bottom: 1px solid rgba(0, 152, 91, 0.08);
    color: #334155;
    vertical-align: middle;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-decision-table tr:last-child td {
    border-bottom: none;
  }
  .fm-decision-table tr:hover td {
    background: #f8fcfa;
  }
  .fm-tier-badge {
    display: inline-block;
    padding: 3px 9px;
    border-radius: 6px;
    font-weight: 700;
    font-size: 12px;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-tier-badge.conservative {
    background: rgba(0, 152, 91, 0.10);
    color: #007543;
    border: 1px solid rgba(0, 152, 91, 0.20);
  }
  .fm-tier-badge.balanced {
    background: rgba(14, 165, 233, 0.10);
    color: #0369a1;
    border: 1px solid rgba(14, 165, 233, 0.20);
  }
  .fm-tier-badge.extended {
    background: rgba(139, 92, 246, 0.10);
    color: #6d28d9;
    border: 1px solid rgba(139, 92, 246, 0.20);
  }
  .fm-decision-note {
    font-size: 13px;
    color: #475569;
    line-height: 1.6;
    background: #f0fdf4;
    border-left: 3px solid #00985b;
    padding: 10px 14px;
    border-radius: 0 8px 8px 0;
    margin: 14px 0 0 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }

  /* ── Step-by-Step How-To Guide ── */
  .fm-howto-list {
    list-style: none;
    padding: 0;
    margin: 18px 0 0 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .fm-howto-item {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    background: #f8fcfa;
    border: 1px solid rgba(0, 152, 91, 0.14);
    border-radius: 12px;
    padding: 16px 18px;
  }
  .fm-howto-num {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #00985b;
    color: #ffffff;
    font-weight: 800;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-howto-body h3 {
    font-size: 14.5px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 4px 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-howto-body p {
    font-size: 13px;
    line-height: 1.6;
    color: #475569;
    margin: 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }

  /* ── Definition Card ── */
  .fm-def-card {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    background: #f0fdf4;
    border: 1px solid rgba(0, 152, 91, 0.22);
    border-radius: 12px;
    padding: 18px 20px;
    margin: 18px 0 20px 0;
  }
  .fm-def-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(0, 152, 91, 0.14);
    color: #007543;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .fm-def-card h3 {
    font-size: 14.5px;
    font-weight: 800;
    color: #007543;
    margin: 0 0 4px 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-def-card p {
    font-size: 13.5px;
    line-height: 1.65;
    color: #1e293b;
    margin: 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }

  /* ── Links & Citations ── */
  .fm-text-link {
    color: #007543;
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 2px;
    font-family: 'TrionAIAbout', sans-serif !important;
    transition: color 0.18s ease;
  }
  .fm-text-link:hover {
    color: #00985b;
  }
  .fm-ext-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: #007543;
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 2px;
    font-family: 'TrionAIAbout', sans-serif !important;
    transition: color 0.18s ease;
  }
  .fm-ext-link:hover {
    color: #00985b;
  }
  .fm-internal-links-bar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 22px;
    padding-top: 16px;
    border-top: 1px solid rgba(0, 152, 91, 0.12);
    font-size: 12.5px;
    color: #64748b;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-internal-links-bar span {
    font-weight: 700;
    color: #0f172a;
  }
  .fm-internal-links-bar a {
    color: #007543;
    text-decoration: none;
    font-weight: 700;
    background: rgba(0, 152, 91, 0.06);
    padding: 3px 10px;
    border-radius: 50px;
    border: 1px solid rgba(0, 152, 91, 0.14);
    transition: all 0.18s ease;
  }
  .fm-internal-links-bar a:hover {
    background: #00985b;
    color: #ffffff;
    border-color: #00985b;
  }

  /* ── 3D Showcase Image Section & SEO Educational Guide ── */
  .fm-seo-card {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.16);
    border-radius: 18px;
    padding: 28px 30px;
    box-shadow: 0 2px 14px rgba(0, 75, 47, 0.02);
  }
  @media (max-width: 640px) {
    .fm-seo-card {
      padding: 20px 16px;
    }
  }
  .fm-seo-header-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }
  .fm-seo-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: rgba(0, 152, 91, 0.08);
    border: 1px solid rgba(0, 152, 91, 0.20);
    color: #007543;
    font-size: 11px;
    font-weight: 700;
    padding: 3px 9px;
    border-radius: 50px;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-seo-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-guide-status-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #eef7f3;
    border: 1px solid rgba(0, 152, 91, 0.22);
    color: #007543;
    font-size: 11.5px;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 50px;
    font-family: 'TrionAIAbout', sans-serif !important;
  }

  /* Figure & Image Showcase */
  .fm-showcase-figure {
    margin: 18px 0 22px 0;
    background: #f8fcfa;
    border: 1px solid rgba(0, 152, 91, 0.16);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 18px rgba(0, 75, 47, 0.04);
  }
  .fm-showcase-img-container {
    width: 100%;
    position: relative;
    overflow: hidden;
    background: #eaf5f0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .fm-showcase-img {
    width: 100%;
    height: auto;
    object-fit: cover;
    display: block;
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .fm-showcase-figure:hover .fm-showcase-img {
    transform: scale(1.015);
  }
  .fm-showcase-caption-block {
    padding: 14px 18px 16px 18px;
    background: #ffffff;
    border-top: 1px solid rgba(0, 152, 91, 0.12);
  }
  .fm-showcase-caption-header {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 6px;
  }
  .fm-showcase-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #00985b;
    flex-shrink: 0;
    margin-top: 6px;
  }
  .fm-showcase-caption-title {
    font-size: 13.5px;
    font-weight: 800;
    color: #0f172a;
    font-family: 'TrionAIAbout', sans-serif !important;
    line-height: 1.45;
  }
  .fm-showcase-description-text {
    font-size: 12.5px;
    line-height: 1.6;
    color: #475569;
    margin: 0;
    padding-left: 15px;
    font-family: 'TrionAIAbout', sans-serif !important;
  }

  .fm-seo-text h3 {
    font-size: 15.5px;
    font-weight: 800;
    color: #0f172a;
    margin: 18px 0 8px 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-seo-text p {
    font-size: 14px;
    line-height: 1.7;
    color: #475569;
    margin: 0 0 10px 0;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-seo-quote {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    background: #eef7f3;
    border-left: 3px solid #00985b;
    border-radius: 0 8px 8px 0;
    padding: 10px 14px;
    font-size: 13px;
    font-weight: 600;
    color: #007543;
    margin-top: 14px;
    font-family: 'TrionAIAbout', sans-serif !important;
  }

  /* ── FAQ Section ── */
  .fm-faq-header {
    text-align: center;
    margin-bottom: 20px;
  }
  .fm-faq-eyebrow {
    font-size: 11.5px;
    font-weight: 700;
    color: #007543;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: block;
    margin-bottom: 4px;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-faq-title {
    font-size: clamp(19px, 3.8vw, 26px);
    font-weight: 800;
    color: #0f172a;
    margin: 0;
    letter-spacing: -0.02em;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-faq-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .fm-faq-item {
    background: #ffffff;
    border: 1px solid rgba(0, 152, 91, 0.14);
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.2s ease;
  }
  .fm-faq-item:hover {
    border-color: rgba(0, 152, 91, 0.30);
  }
  .fm-faq-item.open {
    border-color: #00985b;
    box-shadow: 0 2px 10px rgba(0, 152, 91, 0.06);
  }
  .fm-faq-trigger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 18px;
    background: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
    outline: none;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-faq-q {
    font-size: 14.5px;
    font-weight: 700;
    color: #0f172a;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-faq-arrow {
    color: #007543;
    transition: transform 0.2s ease;
    flex-shrink: 0;
  }
  .fm-faq-arrow.rotated {
    transform: rotate(180deg);
  }
  .fm-faq-answer {
    padding: 0 18px 16px 18px;
    font-size: 13.5px;
    line-height: 1.65;
    color: #475569;
    border-top: 1px solid rgba(0, 152, 91, 0.06);
    padding-top: 10px;
    font-family: 'TrionAIAbout', sans-serif !important;
  }
  .fm-faq-answer p {
    margin: 0;
  }

  /* ── Spinner & Keyframes ── */
  .fm-spinner {
    width: 15px;
    height: 15px;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    display: inline-block;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes fadeSlideUp {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* ═════════════════════════════════════════════════════════
     ── COMPREHENSIVE MOBILE RESPONSIVE MEDIA QUERIES ──
     Phone-first: 768px → 640px → 480px → 400px → 360px → 320px
     ═════════════════════════════════════════════════════════ */

  /* ── Tablet / Large Phone (≤768px) ── */
  @media (max-width: 768px) {
    .fm-orb-1 {
      width: 260px;
      height: 260px;
      top: -60px;
      right: -60px;
      opacity: 0.12;
    }
    .fm-orb-2 {
      width: 200px;
      height: 200px;
      bottom: 40px;
      left: -50px;
      opacity: 0.10;
    }

    .fm-result-header {
      flex-direction: column;
      gap: 10px;
    }
    .fm-verified-pill {
      align-self: flex-start;
    }

    .fm-seo-header-row {
      flex-direction: column;
      gap: 8px;
    }
    .fm-guide-status-pill {
      align-self: flex-start;
    }

    .fm-plan-cumul-group {
      min-width: 90px;
      padding-left: 12px;
    }
    .fm-plan-card-right {
      gap: 12px;
    }

    .fm-internal-links-bar {
      gap: 8px;
    }
    .fm-internal-links-bar a {
      padding: 4px 10px;
      font-size: 11.5px;
    }

    .fm-insight-title-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }
  }

  /* ── Phone (≤640px) ── */
  @media (max-width: 640px) {
    /* ── Navigation ── */
    .fm-nav {
      padding: 8px 12px;
      min-height: 48px;
    }
    .fm-nav-left {
      width: 100%;
      justify-content: space-between;
      gap: 8px;
    }
    .fm-nav-back {
      padding: 5px 10px;
      font-size: 11px;
      gap: 4px;
      white-space: nowrap;
      flex-shrink: 0;
      min-height: 34px;
    }
    .fm-nav-brand-img img {
      height: 24px;
      width: auto;
      max-width: 145px;
    }

    /* ── Layout ── */
    .fm-container {
      padding: 14px 12px 60px 12px;
    }
    .fm-section {
      margin-bottom: 20px;
    }

    /* ── Hero ── */
    .fm-hero {
      margin-bottom: 18px;
    }
    .fm-hero h1 {
      font-size: clamp(20px, 5.5vw, 26px);
      letter-spacing: -0.02em;
      margin-bottom: 8px;
    }
    .fm-hero-desc {
      font-size: 13px;
      line-height: 1.55;
    }
    .fm-eyebrow {
      font-size: 10px;
      padding: 3px 10px;
      gap: 5px;
    }

    /* ── Calculator Card ── */
    .fm-calc-card {
      padding: 16px 14px;
      border-radius: 16px;
    }
    .fm-field-group {
      margin-bottom: 18px;
    }
    .fm-field-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
    .fm-label {
      font-size: 13.5px;
    }
    .fm-label-hint {
      font-size: 11.5px;
    }
    .fm-amount-input {
      height: 48px;
      font-size: 15.5px;
    }
    .fm-currency-symbol {
      padding-left: 12px;
      font-size: 17px;
    }
    .fm-input-wrapper {
      border-radius: 12px;
    }
    .fm-input-clear {
      width: 30px;
      height: 30px;
      margin-right: 8px;
    }

    /* ── Quick Amounts ── */
    .fm-quick-row {
      gap: 5px;
      margin-top: 8px;
    }
    .fm-quick-chip {
      padding: 5px 11px;
      font-size: 11.5px;
      min-height: 32px;
      display: inline-flex;
      align-items: center;
    }
    .fm-quick-label {
      font-size: 11px;
    }

    /* ── Level Selector ── */
    .fm-levels-wrapper {
      padding: 14px 12px 12px 12px;
      border-radius: 14px;
      margin-bottom: 18px;
    }
    .fm-level-header-title {
      gap: 8px;
    }
    .fm-level-icon-badge {
      width: 30px;
      height: 30px;
      border-radius: 8px;
    }
    .fm-level-subtitle {
      font-size: 10.5px;
    }
    .fm-levels-current-badge {
      padding: 4px 10px;
      font-size: 11.5px;
      margin-top: 4px;
    }
    .fm-level-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
      margin-bottom: 12px;
    }
    .fm-level-card {
      padding: 8px 3px 6px 3px;
      min-height: 82px;
      border-radius: 10px;
    }
    .fm-card-tag {
      font-size: 8px;
    }
    .fm-card-number {
      font-size: 17px;
    }
    .fm-card-desc {
      font-size: 9px;
    }

    /* ── Level Insight Banner ── */
    .fm-level-insight-banner {
      padding: 10px 12px;
      gap: 8px;
      flex-direction: column;
    }
    .fm-insight-icon {
      width: 28px;
      height: 28px;
    }
    .fm-insight-title {
      font-size: 12.5px;
    }
    .fm-insight-badge {
      font-size: 10px;
      padding: 3px 8px;
      white-space: nowrap;
    }
    .fm-insight-desc {
      font-size: 11.5px;
    }
    .fm-insight-title-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 5px;
    }

    /* ── Slider ── */
    .fm-level-slider {
      height: 8px;
    }
    .fm-level-slider::-webkit-slider-thumb {
      width: 24px;
      height: 24px;
    }
    .fm-level-slider::-moz-range-thumb {
      width: 24px;
      height: 24px;
    }
    .fm-slider-marker {
      font-size: 12px;
      min-width: 20px;
      text-align: center;
    }

    /* ── Validation ── */
    .fm-validation {
      padding: 10px 12px;
      font-size: 12.5px;
      border-radius: 10px;
      gap: 8px;
    }

    /* ── Action Buttons ── */
    .fm-actions {
      flex-direction: column;
      width: 100%;
      gap: 10px;
      margin-top: 12px;
    }
    .fm-btn-calc {
      width: 100%;
      min-height: 56px;
      height: auto;
      font-size: 16px;
      font-weight: 800;
      padding: 15px 18px;
      border-radius: 14px;
      letter-spacing: 0.015em;
      box-shadow: 0 6px 20px rgba(0, 152, 91, 0.35), 0 2px 6px rgba(0, 75, 47, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.35);
    }
    .fm-btn-reset {
      width: 100%;
      min-height: 50px;
      height: auto;
      font-size: 13.5px;
      border-radius: 14px;
      padding: 12px 16px;
    }

    /* ── Empty State ── */
    .fm-empty {
      padding: 28px 16px;
      border-radius: 14px;
    }
    .fm-empty h3,
    .fm-empty h2 {
      font-size: 15px;
    }
    .fm-empty p {
      font-size: 12.5px;
    }
    .fm-empty-icon {
      width: 42px;
      height: 42px;
      border-radius: 12px;
    }

    /* ── Result Card ── */
    .fm-result-card {
      padding: 16px 12px;
      border-radius: 16px;
    }
    .fm-result-header {
      flex-direction: column;
      gap: 10px;
      padding-bottom: 14px;
    }
    .fm-result-badge {
      font-size: 10px;
      padding: 2px 8px;
    }
    .fm-result-title {
      font-size: 16px;
      line-height: 1.3;
    }
    .fm-result-sub {
      font-size: 12px;
    }
    .fm-verified-pill {
      font-size: 11px;
      padding: 4px 10px;
      align-self: flex-start;
    }

    /* ── Summary Metrics Grid ── */
    .fm-summary-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin: 14px 0 18px 0;
    }
    .fm-summary-item {
      padding: 10px 8px;
      border-radius: 10px;
      overflow: hidden;
    }
    .fm-summary-label {
      font-size: 9.5px;
      gap: 4px;
    }
    .fm-summary-val {
      font-size: 15px;
      word-break: break-all;
      overflow-wrap: anywhere;
    }

    /* ── Breakdown Header ── */
    .fm-breakdown-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }
    .fm-breakdown-title {
      font-size: 15px;
    }
    .fm-stages-badge {
      font-size: 10.5px;
    }

    /* ── Plan Cards ── */
    .fm-plan-card {
      flex-direction: column;
      align-items: stretch;
      gap: 8px;
      padding: 12px 10px 10px 10px;
      border-radius: 12px;
      max-width: 100%;
      overflow: hidden;
    }
    .fm-plan-card::before {
      width: 3px;
    }
    .fm-plan-card-left {
      width: 100%;
      gap: 10px;
      min-width: 0;
    }
    .fm-plan-badge-box {
      min-width: 44px;
      max-width: 52px;
      padding: 6px 4px;
      border-radius: 8px;
      flex-shrink: 0;
    }
    .fm-plan-stage-num {
      font-size: 13px;
    }
    .fm-plan-stage-title {
      font-size: 8px;
    }
    .fm-plan-seq-pill {
      font-size: 10.5px;
      padding: 2px 6px;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .fm-plan-stage-tag {
      font-size: 10px;
      white-space: nowrap;
    }
    .fm-plan-bar-track {
      max-width: 100%;
    }
    .fm-plan-card-right {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 0;
      border-top: 1px solid rgba(0, 152, 91, 0.10);
      padding-top: 8px;
      justify-content: space-between;
    }
    .fm-plan-alloc-group {
      text-align: left;
      flex: 1;
      min-width: 0;
    }
    .fm-plan-cumul-group {
      text-align: right;
      min-width: unset;
      max-width: unset;
      flex: 1;
      border-left: 1px solid rgba(0, 152, 91, 0.10);
      padding-left: 10px;
    }
    .fm-plan-metric-label {
      font-size: 9px;
      white-space: nowrap;
    }
    .fm-plan-alloc-val {
      font-size: 14px;
      word-break: break-all;
    }
    .fm-plan-pct-badge {
      font-size: 9px;
      padding: 1px 4px;
    }
    .fm-plan-cumul-val {
      font-size: 13px;
      word-break: break-all;
    }
    .fm-plan-alloc-wrap {
      justify-content: flex-start;
      gap: 4px;
      flex-wrap: wrap;
    }

    /* ── Verification Card ── */
    .fm-verify-card {
      padding: 12px;
      border-radius: 10px;
    }
    .fm-verify-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    .fm-verify-title {
      font-size: 12.5px;
    }
    .fm-verify-desc {
      font-size: 11px;
    }
    .fm-verify-badge {
      font-size: 10px;
    }
    .fm-verify-stats {
      flex-direction: column;
      gap: 6px;
    }
    .fm-v-div {
      display: none;
    }
    .fm-v-stat {
      font-size: 11.5px;
      width: 100%;
      justify-content: space-between;
    }
    .fm-verify-icon {
      width: 24px;
      height: 24px;
    }

    /* ── Top Takeaway ── */
    .fm-top-takeaway {
      padding: 16px 14px;
      border-radius: 14px;
      margin-bottom: 20px;
      border-left-width: 3px;
    }
    .fm-top-takeaway-header {
      gap: 8px;
    }
    .fm-top-takeaway-icon {
      width: 28px;
      height: 28px;
      min-width: 28px;
    }
    .fm-top-takeaway h2 {
      font-size: 14px;
      line-height: 1.35;
    }
    .fm-top-takeaway-desc {
      font-size: 12.5px;
      line-height: 1.55;
    }
    .fm-takeaway-item {
      font-size: 12px;
      line-height: 1.5;
    }

    /* ── Notice Card ── */
    .fm-notice {
      padding: 14px 12px;
      border-radius: 12px;
      border-left-width: 3px;
    }
    .fm-notice-head {
      gap: 8px;
    }
    .fm-notice-icon {
      width: 28px;
      height: 28px;
      min-width: 28px;
    }
    .fm-notice-head h2 {
      font-size: 13.5px;
      line-height: 1.35;
    }
    .fm-notice p {
      font-size: 12px;
      line-height: 1.55;
    }
    .fm-notice-link {
      font-size: 12px;
    }

    /* ── Section Cards ── */
    .fm-section-card {
      padding: 18px 14px;
      border-radius: 14px;
    }

    /* ── Audience Grid ── */
    .fm-audience-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }
    .fm-audience-card {
      padding: 14px;
      border-radius: 12px;
    }
    .fm-audience-card h3 {
      font-size: 14px;
    }
    .fm-audience-item {
      font-size: 12px;
    }

    /* ── Decision Table ── */
    .fm-decision-table-wrap {
      margin: 14px 0 12px 0;
      border-radius: 10px;
      -webkit-overflow-scrolling: touch;
    }
    .fm-decision-table {
      min-width: 480px;
      font-size: 11.5px;
    }
    .fm-decision-table th {
      padding: 10px 10px;
      font-size: 11px;
      white-space: nowrap;
    }
    .fm-decision-table td {
      padding: 10px 10px;
      font-size: 11px;
    }
    .fm-decision-note {
      font-size: 12px;
      padding: 8px 12px;
    }

    /* ── How-To Guide ── */
    .fm-howto-item {
      padding: 12px 14px;
      gap: 10px;
      border-radius: 10px;
    }
    .fm-howto-num {
      width: 28px;
      height: 28px;
      font-size: 13px;
      min-width: 28px;
    }
    .fm-howto-body h3 {
      font-size: 13.5px;
    }
    .fm-howto-body p {
      font-size: 12px;
      line-height: 1.55;
    }

    /* ── Definition Card ── */
    .fm-def-card {
      padding: 14px;
      gap: 10px;
      border-radius: 10px;
      flex-direction: column;
    }
    .fm-def-icon {
      width: 28px;
      height: 28px;
    }
    .fm-def-card h3 {
      font-size: 13.5px;
    }
    .fm-def-card p {
      font-size: 12px;
      line-height: 1.55;
    }

    /* ── SEO Card ── */
    .fm-seo-card {
      padding: 16px 14px;
      border-radius: 14px;
    }
    .fm-seo-title {
      font-size: 15px;
      line-height: 1.35;
    }
    .fm-seo-badge {
      font-size: 10px;
    }
    .fm-seo-text h3 {
      font-size: 14px;
    }
    .fm-seo-text p {
      font-size: 12px;
      line-height: 1.6;
    }
    .fm-seo-quote {
      font-size: 12px;
      padding: 8px 10px;
    }
    .fm-seo-header-row {
      flex-direction: column;
      gap: 8px;
    }
    .fm-guide-status-pill {
      align-self: flex-start;
      font-size: 10.5px;
    }

    /* ── Showcase Figure ── */
    .fm-showcase-figure {
      border-radius: 12px;
      margin: 14px 0 18px 0;
    }
    .fm-showcase-caption-block {
      padding: 10px 12px;
    }
    .fm-showcase-caption-title {
      font-size: 12px;
    }
    .fm-showcase-description-text {
      font-size: 11px;
      padding-left: 10px;
    }

    /* ── Internal Links Bar ── */
    .fm-internal-links-bar {
      font-size: 11px;
      gap: 6px;
      flex-wrap: wrap;
    }
    .fm-internal-links-bar a {
      padding: 4px 9px;
      font-size: 11px;
    }

    /* ── FAQ Section ── */
    .fm-faq-title {
      font-size: 19px;
    }
    .fm-faq-trigger {
      padding: 14px 12px;
      gap: 10px;
      min-height: 48px;
    }
    .fm-faq-q {
      font-size: 13px;
      line-height: 1.4;
    }
    .fm-faq-answer {
      padding: 0 12px 14px 12px;
      font-size: 12px;
      line-height: 1.55;
    }
    .fm-faq-arrow {
      min-width: 18px;
    }

    /* ── Tier Badges ── */
    .fm-tier-badge {
      font-size: 10.5px;
      padding: 2px 7px;
    }
  }

  /* ── Small Phone (≤480px) ── */
  @media (max-width: 480px) {
    .fm-container {
      padding: 12px 8px 50px 8px;
      max-width: 100vw;
      overflow-x: hidden;
    }

    .fm-hero h1 {
      font-size: clamp(18px, 5.5vw, 22px);
    }
    .fm-hero-desc {
      font-size: 12.5px;
    }

    .fm-calc-card {
      padding: 14px 12px;
    }

    .fm-summary-grid {
      gap: 6px;
    }
    .fm-summary-val {
      font-size: 14px;
    }
    .fm-summary-label {
      font-size: 9px;
      flex-wrap: wrap;
    }

    .fm-plan-alloc-val {
      font-size: 12.5px;
      word-break: break-all;
    }
    .fm-plan-cumul-val {
      font-size: 11.5px;
      word-break: break-all;
    }
    .fm-plan-card-right {
      gap: 0;
    }
    .fm-plan-cumul-group {
      padding-left: 8px;
    }

    .fm-top-takeaway h2 {
      font-size: 13.5px;
    }
    .fm-top-takeaway-desc {
      font-size: 12px;
    }
    .fm-takeaway-item {
      font-size: 11.5px;
    }

    .fm-faq-title {
      font-size: 18px;
    }
    .fm-faq-q {
      font-size: 12.5px;
    }

    .fm-audience-card h3 {
      font-size: 13.5px;
    }
    .fm-audience-item {
      font-size: 11.5px;
    }
  }

  /* ── Mini Phone (≤400px) ── */
  @media (max-width: 400px) {
    .fm-nav {
      padding: 12px 12px;
      min-height: 64px;
    }
    .fm-nav-inner {
      grid-template-columns: auto 1fr;
      gap: 6px;
    }
    .fm-nav-back {
      padding: 6px 10px;
      font-size: 11.5px;
      gap: 3px;
    }
    .fm-nav-back svg {
      width: 13px;
      height: 13px;
    }
    .fm-nav-brand-img img {
      max-width: 175px;
      height: 32px;
    }

    .fm-container {
      padding: 10px 6px 44px 6px;
      max-width: 100vw;
      overflow-x: hidden;
    }

    .fm-level-grid {
      gap: 5px;
    }
    .fm-level-card {
      min-height: 76px;
      padding: 7px 2px 5px 2px;
    }
    .fm-card-number {
      font-size: 16px;
    }
    .fm-card-desc {
      font-size: 8.5px;
    }
    .fm-card-tag {
      font-size: 7.5px;
    }

    .fm-plan-card {
      padding: 10px 8px 8px 8px;
      overflow: hidden;
    }
    .fm-plan-badge-box {
      min-width: 40px;
      max-width: 46px;
      padding: 5px 3px;
    }
    .fm-plan-cumul-group {
      padding-left: 6px;
    }
    .fm-plan-alloc-val {
      font-size: 12px;
    }
    .fm-plan-cumul-val {
      font-size: 11px;
    }

    .fm-result-title {
      font-size: 15px;
    }

    .fm-seo-title {
      font-size: 14px;
    }

    .fm-notice-head h2 {
      font-size: 13px;
    }

    .fm-howto-item {
      padding: 10px 12px;
    }

    .fm-section-card {
      padding: 14px 10px;
    }
    .fm-seo-card {
      padding: 14px 10px;
    }

    .fm-quick-chip {
      padding: 4px 8px;
      font-size: 11px;
    }

    .fm-internal-links-bar {
      font-size: 10.5px;
      gap: 5px;
    }
    .fm-internal-links-bar a {
      padding: 3px 8px;
      font-size: 10.5px;
    }
  }

  /* ── Extra Small Phone (≤360px) ── */
  @media (max-width: 360px) {
    .fm-nav {
      padding: 10px 10px;
      min-height: 60px;
    }
    .fm-nav-back {
      padding: 6px 8px;
      font-size: 11px;
    }
    .fm-nav-brand-img img {
      max-width: 160px;
      height: 30px;
    }

    .fm-hero h1 {
      font-size: 17px;
    }
    .fm-hero-desc {
      font-size: 12px;
    }

    .fm-container {
      padding: 8px 4px 40px 4px;
      max-width: 100vw;
      overflow-x: hidden;
    }

    .fm-level-grid {
      gap: 4px;
    }
    .fm-level-card {
      min-height: 70px;
      padding: 6px 2px 4px 2px;
      border-radius: 8px;
    }
    .fm-card-number {
      font-size: 14px;
    }
    .fm-card-desc {
      font-size: 8px;
    }
    .fm-card-tag {
      font-size: 7px;
    }

    .fm-summary-item {
      padding: 8px 6px;
    }
    .fm-summary-val {
      font-size: 13px;
    }
    .fm-summary-label {
      font-size: 8.5px;
    }

    .fm-plan-card {
      padding: 8px 6px 6px 6px;
      overflow: hidden;
    }
    .fm-plan-badge-box {
      min-width: 36px;
      max-width: 42px;
      padding: 4px 2px;
    }
    .fm-plan-stage-num {
      font-size: 11px;
    }
    .fm-plan-alloc-val {
      font-size: 11.5px;
      word-break: break-all;
    }
    .fm-plan-cumul-val {
      font-size: 11px;
      word-break: break-all;
    }
    .fm-plan-seq-pill {
      font-size: 9.5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 120px;
    }
    .fm-plan-cumul-group {
      padding-left: 5px;
    }
    .fm-plan-metric-label {
      font-size: 8px;
    }

    .fm-result-card {
      padding: 14px 10px;
    }
    .fm-result-title {
      font-size: 14.5px;
    }

    .fm-btn-calc {
      min-height: 52px;
      height: auto;
      font-size: 14.5px;
      font-weight: 800;
      padding: 12px 14px;
      border-radius: 12px;
    }
    .fm-btn-reset {
      min-height: 44px;
      height: auto;
      font-size: 12.5px;
      border-radius: 12px;
    }

    .fm-calc-card {
      padding: 12px 10px;
      border-radius: 14px;
    }

    .fm-top-takeaway {
      padding: 12px 10px;
    }
    .fm-top-takeaway h2 {
      font-size: 13px;
    }

    .fm-notice {
      padding: 12px 10px;
    }

    .fm-faq-trigger {
      padding: 12px 10px;
    }
    .fm-faq-q {
      font-size: 12px;
    }
    .fm-faq-answer {
      padding: 0 10px 12px 10px;
      font-size: 11.5px;
    }

    .fm-section-card {
      padding: 12px 8px;
      border-radius: 12px;
    }
    .fm-seo-card {
      padding: 12px 8px;
      border-radius: 12px;
    }

    .fm-decision-table {
      min-width: 420px;
      font-size: 10.5px;
    }
    .fm-decision-table th,
    .fm-decision-table td {
      padding: 8px;
      font-size: 10px;
    }
  }

  /* ── Minimum Viable Width (≤320px) ── */
  @media (max-width: 320px) {
    .fm-nav-back span,
    .fm-nav-back {
      font-size: 10px;
      padding: 4px 6px;
    }
    .fm-nav-brand-img img {
      max-width: 100px;
      height: 20px;
    }

    .fm-hero h1 {
      font-size: 16px;
    }
    .fm-hero-desc {
      font-size: 11.5px;
    }

    .fm-card-number {
      font-size: 13px;
    }
    .fm-level-card {
      min-height: 65px;
    }

    .fm-summary-val {
      font-size: 12px;
    }

    .fm-result-title {
      font-size: 14px;
    }

    .fm-plan-alloc-val {
      font-size: 11.5px;
    }
    .fm-plan-cumul-val {
      font-size: 11px;
    }

    .fm-quick-chip {
      font-size: 10px;
      padding: 3px 6px;
    }

    .fm-top-takeaway h2 {
      font-size: 12.5px;
    }

    .fm-seo-title {
      font-size: 13px;
    }
  }

  /* ── Touch Target Safety ── */
  @media (hover: none) and (pointer: coarse) {
    .fm-quick-chip {
      min-height: 36px;
      min-width: 44px;
    }
    .fm-level-card {
      min-height: 84px;
    }
    .fm-faq-trigger {
      min-height: 52px;
    }
    .fm-slider-marker {
      min-width: 24px;
      min-height: 24px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .fm-track-step {
      height: 8px;
    }
    .fm-nav-back {
      min-height: 40px;
    }
    .fm-input-clear {
      width: 32px;
      height: 32px;
    }
    .fm-internal-links-bar a {
      min-height: 32px;
      display: inline-flex;
      align-items: center;
    }
    .fm-notice-link {
      min-height: 36px;
      display: inline-flex;
      align-items: center;
    }
  }

  /* ── Landscape Phone ── */
  @media (max-height: 500px) and (orientation: landscape) {
    .fm-orb {
      display: none;
    }
    .fm-nav {
      min-height: 48px;
      padding: 6px 14px;
    }
    .fm-hero {
      margin-bottom: 12px;
    }
    .fm-hero h1 {
      font-size: 20px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

export default function FundManagementPage() {
  const router = useRouter();
  const inputId = useId();
  const resultsRef = useRef(null);

  const [amount, setAmount] = useState("1000");
  const [selectedLevels, setSelectedLevels] = useState(3);
  const [calculatedResult, setCalculatedResult] = useState(null);
  const [error, setError] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Scroll fix for full-document layout
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const next = document.getElementById("__next");

    html.classList.add("fm-page");
    body.classList.add("fm-page");

    html.style.setProperty("height", "auto", "important");
    html.style.setProperty("min-height", "100%", "important");
    html.style.setProperty("overflow-y", "auto", "important");
    html.style.setProperty("overflow-x", "hidden", "important");
    html.style.setProperty("scroll-behavior", "smooth", "important");
    html.style.setProperty("-webkit-overflow-scrolling", "touch", "important");

    body.style.setProperty("height", "auto", "important");
    body.style.setProperty("min-height", "100vh", "important");
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
    } catch { }

    return () => {
      html.classList.remove("fm-page");
      body.classList.remove("fm-page");

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

  const handleAmountChange = (e) => {
    const rawVal = e.target.value;
    if (rawVal === "") { setAmount(""); setError(null); return; }
    const sanitized = rawVal.replace(/[^0-9.]/g, "");
    const parts = sanitized.split(".");
    if (parts.length > 2) return;
    setAmount(sanitized);
    if (error) setError(null);
  };

  const handleQuickAmount = (val) => {
    setAmount(String(val));
    if (error) setError(null);
  };

  const handleCalculate = (e) => {
    if (e) e.preventDefault();
    setError(null);
    const validationError = validateFundManagementInputs(amount, selectedLevels);
    if (validationError) { setError(validationError); return; }
    setIsCalculating(true);
    try {
      const result = calculateFundManagement(amount, selectedLevels);
      setCalculatedResult(result);
      setTimeout(() => {
        setIsCalculating(false);
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 100);
    } catch (err) {
      setError(err.message || "An error occurred during calculation.");
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setAmount("");
    setSelectedLevels(3);
    setCalculatedResult(null);
    setError(null);
  };

  const handleBack = () => {
    try { sessionStorage.setItem("trion_intro_seen", "1"); } catch { }
    router.push("/");
  };

  const toggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  const currentLevelConfig = LEVEL_CONFIG[selectedLevels - 1] || LEVEL_CONFIG[2];

  // Helper for dynamic strategy metadata with clean SVG icons (zero emojis)
  const getStrategyMeta = (lvl) => {
    if (lvl <= 3) {
      return {
        badge: "Conservative Allocation",
        desc: lvl === 1
          ? "Allocates 100% of your total capital in a single direct stage for fast, minimal-step budgeting."
          : `Allocates capital across ${lvl} compact stages, focusing capital into initial stages with a short recovery sequence.`,
        icon: (
          <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        )
      };
    } else if (lvl <= 6) {
      return {
        badge: "Balanced Multi-Tier",
        desc: `Distributes capital evenly across ${lvl} progressive stages, providing a steady geometric allocation structure with balanced depth.`,
        icon: (
          <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3v18" />
            <path d="M6 8l6-5 6 5" />
            <path d="M3 13h6l-3 7z" />
            <path d="M15 13h6l-3 7z" />
          </svg>
        )
      };
    } else {
      return {
        badge: "Extended Depth Buffer",
        desc: `Provides deep multi-stage coverage across ${lvl} systematic tiers, engineered for maximum geometric tolerance and capital preservation buffer.`,
        icon: (
          <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        )
      };
    }
  };

  const strategyMeta = getStrategyMeta(selectedLevels);

  return (
    <>
      <PageHead title={PAGE_TITLE} description={PAGE_DESC} canonical={PAGE_URL}>
        <style dangerouslySetInnerHTML={{ __html: pageStyles }} />
      </PageHead>

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://wingo30.com/" },
          { name: "Fund Management Calculator", url: PAGE_URL }
        ]}
      />
      <OrganizationSchema />
      <WebsiteSchema />
      <WebPageSchema
        title={PAGE_TITLE}
        description={PAGE_DESC}
        url={PAGE_URL}
        datePublished="2026-09-09T00:00:00+05:30"
        dateModified="2026-09-09T18:00:00+05:30"
      />
      <FAQSchema questions={FM_FAQS} />

      <div className="fm-page">
        <div className="fm-orb fm-orb-1" aria-hidden="true" />
        <div className="fm-orb fm-orb-2" aria-hidden="true" />

        {/* ── 1. Top Header Navigation (Enlarged & Centered Logo) ── */}
        <header className="fm-nav" role="banner">
          <div className="fm-nav-inner">
            <div className="fm-nav-side fm-nav-side-left">
              <button
                className="fm-nav-back"
                onClick={handleBack}
                type="button"
                aria-label="Navigate back to TRION AI home page"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Back to Home</span>
              </button>
            </div>

            <div className="fm-nav-center">
              <Link href="/" className="fm-nav-brand-img" aria-label="TRION AI Home">
                <Image
                  src="/trionai.png"
                  alt="TRION AI"
                  width={270}
                  height={42}
                  priority
                />
              </Link>
            </div>

            <div className="fm-nav-side fm-nav-side-right" aria-hidden="true" />
          </div>
        </header>

        <main className="fm-container" id="main-content">
          {/* ── Hero Section ── */}
          <section className="fm-hero fm-section" aria-labelledby="fm-hero-title">
            <div className="fm-eyebrow">
              <span className="fm-eyebrow-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2.5" fill="none">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v8" />
                  <path d="M8 12h8" />
                </svg>
              </span>
              TRION AI &bull; FUND MANAGEMENT
            </div>
            <h1 id="fm-hero-title">Fund Management Calculator</h1>
            <p className="fm-hero-desc">
              Enter your available amount and select the number of management levels to generate a structured level-wise allocation plan.
            </p>
          </section>

          {/* ── Top Summary & Key Takeaway Callout (Direct Answer) ── */}
          <section className="fm-top-takeaway fm-section" aria-labelledby="fm-top-takeaway-title">
            <div className="fm-top-takeaway-header">
              <div className="fm-top-takeaway-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.2" fill="none">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </div>
              <h2 id="fm-top-takeaway-title">Quick Answer: What is the TRION AI Fund Management Calculator?</h2>
            </div>
            <p className="fm-top-takeaway-desc">
              <strong>Direct Answer:</strong> The TRION AI Fund Management Calculator is a deterministic educational budgeting utility that partitions your available capital across 1 to 9 progressive levels based on the standard geometric allocation model. It delivers a transparent stage-by-stage financial plan to help users structure capital depth, manage risk tolerance, and maintain strict budgeting discipline.
            </p>
            <ul className="fm-takeaways-list" aria-label="Key Takeaways">
              <li className="fm-takeaway-item">
                <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2.5" fill="none" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span><strong>100% Mathematical Reconciliation:</strong> Every rupee of your capital is accounted for across all chosen stages with zero calculation leakage.</span>
              </li>
              <li className="fm-takeaway-item">
                <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2.5" fill="none" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span><strong>Configurable 1–9 Stage Depth:</strong> Easily select between compact short-sequence planning (Levels 1–3) and deep safety buffers (Levels 7–9).</span>
              </li>
              <li className="fm-takeaway-item">
                <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2.5" fill="none" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span><strong>Educational Capital Modeling:</strong> Focuses strictly on disciplined risk management, educational budgeting, and objective numerical modeling.</span>
              </li>
            </ul>
          </section>

          {/* ── Calculator Control Card ── */}
          <section className="fm-calc-card fm-section" aria-labelledby="fm-calc-heading">
            <h2 id="fm-calc-heading" className="fm-seo-title" style={{ marginBottom: 18 }}>
              <span className="fm-bar" aria-hidden="true" />
              Configure Capital &amp; Select Management Levels
            </h2>
            <form onSubmit={handleCalculate} noValidate>
              {/* Amount Input */}
              <div className="fm-field-group">
                <div className="fm-field-header">
                  <label htmlFor={inputId} className="fm-label">Enter Amount</label>
                  <span className="fm-label-hint">Platform Currency: INR (₹)</span>
                </div>

                <div className={`fm-input-wrapper ${error && !amount ? "has-error" : ""}`}>
                  <div className="fm-currency-symbol" aria-hidden="true">₹</div>
                  <input
                    id={inputId}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={handleAmountChange}
                    className="fm-amount-input"
                    aria-required="true"
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby="fm-amount-helper fm-validation-msg"
                  />
                  {amount && (
                    <button type="button" onClick={() => setAmount("")} className="fm-input-clear" aria-label="Clear amount input">
                      <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.2" fill="none"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                  )}
                </div>

                <p id="fm-amount-helper" className="fm-helper">
                  Enter the total amount you want to allocate.
                </p>

                <div className="fm-quick-row" aria-label="Suggested amounts">
                  <span className="fm-quick-label">Quick:</span>
                  {[500, 1000, 2500, 5000].map((val) => (
                    <button key={val} type="button" onClick={() => handleQuickAmount(val)}
                      className={`fm-quick-chip ${amount === String(val) ? "active" : ""}`}>
                      ₹{val.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Redesigned Clean Level Selector Section ── */}
              <div className="fm-field-group fm-levels-wrapper">
                {/* Header */}
                <div className="fm-field-header">
                  <div className="fm-level-header-title">
                    <div className="fm-level-icon-badge" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.2" fill="none">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                      </svg>
                    </div>
                    <div>
                      <label className="fm-label" id="fm-levels-label">Select Management Levels</label>
                      <span className="fm-level-subtitle">Structured progression from 1 to 9 tiers</span>
                    </div>
                  </div>

                  <div className="fm-levels-current-badge">
                    <span className="fm-levels-badge-pulse" aria-hidden="true" />
                    <span className="fm-levels-badge-text">
                      Level <strong>{selectedLevels}</strong> &bull; {selectedLevels} {selectedLevels === 1 ? "Stage" : "Stages"}
                    </span>
                  </div>
                </div>

                {/* Dynamic Segmented Visual Track */}
                <div className="fm-level-track" aria-hidden="true">
                  {PRESET_LEVELS.map((lvl) => {
                    const isFilled = lvl <= selectedLevels;
                    const isExact = lvl === selectedLevels;
                    return (
                      <div
                        key={lvl}
                        onClick={() => { setSelectedLevels(lvl); if (error) setError(null); }}
                        className={`fm-track-step ${isFilled ? "filled" : ""} ${isExact ? "exact" : ""}`}
                        title={`Select Level ${lvl}`}
                      >
                        <span className="fm-track-step-bar" />
                      </div>
                    );
                  })}
                </div>

                {/* Level Cards Grid */}
                <div className="fm-level-grid" role="radiogroup" aria-labelledby="fm-levels-label">
                  {LEVEL_CONFIG.map((item) => {
                    const isSelected = selectedLevels === item.level;
                    const isPast = item.level < selectedLevels;
                    return (
                      <button
                        key={item.level}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => {
                          setSelectedLevels(item.level);
                          if (error) setError(null);
                        }}
                        className={`fm-level-card ${isSelected ? "selected" : ""} ${isPast ? "in-range" : ""}`}
                        aria-label={`Level ${item.level}: ${item.desc}`}
                      >
                        {/* Top Tag & Checkmark */}
                        <div className="fm-card-top">
                          <span className="fm-card-tag">{item.tag}</span>
                          {isSelected && (
                            <span className="fm-card-check" aria-hidden="true">
                              <svg viewBox="0 0 24 24" width="9" height="9" stroke="currentColor" strokeWidth="3" fill="none">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </span>
                          )}
                        </div>

                        {/* Level Big Number */}
                        <div className="fm-card-number">{item.level}</div>

                        {/* Stage Subtitle */}
                        <div className="fm-card-desc">{item.desc}</div>

                        {/* Micro Depth Pip Meter */}
                        <div className="fm-card-meter" aria-hidden="true">
                          {Array.from({ length: 9 }).map((_, idx) => (
                            <span
                              key={idx}
                              className={`fm-meter-pip ${idx < item.level ? "active" : ""}`}
                            />
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Interactive Range Slider Scrub Controller */}
                <div className="fm-slider-container">
                  <div className="fm-slider-track-wrap">
                    <input
                      type="range"
                      min="1"
                      max="9"
                      step="1"
                      value={selectedLevels}
                      onChange={(e) => {
                        setSelectedLevels(Number(e.target.value));
                        if (error) setError(null);
                      }}
                      className="fm-level-slider"
                      aria-label="Level Range Slider"
                      style={{
                        "--slider-pct": `${((selectedLevels - 1) / 8) * 100}%`
                      }}
                    />
                    <div className="fm-slider-markers" aria-hidden="true">
                      {PRESET_LEVELS.map((lvl) => (
                        <span
                          key={lvl}
                          onClick={() => { setSelectedLevels(lvl); if (error) setError(null); }}
                          className={`fm-slider-marker ${lvl === selectedLevels ? "active" : ""} ${lvl < selectedLevels ? "passed" : ""}`}
                        >
                          {lvl}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Strategy Insights Banner (Clean SVG Only) */}
                <div className="fm-level-insight-banner">
                  <div className="fm-insight-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.2" fill="none">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </div>
                  <div className="fm-insight-content">
                    <div className="fm-insight-title-row">
                      <span className="fm-insight-title">
                        {currentLevelConfig.depthLabel}
                      </span>
                      <span className="fm-insight-badge">
                        {strategyMeta.icon}
                        {strategyMeta.badge}
                      </span>
                    </div>
                    <p className="fm-insight-desc">
                      {strategyMeta.desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Validation */}
              {error && (
                <div className="fm-validation" role="alert" id="fm-validation-msg">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="fm-actions">
                <button type="submit" disabled={isCalculating} className="fm-btn-calc" aria-label="Calculate Fund Management Plan">
                  {isCalculating ? (
                    <><span className="fm-spinner" aria-hidden="true" />Calculating...</>
                  ) : (
                    <>
                      Calculate Fund Management
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
                    </>
                  )}
                </button>

                {calculatedResult && (
                  <button type="button" onClick={handleReset} className="fm-btn-reset" aria-label="Reset calculator">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.2" fill="none" aria-hidden="true">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
                    </svg>
                    Reset
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* ── Result Section ── */}
          <section className="fm-section" ref={resultsRef} aria-live="polite" aria-atomic="true">
            {!calculatedResult ? (
              <div className="fm-empty">
                <div className="fm-empty-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.8" fill="none">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    <path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" />
                  </svg>
                </div>
                <h2>Your Fund Management Plan Will Appear Here</h2>
                <p>Enter an amount and select 1–9 levels above to generate your structured calculation.</p>
              </div>
            ) : (
              <div className="fm-result-card">
                {/* Header */}
                <div className="fm-result-header">
                  <div>
                    <div className="fm-result-badge">
                      <span className="fm-result-badge-dot" aria-hidden="true" />
                      Deterministic Allocation
                    </div>
                    <h2 className="fm-result-title">Fund Management Plan &amp; Stage Breakdown</h2>
                    <p className="fm-result-sub">
                      Your selected amount has been distributed across the selected management levels.
                    </p>
                  </div>
                  <span className="fm-verified-pill">
                    <svg viewBox="0 0 24 24" width="13" height="13" stroke="#00985b" strokeWidth="2.5" fill="none" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                    100% Reconciled
                  </span>
                </div>

                {/* Metric Summary Grid */}
                <div className="fm-summary-grid">
                  <div className="fm-summary-item">
                    <span className="fm-summary-label">
                      <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2.2" fill="none"><circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" /></svg>
                      Amount
                    </span>
                    <strong className="fm-summary-val">{calculatedResult.totalAmountFormatted}</strong>
                  </div>
                  <div className="fm-summary-item">
                    <span className="fm-summary-label">
                      <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2.2" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
                      Levels
                    </span>
                    <strong className="fm-summary-val">{calculatedResult.selectedLevels}</strong>
                  </div>
                  <div className="fm-summary-item">
                    <span className="fm-summary-label">
                      <svg viewBox="0 0 24 24" width="12" height="12" stroke="#007543" strokeWidth="2.2" fill="none"><polyline points="20 6 9 17 4 12" /></svg>
                      Allocated
                    </span>
                    <strong className="fm-summary-val fm-val-green">{calculatedResult.totalAllocatedFormatted}</strong>
                  </div>
                  <div className="fm-summary-item">
                    <span className="fm-summary-label">
                      <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2.2" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                      Remaining
                    </span>
                    <strong className="fm-summary-val">{calculatedResult.remainingFormatted}</strong>
                  </div>
                </div>

                {/* Breakdown Heading */}
                <div className="fm-breakdown-header">
                  <h3 className="fm-breakdown-title">
                    <span className="fm-bar" aria-hidden="true" />
                    Level-wise Fund Management Plan
                  </h3>
                  <span className="fm-stages-badge">
                    {calculatedResult.plan.length} {calculatedResult.plan.length === 1 ? "Stage" : "Stages"} Active
                  </span>
                </div>

                {/* ── Unique & Premium Plan Cards List ── */}
                <div className="fm-plan-list" role="list" aria-label="Level-wise allocation cards">
                  {calculatedResult.plan.map((row, idx) => {
                    const pctNum = parseFloat(row.percentage) || 10;
                    return (
                      <div
                        key={row.level}
                        className="fm-plan-card"
                        role="listitem"
                        style={{ "--anim-delay": `${idx * 45}ms` }}
                      >
                        {/* Left Spine / Stage Identifier */}
                        <div className="fm-plan-card-left">
                          <div className="fm-plan-badge-box">
                            <span className="fm-plan-stage-num">{row.levelFormatted}</span>
                            <span className="fm-plan-stage-title">LEVEL {row.level}</span>
                          </div>

                          <div className="fm-plan-meta">
                            <div className="fm-plan-sequence-row">
                              <span className="fm-plan-seq-pill">
                                <svg viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" strokeWidth="2.5" fill="none"><polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" /></svg>
                                {row.sequenceLabel.replace(`Level ${row.level} — `, "")}
                              </span>
                              <span className="fm-plan-stage-tag">
                                Stage {row.level} of {calculatedResult.plan.length}
                              </span>
                            </div>

                            {/* Visual Proportion Bar */}
                            <div className="fm-plan-bar-track" aria-hidden="true">
                              <div
                                className="fm-plan-bar-fill"
                                style={{ width: `${Math.max(pctNum, 4)}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Right Financial Allocation & Cumulative Values */}
                        <div className="fm-plan-card-right">
                          <div className="fm-plan-metric-group fm-plan-alloc-group">
                            <span className="fm-plan-metric-label">Stage Allocation</span>
                            <div className="fm-plan-alloc-wrap">
                              <span className="fm-plan-alloc-val">{row.allocationFormatted}</span>
                              <span className="fm-plan-pct-badge">{row.percentage}</span>
                            </div>
                          </div>

                          <div className="fm-plan-metric-group fm-plan-cumul-group">
                            <span className="fm-plan-metric-label">Cumulative Total</span>
                            <span className="fm-plan-cumul-val">{row.cumulativeFormatted}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Verification Box */}
                <div className="fm-verify-card">
                  <div className="fm-verify-header">
                    <div className="fm-verify-title-row">
                      <span className="fm-verify-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                      </span>
                      <div>
                        <h4 className="fm-verify-title">Total Allocation Verification</h4>
                        <p className="fm-verify-desc">All calculated levels reconcile completely with your entered amount.</p>
                      </div>
                    </div>
                    <span className="fm-verify-badge">Sum = Entered Amount</span>
                  </div>
                  <div className="fm-verify-stats">
                    <div className="fm-v-stat"><span>Allocated:</span><strong>{calculatedResult.totalAllocatedFormatted}</strong></div>
                    <div className="fm-v-div" />
                    <div className="fm-v-stat"><span>Remaining:</span><strong>{calculatedResult.remainingFormatted}</strong></div>
                    <div className="fm-v-div" />
                    <div className="fm-v-stat"><span>Total:</span><strong className="fm-val-green">{calculatedResult.totalAmountFormatted}</strong></div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* ── Audience & Use-Case Clarity Section ── */}
          <section className="fm-section-card fm-section" aria-labelledby="fm-audience-heading">
            <div className="fm-seo-header-row">
              <div>
                <span className="fm-seo-badge">
                  <svg viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" strokeWidth="2.2" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                  Audience &amp; Use Cases
                </span>
                <h2 id="fm-audience-heading" className="fm-seo-title">
                  <span className="fm-bar" aria-hidden="true" />
                  Who is the Fund Management Calculator For &amp; Supported Use Cases?
                </h2>
              </div>
            </div>
            <p className="fm-seo-text">
              The TRION AI Fund Management Calculator is engineered for individuals, analytical planners, students of probability, and budgeters who want an objective, systematic method to allocate capital across progressive tiers without guesswork.
            </p>

            <div className="fm-audience-grid">
              <div className="fm-audience-card">
                <div className="fm-audience-card-head">
                  <div className="fm-audience-card-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.2" fill="none"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  </div>
                  <h3>Target Audience &amp; When to Use</h3>
                </div>
                <ul className="fm-audience-list">
                  <li className="fm-audience-item">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                    <span><strong>Educational Budgeters:</strong> Users seeking structured capital division before executing multi-stage activities.</span>
                  </li>
                  <li className="fm-audience-item">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                    <span><strong>Risk Strategists:</strong> Planners establishing strict maximum drawdown caps and capital tolerance limits.</span>
                  </li>
                  <li className="fm-audience-item">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                    <span><strong>Mathematics &amp; Finance Students:</strong> Learners studying geometric progression sequences and unit share reconciliations.</span>
                  </li>
                </ul>
              </div>

              <div className="fm-audience-card">
                <div className="fm-audience-card-head">
                  <div className="fm-audience-card-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.2" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                  </div>
                  <h3>Supported Educational Use Cases</h3>
                </div>
                <ul className="fm-audience-list">
                  <li className="fm-audience-item">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                    <span><strong>Multi-Stage Capital Budgeting:</strong> Partitioning funds across defined sequential steps to avoid lump-sum exposure.</span>
                  </li>
                  <li className="fm-audience-item">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                    <span><strong>Geometric Risk Modeling:</strong> Understanding how exponential weights (1x, 2x, 4x... 256x) scale across level depths.</span>
                  </li>
                  <li className="fm-audience-item">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                    <span><strong>Tolerance Buffer Comparison:</strong> Comparing tight 3-tier short plans against resilient 9-tier safety buffers.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* ── Level Selection Comparison & Decision Support Matrix ── */}
          <section className="fm-section-card fm-section" aria-labelledby="fm-decision-heading">
            <div className="fm-seo-header-row">
              <div>
                <span className="fm-seo-badge">
                  <svg viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" strokeWidth="2.2" fill="none"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                  Decision Matrix
                </span>
                <h2 id="fm-decision-heading" className="fm-seo-title">
                  <span className="fm-bar" aria-hidden="true" />
                  Level Selection Comparison &amp; Decision Matrix
                </h2>
              </div>
            </div>
            <p className="fm-seo-text">
              Use this comparative breakdown to determine which management level tier matches your available capital, planned horizon, and risk tolerance profile:
            </p>

            <div className="fm-decision-table-wrap">
              <table className="fm-decision-table">
                <thead>
                  <tr>
                    <th scope="col">Level Tier</th>
                    <th scope="col">Stages</th>
                    <th scope="col">Multiplier Progression</th>
                    <th scope="col">Capital Spread Profile</th>
                    <th scope="col">Best For / Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="fm-tier-badge conservative">Conservative (L1–L3)</span></td>
                    <td>1 to 3 Stages</td>
                    <td>1x, 2x, 4x</td>
                    <td>Concentrated in early stages (14.3% to 100%)</td>
                    <td>Small capital pools, short-sequence budgets, fast cycle resolution.</td>
                  </tr>
                  <tr>
                    <td><span className="fm-tier-badge balanced">Balanced (L4–L6)</span></td>
                    <td>4 to 6 Stages</td>
                    <td>1x up to 32x</td>
                    <td>Even progressive curve (1.6% to 50.8%)</td>
                    <td>Standard multi-tier planning, moderate risk buffer, balanced capital deployment.</td>
                  </tr>
                  <tr>
                    <td><span className="fm-tier-badge extended">Extended Buffer (L7–L9)</span></td>
                    <td>7 to 9 Stages</td>
                    <td>1x up to 256x</td>
                    <td>Gradual exponential cushion (0.2% to 50.1%)</td>
                    <td>Deep multi-tier safety buffer, maximum drawdown tolerance, long-horizon planning.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="fm-decision-note">
              <strong>Direct Recommendation:</strong> If you are planning an initial multi-stage budget, <strong>Level 3 to Level 5</strong> offers the optimal balance between early stage efficiency and extended safety buffer.
            </p>
          </section>

          {/* ── Step-by-Step How-To Guide ── */}
          <section className="fm-section-card fm-section" aria-labelledby="fm-howto-heading">
            <div className="fm-seo-header-row">
              <div>
                <span className="fm-seo-badge">
                  <svg viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" strokeWidth="2.2" fill="none"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
                  How-To Guide
                </span>
                <h2 id="fm-howto-heading" className="fm-seo-title">
                  <span className="fm-bar" aria-hidden="true" />
                  How to Use the Fund Management Calculator (Step-by-Step)
                </h2>
              </div>
            </div>
            <p className="fm-seo-text">
              Follow these three simple steps to calculate your customized level-wise fund management plan in seconds:
            </p>

            <ol className="fm-howto-list">
              <li className="fm-howto-item">
                <div className="fm-howto-num">1</div>
                <div className="fm-howto-body">
                  <h3>Step 1: Enter Your Available Total Capital</h3>
                  <p>Type your total available budget in INR (₹) into the input box or click one of the quick amount presets (₹500, ₹1,000, ₹2,500, or ₹5,000).</p>
                </div>
              </li>
              <li className="fm-howto-item">
                <div className="fm-howto-num">2</div>
                <div className="fm-howto-body">
                  <h3>Step 2: Choose Your Management Level Depth (1 to 9)</h3>
                  <p>Select your preferred tier count by clicking on the level cards or dragging the smooth slider from 1 stage (direct allocation) up to 9 stages (deep buffer).</p>
                </div>
              </li>
              <li className="fm-howto-item">
                <div className="fm-howto-num">3</div>
                <div className="fm-howto-body">
                  <h3>Step 3: Calculate &amp; Review Your Allocation Breakdown</h3>
                  <p>Click &ldquo;Calculate Fund Management&rdquo; to view your level-wise stage allocation amounts, percentage weights, cumulative progression, and 100% mathematical reconciliation.</p>
                </div>
              </li>
            </ol>
          </section>

          {/* ── 3D Showcase Image Section & SEO Educational Guide ── */}
          <section className="fm-seo-card fm-section" aria-labelledby="fm-how-it-works">
            <div className="fm-seo-header-row">
              <div>
                <span className="fm-seo-badge">
                  <svg viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" strokeWidth="2.2" fill="none"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                  Educational Guide
                </span>
                <h2 id="fm-how-it-works" className="fm-seo-title">
                  <span className="fm-bar" aria-hidden="true" />
                  What is Fund Management &amp; Why is Structured Allocation Important?
                </h2>
              </div>
              <span className="fm-guide-status-pill">
                <svg viewBox="0 0 24 24" width="13" height="13" stroke="#00985b" strokeWidth="2.5" fill="none"><polyline points="20 6 9 17 4 12" /></svg>
                TRION AI Methodology
              </span>
            </div>

            {/* Featured Visual Overview Figure with Complete SEO Metadata */}
            <figure className="fm-showcase-figure" itemScope itemType="https://schema.org/ImageObject">
              <div className="fm-showcase-img-container">
                <Image
                  src="/trion-ai-fund-management-calculator-wingo30.webp"
                  alt="TRION AI Fund Management Calculator for Wingo30 with fund planning levels"
                  title="TRION AI Fund Management Calculator | Wingo30"
                  width={1280}
                  height={720}
                  priority
                  className="fm-showcase-img"
                  itemProp="contentUrl"
                />
                <meta itemProp="name" content="TRION AI Fund Management Calculator | Wingo30" />
                <meta itemProp="description" content="TRION AI Fund Management Calculator for Wingo30 helps users calculate a fund management plan by entering an amount and selecting levels from 1 to 9. The clean mobile interface displays the selected level and calculated fund management list." />
              </div>
              <figcaption className="fm-showcase-caption-block">
                <div className="fm-showcase-caption-header">
                  <span className="fm-showcase-dot" aria-hidden="true" />
                  <strong className="fm-showcase-caption-title" itemProp="caption">
                    TRION AI Fund Management Calculator – Enter an amount, select levels, and view the calculated fund management plan.
                  </strong>
                </div>
                <p className="fm-showcase-description-text">
                  TRION AI Fund Management Calculator for Wingo30 helps users calculate a fund management plan by entering an amount and selecting levels from 1 to 9. The clean mobile interface displays the selected level and calculated fund management list.
                </p>
              </figcaption>
            </figure>

            {/* Definition Box */}
            <div className="fm-def-card">
              <div className="fm-def-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.2" fill="none">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <div>
                <h3>Definition of Fund Management</h3>
                <p>
                  <strong>Definition:</strong> In capital budgeting and probability mathematics, <strong>fund management</strong> is the systematic discipline of partitioning an aggregate capital pool into predefined fractional amounts across sequential stages to manage risk, preserve resources, and prevent sudden capital depletion.
                </p>
              </div>
            </div>

            <div className="fm-seo-text">
              <h3>Why is Multi-Tier Geometric Allocation Safer Than Single-Stage Allocation?</h3>
              <p>
                Deploying 100% of your capital in a single stage leaves zero room for variance, whereas dividing capital across geometric progression tiers (such as 1x, 2x, 4x, 8x...) allocates smaller initial amounts while retaining sufficient reserves for subsequent stages. To explore our platform algorithms in depth, visit the <Link href="/about" className="fm-text-link">About TRION AI Engine</Link> page or review our <Link href="/responsible-gambling" className="fm-text-link">Responsible Use &amp; 18+ Guidelines</Link>.
              </p>

              <h3>Academic and Financial Literature on Capital Allocation</h3>
              <p>
                The mathematical concepts behind stage-wise budgeting draw from classical financial literature on risk budgeting and capital preservation. For authoritative background on disciplined capital distribution, refer to <a href="https://www.investopedia.com/terms/c/capital_allocation.asp" target="_blank" rel="noopener noreferrer" className="fm-ext-link">Investopedia&rsquo;s Capital Allocation Guide <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2.5" fill="none" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg></a> and academic articles on <a href="https://en.wikipedia.org/wiki/Risk_management" target="_blank" rel="noopener noreferrer" className="fm-ext-link">Wikipedia&rsquo;s Risk Management Overview <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2.5" fill="none" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg></a>.
              </p>
            </div>

            <div className="fm-seo-quote">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="#007543" strokeWidth="2.2" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              A calculated allocation is strictly a mathematical budgeting representation and does not guarantee profit or future outcomes.
            </div>

            {/* Internal Resources Navigation Bar */}
            <div className="fm-internal-links-bar">
              <span>Related TRION AI Resources:</span>
              <Link href="/about">About Us</Link>
              <Link href="/responsible-gambling">Responsible Gambling</Link>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/disclaimer">Disclaimer</Link>
            </div>
          </section>

          {/* ── Responsible Use Notice ── */}
          <section className="fm-notice fm-section" aria-labelledby="fm-notice-heading">
            <div className="fm-notice-head">
              <div className="fm-notice-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.2" fill="none">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <h2 id="fm-notice-heading">Important Responsible Use Notice &amp; Risk Policy</h2>
            </div>
            <p>
              This calculator provides a mathematical allocation example based on the selected amount and levels. It does not guarantee profits or outcomes, and past results cannot guarantee future results.
            </p>
            <p>
              Never use essential living expenses, emergency funds, tuition fees, medical funds or borrowed money for high-risk activities. Review our full safety framework in the <Link href="/responsible-gambling" className="fm-text-link">Responsible Gambling &amp; 18+ Policy</Link> and our <Link href="/disclaimer" className="fm-text-link">Platform Disclaimer</Link>.
            </p>
            <Link href="/responsible-gambling" className="fm-notice-link">
              Responsible Use &amp; 18+ Policy
              <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2.5" fill="none"><polyline points="9 18 15 12 9 6" /></svg>
            </Link>
          </section>

          {/* ── FAQ Section ── */}
          <section className="fm-section" aria-labelledby="fm-faq-heading" style={{ marginBottom: 48 }}>
            <div className="fm-faq-header">
              <span className="fm-faq-eyebrow">Frequently Asked Questions</span>
              <h2 id="fm-faq-heading" className="fm-faq-title">Frequently Asked Questions About Fund Management</h2>
            </div>

            <div className="fm-faq-list">
              {FM_FAQS.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={index} className={`fm-faq-item ${isOpen ? "open" : ""}`}>
                    <button type="button" onClick={() => toggleFaq(index)} className="fm-faq-trigger"
                      aria-expanded={isOpen} aria-controls={`fm-faq-ans-${index}`}>
                      <span className="fm-faq-q">{faq.question}</span>
                      <svg className={`fm-faq-arrow ${isOpen ? "rotated" : ""}`}
                        viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.2" fill="none" aria-hidden="true">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    {isOpen && (
                      <div id={`fm-faq-ans-${index}`} className="fm-faq-answer" role="region">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </main>

        {/* Global Footer */}
        <SiteFooter />
      </div>
    </>
  );
}
