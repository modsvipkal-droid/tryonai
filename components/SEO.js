import Head from "next/head";

const SITE_URL = "https://wingo30.com";
const SITE_NAME = "TryonAI";
const DEFAULT_DESC = "AI-powered prediction platform for Wingo30. Real-time analysis, pattern recognition, and smart trading signals.";

export function PageHead({ title, description, canonical, noindex, children }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - AI Prediction Platform`;
  const desc = description || DEFAULT_DESC;
  const canon = canonical || SITE_URL;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canon} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={canon} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {children}
    </Head>
  );
}

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    "name": SITE_NAME,
    "url": SITE_URL,
    "description": DEFAULT_DESC,
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "telegram": "https://t.me/kal_mods"
    },
    "sameAs": [
      "https://t.me/+spWu5CnIDrViNDRl"
    ]
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    "url": SITE_URL,
    "name": `${SITE_NAME} - AI Prediction Platform`,
    "description": DEFAULT_DESC,
    "publisher": { "@id": `${SITE_URL}/#organization` },
    "inLanguage": "en",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function WebPageSchema({ title, description, url }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url || SITE_URL}/#webpage`,
    "url": url || SITE_URL,
    "name": title || `${SITE_NAME} - AI Prediction Platform`,
    "description": description || DEFAULT_DESC,
    "isPartOf": { "@id": `${SITE_URL}/#website` },
    "about": { "@id": `${SITE_URL}/#organization` },
    "inLanguage": "en"
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function BreadcrumbSchema({ items }) {
  const itemListElement = (items || []).map((item, idx) => ({
    "@type": "ListItem",
    "position": idx + 1,
    "item": item.url ? { "@id": item.url, "name": item.name } : item.name
  }));
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": itemListElement.length > 0 ? itemListElement : [
      { "@type": "ListItem", "position": 1, "item": { "@id": `${SITE_URL}/`, "name": "Home" } }
    ]
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function SoftwareAppSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#software`,
    "name": SITE_NAME,
    "applicationCategory": "GameApplication",
    "operatingSystem": "Web",
    "description": DEFAULT_DESC,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": { "@id": `${SITE_URL}/#organization` }
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function FAQSchema({ questions }) {
  const faqItems = (questions || []).map(q => ({
    "@type": "Question",
    "name": q.question,
    "acceptedAnswer": { "@type": "Answer", "text": q.answer }
  }));
  if (faqItems.length === 0) return null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
