import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { TOOLS, CATEGORIES, getToolsByCategory } from "@/lib/tools";
import { ToolCard } from "@/components/tool-card";
import { Search } from "lucide-react";

export const Route = createFileRoute("/all-tools")({
  head: () => ({
    meta: [
      { title: "All Tools — DhuranHub" },
      { name: "description", content: "Browse all 200+ tools: PDF, AI, calculators, converters, image, video, developer, utility tools and more." },
    ],
  }),
  component: AllTools,
});

function AllTools() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | "all">("all");

  const filtered = useMemo(() => {
    return TOOLS.filter((t) => {
      if (cat !== "all" && t.category !== cat) return false;
      if (!q.trim()) return true;
      const s = q.toLowerCase();
      return t.name.toLowerCase().includes(s) || t.description.toLowerCase().includes(s);
    });
  }, [q, cat]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">All Tools</h1>
        <p className="mt-2 text-muted-foreground">Explore everything DhuranHub has to offer — {TOOLS.length} tools and growing.</p>
      </div>

      <div className="mt-8 relative max-w-xl mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tools by name or description..." className="w-full h-12 pl-10 pr-4 rounded-xl border border-border bg-card focus:border-ring focus:ring-2 focus:ring-ring/20 outline-none text-sm" />
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <CatBtn active={cat === "all"} onClick={() => setCat("all")}>All</CatBtn>
        {CATEGORIES.map((c) => <CatBtn key={c.slug} active={cat === c.slug} onClick={() => setCat(c.slug)}>{c.name}</CatBtn>)}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((t) => <ToolCard key={t.slug} tool={t} />)}
      </div>
      {filtered.length === 0 && (
        <div className="text-center text-muted-foreground py-16">No tools match your search.</div>
      )}

      <div className="mt-16 text-xs text-muted-foreground text-center">
        Looking for something specific? <Link to="/contact" className="text-primary hover:underline">Request a tool</Link>.
      </div>
    </div>
  );
}

function CatBtn({ active, ...p }: { active?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...p} className={`px-3 h-8 rounded-full text-xs font-medium border transition ${active ? "primary-gradient border-transparent" : "bg-card border-border hover:bg-accent"}`} />;
}
