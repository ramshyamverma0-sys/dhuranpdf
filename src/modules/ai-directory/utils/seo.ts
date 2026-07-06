/**
 * AI Directory — SEO helpers.
 *
 * Reusable builders for TanStack Start route `head()` output. Every future
 * AI Directory page should call one of these instead of hand-rolling meta.
 */

import type { AITool, AICategory, AIModel } from "../types";

export const SITE_ORIGIN = "https://dhuranhub.lovable.app";
export const SITE_NAME = "DhuranHub";

export interface AiHeadInput {
  title: string;
  description: string;
  path: string;                        // e.g. "/ai/tools"
  image?: string;                      // absolute https URL only
  type?: "website" | "article";
  keywords?: string[];
  breadcrumbs?: { label: string; path: string }[];
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
}

export interface AiHead {
  meta: Array<Record<string, string>>;
  links: Array<Record<string, string>>;
  scripts?: Array<{ type: string; children: string }>;
}

export function buildAiHead(input: AiHeadInput): AiHead {
  const url = `${SITE_ORIGIN}${input.path}`;
  const meta: Array<Record<string, string>> = [
    { title: input.title },
    { name: "description", content: input.description },
    { property: "og:title", content: input.title },
    { property: "og:description", content: input.description },
    { property: "og:type", content: input.type ?? "website" },
    { property: "og:url", content: url },
    { property: "og:site_name", content: SITE_NAME },
    { name: "twitter:card", content: input.image ? "summary_large_image" : "summary" },
    { name: "twitter:title", content: input.title },
    { name: "twitter:description", content: input.description },
  ];
  if (input.image) {
    meta.push({ property: "og:image", content: input.image });
    meta.push({ name: "twitter:image", content: input.image });
  }
  if (input.keywords?.length) {
    meta.push({ name: "keywords", content: input.keywords.join(", ") });
  }
  if (input.noindex) {
    meta.push({ name: "robots", content: "noindex, nofollow" });
  }

  const links = [{ rel: "canonical", href: url }];

  const structured: Record<string, unknown>[] = [];
  if (input.breadcrumbs?.length) {
    structured.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: input.breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.label,
        item: `${SITE_ORIGIN}${b.path}`,
      })),
    });
  }
  if (input.jsonLd) {
    if (Array.isArray(input.jsonLd)) structured.push(...input.jsonLd);
    else structured.push(input.jsonLd);
  }

  const scripts = structured.length
    ? [{ type: "application/ld+json", children: JSON.stringify(structured) }]
    : undefined;

  return { meta, links, scripts };
}

export function toolJsonLd(tool: AITool) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.shortDescription,
    applicationCategory: tool.category,
    operatingSystem: tool.platforms?.join(", "),
    url: tool.officialWebsite,
    image: tool.officialLogo,
    offers: tool.price
      ? { "@type": "Offer", price: tool.price, priceCurrency: "USD" }
      : { "@type": "Offer", price: 0, priceCurrency: "USD" },
    aggregateRating: tool.rating && tool.reviewCount
      ? { "@type": "AggregateRating", ratingValue: tool.rating, reviewCount: tool.reviewCount }
      : undefined,
  };
}

export function categoryJsonLd(category: AICategory) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description,
  };
}

export function modelJsonLd(model: AIModel) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: model.name,
    description: model.description,
    applicationCategory: "AI Model",
    url: model.officialUrl,
  };
}
