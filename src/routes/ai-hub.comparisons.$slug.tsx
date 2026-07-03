import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AI_COMPARISONS } from "@/ai-hub/data";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/ai-hub/comparisons/$slug")({
  loader: ({ params }) => {
    const c = AI_COMPARISONS.find((x) => x.slug === params.slug);
    if (!c) throw notFound();
    return { c };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.c.a} vs ${loaderData?.c.b} — AI Comparison` },
      { name: "description", content: loaderData?.c.verdict || "AI tool comparison" },
    ],
  }),
  notFoundComponent: () => <div className="p-8 text-center">Comparison not found. <Link to="/ai-hub/comparisons" className="text-primary">Back</Link></div>,
  component: ComparisonPage,
});

function ComparisonPage() {
  const { c } = Route.useLoaderData();
  return (
    <div className="max-w-4xl">
      <Link to="/ai-hub/comparisons" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4"><ArrowLeft className="h-3 w-3" /> All comparisons</Link>
      <h1 className="text-3xl sm:text-4xl font-bold">{c.a} <span className="text-muted-foreground">vs</span> {c.b}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{c.verdict}</p>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full border border-border rounded-xl overflow-hidden text-sm">
          <thead className="bg-surface">
            <tr>
              <th className="text-left p-3 font-semibold w-32">Criteria</th>
              <th className="text-left p-3 font-semibold">{c.a}</th>
              <th className="text-left p-3 font-semibold">{c.b}</th>
            </tr>
          </thead>
          <tbody>
            {c.sections.map((s: { title: string; a: string; b: string }) => (
              <tr key={s.title} className="border-t border-border">
                <td className="p-3 font-medium bg-surface/50">{s.title}</td>
                <td className="p-3">{s.a}</td>
                <td className="p-3">{s.b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-5">
        <h2 className="text-lg font-bold">Final verdict</h2>
        <p className="text-sm mt-2">{c.verdict}</p>
      </div>
    </div>
  );
}
