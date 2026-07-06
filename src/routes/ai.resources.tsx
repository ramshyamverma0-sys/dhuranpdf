import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { DirectoryPlaceholder } from "@/modules/ai-directory/components/DirectoryPlaceholder";
import { buildAiHead } from "@/modules/ai-directory/utils/seo";

export const Route = createFileRoute("/ai/resources")({
  head: () => buildAiHead({
    title: "AI Resources | DhuranHub",
    description: "Guides, cheat sheets, courses and reference material for AI builders and users.",
    path: "/ai/resources",
    breadcrumbs: [
      { label: "AI Hub", path: "/ai" },
      { label: "Resources", path: "/ai/resources" },
    ],
  }),
  component: AiResourcesPage,
});

function AiResourcesPage() {
  return (
    <DirectoryPlaceholder
      title="AI Resources"
      description="A resource hub with guides, cheat sheets and learning paths is under development."
      icon={<BookOpen className="h-7 w-7" />}
      breadcrumbs={[{ label: "AI Hub", to: "/ai" }, { label: "Resources" }]}
    />
  );
}
