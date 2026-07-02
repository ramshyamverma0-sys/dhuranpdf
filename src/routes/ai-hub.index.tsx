import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ArrowRight, Sparkles, TrendingUp, Star, Newspaper, GraduationCap, ChevronRight } from "lucide-react";
import { AI_TOOLS, AI_CATEGORIES, AI_COLLECTIONS, AI_NEWS, AI_TUTORIALS, AI_PROMPTS } from "@/ai-hub/data";
import { AIToolCard, AICategoryCard, HubHero, Section, MoreLink, CatIcon } from "@/ai-hub/components";

export const Route = createFileRoute("/ai-hub/")({
  head: () => ({
    meta: [
      { title: "Dhuran AI Hub — 300+ AI Tools Directory" },
      { name: "description", content: "Discover the best AI tools of 2026 — chatbots, image generators, video AI, coding assistants and more. Curated by the Dhuran team." },
    ],
  }),
  component: Home,
});

function Home() {
  const [q, setQ] = useState("");
  const results = q.trim().length === 0 ? [] : AI_TOOLS.filter((t) =>
    t.name.toLowerCase().includes(q.toLowerCase()) || t.description.toLowerCase().includes(q.toLowerCase()) || t.tags.some((tag) => tag.toLowerCase().includes(q.toLowerCase()))
  ).slice(0, 8);

  const trending = AI_TOOLS.filter((t) => t.badges?.includes("trending")).slice(0, 8);
  const popular = AI_TOOLS.filter((t) => t.badges?.includes("popular")).slice(0, 8);
  const fresh = AI_TOOLS.filter((t) => t.badges?.includes("new") || t.badges?.includes("trending")).slice(0, 8);
  const editor = AI_TOOLS.filter((t) => t.badges?.includes("editor")).slice(0, 8);
  const countBySlug = (slug: string) => AI_TOOLS.filter((t) => t.category === slug).length;

  return (
    <div>
      <HubHero kicker="AI Hub" title="Discover 300+ AI tools that make you 10× faster" sub="A curated directory of the best AI tools, prompts, tutorials and comparisons — updated weekly.">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search AI tools, categories, tags..."
            className="w-full h-12 pl-9 pr-3 rounded-xl bg-background border border-border shadow-soft focus:border-primary outline-none text-sm"
          />
          {results.length > 0 && (
            <div className="absolute mt-2 w-full bg-popover border border-border rounded-xl shadow-card overflow-hidden z-10">
              {results.map((t) => (
                <Link key={t.slug} to="/ai-hub/tool/$slug" params={{ slug: t.slug }} onClick={() => setQ("")} className="flex items-center gap-3 px-3 py-2.5 hover:bg-accent transition">
                  <div className="grid h-7 w-7 place-items-center rounded-md bg-primary/10 text-primary text-xs font-bold">{t.name.slice(0, 2)}</div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{t.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{t.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Free","Freemium","Open Source","No Login","Trending"].map((f) => (
            <Link key={f} to="/ai-hub/directory" search={{ filter: f.toLowerCase().replace(" ", "-") } as any} className="text-xs px-3 py-1.5 rounded-full border border-border bg-card hover:border-primary/40 hover:text-primary transition">{f}</Link>
          ))}
        </div>
      </HubHero>

      <Section title="Trending AI" subtitle="What's exploding in the AI world right now" action={<MoreLink to="/ai-hub/directory" search={{ filter: "trending" }}>See all</MoreLink>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trending.map((t) => <AIToolCard key={t.slug} tool={t} />)}
        </div>
      </Section>

      <Section title="Popular AI Tools" subtitle="Loved by millions of users" action={<MoreLink to="/ai-hub/directory" search={{ filter: "popular" }}>See all</MoreLink>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popular.map((t) => <AIToolCard key={t.slug} tool={t} />)}
        </div>
      </Section>

      <Section title="Browse by Category" subtitle="43 categories covering every AI use case" action={<MoreLink to="/ai-hub/directory">Browse all</MoreLink>}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {AI_CATEGORIES.slice(0, 24).map((c) => <AICategoryCard key={c.slug} cat={c} count={countBySlug(c.slug)} />)}
        </div>
      </Section>

      <Section title="Featured Collections" subtitle="Hand-picked bundles for common goals" action={<MoreLink to="/ai-hub/collections">View all</MoreLink>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AI_COLLECTIONS.slice(0, 6).map((c) => (
            <Link key={c.slug} to="/ai-hub/collections/$slug" params={{ slug: c.slug }} className="group rounded-xl border border-border bg-card p-5 shadow-soft hover:shadow-card hover:-translate-y-0.5 hover:border-primary/40 transition-all">
              <div className="flex items-center gap-2 text-xs text-primary font-medium mb-2"><Star className="h-3 w-3" /> Collection</div>
              <h3 className="font-semibold">{c.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
              <div className="mt-3 text-xs text-muted-foreground">{c.toolSlugs.length} tools</div>
              <div className="mt-3 inline-flex items-center gap-1 text-xs text-primary group-hover:underline">Explore <ArrowRight className="h-3 w-3" /></div>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Editor's Choice" subtitle="Personal favorites from our team" action={<MoreLink to="/ai-hub/directory" search={{ sort: "rating" }}>See all</MoreLink>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {editor.map((t) => <AIToolCard key={t.slug} tool={t} />)}
        </div>
      </Section>

      <Section title="Prompt Library" subtitle="Battle-tested prompts for every model" action={<MoreLink to="/ai-hub/prompts">Browse prompts</MoreLink>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AI_PROMPTS.slice(0, 6).map((p) => (
            <Link key={p.slug} to="/ai-hub/prompts/$slug" params={{ slug: p.slug }} className="rounded-xl border border-border bg-card p-4 shadow-soft hover:shadow-card hover:border-primary/40 transition">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{p.model}</span>
                <span className="text-muted-foreground">{p.category}</span>
              </div>
              <h3 className="mt-3 font-semibold text-sm">{p.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
            </Link>
          ))}
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-2 mb-16">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2"><Newspaper className="h-5 w-5 text-primary" /> Latest AI News</h2>
            <MoreLink to="/ai-hub/news">All news</MoreLink>
          </div>
          <div className="space-y-3">
            {AI_NEWS.slice(0, 5).map((n) => (
              <a key={n.slug} href={n.url} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition">
                <div className="text-xs text-muted-foreground">{n.source} · {new Date(n.date).toLocaleDateString()}</div>
                <h3 className="font-semibold mt-1">{n.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{n.excerpt}</p>
              </a>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2"><GraduationCap className="h-5 w-5 text-primary" /> AI Tutorials</h2>
            <MoreLink to="/ai-hub/tutorials">All tutorials</MoreLink>
          </div>
          <div className="space-y-3">
            {AI_TUTORIALS.slice(0, 5).map((t) => (
              <Link key={t.slug} to="/ai-hub/tutorials/$slug" params={{ slug: t.slug }} className="block rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition">
                <div className="text-xs text-primary font-medium">{t.category} · {t.level} · {t.readMins} min</div>
                <h3 className="font-semibold mt-1">{t.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{t.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Section title="AI Comparisons" subtitle="Head-to-head breakdowns of top AI tools" action={<MoreLink to="/ai-hub/comparisons">All comparisons</MoreLink>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {["chatgpt-vs-claude","chatgpt-vs-gemini","cursor-vs-copilot","runway-vs-kling","midjourney-vs-leonardo","grok-vs-chatgpt"].map((slug) => (
            <Link key={slug} to="/ai-hub/comparisons/$slug" params={{ slug }} className="rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-card transition">
              <div className="text-xs text-primary font-medium mb-2 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Comparison</div>
              <h3 className="font-semibold">{slug.split("-vs-").map((x) => x[0].toUpperCase() + x.slice(1)).join(" vs ")}</h3>
              <div className="mt-3 inline-flex items-center gap-1 text-xs text-primary">Read more <ChevronRight className="h-3 w-3" /></div>
            </Link>
          ))}
        </div>
      </Section>

      <section className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-primary/5 p-8 mb-16 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-3">
          <Sparkles className="h-3 w-3" /> Newsletter
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold">Get the best AI tools every week</h2>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto">Join thousands of builders getting our weekly roundup of new AI tools, prompts and tutorials.</p>
        <form onSubmit={(e) => { e.preventDefault(); alert("Thanks! You'll get our next AI weekly."); }} className="mt-5 flex gap-2 max-w-md mx-auto">
          <input type="email" required placeholder="you@work.com" className="flex-1 h-11 px-3 rounded-lg border border-input bg-background text-sm" />
          <button className="h-11 px-5 rounded-lg primary-gradient font-semibold text-sm">Subscribe</button>
        </form>
      </section>

      <Section title="FAQ" subtitle="Everything you need to know">
        <div className="grid gap-3 max-w-3xl">
          {[
            { q: "What is Dhuran AI Hub?", a: "A curated directory of the best AI tools, prompts, tutorials and comparisons. Free to use." },
            { q: "Are the tools free?", a: "Many have free plans. We tag each tool as Free, Freemium or Paid so you can filter." },
            { q: "How often is it updated?", a: "Weekly. We add new tools, badges and news every week." },
            { q: "Can I submit a tool?", a: "Yes — use the Contact page to suggest a tool and we'll review it." },
          ].map((f) => (
            <details key={f.q} className="rounded-xl border border-border bg-card p-4 group">
              <summary className="cursor-pointer font-semibold text-sm flex items-center justify-between">{f.q}<ChevronRight className="h-4 w-4 transition group-open:rotate-90" /></summary>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </div>
  );
}
