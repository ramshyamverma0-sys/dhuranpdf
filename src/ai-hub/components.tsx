import { Link } from "@tanstack/react-router";
import { useState } from "react";
import * as Icons from "lucide-react";
import type { AITool, AIHubCategory } from "./data";
import { cn } from "@/lib/utils";
import { Star, ArrowRight, ExternalLink, Sparkles } from "lucide-react";

// Extract a clean hostname from a tool website URL.
function domainOf(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
  }
}

// Renders the official brand favicon for a tool with a gradient-initials fallback.
// Uses Google's public favicon service (no API key, works for every domain).
export function ToolLogo({ name, website, size = 44, rounded = "rounded-xl" }: { name: string; website: string; size?: number; rounded?: string }) {
  const [failed, setFailed] = useState(false);
  const domain = domainOf(website);
  const src = `https://www.google.com/s2/favicons?sz=128&domain=${encodeURIComponent(domain)}`;
  const hue = hueFrom(name);
  const px = `${size}px`;
  if (failed) {
    return (
      <div
        className={cn("grid place-items-center text-white font-bold shrink-0", rounded)}
        style={{ width: px, height: px, fontSize: size * 0.32, background: `linear-gradient(135deg, hsl(${hue} 70% 50%), hsl(${(hue + 40) % 360} 70% 45%))` }}
        aria-hidden
      >
        {initials(name)}
      </div>
    );
  }
  return (
    <div className={cn("grid place-items-center bg-white dark:bg-white/95 border border-border shrink-0 overflow-hidden", rounded)} style={{ width: px, height: px }}>
      <img
        src={src}
        alt={`${name} logo`}
        loading="lazy"
        onError={() => setFailed(true)}
        style={{ width: size * 0.7, height: size * 0.7, objectFit: "contain" }}
      />
    </div>
  );
}

export function CatIcon({ name, className }: { name: string; className?: string }) {
  const C = (Icons as any)[name] || Icons.Sparkles;
  return <C className={className} />;
}

export function Section({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mb-16">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

const badgeStyles: Record<string, string> = {
  popular: "bg-primary/10 text-primary border-primary/20",
  trending: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  editor: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  new: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  verified: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};
const badgeLabels: Record<string, string> = {
  popular: "Popular", trending: "Trending", editor: "Editor's Choice", new: "New", verified: "Verified",
};

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

function hueFrom(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
}

export function AIToolCard({ tool }: { tool: AITool }) {
  const hue = hueFrom(tool.name);
  return (
    <Link
      to="/ai-hub/tool/$slug"
      params={{ slug: tool.slug }}
      className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-soft hover:shadow-card hover:-translate-y-0.5 hover:border-primary/40 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <ToolLogo name={tool.name} website={tool.website} size={44} />
        <div className="flex items-center gap-1 text-xs">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="font-medium">{tool.rating.toFixed(1)}</span>
        </div>
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <h3 className="font-semibold text-sm truncate">{tool.name}</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{tool.description}</p>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-auto">
        <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border",
          tool.pricing === "Free" ? "bg-success/10 text-success border-success/20"
          : tool.pricing === "Freemium" ? "bg-primary/10 text-primary border-primary/20"
          : "bg-muted text-muted-foreground border-border")}>
          {tool.pricing}
        </span>
        {tool.openSource && <span className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">Open Source</span>}
        {tool.badges?.slice(0, 2).map((b) => (
          <span key={b} className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border", badgeStyles[b])}>{badgeLabels[b]}</span>
        ))}
      </div>
    </Link>
  );
}

export function AICategoryCard({ cat, count }: { cat: AIHubCategory; count: number }) {
  return (
    <Link
      to="/ai-hub/directory"
      search={{ category: cat.slug } as any}
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-soft hover:shadow-card hover:-translate-y-0.5 hover:border-primary/40 transition-all"
    >
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary group-hover:scale-110 transition-transform">
        <CatIcon name={cat.icon} className="h-5 w-5" />
      </span>
      <h3 className="mt-3 font-semibold text-sm">{cat.name}</h3>
      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{cat.description}</p>
      <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-foreground/70">
        <Sparkles className="h-3 w-3" /> {count} tools
      </div>
    </Link>
  );
}

export function HubHero({ children, kicker, title, sub }: { kicker?: string; title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-10 mb-12">
      <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.15),transparent_50%)]" aria-hidden />
      <div className="relative max-w-3xl">
        {kicker && (
          <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-4">
            <Sparkles className="h-3 w-3" /> {kicker}
          </div>
        )}
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">{title}</h1>
        {sub && <p className="mt-4 text-base sm:text-lg text-muted-foreground">{sub}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}

export function HubTabs() {
  const links: { to: string; label: string; exact?: boolean }[] = [
    { to: "/ai-hub", label: "Home", exact: true },
    { to: "/ai-hub/directory", label: "Directory" },
    { to: "/ai-hub/prompts", label: "Prompts" },
    { to: "/ai-hub/collections", label: "Collections" },
    { to: "/ai-hub/comparisons", label: "Compare" },
    { to: "/ai-hub/tutorials", label: "Tutorials" },
    { to: "/ai-hub/news", label: "News" },
    { to: "/ai-hub/blog", label: "Blog" },
    { to: "/ai-hub/resources", label: "Resources" },
  ];
  return (
    <div className="mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
      <div className="flex gap-1 border-b border-border min-w-max">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to as any}
            activeOptions={l.exact ? { exact: true } : undefined}
            className="px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground border-b-2 border-transparent transition"
            activeProps={{ className: "text-primary border-primary font-semibold" }}
          >{l.label}</Link>
        ))}
      </div>
    </div>
  );
}

export function VisitButton({ href, children = "Visit Website" }: { href: string; children?: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center justify-center gap-2 rounded-lg primary-gradient px-4 py-2 text-sm font-semibold shadow-soft hover:shadow-card transition">
      {children} <ExternalLink className="h-4 w-4" />
    </a>
  );
}

export function MoreLink({ to, params, search, children }: { to: string; params?: any; search?: any; children: React.ReactNode }) {
  return (
    <Link to={to as any} params={params} search={search} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
      {children} <ArrowRight className="h-3.5 w-3.5" />
    </Link>
  );
}
