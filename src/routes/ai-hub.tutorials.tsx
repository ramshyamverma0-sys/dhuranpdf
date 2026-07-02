import { createFileRoute, Link } from "@tanstack/react-router";
import { AI_TUTORIALS } from "@/ai-hub/data";

export const Route = createFileRoute("/ai-hub/tutorials")({
  head: () => ({
    meta: [
      { title: "AI Tutorials — Learn AI from Scratch | Dhuran AI Hub" },
      { name: "description", content: "Beginner to advanced AI tutorials covering ChatGPT, prompt engineering, image and video generation, coding AI and more." },
    ],
  }),
  component: Tutorials,
});

function Tutorials() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI Tutorials</h1>
        <p className="text-muted-foreground mt-1">Learn AI step-by-step — from your first prompt to shipping AI features.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AI_TUTORIALS.map((t) => (
          <Link key={t.slug} to="/ai-hub/tutorials/$slug" params={{ slug: t.slug }} className="rounded-xl border border-border bg-card p-5 shadow-soft hover:shadow-card hover:border-primary/40 transition">
            <div className="text-xs text-primary font-medium">{t.category} · {t.level} · {t.readMins} min</div>
            <h3 className="mt-2 font-semibold">{t.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
