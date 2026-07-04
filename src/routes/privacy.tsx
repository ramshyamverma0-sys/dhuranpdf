import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — DhuranHub" },
      { name: "description", content: "How DhuranHub handles your data and files." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 prose-headings:font-bold">
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="mt-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p><strong className="text-foreground">Your files stay on your device.</strong> The vast majority of DhuranHub tools run entirely in your browser. We don't upload your PDFs, images or text to our servers.</p>
        <p>A small number of AI-powered tools send your input text to our AI provider to generate a response. The text is processed solely to fulfill your request and is not used to train models.</p>
        <p>We do not sell, share or monetize your personal data. We use standard analytics to understand how the site is used. You can contact us at any time to request deletion of any information we may hold about you.</p>
        <p>By using DhuranHub you agree to this policy.</p>
      </div>
    </div>
  ),
});
