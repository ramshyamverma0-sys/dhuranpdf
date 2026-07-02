import { createFileRoute } from "@tanstack/react-router";
import { AI_NEWS } from "@/ai-hub/data";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/ai-hub/news")({
  head: () => ({
    meta: [
      { title: "AI News — Latest Product Launches & Industry Updates" },
      { name: "description", content: "The latest AI news, model launches, product updates and industry announcements." },
    ],
  }),
  component: News,
});

function News() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI News</h1>
        <p className="text-muted-foreground mt-1">Fresh AI announcements from top labs and companies</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {AI_NEWS.map((n) => (
          <a key={n.slug} href={n.url} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-border bg-card p-5 shadow-soft hover:shadow-card hover:border-primary/40 transition">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{n.source} · {new Date(n.date).toLocaleDateString()}</span>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{n.tag}</span>
            </div>
            <h3 className="mt-3 font-semibold">{n.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{n.excerpt}</p>
            <div className="mt-3 inline-flex items-center gap-1 text-xs text-primary">Read source <ExternalLink className="h-3 w-3" /></div>
          </a>
        ))}
      </div>
    </div>
  );
}
