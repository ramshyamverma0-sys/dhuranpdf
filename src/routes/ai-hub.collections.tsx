import { createFileRoute, Link } from "@tanstack/react-router";
import { AI_COLLECTIONS } from "@/ai-hub/data";
import { Star, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/ai-hub/collections")({
  head: () => ({
    meta: [
      { title: "AI Collections — Curated Bundles | Dhuran AI Hub" },
      { name: "description", content: "Curated AI tool collections: best free AI, best for coding, students, SEO, YouTube, business, research and more." },
    ],
  }),
  component: Collections,
});

function Collections() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI Collections</h1>
        <p className="text-muted-foreground mt-1">Hand-picked bundles of the best AI tools for common goals</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AI_COLLECTIONS.map((c) => (
          <Link key={c.slug} to="/ai-hub/collections/$slug" params={{ slug: c.slug }} className="group rounded-xl border border-border bg-card p-5 shadow-soft hover:shadow-card hover:-translate-y-0.5 hover:border-primary/40 transition-all">
            <div className="flex items-center gap-2 text-xs text-primary font-medium mb-2"><Star className="h-3 w-3" /> Collection</div>
            <h3 className="font-semibold">{c.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
            <div className="mt-3 text-xs text-muted-foreground">{c.toolSlugs.length} tools</div>
            <div className="mt-3 inline-flex items-center gap-1 text-xs text-primary group-hover:underline">Explore <ArrowRight className="h-3 w-3" /></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
