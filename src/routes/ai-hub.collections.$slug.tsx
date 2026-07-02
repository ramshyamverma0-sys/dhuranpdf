import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AI_COLLECTIONS, AI_TOOLS } from "@/ai-hub/data";
import { AIToolCard } from "@/ai-hub/components";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/ai-hub/collections/$slug")({
  loader: ({ params }) => {
    const c = AI_COLLECTIONS.find((x) => x.slug === params.slug);
    if (!c) throw notFound();
    const tools = c.toolSlugs.map((s) => AI_TOOLS.find((t) => t.slug === s)).filter(Boolean) as typeof AI_TOOLS;
    return { c, tools };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.c.title} — AI Collection` },
      { name: "description", content: loaderData?.c.description },
    ],
  }),
  notFoundComponent: () => <div className="p-8 text-center">Collection not found. <Link to="/ai-hub/collections" className="text-primary">Back</Link></div>,
  component: CollectionPage,
});

function CollectionPage() {
  const { c, tools } = Route.useLoaderData();
  return (
    <div>
      <Link to="/ai-hub/collections" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4"><ArrowLeft className="h-3 w-3" /> All collections</Link>
      <h1 className="text-3xl sm:text-4xl font-bold">{c.title}</h1>
      <p className="mt-2 text-lg text-muted-foreground">{c.description}</p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((t) => <AIToolCard key={t.slug} tool={t} />)}
      </div>
    </div>
  );
}
