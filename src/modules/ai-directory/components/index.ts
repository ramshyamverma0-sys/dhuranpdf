/**
 * AI Directory — component barrel.
 *
 * Every future AI Directory page imports from here. Today the module
 * re-exports the AI Hub design system (grids, cards, filters, badges,
 * breadcrumb, search, pagination, skeletons) and the shared placeholder.
 * Once real pages land they will add module-specific components alongside.
 */

export * from "@/modules/ai-hub/components";
export * from "./DirectoryPlaceholder";
