import { createFileRoute, Link } from "@tanstack/react-router";
import { AI_BLOG } from "@/ai-hub/data";
import { Clock } from "lucide-react";

export const Route = createFileRoute("/ai-hub/blog")({
  head: () => ({
    meta: [
      { title: "AI Blog — Articles, Guides & Opinion | Dhuran AI Hub" },
      { name: "description", content: "Fresh AI articles, guides and opinion pieces from the Dhuran team." },
    ],
  }),
  component: Blog,
});

function Blog() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI Blog</h1>
        <p className="text-muted-foreground mt-1">Articles, guides and takes from the Dhuran team</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AI_BLOG.map((b) => (
          <Link key={b.slug} to="/ai-hub/blog/$slug" params={{ slug: b.slug }} className="rounded-xl border border-border bg-card p-5 shadow-soft hover:shadow-card hover:border-primary/40 transition">
            <div className="text-xs text-primary font-medium">{b.category}</div>
            <h3 className="mt-2 font-semibold text-lg">{b.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{b.excerpt}</p>
            <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
              <span>{b.author}</span>
              <span>·</span>
              <span>{new Date(b.date).toLocaleDateString()}</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {b.readMins} min</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
