import { Link } from "@tanstack/react-router";
import type { Tool } from "@/lib/tools";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  const implemented = !!tool.componentKey;
  return (
    <Link
      to="/tools/$slug"
      params={{ slug: tool.slug }}
      className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-soft hover:shadow-card hover:-translate-y-0.5 hover:border-primary/40 transition-all"
    >
      <div className="flex items-start justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary group-hover:scale-110 transition-transform">
          <Icon className="h-5 w-5" />
        </span>
        {implemented ? (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20">Ready</span>
        ) : (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">Soon</span>
        )}
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-sm truncate">{tool.name}</h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{tool.description}</p>
      </div>
      <div className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition">
        Open <ArrowRight className="h-3 w-3" />
      </div>
    </Link>
  );
}

export function CategoryCard({ slug, name, description, icon: Icon, color, count }: { slug: string; name: string; description: string; icon: any; color: string; count: number }) {
  return (
    <Link
      to="/category/$slug"
      params={{ slug }}
      className={cn("group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all")}
    >
      <div className={cn("absolute inset-0 opacity-60 bg-gradient-to-br", color)} aria-hidden />
      <div className="relative">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-background/80 backdrop-blur shadow-soft">
          <Icon className="h-6 w-6 text-primary" />
        </span>
        <h3 className="mt-4 font-semibold">{name}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{description}</p>
        <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-foreground/70">
          <Sparkles className="h-3 w-3" /> {count} tools
        </div>
      </div>
    </Link>
  );
}
