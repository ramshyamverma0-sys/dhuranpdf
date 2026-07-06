import { createFileRoute } from "@tanstack/react-router";
import { Newspaper } from "lucide-react";
import { DirectoryPlaceholder } from "@/modules/ai-directory/components/DirectoryPlaceholder";
import { buildAiHead } from "@/modules/ai-directory/utils/seo";

export const Route = createFileRoute("/ai/news")({
  head: () => buildAiHead({
    title: "AI News | DhuranHub",
    description: "Daily AI industry news, model releases, product launches and research highlights.",
    path: "/ai/news",
    breadcrumbs: [
      { label: "AI Hub", path: "/ai" },
      { label: "News", path: "/ai/news" },
    ],
  }),
  component: AiNewsPage,
});

function AiNewsPage() {
  return (
    <DirectoryPlaceholder
      title="AI News"
      description="A dedicated AI news stream with editorial picks and industry updates is on its way."
      icon={<Newspaper className="h-7 w-7" />}
      breadcrumbs={[{ label: "AI Hub", to: "/ai" }, { label: "News" }]}
    />
  );
}
