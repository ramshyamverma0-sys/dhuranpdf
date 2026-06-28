import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORIES, TOOLS, getToolsByCategory, getImplementedTools } from "@/lib/tools";
import { CategoryCard, ToolCard } from "@/components/tool-card";
import { ArrowRight, Shield, Zap, Sparkles, Cloud, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dhuran PDF — All PDF & Smart AI Tools In One Place" },
      { name: "description", content: "200+ free online tools: merge, split, compress PDF, EMI/SIP/BMI calculators, unit converters, AI summarizer, QR generator and more. Fast, private, beautiful." },
    ],
  }),
  component: Index,
});

function Index() {
  const featured = getImplementedTools().slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden hero-gradient">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/70 backdrop-blur border border-border text-xs font-medium">
              <Sparkles className="h-3 w-3 text-primary" /> {TOOLS.length}+ tools · always free
            </span>
            <h1 className="mt-5 text-4xl sm:text-6xl font-bold tracking-tight">
              All PDF & <span className="text-primary">Smart AI Tools</span><br />In One Place
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
              The complete digital toolkit. Edit PDFs, run calculations, convert files, generate QR codes,
              summarize with AI — all in your browser, with no signup.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/all-tools" className="inline-flex items-center gap-2 h-12 px-6 rounded-lg primary-gradient text-sm font-semibold shadow-soft hover:opacity-90 transition">
                Explore all tools <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/category/$slug" params={{ slug: "ai" }} className="inline-flex items-center gap-2 h-12 px-6 rounded-lg border border-border bg-background/80 backdrop-blur text-sm font-semibold hover:bg-background transition">
                <Sparkles className="h-4 w-4 text-primary" /> Try AI tools
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-success" /> Private — files stay in your browser</span>
              <span className="inline-flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-success" /> Instant — no waiting</span>
              <span className="inline-flex items-center gap-1.5"><Cloud className="h-3.5 w-3.5 text-success" /> No signup required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between flex-wrap gap-3 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Browse by category</h2>
            <p className="mt-1 text-muted-foreground">{CATEGORIES.length} categories · {TOOLS.length} tools</p>
          </div>
          <Link to="/all-tools" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
            See all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {CATEGORIES.map((c) => (
            <CategoryCard key={c.slug} {...c} count={getToolsByCategory(c.slug).length} />
          ))}
        </div>
      </section>

      {/* Featured tools */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Most used tools</h2>
          <p className="mt-1 text-muted-foreground">Start with these popular picks.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((t) => <ToolCard key={t.slug} tool={t} />)}
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { icon: Shield, title: "Privacy first", text: "Most tools run 100% in your browser — your files never leave your device." },
            { icon: Zap, title: "Lightning fast", text: "Built on modern web technology for instant results — no uploads, no waiting." },
            { icon: CheckCircle2, title: "Always free", text: "200+ tools with no signup, no watermark, no daily limits. Forever." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary"><f.icon className="h-5 w-5" /></span>
              <h3 className="mt-4 font-semibold text-lg">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
