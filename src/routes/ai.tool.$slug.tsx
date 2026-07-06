import { createFileRoute } from "@tanstack/react-router";
import { Bot } from "lucide-react";
import { DirectoryPlaceholder } from "@/modules/ai-directory/components/DirectoryPlaceholder";
import { buildAiHead } from "@/modules/ai-directory/utils/seo";

export const Route = createFileRoute("/ai/tool/$slug")({
  head: ({ params }) => buildAiHead({
    title: `${params.slug} | AI Tool | DhuranHub`,
    description: `Details, pricing, features and alternatives for the ${params.slug} AI tool.`,
    path: `/ai/tool/${params.slug}`,
    type: "article",
    breadcrumbs: [
      { label: "AI Hub", path: "/ai" },
      { label: "AI Tools", path: "/ai/tools" },
      { label: params.slug, path: `/ai/tool/${params.slug}` },
    ],
  }),
  component: AiToolDetailPage,
});

function AiToolDetailPage() {
  const { slug } = Route.useParams();
  return (
    <DirectoryPlaceholder
      title={`AI Tool: ${slug}`}
      description="Individual AI tool pages will include overview, pricing, features, pros/cons, alternatives, screenshots and FAQ. Coming soon."
      icon={<Bot className="h-7 w-7" />}
      breadcrumbs={[
        { label: "AI Hub", to: "/ai" },
        { label: "AI Tools", to: "/ai/tools" },
        { label: slug },
      ]}
    />
  );
}
