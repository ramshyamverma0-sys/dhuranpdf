/**
 * AI Directory — Service layer stubs.
 *
 * These functions return empty results today. When the backend (Lovable
 * Cloud) is wired up in a future prompt, swap the implementations to hit
 * Supabase / TanStack server functions — the call sites stay identical.
 */

import type {
  AITool, AICategory, AITag, AIModel, AIPrompt, AITutorial,
  DirectoryFilters, PaginatedResult,
} from "../types";
import { applyDirectoryQuery } from "../utils";
import { DEFAULT_PAGE_SIZE } from "../constants";

const EMPTY_PAGE = <T,>(pageSize = DEFAULT_PAGE_SIZE): PaginatedResult<T> => ({
  items: [], total: 0, page: 1, pageSize, pageCount: 1,
});

/* ---------- Tools ---------- */
export async function listTools(filters: DirectoryFilters = {}): Promise<PaginatedResult<AITool>> {
  // TODO: replace with Supabase query in future prompt.
  const tools: AITool[] = [];
  return applyDirectoryQuery(tools, filters);
}
export async function getToolBySlug(_slug: string): Promise<AITool | null> { return null; }
export async function getFeaturedTools(_limit = 12): Promise<AITool[]> { return []; }
export async function getTrendingTools(_limit = 12): Promise<AITool[]> { return []; }
export async function getNewTools(_limit = 12): Promise<AITool[]> { return []; }

/* ---------- Categories ---------- */
export async function listCategories(): Promise<AICategory[]> { return []; }
export async function getCategoryBySlug(_slug: string): Promise<AICategory | null> { return null; }

/* ---------- Tags ---------- */
export async function listTags(): Promise<AITag[]> { return []; }

/* ---------- Models ---------- */
export async function listModels(): Promise<AIModel[]> { return []; }
export async function getModelBySlug(_slug: string): Promise<AIModel | null> { return null; }

/* ---------- Prompts ---------- */
export async function listPrompts(_page = 1, pageSize = DEFAULT_PAGE_SIZE): Promise<PaginatedResult<AIPrompt>> {
  return EMPTY_PAGE<AIPrompt>(pageSize);
}
export async function getPromptBySlug(_slug: string): Promise<AIPrompt | null> { return null; }

/* ---------- Tutorials ---------- */
export async function listTutorials(_page = 1, pageSize = DEFAULT_PAGE_SIZE): Promise<PaginatedResult<AITutorial>> {
  return EMPTY_PAGE<AITutorial>(pageSize);
}
export async function getTutorialBySlug(_slug: string): Promise<AITutorial | null> { return null; }

/* ---------- Search ---------- */
export async function searchDirectory(query: string): Promise<{
  tools: AITool[]; categories: AICategory[]; models: AIModel[]; prompts: AIPrompt[]; tutorials: AITutorial[];
}> {
  void query;
  return { tools: [], categories: [], models: [], prompts: [], tutorials: [] };
}
