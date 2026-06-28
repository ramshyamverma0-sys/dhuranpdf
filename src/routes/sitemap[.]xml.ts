import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { TOOLS, CATEGORIES } from "@/lib/tools";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = [
          { path: "/", priority: "1.0" },
          { path: "/all-tools", priority: "0.9" },
          { path: "/about" },
          { path: "/contact" },
          { path: "/privacy" },
          { path: "/terms" },
          ...CATEGORIES.map((c) => ({ path: `/category/${c.slug}`, priority: "0.8" })),
          ...TOOLS.map((t) => ({ path: `/tools/${t.slug}`, priority: "0.7" })),
        ];

        const urls = entries
          .map(
            (e) =>
              `  <url><loc>${BASE_URL}${e.path}</loc>${"priority" in e ? `<priority>${e.priority}</priority>` : ""}</url>`,
          )
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
