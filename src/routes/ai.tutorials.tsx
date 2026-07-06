import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { DirectoryPlaceholder } from "@/modules/ai-directory/components/DirectoryPlaceholder";
import { buildAiHead } from "@/modules/ai-directory/utils/seo";

export const Route = createFileRoute("/ai/tutorials")({
  head: () => buildAiHead({
    title: "AI Tutorials | DhuranHub",
    description: "Beginner to advanced tutorials for AI tools, prompt engineering, workflows and automation.",
    path: "/ai/tutorials",
    breadcrumbs: [
      { label: "AI Hub", path: "/ai" },
      { label: "Tutorials", path: "/ai/tutorials" },
    ],
  }),
  component: AiTutorialsPage,
});

function AiTutorialsPage() {
  return (
    <DirectoryPlaceholder
      title="AI Tutorials"
      description="Step-by-step AI tutorials with hands-on examples are launching soon."
      icon={<GraduationCap className="h-7 w-7" />}
      breadcrumbs={[{ label: "AI Hub", to: "/ai" }, { label: "Tutorials" }]}
    />
  );
}
