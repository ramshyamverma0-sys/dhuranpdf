import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      { title: "AI Hub — DhuranHub" },
      { name: "description", content: "DhuranHub AI Hub — curated AI tools, prompts, tutorials and resources. Coming soon." },
      { property: "og:title", content: "AI Hub — DhuranHub" },
      { property: "og:description", content: "DhuranHub AI Hub — curated AI tools, prompts, tutorials and resources. Coming soon." },
      { property: "og:url", content: "https://dhuranpdf.lovable.app/ai" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://dhuranpdf.lovable.app/ai" }],
  }),
  component: AIHubComingSoon,
});

function AIHubComingSoon() {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24 text-center">
      <span className="inline-grid h-14 w-14 place-items-center rounded-2xl primary-gradient shadow-soft mx-auto">
        <Sparkles className="h-7 w-7" />
      </span>
      <h1 className="mt-6 text-3xl sm:text-4xl font-bold tracking-tight">AI Hub is coming soon</h1>
      <p className="mt-3 text-muted-foreground">
        A curated hub of AI tools, prompts, tutorials, comparisons and resources — built into DhuranHub. Stay tuned.
      </p>
      <div className="mt-8">
        <Link to="/all-tools" className="inline-flex items-center justify-center rounded-md primary-gradient px-5 py-2.5 text-sm font-medium">
          Explore existing tools
        </Link>
      </div>
    </section>
  );
}
