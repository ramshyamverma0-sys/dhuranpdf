import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, X, SlidersHorizontal, Check } from "lucide-react";

export interface FilterOption { value: string; label: string; count?: number }

/* Generic pill-group filter — used for Category, Platform, Pricing, Tag, Language */
export function PillFilterGroup({
  title, options, value, onChange, multi = false, className,
}: {
  title: string;
  options: FilterOption[];
  value: string[];
  onChange: (next: string[]) => void;
  multi?: boolean;
  className?: string;
}) {
  const toggle = (v: string) => {
    if (multi) {
      onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
    } else {
      onChange(value[0] === v ? [] : [v]);
    }
  };
  return (
    <fieldset className={cn("space-y-2", className)}>
      <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</legend>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label={title}>
        {options.map((o) => {
          const active = value.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(o.value)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition",
                active
                  ? "primary-gradient text-primary-foreground border-transparent shadow-soft"
                  : "border-border bg-secondary text-secondary-foreground hover:border-primary/40 hover:text-primary",
              )}
            >
              {active ? <Check className="h-3 w-3" /> : null}
              {o.label}
              {typeof o.count === "number" ? (
                <span className={cn("ml-1 text-[10px]", active ? "text-primary-foreground/80" : "text-muted-foreground")}>
                  {o.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/* Concrete filter aliases (all reuse PillFilterGroup) */
export const CategoryFilter = (p: Omit<Parameters<typeof PillFilterGroup>[0], "title" | "multi">) =>
  <PillFilterGroup title="Category" multi {...p} />;
export const PlatformFilter = (p: Omit<Parameters<typeof PillFilterGroup>[0], "title" | "multi">) =>
  <PillFilterGroup title="Platform" multi {...p} />;
export const PricingFilter = (p: Omit<Parameters<typeof PillFilterGroup>[0], "title" | "multi">) =>
  <PillFilterGroup title="Pricing" multi {...p} />;
export const TagFilter = (p: Omit<Parameters<typeof PillFilterGroup>[0], "title" | "multi">) =>
  <PillFilterGroup title="Tags" multi {...p} />;
export const LanguageFilter = (p: Omit<Parameters<typeof PillFilterGroup>[0], "title" | "multi">) =>
  <PillFilterGroup title="Language" multi {...p} />;

/* Sort dropdown */
export function SortDropdown({
  value, options, onChange, className,
}: {
  value: string; options: FilterOption[]; onChange: (v: string) => void; className?: string;
}) {
  return (
    <label className={cn("relative inline-flex items-center gap-2 text-sm", className)}>
      <span className="text-muted-foreground">Sort:</span>
      <span className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none rounded-lg border border-border bg-background px-3 py-1.5 pr-8 text-sm font-medium outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
        >
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </span>
    </label>
  );
}

/* Clear filters chip */
export function ClearFiltersButton({ onClick, count, className }: { onClick?: () => void; count?: number; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground",
        "hover:text-destructive hover:border-destructive/40 transition",
        className,
      )}
    >
      <X className="h-3 w-3" /> Clear filters
      {typeof count === "number" && count > 0 ? (
        <span className="ml-1 rounded-full bg-destructive/10 px-1.5 text-[10px] font-semibold text-destructive">{count}</span>
      ) : null}
    </button>
  );
}

/* Sidebar container */
export function SidebarFilter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <aside
      aria-label="Filters"
      className={cn(
        "hidden lg:block sticky top-20 h-fit w-full max-w-xs rounded-2xl border border-border bg-card p-5 shadow-soft space-y-5",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Filters</h3>
      </div>
      {children}
    </aside>
  );
}

/* Mobile filter drawer (uncontrolled trigger + controlled from parent) */
export function MobileFilterDrawer({
  triggerLabel = "Filters", children, className,
}: { triggerLabel?: string; children: ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("lg:hidden", className)}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium shadow-soft hover:border-primary/40 transition"
      >
        <SlidersHorizontal className="h-4 w-4" /> {triggerLabel}
      </button>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          className="fixed inset-0 z-50 flex"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-in fade-in duration-200" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative ml-auto flex h-full w-[85%] max-w-sm flex-col gap-4 bg-background p-5 shadow-2xl animate-in slide-in-from-right duration-300"
          >
            <header className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <h2 className="text-base font-semibold">Filters</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close filters"
                className="grid h-9 w-9 place-items-center rounded-lg hover:bg-accent"
              >
                <X className="h-5 w-5" />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto space-y-5 pr-1">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
}
