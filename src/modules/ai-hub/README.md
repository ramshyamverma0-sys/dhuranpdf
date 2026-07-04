# AI Hub Module

Placeholder scaffold for the upcoming DhuranHub AI Hub. Do not import from here yet — kept for future expansion.

Structure:

- `components/` — module-specific UI (cards, filters, hero)
- `pages/` — page-level compositions used by routes under `/ai/*`
- `hooks/` — React hooks scoped to AI Hub
- `services/` — data fetching, server function wrappers
- `types/` — TypeScript types & Zod schemas
- `assets/` — logos, illustrations

Shared primitives (Button, Card, Badge, Search, Pagination, Header, Footer, ThemeProvider) live in `src/components/` and MUST be reused instead of duplicated.

Routes will follow the flat convention: `src/routes/ai.tsx` (index), `src/routes/ai.tools.tsx`, `src/routes/ai.tool.$slug.tsx`, etc.
