import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AI_TOOLS, AI_CATEGORIES } from "@/ai-hub/data";
import { AIToolCard, VisitButton, ToolLogo } from "@/ai-hub/components";
import { Star, Check, X, Bookmark, Share2, Flag, Calendar, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/ai-hub/tool/$slug")({
  loader: ({ params }) => {
    const tool = AI_TOOLS.find((t) => t.slug === params.slug);
    if (!tool) throw notFound();
    return { tool };
  },
  head: ({ loaderData }) => {
    const t = loaderData?.tool;
    if (!t) return { meta: [{ title: "AI tool not found" }] };
    return {
      meta: [
        { title: `${t.name} — Review, Pricing & Alternatives | Dhuran AI Hub` },
        { name: "description", content: `${t.name}: ${t.description} Pricing: ${t.pricing}. Rating ${t.rating.toFixed(1)}/5. Read our review, features and alternatives.` },
        { property: "og:title", content: `${t.name} — ${t.description}` },
        { property: "og:description", content: `${t.description} Pricing: ${t.pricing}.` },
        { property: "og:type", content: "article" },
      ],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org", "@type": "SoftwareApplication",
          name: t.name, description: t.description, applicationCategory: t.category,
          aggregateRating: { "@type": "AggregateRating", ratingValue: t.rating, ratingCount: 100 },
          offers: { "@type": "Offer", price: t.pricing === "Free" ? "0" : undefined, priceCurrency: "USD" },
          url: t.website,
        }),
      }],
    };
  },
  notFoundComponent: () => (
    <div className="text-center py-16">
      <h1 className="text-2xl font-bold">AI tool not found</h1>
      <Link to="/ai-hub/directory" className="mt-4 inline-block text-primary hover:underline">Browse directory</Link>
    </div>
  ),
  component: ToolPage,
});

function ToolPage() {
  const { tool } = Route.useLoaderData() as { tool: typeof AI_TOOLS[number] };
  const cat = AI_CATEGORIES.find((c) => c.slug === tool.category);
  const related = AI_TOOLS.filter((t) => t.category === tool.category && t.slug !== tool.slug).slice(0, 4);
  const alternatives = (tool.alternatives || []).map((slug: string) => AI_TOOLS.find((x) => x.slug === slug)).filter(Boolean) as typeof AI_TOOLS;

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) await navigator.share({ title: tool.name, url });
      else { await navigator.clipboard.writeText(url); toast.success("Link copied"); }
    } catch { /* cancel */ }
  };
  const bookmark = () => {
    if (typeof window === "undefined") return;
    const key = "aihub_bookmarks";
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    if (!list.includes(tool.slug)) list.push(tool.slug);
    localStorage.setItem(key, JSON.stringify(list));
    toast.success("Bookmarked");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-start gap-4">
            <ToolLogo name={tool.name} website={tool.website} size={64} rounded="rounded-2xl" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold truncate">{tool.name}</h1>
                {tool.badges?.map((b) => <span key={b} className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{b}</span>)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{cat?.name} · {tool.pricing}{tool.openSource ? " · Open Source" : ""}</div>
              <div className="flex items-center gap-1 text-sm mt-2">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold">{tool.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">/ 5</span>
              </div>
            </div>
          </div>
          <p className="mt-5 text-base leading-relaxed">{tool.long || tool.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <VisitButton href={tool.website}>Visit {tool.name}</VisitButton>
            <button onClick={share} className="inline-flex items-center gap-1 h-9 px-3 rounded-lg border border-input bg-background text-sm hover:bg-accent"><Share2 className="h-4 w-4" /> Share</button>
            <button onClick={bookmark} className="inline-flex items-center gap-1 h-9 px-3 rounded-lg border border-input bg-background text-sm hover:bg-accent"><Bookmark className="h-4 w-4" /> Bookmark</button>
            <a href={`mailto:hello@dhuranpdf.com?subject=Broken link: ${tool.name}`} className="inline-flex items-center gap-1 h-9 px-3 rounded-lg border border-input bg-background text-sm hover:bg-accent"><Flag className="h-4 w-4" /> Report</a>
          </div>
        </div>

        {tool.features && tool.features.length > 0 && (
          <div className="mt-6 rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold mb-3">Key features</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {tool.features.map((f) => <div key={f} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-success mt-0.5 shrink-0" /> {f}</div>)}
            </div>
          </div>
        )}

        {(tool.pros?.length || tool.cons?.length) && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {tool.pros && tool.pros.length > 0 && (
              <div className="rounded-2xl border border-success/30 bg-success/5 p-5">
                <h2 className="text-lg font-bold mb-3 text-success">Pros</h2>
                <ul className="space-y-2 text-sm">
                  {tool.pros.map((p) => <li key={p} className="flex items-start gap-2"><Check className="h-4 w-4 text-success mt-0.5" /> {p}</li>)}
                </ul>
              </div>
            )}
            {tool.cons && tool.cons.length > 0 && (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
                <h2 className="text-lg font-bold mb-3 text-destructive">Cons</h2>
                <ul className="space-y-2 text-sm">
                  {tool.cons.map((p) => <li key={p} className="flex items-start gap-2"><X className="h-4 w-4 text-destructive mt-0.5" /> {p}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}

        {alternatives.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-3">Alternatives</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {alternatives.map((t) => <AIToolCard key={t.slug} tool={t} />)}
            </div>
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold mb-3">Similar AI tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {related.map((t) => <AIToolCard key={t.slug} tool={t} />)}
            </div>
          </div>
        )}
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold mb-3">Details</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Category</dt><dd className="font-medium">{cat?.name}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Pricing</dt><dd className="font-medium">{tool.pricing}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Open Source</dt><dd>{tool.openSource ? "Yes" : "No"}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">API</dt><dd>{tool.api ? "Yes" : "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Mobile</dt><dd>{tool.mobile ? "Yes" : "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Updated</dt><dd className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {tool.updated}</dd></div>
          </dl>
          <a href={tool.website} target="_blank" rel="noopener noreferrer nofollow" className="mt-4 inline-flex w-full items-center justify-center gap-1 text-sm text-primary hover:underline">Official website <ExternalLink className="h-3 w-3" /></a>
        </div>
        {tool.tags.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-1.5">
              {tool.tags.map((t) => <span key={t} className="text-xs px-2 py-0.5 rounded-full border border-border bg-background">#{t}</span>)}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
