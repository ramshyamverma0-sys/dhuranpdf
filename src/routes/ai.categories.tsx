import { createFileRoute } from "@tanstack/react-router";
import { Library } from "lucide-react";
import { DirectoryPlaceholder } from "@/modules/ai-directory/components/DirectoryPlaceholder";
import { buildAiHead } from "@/modules/ai-directory/utils/seo";

export const Route = createFileRoute("/ai/categories")({
  head: () => buildAiHead({
    title: "AI Categories | DhuranHub",
    description: "Explore AI tools by category — chatbots, writing, coding, image, video, voice and more.",
    path: "/ai/categories",
    breadcrumbs: [
      { label: "AI Hub", path: "/ai" },
      { label: "Categories", path: "/ai/categories" },
    ],
  }),
  component: AiCategoriesPage,
});

function AiCategoriesPage() {
  return (
    <DirectoryPlaceholder
      title="AI Categories"
      description="A comprehensive category and sub-category browser is under construction. Full navigation across 150+ categories coming soon."
      icon={<Library className="h-7 w-7" />}
      breadcrumbs={[{ label: "AI Hub", to: "/ai" }, { label: "Categories" }]}
    />
  );
}
