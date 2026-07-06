import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  Search,
  Flame,
  Star,
  Plus,
  Rocket,
  Bot,
  PenLine,
  Image as ImageIcon,
  Video,
  Code2,
  GraduationCap,
  Megaphone,
  LineChart,
  Mic,
  FileText,
  Microscope,
  Zap,
  Library,
  BookOpen,
  Newspaper,
  GitCompare,
  LayoutGrid,
  Store,
  BookMarked,
  Cpu,
  ShieldCheck,
  Globe,
  Images,
  RefreshCw,
  Filter,
  Sprout,
  Briefcase,
  Clock,
  ArrowRight,
} from "lucide-react";

const CANONICAL = "https://dhuranpdf.lovable.app/ai";

export const Route = createFileRoute("/ai/")({
  head: () => ({
    meta: [
      { title: "Dhuran AI Hub | Discover AI Tools, Models & Prompts" },
      {
        name: "description",
        content:
          "Explore thousands of AI tools, AI models, prompts, tutorials, news and comparisons in one place.",
      },
      { property: "og:title", content: "Dhuran AI Hub | Discover AI Tools, Models & Prompts" },
      {
        property: "og:description",
        content:
          "Explore thousands of AI tools, AI models, prompts, tutorials, news and comparisons in one place.",
      },
      { property: "og:url", content: CANONICAL },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Dhuran AI Hub | Discover AI Tools, Models & Prompts" },
      {
        name: "twitter:description",
        content:
          "Explore thousands of AI tools, AI models, prompts, tutorials, news and comparisons in one place.",
      },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://dhuranpdf.lovable.app/" },
            { "@type": "ListItem", position: 2, name: "AI Hub", item: CANONICAL },
          ],
        }),
      },
    ],
  }),
  component: AIHubLanding,
});

const STATS = [
  { value: "3000+", label: "AI Tools" },
  { value: "150+", label: "Categories" },
  { value: "120+", label: "AI Models" },
  { value: "10000+", label: "Prompts" },
  { value: "1000+", label: "Tutorials" },
  { value: "500+", label: "Comparisons" },
];

const FEATURED = [
  { icon: Flame, title: "Trending AI", desc: "Tools rising fast this week.", tone: "from-orange-500/15 to-red-500/10", accent: "text-orange-600" },
  { icon: Star, title: "Editor's Choice", desc: "Hand-picked by our team.", tone: "from-amber-400/15 to-yellow-500/10", accent: "text-amber-600" },
  { icon: Plus, title: "Newly Added", desc: "Fresh AI tools, added daily.", tone: "from-emerald-400/15 to-teal-500/10", accent: "text-emerald-600" },
  { icon: Rocket, title: "Popular AI", desc: "The community's favorites.", tone: "from-blue-500/15 to-indigo-500/10", accent: "text-blue-600" },
];

const DISCOVER = [
  { icon: LayoutGrid, title: "AI Tools", desc: "Browse the full directory of AI apps.", to: "/ai" },
  { icon: Cpu, title: "AI Models", desc: "Explore leading foundation models.", to: "/ai" },
  { icon: Library, title: "Prompt Library", desc: "Ready-to-use prompts for every task.", to: "/ai" },
  { icon: BookOpen, title: "Tutorials", desc: "Learn AI step-by-step.", to: "/ai" },
  { icon: Newspaper, title: "AI News", desc: "Daily updates from the AI world.", to: "/ai" },
  { icon: GitCompare, title: "Comparisons", desc: "Side-by-side tool breakdowns.", to: "/ai" },
  { icon: BookMarked, title: "Collections", desc: "Curated stacks for real workflows.", to: "/ai" },
  { icon: Store, title: "Marketplace", desc: "Discover premium AI resources.", to: "/ai" },
  { icon: FileText, title: "Resources", desc: "Guides, cheatsheets & downloads.", to: "/ai" },
];

const CATEGORIES = [
  { icon: Bot, name: "AI Chatbots" },
  { icon: PenLine, name: "AI Writing" },
  { icon: ImageIcon, name: "Image Generator" },
  { icon: Video, name: "Video Generator" },
  { icon: Code2, name: "Coding AI" },
  { icon: GraduationCap, name: "Education AI" },
  { icon: Megaphone, name: "Marketing AI" },
  { icon: LineChart, name: "SEO AI" },
  { icon: Mic, name: "Voice AI" },
  { icon: FileText, name: "PDF AI" },
  { icon: Microscope, name: "Research AI" },
  { icon: Zap, name: "Productivity AI" },
];

const WHY = [
  { icon: ShieldCheck, title: "Verified AI Tools", desc: "Every listing is checked before publishing." },
  { icon: Globe, title: "Official Websites", desc: "Links always point to the real source." },
  { icon: Images, title: "Official Logos", desc: "Recognizable brand marks, not placeholders." },
  { icon: RefreshCw, title: "Daily Updates", desc: "New tools and news added every day." },
  { icon: Search, title: "Smart Search", desc: "Find the right AI in seconds." },
  { icon: Filter, title: "Advanced Filters", desc: "Narrow down by use case & pricing." },
  { icon: Sprout, title: "Beginner Friendly", desc: "Clear guides for anyone starting out." },
  { icon: GraduationCap, title: "Student Friendly", desc: "Free picks and learning paths." },
  { icon: Briefcase, title: "Business Ready", desc: "Enterprise-grade tools, curated." },
  { icon: Clock, title: "Future Proof", desc: "Built to grow with the AI ecosystem." },
];

