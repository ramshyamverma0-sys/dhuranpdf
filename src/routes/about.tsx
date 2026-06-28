import { createFileRoute } from "@tanstack/react-router";
import { TOTAL_TOOLS, CATEGORIES } from "@/lib/tools";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Dhuran PDF" },
      { name: "description", content: "Dhuran PDF is a complete digital toolkit with 200+ free PDF, AI, calculator and utility tools." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">About Dhuran PDF</h1>
      <p className="mt-4 text-muted-foreground">Dhuran PDF is a complete AI-powered digital tools ecosystem. We bring together {TOTAL_TOOLS}+ tools across {CATEGORIES.length} categories so you never have to bounce between websites again.</p>
      <h2 className="mt-8 text-xl font-semibold">Our mission</h2>
      <p className="mt-2 text-muted-foreground">Make powerful, professional tools available to everyone — for free, with no signup, and with privacy by default.</p>
      <h2 className="mt-8 text-xl font-semibold">What you'll find</h2>
      <ul className="mt-2 list-disc pl-6 space-y-1 text-muted-foreground">
        {CATEGORIES.map((c) => <li key={c.slug}><strong className="text-foreground">{c.name}</strong> — {c.description}</li>)}
      </ul>
    </div>
  );
}
