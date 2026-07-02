import { createFileRoute, Link } from "@tanstack/react-router";
import { AI_COMPARISONS } from "@/ai-hub/data";

export const Route = createFileRoute("/ai-hub/comparisons")({
  head: () => ({
    meta: [
      { title: "AI Tool Comparisons — Head-to-Head Reviews | Dhuran AI Hub" },
      { name: "description", content: "Compare popular AI tools: ChatGPT vs Claude, Midjourney vs Leonardo, Cursor vs Copilot and more — features, pricing, pros & cons." },
    ],
  }),
  component: Comparisons,
});

function Comparisons() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI Comparisons</h1>
        <p className="text-muted-foreground mt-1">Detailed head-to-head reviews of top AI tools</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {AI_COMPARISONS.map((c) => (
          <Link key={c.slug} to="/ai-hub/comparisons/$slug" params={{ slug: c.slug }} className="rounded-xl border border-border bg-card p-5 shadow-soft hover:shadow-card hover:border-primary/40 transition">
            <div className="text-xs text-primary font-medium">Comparison</div>
            <h3 className="mt-2 text-lg font-bold">{c.a} vs {c.b}</h3>
            <p className="text-sm text-muted-foreground mt-1">{c.verdict}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
