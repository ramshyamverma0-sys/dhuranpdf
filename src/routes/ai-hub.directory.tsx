import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";
import { AI_TOOLS, AI_CATEGORIES } from "@/ai-hub/data";
import { AIToolCard } from "@/ai-hub/components";
import { Search, X, SlidersHorizontal } from "lucide-react";

const SearchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  filter: z.string().optional(),
  sort: z.enum(["popular","newest","rating","name","updated"]).optional(),
});

export const Route = createFileRoute("/ai-hub/directory")({
  validateSearch: zodValidator(SearchSchema),
  head: () => ({
    meta: [
      { title: "AI Tools Directory — Dhuran AI Hub" },
      { name: "description", content: "Browse 300+ AI tools by category, pricing and features. Find the perfect AI tool for your workflow." },
    ],
  }),
  component: Directory,
});

const FILTERS = [
  { key: "all", label: "All" },
  { key: "free", label: "Free" },
  { key: "freemium", label: "Freemium" },
  { key: "paid", label: "Paid" },
  { key: "open-source", label: "Open Source" },
  { key: "no-login", label: "No Login" },
  { key: "trending", label: "Trending" },
  { key: "popular", label: "Most Popular" },
  { key: "mobile", label: "Mobile Friendly" },
  { key: "api", label: "API Available" },
];

function Directory() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [query, setQuery] = useState(search.q || "");

  const setSearch = (patch: Record<string, unknown>) =>
    navigate({ search: (prev: any) => ({ ...prev, ...patch }) });

  const filter = search.filter || "all";
  const sort = search.sort || "popular";
  const category = search.category || "all";

  const filtered = useMemo(() => {
    const q = (query || "").toLowerCase().trim();
    let list = AI_TOOLS.filter((t) => {
      if (category !== "all" && t.category !== category) return false;
      if (filter === "free" && t.pricing !== "Free") return false;
      if (filter === "freemium" && t.pricing !== "Freemium") return false;
      if (filter === "paid" && t.pricing !== "Paid") return false;
      if (filter === "open-source" && !t.openSource) return false;
      if (filter === "no-login" && !t.noLogin) return false;
      if (filter === "trending" && !t.badges?.includes("trending")) return false;
      if (filter === "popular" && !t.badges?.includes("popular")) return false;
      if (filter === "mobile" && !t.mobile) return false;
      if (filter === "api" && !t.api) return false;
      if (!q) return true;
      return t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags.some((tag) => tag.toLowerCase().includes(q));
    });
    if (sort === "name") list = list.slice().sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "rating") list = list.slice().sort((a, b) => b.rating - a.rating);
    else if (sort === "updated" || sort === "newest") list = list.slice().sort((a, b) => b.updated.localeCompare(a.updated));
    else list = list.slice().sort((a, b) => (b.badges?.length || 0) - (a.badges?.length || 0));
    return list;
  }, [query, category, filter, sort]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI Tools Directory</h1>
        <p className="text-muted-foreground mt-1">{AI_TOOLS.length}+ curated AI tools across {AI_CATEGORIES.length} categories</p>
      </div>

      <div className="grid gap-4 md:grid-cols-[240px_1fr]">
        <aside className="rounded-xl border border-border bg-card p-4 h-fit md:sticky md:top-24">
          <div className="flex items-center gap-2 text-sm font-semibold mb-3"><SlidersHorizontal className="h-4 w-4" /> Filters</div>
          <div className="mb-4">
            <div className="text-xs font-medium mb-2 text-muted-foreground uppercase">Type</div>
            <div className="space-y-1">
              {FILTERS.map((f) => (
                <button key={f.key} onClick={() => setSearch({ filter: f.key })} className={`w-full text-left text-sm px-2 py-1.5 rounded-md transition ${filter === f.key ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent"}`}>{f.label}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium mb-2 text-muted-foreground uppercase">Category</div>
            <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
              <button onClick={() => setSearch({ category: "all" })} className={`w-full text-left text-sm px-2 py-1.5 rounded-md transition ${category === "all" ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent"}`}>All categories</button>
              {AI_CATEGORIES.map((c) => (
                <button key={c.slug} onClick={() => setSearch({ category: c.slug })} className={`w-full text-left text-sm px-2 py-1.5 rounded-md transition ${category === c.slug ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent"}`}>{c.name}</button>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools by name, tag, feature..."
                className="w-full h-11 pl-9 pr-9 rounded-lg border border-input bg-background text-sm"
              />
              {query && <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>}
            </div>
            <select value={sort} onChange={(e) => setSearch({ sort: e.target.value })} className="h-11 px-3 rounded-lg border border-input bg-background text-sm">
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="rating">Highest Rated</option>
              <option value="updated">Recently Updated</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>

          <div className="text-xs text-muted-foreground mb-3">{filtered.length} results</div>
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">No AI tools match your filters. <button onClick={() => { setQuery(""); navigate({ search: {} as any }); }} className="text-primary hover:underline">Reset</button></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((t) => <AIToolCard key={t.slug} tool={t} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
