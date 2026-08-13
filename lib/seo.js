export const SITE = {
  name: "TRION AI",
  url: "https://wingo30.com",
  titleSuffix: "TRION AI",
  defaultTitle: "TRION AI – AI Wingo Prediction Platform",
  defaultDescription:
    "TRION AI is an AI-powered Wingo30 prediction and signals platform. Real-time analysis, trend charts, hot & cold signals, Korven and FX1 models, and a live analytics dashboard.",
  ogImage: "https://wingo30.com/Bannerv2.jpg",
  ogType: "website",
  locale: "en_US",
  twitterCard: "summary_large_image",
};

export const DEFAULT_ROBOTS =
  "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";

export const PUBLIC_ROUTES = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/ai-prediction", changefreq: "weekly", priority: "0.9" },
  { path: "/wingo-30-second-prediction", changefreq: "weekly", priority: "0.9" },
  { path: "/wingo-signal", changefreq: "weekly", priority: "0.8" },
  { path: "/ai-dashboard", changefreq: "weekly", priority: "0.8" },
  { path: "/models", changefreq: "weekly", priority: "0.8" },
  { path: "/korven-model", changefreq: "monthly", priority: "0.7" },
  { path: "/fx1-model", changefreq: "monthly", priority: "0.7" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/faq", changefreq: "monthly", priority: "0.6" },
  { path: "/subscription", changefreq: "weekly", priority: "0.6" },
  { path: "/developer", changefreq: "weekly", priority: "0.5" },
  { path: "/contact", changefreq: "monthly", priority: "0.5" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/refund", changefreq: "yearly", priority: "0.3" },
];