import { createFileRoute } from "@tanstack/react-router";
import { BookMarked } from "lucide-react";
import { DirectoryPlaceholder } from "@/modules/ai-directory/components/DirectoryPlaceholder";
import { buildAiHead } from "@/modules/ai-directory/utils/seo";

export const Route = createFileRoute("/ai/collections")({
  head: () => buildAiHead({
    title: "AI Collections | DhuranHub",
    description: "Hand-picked AI tool collections curated by use-case, workflow and industry.",
    path: "/ai/collections",
    breadcrumbs: [
      { label: "AI Hub", path: "/ai" },
      { label: "Collections", path: "/ai/collections" },
    ],
  }),
  component: AiCollectionsPage,
});

function AiCollectionsPage() {
  return (
    <DirectoryPlaceholder
      title="AI Collections"
      description="Curated collections grouping the best AI tools by workflow and outcome are launching soon."
      icon={<BookMarked className="h-7 w-7" />}
      breadcrumbs={[{ label: "AI Hub", to: "/ai" }, { label: "Collections" }]}
    />
  );
}
