/**
 * AI Directory — Type definitions
 *
 * These are the canonical data models the AI Directory will consume once
 * the backend (Lovable Cloud) is wired up. No runtime code lives here.
 */

export type PricingType =
  | "free"
  | "freemium"
  | "paid"
  | "subscription"
  | "one-time"
  | "open-source"
  | "contact-sales";

export type Platform =
  | "web"
  | "desktop-windows"
  | "desktop-mac"
  | "desktop-linux"
  | "android"
  | "ios"
  | "chrome-extension"
  | "api";

export type SortOption =
  | "newest"
  | "oldest"
  | "highest-rated"
  | "most-popular"
  | "recently-updated"
  | "alphabetical";

export interface SEOFields {
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface PricingPlan {
  name: string;
  price?: number;
  currency?: string;
  billingCycle?: "monthly" | "yearly" | "one-time" | "free";
  features?: string[];
}

/* ================== AI Tool ================== */
export interface AITool extends SEOFields {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;

  officialWebsite: string;
  officialLogo?: string;
  screenshots?: string[];

  developer?: string;
  company?: string;
  country?: string;
  launchYear?: number;

  pricingType: PricingType;
  price?: number;
  pricingPlans?: PricingPlan[];

  category: string;      // category slug
  subCategory?: string;  // sub-category slug
  tags?: string[];

  platforms?: Platform[];
  languages?: string[];
  features?: string[];
  useCases?: string[];
  pros?: string[];
  cons?: string[];
  alternatives?: string[]; // slugs of other tools

  rating?: number;         // 0-5
  reviewCount?: number;

  verified?: boolean;
  featured?: boolean;
  trending?: boolean;
  new?: boolean;
  editorsChoice?: boolean;
  studentFriendly?: boolean;
  enterpriseReady?: boolean;

  apiAvailable?: boolean;
  mobileSupport?: boolean;
  desktopSupport?: boolean;
  browserSupport?: boolean;
  openSource?: boolean;
  freePlan?: boolean;

  lastUpdated?: string; // ISO date
  faq?: FAQItem[];

  createdAt: string;
  updatedAt: string;
}

/* ================== Category ================== */
export interface AICategory extends SEOFields {
  id: string;
  slug: string;
  name: string;
  icon?: string;             // lucide icon name or asset key
  description?: string;
  parentCategory?: string;   // parent slug for sub-categories
  order?: number;
  featured?: boolean;
  toolCount?: number;
}

/* ================== Tag ================== */
export interface AITag {
  id: string;
  slug: string;
  name: string;
  description?: string;
  toolCount?: number;
}

/* ================== AI Model ================== */
export type ModelFamily =
  | "gpt"
  | "claude"
  | "gemini"
  | "deepseek"
  | "llama"
  | "qwen"
  | "mistral"
  | "flux"
  | "stable-diffusion"
  | "voice"
  | "video"
  | "image"
  | "other";

export type ModelModality = "text" | "image" | "video" | "audio" | "multimodal" | "code" | "embedding";

export interface AIModel extends SEOFields {
  id: string;
  slug: string;
  name: string;
  family: ModelFamily;
  provider: string;
  version?: string;
  modality: ModelModality[];
  contextWindow?: number;
  parameters?: string;
  openSource?: boolean;
  releaseDate?: string;
  description?: string;
  officialUrl?: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

/* ================== Prompt ================== */
export interface AIPrompt extends SEOFields {
  id: string;
  slug: string;
  title: string;
  prompt: string;
  useCase?: string;
  category?: string;
  compatibleModels?: string[];
  tags?: string[];
  author?: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

/* ================== Tutorial ================== */
export interface AITutorial extends SEOFields {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  coverImage?: string;
  author?: string;
  readingMinutes?: number;
  difficulty?: "beginner" | "intermediate" | "advanced";
  relatedTools?: string[];
  tags?: string[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/* ================== Query params ================== */
export interface DirectoryFilters {
  category?: string;
  subCategory?: string;
  tags?: string[];
  pricing?: PricingType[];
  platforms?: Platform[];
  languages?: string[];
  flags?: Array<
    | "trending" | "new" | "editors-choice" | "verified" | "indian"
    | "free" | "freemium" | "paid" | "open-source"
    | "student" | "enterprise"
    | "api" | "desktop" | "android" | "ios" | "web"
  >;
  developer?: string;
  company?: string;
  query?: string;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}
