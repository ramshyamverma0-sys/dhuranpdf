/**
 * AI Directory — pure utility helpers.
 * No React, no I/O. Reused by services, hooks, and components.
 */

import type { AITool, DirectoryFilters, SortOption, PaginatedResult } from "../types";
import { DEFAULT_PAGE_SIZE, SEARCH_FIELDS } from "../constants";

export function toSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatCount(n: number): string {
  if (n < 1_000) return String(n);
  if (n < 1_000_000) return `${(n / 1_000).toFixed(n < 10_000 ? 1 : 0).replace(/\.0$/, "")}k`;
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
}

export function paginate<T>(items: T[], page = 1, pageSize = DEFAULT_PAGE_SIZE): PaginatedResult<T> {
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const start = (safePage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    pageCount,
  };
}

function fieldValue(tool: AITool, field: string): string {
  const v = (tool as unknown as Record<string, unknown>)[field];
  if (Array.isArray(v)) return v.join(" ");
  return typeof v === "string" ? v : "";
}

export function matchesSearch(tool: AITool, query: string): boolean {
  if (!query) return true;
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return SEARCH_FIELDS.some((f) => fieldValue(tool, f).toLowerCase().includes(q));
}

export function matchesFilters(tool: AITool, f: DirectoryFilters): boolean {
  if (f.category && tool.category !== f.category) return false;
  if (f.subCategory && tool.subCategory !== f.subCategory) return false;
  if (f.developer && tool.developer !== f.developer) return false;
  if (f.company && tool.company !== f.company) return false;
  if (f.tags?.length && !f.tags.every((t) => tool.tags?.includes(t))) return false;
  if (f.pricing?.length && !f.pricing.includes(tool.pricingType)) return false;
  if (f.platforms?.length && !f.platforms.some((p) => tool.platforms?.includes(p))) return false;
  if (f.languages?.length && !f.languages.some((l) => tool.languages?.includes(l))) return false;
  if (f.flags?.length) {
    for (const flag of f.flags) {
      switch (flag) {
        case "trending": if (!tool.trending) return false; break;
        case "new": if (!tool.new) return false; break;
        case "editors-choice": if (!tool.editorsChoice) return false; break;
        case "verified": if (!tool.verified) return false; break;
        case "indian": if (tool.country !== "IN" && tool.country !== "India") return false; break;
        case "free": if (tool.pricingType !== "free" && !tool.freePlan) return false; break;
        case "freemium": if (tool.pricingType !== "freemium") return false; break;
        case "paid": if (!["paid", "subscription", "one-time"].includes(tool.pricingType)) return false; break;
        case "open-source": if (!tool.openSource) return false; break;
        case "student": if (!tool.studentFriendly) return false; break;
        case "enterprise": if (!tool.enterpriseReady) return false; break;
        case "api": if (!tool.apiAvailable) return false; break;
        case "desktop": if (!tool.desktopSupport) return false; break;
        case "android": if (!tool.platforms?.includes("android")) return false; break;
        case "ios": if (!tool.platforms?.includes("ios")) return false; break;
        case "web": if (!tool.platforms?.includes("web") && !tool.browserSupport) return false; break;
      }
    }
  }
  return matchesSearch(tool, f.query ?? "");
}

export function sortTools(tools: AITool[], sort: SortOption = "most-popular"): AITool[] {
  const copy = [...tools];
  switch (sort) {
    case "newest":            return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "oldest":            return copy.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    case "highest-rated":     return copy.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case "most-popular":      return copy.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
    case "recently-updated":  return copy.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    case "alphabetical":      return copy.sort((a, b) => a.name.localeCompare(b.name));
    default:                  return copy;
  }
}

export function applyDirectoryQuery(tools: AITool[], filters: DirectoryFilters): PaginatedResult<AITool> {
  const filtered = tools.filter((t) => matchesFilters(t, filters));
  const sorted = sortTools(filtered, filters.sort);
  return paginate(sorted, filters.page ?? 1, filters.pageSize ?? DEFAULT_PAGE_SIZE);
}
