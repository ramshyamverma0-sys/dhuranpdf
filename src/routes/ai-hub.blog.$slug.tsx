import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AI_BLOG } from "@/ai-hub/data";
import { ArrowLeft, Clock, Share2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/ai-hub/blog/$slug")({
  loader: ({ params }) => {
    const post = AI_BLOG.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.post.title} — Dhuran AI Blog` },
      { name: "description", content: loaderData?.post.excerpt },
      { property: "og:type", content: "article" },
    ],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org", "@type": "Article",
        headline: loaderData?.post.title, author: { "@type": "Person", name: loaderData?.post.author },
        datePublished: loaderData?.post.date,
      }),
    }],
  }),
  notFoundComponent: () => <div className="p-8 text-center">Post not found. <Link to="/ai-hub/blog" className="text-primary">Back</Link></div>,
  component: BlogPost,
});

function BlogPost() {
  const { post } = Route.useLoaderData();
  const related = AI_BLOG.filter((p) => p.slug !== post.slug).slice(0, 3);
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: post.title, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); toast.success("Link copied"); }
    } catch { /* cancel */ }
  };
  return (
    <div>
      <Link to="/ai-hub/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4"><ArrowLeft className="h-3 w-3" /> Blog</Link>
      <article className="max-w-3xl">
        <div className="text-xs text-primary font-medium">{post.category}</div>
        <h1 className="text-3xl sm:text-4xl font-bold mt-2">{post.title}</h1>
        <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
          <span>{post.author}</span><span>·</span>
          <span>{new Date(post.date).toLocaleDateString()}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readMins} min</span>
          <button onClick={share} className="ml-auto inline-flex items-center gap-1 text-sm hover:text-primary"><Share2 className="h-3 w-3" /> Share</button>
        </div>
        <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
          {post.body.split("\n").map((para: string, i: number) => <p key={i}>{para}</p>)}
        </div>
        <div className="mt-6 flex flex-wrap gap-1.5">{post.tags.map((t: string) => <span key={t} className="text-xs px-2 py-0.5 rounded-full border border-border">#{t}</span>)}</div>
      </article>
      {related.length > 0 && (
        <div className="mt-12 max-w-3xl">
          <h2 className="text-xl font-bold mb-4">Related posts</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <Link key={r.slug} to="/ai-hub/blog/$slug" params={{ slug: r.slug }} className="rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition">
                <h3 className="font-semibold text-sm">{r.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
