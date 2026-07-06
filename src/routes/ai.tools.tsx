import { createFileRoute } from "@tanstack/react-router";
import { LayoutGrid } from "lucide-react";
import { DirectoryPlaceholder } from "@/modules/ai-directory/components/DirectoryPlaceholder";
import { buildAiHead } from "@/modules/ai-directory/utils/seo";

export const Route = createFileRoute("/ai/tools")({
  head: () => buildAiHead({
    title: "AI Tools Directory | DhuranHub",
    description: "Browse a curated directory of AI tools across categories, pricing, platforms and use-cases.",
    path: "/ai/tools",
    breadcrumbs: [
      { label: "AI Hub", path: "/ai" },
      { label: "AI Tools", path: "/ai/tools" },
    ],
  }),
  component: AiToolsPage,
});

function AiToolsPage() {
  return (
    <DirectoryPlaceholder
      title="AI Tools Directory"
      description="A searchable, filterable directory of AI tools is on its way. The scalable architecture is already in place — content lands in an upcoming update."
      icon={<LayoutGrid className="h-7 w-7" />}
      breadcrumbs={[{ label: "AI Hub", to: "/ai" }, { label: "AI Tools" }]}
    />
  );
}
