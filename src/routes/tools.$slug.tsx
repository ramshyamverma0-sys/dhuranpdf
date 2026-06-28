import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getTool } from "@/lib/tools";
import { TOOL_COMPONENTS } from "@/tools/registry";
import { ToolPage } from "@/components/tool-page";
import { Wand2 } from "lucide-react";

export const Route = createFileRoute("/tools/$slug")({
  loader: ({ params }) => {
    const tool = getTool(params.slug);
    if (!tool) throw notFound();
    return { tool };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.tool.name} — Dhuran PDF` },
          { name: "description", content: loaderData.tool.description },
          { property: "og:title", content: `${loaderData.tool.name} — Dhuran PDF` },
          { property: "og:description", content: loaderData.tool.description },
        ]
      : [],
  }),
  component: ToolDispatcher,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl py-20 text-center">
      <h1 className="text-2xl font-bold">Tool not found</h1>
      <Link to="/all-tools" className="text-primary mt-4 inline-block">Browse all tools</Link>
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-10 text-center">{error.message}</div>,
});

function ToolDispatcher() {
  const { tool } = Route.useLoaderData();
  const Comp = tool.componentKey ? TOOL_COMPONENTS[tool.componentKey] : null;

  return (
    <ToolPage title={tool.name} description={tool.description} category={tool.category}>
      {Comp ? (
        <Comp slug={tool.slug} />
      ) : (
        <div className="text-center py-12">
          <span className="inline-grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary mb-4"><Wand2 className="h-6 w-6" /></span>
          <h2 className="text-xl font-semibold">Coming soon</h2>
          <p className="mt-2 text-muted-foreground text-sm max-w-md mx-auto">This tool is on our roadmap. In the meantime, explore other tools that are ready to use.</p>
          <Link to="/all-tools" className="mt-6 inline-flex h-10 px-4 items-center rounded-md primary-gradient text-sm font-medium">Browse tools</Link>
        </div>
      )}
    </ToolPage>
  );
}
