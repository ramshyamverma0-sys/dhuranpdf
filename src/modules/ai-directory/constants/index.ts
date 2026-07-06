/**
 * AI Directory — Constants
 *
 * Static option lists for filters, sort dropdowns, pricing chips, badges,
 * and default pagination. Kept UI-agnostic so both the sidebar and mobile
 * drawer can reuse the same source of truth.
 */

import type { PricingType, Platform, SortOption, ModelFamily } from "../types";

export const AI_DIRECTORY_BASE = "/ai" as const;

export const AI_ROUTES = {
  hub: "/ai",
  tools: "/ai/tools",
  tool: (slug: string) => `/ai/tool/${slug}`,
  categories: "/ai/categories",
  category: (slug: string) => `/ai/category/${slug}`,
  models: "/ai/models",
  model: (slug: string) => `/ai/model/${slug}`,
  prompts: "/ai/prompts",
  prompt: (slug: string) => `/ai/prompt/${slug}`,
  tutorials: "/ai/tutorials",
  tutorial: (slug: string) => `/ai/tutorial/${slug}`,
  news: "/ai/news",
  comparisons: "/ai/comparisons",
  collections: "/ai/collections",
  resources: "/ai/resources",
  marketplace: "/ai/marketplace",
} as const;

export const PRICING_OPTIONS: { value: PricingType; label: string }[] = [
  { value: "free", label: "Free" },
  { value: "freemium", label: "Freemium" },
  { value: "paid", label: "Paid" },
  { value: "subscription", label: "Subscription" },
  { value: "one-time", label: "One-Time" },
  { value: "open-source", label: "Open Source" },
  { value: "contact-sales", label: "Contact Sales" },
];

export const PLATFORM_OPTIONS: { value: Platform; label: string }[] = [
  { value: "web", label: "Web" },
  { value: "desktop-windows", label: "Windows" },
  { value: "desktop-mac", label: "macOS" },
  { value: "desktop-linux", label: "Linux" },
  { value: "android", label: "Android" },
  { value: "ios", label: "iOS" },
  { value: "chrome-extension", label: "Chrome Extension" },
  { value: "api", label: "API" },
];

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "highest-rated", label: "Highest Rated" },
  { value: "most-popular", label: "Most Popular" },
  { value: "recently-updated", label: "Recently Updated" },
  { value: "alphabetical", label: "Alphabetical (A–Z)" },
];

export const FLAG_OPTIONS = [
  { value: "trending", label: "Trending" },
  { value: "new", label: "New" },
  { value: "editors-choice", label: "Editor's Choice" },
  { value: "verified", label: "Verified" },
  { value: "indian", label: "Indian" },
  { value: "free", label: "Free" },
  { value: "freemium", label: "Freemium" },
  { value: "paid", label: "Paid" },
  { value: "open-source", label: "Open Source" },
  { value: "student", label: "Student Friendly" },
  { value: "enterprise", label: "Enterprise Ready" },
  { value: "api", label: "Has API" },
  { value: "desktop", label: "Desktop" },
  { value: "android", label: "Android" },
  { value: "ios", label: "iOS" },
  { value: "web", label: "Web" },
] as const;

export const MODEL_FAMILIES: { value: ModelFamily; label: string }[] = [
  { value: "gpt", label: "GPT (OpenAI)" },
  { value: "claude", label: "Claude (Anthropic)" },
  { value: "gemini", label: "Gemini (Google)" },
  { value: "deepseek", label: "DeepSeek" },
  { value: "llama", label: "Llama (Meta)" },
  { value: "qwen", label: "Qwen (Alibaba)" },
  { value: "mistral", label: "Mistral" },
  { value: "flux", label: "FLUX" },
  { value: "stable-diffusion", label: "Stable Diffusion" },
  { value: "voice", label: "Voice Models" },
  { value: "video", label: "Video Models" },
  { value: "image", label: "Image Models" },
  { value: "other", label: "Other" },
];

export const DEFAULT_PAGE_SIZE = 24;
export const MAX_PAGE_SIZE = 96;

export const SEARCH_FIELDS = [
  "name",
  "shortDescription",
  "description",
  "category",
  "subCategory",
  "tags",
  "developer",
  "company",
  "features",
  "useCases",
  "languages",
] as const;
