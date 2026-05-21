import { useEffect } from "react";
import { SITE } from "@/lib/config";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  keywords?: string;
  type?: "website" | "article";
  noindex?: boolean;
  structuredData?: object | object[];
}

const setMeta = (attr: string, key: string, content: string) => {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
};

const SEO = ({
  title,
  description,
  canonical,
  ogImage = "/favicon_dark.png",
  keywords,
  type = "website",
  noindex = false,
  structuredData,
}: SEOProps) => {
  const fullTitle    = title.includes(SITE.name) ? title : `${title} | ${SITE.name}`;
  const canonicalUrl = `${SITE.url}${canonical ?? ""}`;
  const ogImageUrl   = ogImage.startsWith("http") ? ogImage : `${SITE.url}${ogImage}`;

  useEffect(() => {
    document.title = fullTitle;

    setMeta("name", "description",        description);
    setMeta("name", "robots",             noindex ? "noindex, nofollow" : "index, follow");
    setMeta("name", "author",             SITE.name);
    setMeta("name", "geo.region",         "FR-71");
    setMeta("name", "geo.placename",      "Mâcon");
    setMeta("name", "geo.position",       "46.3077;4.8288");
    setMeta("name", "ICBM",              "46.3077, 4.8288");

    if (keywords) setMeta("name", "keywords", keywords);

    // Open Graph
    setMeta("property", "og:title",       fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type",        type);
    setMeta("property", "og:url",         canonicalUrl);
    setMeta("property", "og:image",       ogImageUrl);
    setMeta("property", "og:image:width",  "512");
    setMeta("property", "og:image:height", "512");
    setMeta("property", "og:image:alt",    `${SITE.name} — Logo`);
    setMeta("property", "og:locale",       SITE.locale);
    setMeta("property", "og:site_name",    SITE.name);

    // Twitter
    setMeta("name", "twitter:card",        "summary");
    setMeta("name", "twitter:site",        SITE.twitter);
    setMeta("name", "twitter:title",       fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image",       ogImageUrl);
    setMeta("name", "twitter:image:alt",   `${SITE.name} — Logo`);

    // Canonical
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonicalUrl;

    // Structured data
    document.querySelectorAll('script[data-seo="page"]').forEach(s => s.remove());
    if (structuredData) {
      const schemas = Array.isArray(structuredData) ? structuredData : [structuredData];
      schemas.forEach((schema, i) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-seo", "page");
        script.setAttribute("data-seo-index", String(i));
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      });
    }

    return () => {
      document.querySelectorAll('script[data-seo="page"]').forEach(s => s.remove());
    };
  }, [fullTitle, description, canonicalUrl, ogImageUrl, keywords, type, noindex, structuredData]);

  return null;
};

export default SEO;
