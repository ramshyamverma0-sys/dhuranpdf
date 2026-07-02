import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AI_TUTORIALS } from "@/ai-hub/data";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/ai-hub/tutorials/$slug")({
  loader: ({ params }) => {
    const t = AI_TUTORIALS.find((x) => x.slug === params.slug);
    if (!t) throw notFound();
    return { t };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.t.title || "Tutorial"} — Dhuran AI Hub` },
      { name: "description", content: loaderData?.t.description || "AI tutorial." },
      { property: "og:type", content: "article" },
    ],
  }),
  notFoundComponent: () => <div className="p-8 text-center">Tutorial not found. <Link to="/ai-hub/tutorials" className="text-primary">Back</Link></div>,
  component: TutorialPage,
});

function TutorialPage() {
  const { t } = Route.useLoaderData();
  return (
    <article className="max-w-3xl">
      <Link to="/ai-hub/tutorials" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4"><ArrowLeft className="h-3 w-3" /> All tutorials</Link>
      <div className="text-xs text-primary font-medium">{t.category} · {t.level} · {t.readMins} min read</div>
      <h1 className="text-3xl sm:text-4xl font-bold mt-2">{t.title}</h1>
      <p className="text-muted-foreground mt-3 text-lg">{t.description}</p>
      <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
        {t.body.split("\n").map((para, i) => <p key={i}>{para}</p>)}
      </div>
    </article>
  );
}
