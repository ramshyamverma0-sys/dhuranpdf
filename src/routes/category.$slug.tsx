import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getCategory, getToolsByCategory } from "@/lib/tools";
import { ToolCard } from "@/components/tool-card";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const cat = getCategory(params.slug);
    if (!cat) throw notFound();
    return { cat };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.cat.name} — Dhuran PDF` },
          { name: "description", content: loaderData.cat.description },
          { property: "og:title", content: `${loaderData.cat.name} — Dhuran PDF` },
          { property: "og:description", content: loaderData.cat.description },
        ]
      : [],
  }),
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl py-20 text-center">
      <h1 className="text-2xl font-bold">Category not found</h1>
      <Link to="/all-tools" className="text-primary mt-4 inline-block">Browse all tools</Link>
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-10 text-center">{error.message}</div>,
});

function CategoryPage() {
  const { cat } = Route.useLoaderData();
  const tools = getToolsByCategory(cat.slug);
  const Icon = cat.icon;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/all-tools" className="hover:text-primary">Tools</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{cat.name}</span>
      </nav>
      <div className="flex items-start gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary"><Icon className="h-7 w-7" /></span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{cat.name}</h1>
          <p className="mt-1 text-muted-foreground">{cat.description}</p>
          <div className="mt-2 text-xs text-muted-foreground">{tools.length} tools</div>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tools.map((t) => <ToolCard key={t.slug} tool={t} />)}
      </div>
    </div>
  );
}
