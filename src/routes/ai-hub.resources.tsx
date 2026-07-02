import { createFileRoute } from "@tanstack/react-router";
import { AI_RESOURCES } from "@/ai-hub/data";
import { Download } from "lucide-react";

export const Route = createFileRoute("/ai-hub/resources")({
  head: () => ({
    meta: [
      { title: "AI Resources — Free Downloads, Prompt Books & Guides" },
      { name: "description", content: "Free AI cheat sheets, prompt packs, guides, PDFs and downloadable resources." },
    ],
  }),
  component: Resources,
});

function Resources() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI Resources & Marketplace</h1>
        <p className="text-muted-foreground mt-1">Prompt packs, cheat sheets, eBooks and downloadable AI resources</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AI_RESOURCES.map((r) => (
          <a key={r.slug} href={r.url} className="rounded-xl border border-border bg-card p-5 shadow-soft hover:shadow-card hover:border-primary/40 transition">
            <div className="flex items-center justify-between text-xs">
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{r.type}</span>
              <span className="font-semibold">{r.price}</span>
            </div>
            <h3 className="mt-3 font-semibold">{r.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{r.description}</p>
            <div className="mt-3 inline-flex items-center gap-1 text-xs text-primary"><Download className="h-3 w-3" /> Get resource</div>
          </a>
        ))}
      </div>
    </div>
  );
}
