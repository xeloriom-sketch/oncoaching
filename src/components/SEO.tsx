import { useEffect } from "react";
import { SITE } from "@/lib/config";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  type?: "website" | "article";
  structuredData?: object;
}

const setMeta = (selector: string, attr: string, key: string, content: string) => {
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
  type = "website",
  structuredData,
}: SEOProps) => {
  const fullTitle    = title.includes(SITE.name) ? title : `${title} | ${SITE.name}`;
  const canonicalUrl = `${SITE.url}${canonical ?? ""}`;
  const ogImageUrl   = ogImage.startsWith("http") ? ogImage : `${SITE.url}${ogImage}`;

  useEffect(() => {
    document.title = fullTitle;

    // Standard meta
    setMeta("", "name", "description", description);
    setMeta("", "name", "robots",      "index, follow");

    // Open Graph
    setMeta("", "property", "og:title",       fullTitle);
    setMeta("", "property", "og:description", description);
    setMeta("", "property", "og:type",        type);
    setMeta("", "property", "og:url",         canonicalUrl);
    setMeta("", "property", "og:image",       ogImageUrl);
    setMeta("", "property", "og:locale",      SITE.locale);
    setMeta("", "property", "og:site_name",   SITE.name);

    // Twitter
    setMeta("", "name", "twitter:title",       fullTitle);
    setMeta("", "name", "twitter:description", description);
    setMeta("", "name", "twitter:image",       ogImageUrl);

    // Canonical link
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonicalUrl;

    // Page-level structured data
    if (structuredData) {
      let script = document.querySelector<HTMLScriptElement>('script[data-seo="page"]');
      if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-seo", "page");
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }

    return () => {
      document.querySelector('script[data-seo="page"]')?.remove();
    };
  }, [fullTitle, description, canonicalUrl, ogImageUrl, type, structuredData]);

  return null;
};

export default SEO;
