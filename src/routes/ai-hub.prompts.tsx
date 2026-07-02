import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AI_PROMPTS, AI_MODELS, PROMPT_CATEGORIES } from "@/ai-hub/data";
import { Search } from "lucide-react";

export const Route = createFileRoute("/ai-hub/prompts")({
  head: () => ({
    meta: [
      { title: "AI Prompt Library — Dhuran AI Hub" },
      { name: "description", content: "Battle-tested prompts for ChatGPT, Claude, Midjourney, Runway and more — across SEO, marketing, coding, writing and image generation." },
    ],
  }),
  component: Prompts,
});

function Prompts() {
  const [q, setQ] = useState("");
  const [model, setModel] = useState("All");
  const [cat, setCat] = useState("All");
  const list = useMemo(() => AI_PROMPTS.filter((p) => {
    if (model !== "All" && p.model !== model) return false;
    if (cat !== "All" && p.category !== cat) return false;
    const ql = q.toLowerCase();
    if (!ql) return true;
    return p.title.toLowerCase().includes(ql) || p.description.toLowerCase().includes(ql) || p.tags.some((t) => t.toLowerCase().includes(ql));
  }), [q, model, cat]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI Prompt Library</h1>
        <p className="text-muted-foreground mt-1">{AI_PROMPTS.length} curated prompts across {PROMPT_CATEGORIES.length} categories</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_180px_200px] mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search prompts..." className="w-full h-11 pl-9 pr-3 rounded-lg border border-input bg-background text-sm" />
        </div>
        <select value={model} onChange={(e) => setModel(e.target.value)} className="h-11 px-3 rounded-lg border border-input bg-background text-sm">
          <option>All</option>{AI_MODELS.map((m) => <option key={m}>{m}</option>)}
        </select>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="h-11 px-3 rounded-lg border border-input bg-background text-sm">
          <option>All</option>{PROMPT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((p) => (
          <Link key={p.slug} to="/ai-hub/prompts/$slug" params={{ slug: p.slug }} className="rounded-xl border border-border bg-card p-4 shadow-soft hover:shadow-card hover:border-primary/40 transition">
            <div className="flex items-center justify-between text-xs">
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{p.model}</span>
              <span className="text-muted-foreground">{p.category} · {p.difficulty}</span>
            </div>
            <h3 className="mt-3 font-semibold text-sm">{p.title}</h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
            <div className="mt-3 flex flex-wrap gap-1">{p.tags.slice(0, 3).map((t) => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-background border border-border">#{t}</span>)}</div>
          </Link>
        ))}
      </div>
      {list.length === 0 && <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">No prompts match your filters.</div>}
    </div>
  );
}
