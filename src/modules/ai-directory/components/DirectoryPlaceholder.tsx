/**
 * AI Directory — Placeholder page.
 *
 * Premium "under development" screen used by every AI Directory route
 * until real content is wired up in a future prompt.
 */

import { Link } from "@tanstack/react-router";
import { Sparkles, ArrowLeft, Bell, Clock } from "lucide-react";
import type { ReactNode } from "react";
import { AiBreadcrumb, SectionHeader, type Crumb } from "@/modules/ai-hub/components/layout";
import { cn } from "@/lib/utils";

export interface DirectoryPlaceholderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
}

const DEFAULT_COPY =
  "This section is currently under development and will be available in upcoming updates.";

export function DirectoryPlaceholder({
  eyebrow = "AI Directory",
  title,
  description = DEFAULT_COPY,
  breadcrumbs,
  icon,
  className,
  children,
}: DirectoryPlaceholderProps) {
  return (
    <main className={cn("mx-auto w-full max-w-6xl px-4 py-10 sm:py-14", className)}>
      {breadcrumbs?.length ? <AiBreadcrumb items={breadcrumbs} className="mb-6" /> : null}

      <SectionHeader
        eyebrow={
          <>
            <Sparkles className="h-3.5 w-3.5" />
            <span>{eyebrow}</span>
          </>
        }
        title={title}
        description={description}
      />

      <section
        aria-live="polite"
        className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-soft sm:p-12"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative flex flex-col items-center gap-6 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-soft text-primary">
            {icon ?? <Clock className="h-7 w-7" />}
          </span>
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Coming soon</h2>
            <p className="text-sm text-muted-foreground sm:text-base">{description}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/ai"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold shadow-soft transition hover:border-primary/40 hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" /> Back to AI Hub
            </Link>
            <Link
              to="/all-tools"
              className="inline-flex items-center gap-1.5 rounded-lg primary-gradient px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-95"
            >
              <Bell className="h-4 w-4" /> Explore existing tools
            </Link>
          </div>
          {children ? <div className="w-full pt-4">{children}</div> : null}
        </div>
      </section>
    </main>
  );
}
