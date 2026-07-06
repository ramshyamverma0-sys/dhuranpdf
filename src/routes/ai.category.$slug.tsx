import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { DirectoryPlaceholder } from "@/modules/ai-directory/components/DirectoryPlaceholder";
import { buildAiHead } from "@/modules/ai-directory/utils/seo";

export const Route = createFileRoute("/ai/category/$slug")({
  head: ({ params }) => buildAiHead({
    title: `${params.slug} — AI Category | DhuranHub`,
    description: `Discover AI tools in the ${params.slug} category.`,
    path: `/ai/category/${params.slug}`,
    breadcrumbs: [
      { label: "AI Hub", path: "/ai" },
      { label: "Categories", path: "/ai/categories" },
      { label: params.slug, path: `/ai/category/${params.slug}` },
    ],
  }),
  component: AiCategoryDetailPage,
});

function AiCategoryDetailPage() {
  const { slug } = Route.useParams();
  return (
    <DirectoryPlaceholder
      title={`Category: ${slug}`}
      description="Category pages will list every AI tool in this category with filters, sort options and pagination. Coming soon."
      icon={<Sparkles className="h-7 w-7" />}
      breadcrumbs={[
        { label: "AI Hub", to: "/ai" },
        { label: "Categories", to: "/ai/categories" },
        { label: slug },
      ]}
    />
  );
}