function AIHubLanding() {
  return (
    <main className="relative">
      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--gradient-hero)" }}
        aria-labelledby="ai-hero-title"
      >
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-accent/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 backdrop-blur px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Dhuran AI Hub
          </span>
          <h1 id="ai-hero-title" className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Welcome to <span className="text-primary">Dhuran AI Hub</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-muted-foreground">
            Discover thousands of AI tools, AI models, prompts, tutorials, comparisons, resources and AI news — all in one place.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/ai"
              className="inline-flex items-center gap-2 rounded-lg primary-gradient px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95 transition"
            >
              Explore AI Tools <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/ai"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/70 backdrop-blur px-5 py-2.5 text-sm font-semibold hover:bg-background transition"
            >
              Browse Categories
            </Link>
          </div>

          <form
            role="search"
            onSubmit={(e) => e.preventDefault()}
            className="mx-auto mt-10 max-w-2xl"
          >
            <label htmlFor="ai-search" className="sr-only">Search AI tools, models, prompts</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                id="ai-search"
                type="search"
                placeholder="Search AI tools, models, prompts..."
                className="w-full h-14 pl-12 pr-32 rounded-2xl border border-border bg-background/80 backdrop-blur shadow-soft outline-none focus:border-ring focus:bg-background transition text-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl primary-gradient px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* STATS */}
      <section aria-label="AI Hub statistics" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-card p-5 text-center shadow-soft hover:shadow-card hover:-translate-y-0.5 transition"
            >
              <div className="text-2xl sm:text-3xl font-bold text-primary">{s.value}</div>
              <div className="mt-1 text-xs sm:text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section aria-labelledby="ai-featured" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
        <div className="mb-8 text-center">
          <h2 id="ai-featured" className="text-2xl sm:text-3xl font-bold tracking-tight">Featured on Dhuran AI</h2>
          <p className="mt-2 text-muted-foreground">Highlights from across the AI Hub.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED.map((f) => (
            <div
              key={f.title}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${f.tone} p-6 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition`}
            >
              <div className={`inline-grid h-11 w-11 place-items-center rounded-xl bg-background/70 backdrop-blur ${f.accent}`}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
                Coming soon <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* DISCOVER */}
      <section aria-labelledby="ai-discover" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10 text-center">
          <h2 id="ai-discover" className="text-2xl sm:text-3xl font-bold tracking-tight">Discover the AI Hub</h2>
          <p className="mt-2 text-muted-foreground">Everything you need to explore, learn and build with AI.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DISCOVER.map((d) => (
            <Link
              key={d.title}
              to={d.to}
              className="group relative rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-card hover:-translate-y-0.5 hover:border-primary/40 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="inline-grid h-12 w-12 place-items-center rounded-xl primary-gradient text-primary-foreground shadow-soft">
                  <d.icon className="h-5 w-5" />
                </span>
                <span className="rounded-full border border-border bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Coming Soon
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold">{d.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition">
                Explore <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section aria-labelledby="ai-categories" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-10 text-center">
          <h2 id="ai-categories" className="text-2xl sm:text-3xl font-bold tracking-tight">Popular Categories</h2>
          <p className="mt-2 text-muted-foreground">Jump straight into what you need.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((c) => (
            <div
              key={c.name}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 text-center shadow-soft hover:shadow-card hover:-translate-y-0.5 hover:border-primary/40 transition"
            >
              <span className="inline-grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary group-hover:primary-gradient group-hover:text-primary-foreground transition">
                <c.icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-medium">{c.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section
        aria-labelledby="ai-why"
        className="relative"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="mb-12 text-center">
            <h2 id="ai-why" className="text-2xl sm:text-3xl font-bold tracking-tight">Why Dhuran AI Hub</h2>
            <p className="mt-2 text-muted-foreground">Built to be trustworthy, complete and future-ready.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {WHY.map((w) => (
              <div
                key={w.title}
                className="rounded-2xl border border-border bg-background/70 backdrop-blur p-5 shadow-soft hover:shadow-card transition"
              >
                <span className="inline-grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                  <w.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-sm font-semibold">{w.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section aria-labelledby="ai-cta" className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative overflow-hidden rounded-3xl border border-border p-10 sm:p-14 text-center shadow-card"
             style={{ background: "var(--gradient-primary)" }}>
          <div aria-hidden className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <h2 id="ai-cta" className="text-3xl sm:text-4xl font-bold tracking-tight text-primary-foreground">
            Start Exploring AI
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
            Jump into the Dhuran AI Hub and discover the tools, prompts and knowledge shaping the future.
          </p>
          <div className="mt-8">
            <Link
              to="/ai"
              className="inline-flex items-center gap-2 rounded-xl bg-background px-6 py-3 text-sm font-semibold text-primary shadow-soft hover:opacity-95 transition"
            >
              Explore AI Hub <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
