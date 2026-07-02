import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { HubTabs } from "@/ai-hub/components";

export const Route = createFileRoute("/ai-hub")({
  head: () => ({
    meta: [
      { title: "Dhuran AI Hub — Discover 300+ AI Tools, Prompts & Tutorials" },
      { name: "description", content: "The Dhuran AI Hub: a curated directory of 300+ AI tools, prompt library, tutorials, comparisons, collections and AI news — all in one place." },
      { property: "og:title", content: "Dhuran AI Hub — Discover 300+ AI Tools" },
      { property: "og:description", content: "Curated AI tools directory, prompt library, tutorials, comparisons and AI news." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://dhuranpdf.lovable.app/ai-hub" }],
  }),
  component: HubLayout,
});

function HubLayout() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link to="/ai-hub" className="hover:text-primary inline-flex items-center gap-1"><Sparkles className="h-3 w-3" /> AI Hub</Link>
      </div>
      <HubTabs />
      <Outlet />
    </div>
  );
}
