import { createFileRoute } from "@tanstack/react-router";
import { GitCompare } from "lucide-react";
import { DirectoryPlaceholder } from "@/modules/ai-directory/components/DirectoryPlaceholder";
import { buildAiHead } from "@/modules/ai-directory/utils/seo";

export const Route = createFileRoute("/ai/comparisons")({
  head: () => buildAiHead({
    title: "AI Tool Comparisons | DhuranHub",
    description: "Side-by-side comparisons of leading AI tools across features, pricing and platforms.",
    path: "/ai/comparisons",
    breadcrumbs: [
      { label: "AI Hub", path: "/ai" },
      { label: "Comparisons", path: "/ai/comparisons" },
    ],
  }),
  component: AiComparisonsPage,
});

function AiComparisonsPage() {
  return (
    <DirectoryPlaceholder
      title="AI Comparisons"
      description="Head-to-head comparisons across leading AI tools and models are coming soon."
      icon={<GitCompare className="h-7 w-7" />}
      breadcrumbs={[{ label: "AI Hub", to: "/ai" }, { label: "Comparisons" }]}
    />
  );
}
