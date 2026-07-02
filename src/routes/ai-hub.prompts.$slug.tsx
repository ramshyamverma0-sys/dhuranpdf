import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { AI_PROMPTS } from "@/ai-hub/data";
import { Copy, Heart, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/ai-hub/prompts/$slug")({
  loader: ({ params }) => {
    const prompt = AI_PROMPTS.find((p) => p.slug === params.slug);
    if (!prompt) throw notFound();
    return { prompt };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.prompt.title || "Prompt"} — AI Prompt Library` },
      { name: "description", content: loaderData?.prompt.description || "AI prompt from Dhuran AI Hub." },
    ],
  }),
  notFoundComponent: () => <div className="p-8 text-center">Prompt not found. <Link to="/ai-hub/prompts" className="text-primary">Back</Link></div>,
  component: PromptDetail,
});

function PromptDetail() {
  const { prompt } = Route.useLoaderData();
  const [fav, setFav] = useState(false);
  const copy = async () => { await navigator.clipboard.writeText(prompt.prompt); toast.success("Prompt copied"); };
  const toggleFav = () => {
    const key = "aihub_favprompts";
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    const next = list.includes(prompt.slug) ? list.filter((s: string) => s !== prompt.slug) : [...list, prompt.slug];
    localStorage.setItem(key, JSON.stringify(next));
    setFav(next.includes(prompt.slug));
    toast.success(fav ? "Removed from favorites" : "Added to favorites");
  };
  return (
    <div className="max-w-3xl">
      <Link to="/ai-hub/prompts" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4"><ArrowLeft className="h-3 w-3" /> Back to library</Link>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{prompt.model}</span>
          <span className="px-2 py-0.5 rounded-full border border-border">{prompt.category}</span>
          <span className="px-2 py-0.5 rounded-full border border-border">{prompt.difficulty}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mt-3">{prompt.title}</h1>
        <p className="text-muted-foreground mt-2">{prompt.description}</p>
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold uppercase text-muted-foreground">Prompt</div>
            <div className="flex gap-2">
              <button onClick={toggleFav} className="inline-flex items-center gap-1 h-8 px-3 rounded-md border border-input bg-background text-xs hover:bg-accent"><Heart className={`h-3 w-3 ${fav ? "fill-red-500 text-red-500" : ""}`} /> Favorite</button>
              <button onClick={copy} className="inline-flex items-center gap-1 h-8 px-3 rounded-md primary-gradient text-xs font-semibold"><Copy className="h-3 w-3" /> Copy prompt</button>
            </div>
          </div>
          <pre className="whitespace-pre-wrap text-sm bg-surface border border-border rounded-lg p-4 font-mono leading-relaxed">{prompt.prompt}</pre>
        </div>
        <div className="mt-6 flex flex-wrap gap-1.5">{prompt.tags.map((t) => <span key={t} className="text-xs px-2 py-0.5 rounded-full border border-border">#{t}</span>)}</div>
      </div>
    </div>
  );
}
