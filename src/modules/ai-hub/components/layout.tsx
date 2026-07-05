import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Home, PackageSearch, Inbox, AlertTriangle } from "lucide-react";

/* Grid layout — responsive column defaults */
export function AiGrid({
  children,
  cols = { base: 1, sm: 2, lg: 3, xl: 4 },
  className,
}: {
  children: ReactNode;
  cols?: { base?: number; sm?: number; md?: number; lg?: number; xl?: number };
  className?: string;
}) {
  const map = (n?: number, p = "") => n ? `${p}grid-cols-${n}` : "";
  return (
    <div
      className={cn(
        "grid gap-5",
        map(cols.base),
        map(cols.sm, "sm:"),
        map(cols.md, "md:"),
        map(cols.lg, "lg:"),
        map(cols.xl, "xl:"),
        className,
      )}
    >
      {children}
    </div>
  );
}

/* List view */
export function AiListView({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-3", className)}>{children}</div>;
}

/* Section header */
export function SectionHeader({
  eyebrow, title, description, action, id, className, center = false,
}: {
  eyebrow?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  id?: string;
  className?: string;
  center?: boolean;
}) {
  return (
    <header className={cn("mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", center && "sm:justify-center sm:text-center", className)}>
      <div className={cn(center && "mx-auto max-w-2xl")}>
        {eyebrow ? (
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-primary-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
            {eyebrow}
          </div>
        ) : null}
        <h2 id={id} className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        {description ? <p className="mt-2 text-sm text-muted-foreground sm:text-base">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

/* Breadcrumb */
export interface Crumb { label: string; to?: string; }
export function AiBreadcrumb({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm text-muted-foreground", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        <li className="inline-flex items-center gap-1.5">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground transition">
            <Home className="h-3.5 w-3.5" /> Home
          </Link>
        </li>
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="inline-flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
              {c.to && !last ? (
                <Link to={c.to} className="hover:text-foreground transition">{c.label}</Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={cn(last && "font-semibold text-foreground")}>{c.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* Simple sidebar shell */
export function AiSidebar({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <aside className={cn("hidden lg:block sticky top-20 h-fit w-full max-w-xs space-y-5", className)}>
      {children}
    </aside>
  );
}

/* Pagination */
export function AiPagination({
  page, pageCount, onChange, className,
}: { page: number; pageCount: number; onChange: (page: number) => void; className?: string }) {
  const go = (p: number) => onChange(Math.max(1, Math.min(pageCount, p)));
  const pages: (number | "…")[] = [];
  const push = (v: number | "…") => pages.push(v);
  const around = 1;
  for (let i = 1; i <= pageCount; i++) {
    if (i === 1 || i === pageCount || (i >= page - around && i <= page + around)) push(i);
    else if (pages[pages.length - 1] !== "…") push("…");
  }
  return (
    <nav aria-label="Pagination" className={cn("flex items-center justify-center gap-1", className)}>
      <button
        type="button"
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium hover:border-primary/40 disabled:opacity-40 disabled:pointer-events-none transition"
      >
        Prev
      </button>
      {pages.map((p, i) => p === "…" ? (
        <span key={`e-${i}`} className="px-2 text-sm text-muted-foreground">…</span>
      ) : (
        <button
          key={p}
          type="button"
          aria-current={p === page ? "page" : undefined}
          onClick={() => go(p)}
          className={cn(
            "min-w-9 rounded-lg border px-3 py-1.5 text-sm font-medium transition",
            p === page
              ? "primary-gradient text-primary-foreground border-transparent shadow-soft"
              : "border-border bg-background hover:border-primary/40",
          )}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        onClick={() => go(page + 1)}
        disabled={page >= pageCount}
        className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium hover:border-primary/40 disabled:opacity-40 disabled:pointer-events-none transition"
      >
        Next
      </button>
    </nav>
  );
}

/* Empty state */
export function EmptyState({
  icon: Icon = Inbox, title, description, action, className,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-10 text-center",
      className,
    )}>
      <span className="grid h-14 w-14 place-items-center rounded-full bg-primary-soft text-primary">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      {description ? <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

/* Loading skeleton block */
export function LoadingSkeletonGrid({ count = 6, withMedia = false, className }: { count?: number; withMedia?: boolean; className?: string }) {
  return (
    <div className={cn("grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft">
          {withMedia ? <Skeleton className="aspect-[16/9] w-full rounded-xl" /> : null}
          <Skeleton className="h-11 w-11 rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <div className="mt-2 flex gap-2">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* 404 / Not-found state */
export function NotFoundState({
  title = "Nothing here yet",
  description = "This AI Hub page is on its way. Please check back soon.",
  action,
  className,
}: {
  title?: string; description?: string; action?: ReactNode; className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center shadow-soft", className)}>
      <span className="grid h-16 w-16 place-items-center rounded-full bg-primary-soft text-primary">
        <PackageSearch className="h-7 w-7" />
      </span>
      <h2 className="mt-5 text-2xl font-bold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-6">{action}</div> : (
        <Link to="/ai" className="mt-6 inline-flex items-center gap-1.5 rounded-lg primary-gradient px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95 transition">
          Back to AI Hub
        </Link>
      )}
    </div>
  );
}

/* Error state */
export function ErrorState({ title = "Something went wrong", description, action }: { title?: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center">
      <AlertTriangle className="h-7 w-7 text-destructive" />
      <h3 className="mt-3 text-base font-semibold">{title}</h3>
      {description ? <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
