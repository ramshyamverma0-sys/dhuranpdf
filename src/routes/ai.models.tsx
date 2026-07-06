import { createFileRoute } from "@tanstack/react-router";
import { Cpu } from "lucide-react";
import { DirectoryPlaceholder } from "@/modules/ai-directory/components/DirectoryPlaceholder";
import { buildAiHead } from "@/modules/ai-directory/utils/seo";

export const Route = createFileRoute("/ai/models")({
  head: () => buildAiHead({
    title: "AI Models | GPT, Claude, Gemini, Llama & more | DhuranHub",
    description: "Compare leading AI models — GPT, Claude, Gemini, DeepSeek, Llama, Qwen, Mistral, FLUX, Stable Diffusion and more.",
    path: "/ai/models",
    breadcrumbs: [
      { label: "AI Hub", path: "/ai" },
      { label: "AI Models", path: "/ai/models" },
    ],
  }),
  component: AiModelsPage,
});

function AiModelsPage() {
  return (
    <DirectoryPlaceholder
      title="AI Models"
      description="A comprehensive index of large language, image, video and voice models is coming soon."
      icon={<Cpu className="h-7 w-7" />}
      breadcrumbs={[{ label: "AI Hub", to: "/ai" }, { label: "AI Models" }]}
    />
  );
}
