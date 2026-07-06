import { createFileRoute } from "@tanstack/react-router";
import { Store } from "lucide-react";
import { DirectoryPlaceholder } from "@/modules/ai-directory/components/DirectoryPlaceholder";
import { buildAiHead } from "@/modules/ai-directory/utils/seo";

export const Route = createFileRoute("/ai/marketplace")({
  head: () => buildAiHead({
    title: "AI Marketplace | DhuranHub",
    description: "Buy, sell and discover AI prompts, models, templates and services.",
    path: "/ai/marketplace",
    breadcrumbs: [
      { label: "AI Hub", path: "/ai" },
      { label: "Marketplace", path: "/ai/marketplace" },
    ],
  }),
  component: AiMarketplacePage,
});

function AiMarketplacePage() {
  return (
    <DirectoryPlaceholder
      title="AI Marketplace"
      description="An AI marketplace for prompts, templates, models and services is planned for a future update."
      icon={<Store className="h-7 w-7" />}
      breadcrumbs={[{ label: "AI Hub", to: "/ai" }, { label: "Marketplace" }]}
    />
  );
}
