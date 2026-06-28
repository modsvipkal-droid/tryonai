export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://wingo30.com/#organization",
    "name": "TryonAI",
    "url": "https://wingo30.com",
    "description": "AI-powered prediction platform for Wingo30. Real-time analysis, pattern recognition, and smart trading signals.",
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
    "@id": "https://wingo30.com/#website",
    "url": "https://wingo30.com",
    "name": "TryonAI - AI Prediction Platform",
    "description": "AI-powered prediction platform for Wingo30 with real-time analysis, pattern recognition, and smart trading signals.",
    "publisher": { "@id": "https://wingo30.com/#organization" },
    "inLanguage": "en",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://wingo30.com/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function WebPageSchema({ title, description, url }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url || "https://wingo30.com/"}#webpage`,
    "url": url || "https://wingo30.com/",
    "name": title || "TryonAI - AI Prediction Platform",
    "description": description || "AI-powered prediction platform for Wingo30 with real-time analysis.",
    "isPartOf": { "@id": "https://wingo30.com/#website" },
    "about": { "@id": "https://wingo30.com/#organization" },
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
      { "@type": "ListItem", "position": 1, "item": { "@id": "https://wingo30.com/", "name": "Home" } }
    ]
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function SoftwareAppSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": "https://wingo30.com/#software",
    "name": "TryonAI",
    "applicationCategory": "Game Application",
    "operatingSystem": "Web",
    "description": "AI-powered prediction platform for Wingo30. Real-time analysis, pattern recognition, smart signals, and live dashboard.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": { "@id": "https://wingo30.com/#organization" }
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
