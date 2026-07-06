import { createFileRoute, Outlet } from "@tanstack/react-router";

/**
 * `/ai` layout route.
 *
 * Renders an <Outlet /> so `ai.index.tsx` and every future `ai.*` child
 * route (tools, categories, models, prompts, tutorials, etc.) can mount.
 * Keep this file free of chrome — the global Header/Footer already wrap
 * every route via `__root.tsx`.
 */
export const Route = createFileRoute("/ai")({
  component: () => <Outlet />,
});
