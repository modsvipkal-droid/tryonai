import Head from "next/head";
import { SITE, DEFAULT_ROBOTS } from "@/lib/seo";

export function PageHead({ title, description, canonical, noindex, robots, children }) {
  const fullTitle = title
    ? (title.includes(SITE.titleSuffix) ? title : `${title} | ${SITE.titleSuffix}`)
    : SITE.defaultTitle;
  const desc = description || SITE.defaultDescription;
  const canon = canonical || SITE.url;
  const robotsValue = robots || (noindex ? "noindex, nofollow" : DEFAULT_ROBOTS);

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canon} />
      <meta name="robots" content={robotsValue} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={canon} />
      <meta property="og:type" content={SITE.ogType} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:locale" content={SITE.locale} />
      <meta property="og:image" content={SITE.ogImage} />
      <meta property="og:image:width" content="1280" />
      <meta property="og:image:height" content="720" />
      <meta property="og:image:alt" content={SITE.name} />
      <meta name="twitter:card" content={SITE.twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={SITE.ogImage} />
      {children}
    </Head>
  );
}

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    "name": SITE.name,
    "alternateName": ["TryonAI", "TRION AI"],
    "url": SITE.url,
    "logo": `${SITE.url}/trionAIofficial.png`,
    "description": SITE.defaultDescription,
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "url": "https://t.me/kal_mods"
    },
    "sameAs": [
      "https://t.me/+IeDdLm-koIc1Yzg1"
    ]
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    "url": SITE.url,
    "name": SITE.name,
    "alternateName": "TryonAI",
    "description": SITE.defaultDescription,
    "publisher": { "@id": `${SITE.url}/#organization` },
    "inLanguage": "en"
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function WebPageSchema({ title, description, url }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url || SITE.url}/#webpage`,
    "url": url || SITE.url,
    "name": title || SITE.defaultTitle,
    "description": description || SITE.defaultDescription,
    "isPartOf": { "@id": `${SITE.url}/#website` },
    "about": { "@id": `${SITE.url}/#organization` },
    "publisher": { "@id": `${SITE.url}/#organization` },
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
      { "@type": "ListItem", "position": 1, "item": { "@id": `${SITE.url}/`, "name": "Home" } }
    ]
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function SoftwareAppSchema({
  name = SITE.name,
  alternateName = "TryonAI",
  applicationCategory = "BusinessApplication",
  operatingSystem = "Web",
  description = SITE.defaultDescription,
  url,
  id,
  offers,
} = {}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": id || (url ? `${url}/#software` : `${SITE.url}/#software`),
    "name": name,
    "alternateName": alternateName,
    "applicationCategory": applicationCategory,
    "operatingSystem": operatingSystem,
    "description": description,
    "url": url || SITE.url,
    "publisher": { "@id": `${SITE.url}/#organization` },
    ...(offers && offers.length > 0 ? { "offers": offers } : {})
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function HowToSchema({ name, description, steps }) {
  if (!steps || steps.length === 0) return null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "step": steps.map((step, idx) => ({
      "@type": "HowToStep",
      "position": idx + 1,
      "name": step.name,
      "text": step.text,
      ...(step.url ? { "url": step.url } : {})
    }))
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