import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { getTool } from "@/lib/tools";
import { TOOL_COMPONENTS } from "@/tools/registry";
import { ToolPage } from "@/components/tool-page";
import GenericWorkingTool from "@/tools/generic-tool";

export const Route = createFileRoute("/tools/$slug")({
  loader: ({ params }) => {
    const tool = getTool(params.slug);
    if (!tool) throw notFound();
    const { icon: _icon, ...safe } = tool;
    return { tool: safe };
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
  const [resetKey, setResetKey] = useState(0);
  const Comp = tool.componentKey ? TOOL_COMPONENTS[tool.componentKey] : null;

  return (
    <ToolPage title={tool.name} description={tool.description} category={tool.category} onReset={() => setResetKey((k) => k + 1)}>
      {Comp ? (
        <Comp key={resetKey} slug={tool.slug} />
      ) : (
        <GenericWorkingTool key={resetKey} slug={tool.slug} />
      )}
    </ToolPage>
  );
}
