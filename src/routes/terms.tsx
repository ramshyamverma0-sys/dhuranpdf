import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Dhuran PDF" },
      { name: "description", content: "Terms of using Dhuran PDF and its tools." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Terms & Conditions</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="mt-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>Dhuran PDF is provided "as is" without warranty of any kind. By using the service you agree not to misuse the tools, attempt to disrupt the service, or use it to process content you don't have rights to.</p>
        <p>The tools are intended for general personal and business use. Always verify critical outputs (financial, legal, medical) with a qualified professional.</p>
        <p>We may update or remove tools at any time. We are not liable for any loss of data or damages resulting from use of the service.</p>
      </div>
    </div>
  ),
});
