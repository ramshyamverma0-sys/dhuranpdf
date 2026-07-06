import { createFileRoute } from "@tanstack/react-router";
import { PenLine } from "lucide-react";
import { DirectoryPlaceholder } from "@/modules/ai-directory/components/DirectoryPlaceholder";
import { buildAiHead } from "@/modules/ai-directory/utils/seo";

export const Route = createFileRoute("/ai/prompts")({
  head: () => buildAiHead({
    title: "AI Prompt Library | DhuranHub",
    description: "A curated library of AI prompts for writing, coding, marketing, images, video and more.",
    path: "/ai/prompts",
    breadcrumbs: [
      { label: "AI Hub", path: "/ai" },
      { label: "Prompts", path: "/ai/prompts" },
    ],
  }),
  component: AiPromptsPage,
});

function AiPromptsPage() {
  return (
    <DirectoryPlaceholder
      title="AI Prompt Library"
      description="A searchable library of high-quality prompts organized by use-case and model compatibility is in the works."
      icon={<PenLine className="h-7 w-7" />}
      breadcrumbs={[{ label: "AI Hub", to: "/ai" }, { label: "Prompts" }]}
    />
  );
}
