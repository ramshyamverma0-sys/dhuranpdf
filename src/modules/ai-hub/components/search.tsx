import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Search, Clock, Flame, SearchX, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

/* Search bar (UI only) */
export interface AiSearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "md" | "lg";
  onSearch?: (q: string) => void;
  containerClassName?: string;
  actionLabel?: string;
}

export function AiSearchBar({
  size = "md",
  onSearch,
  containerClassName,
  actionLabel = "Search",
  className,
  placeholder = "Search AI tools, models, prompts…",
  ...rest
}: AiSearchBarProps) {
  const h = size === "lg" ? "h-14" : "h-11";
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        onSearch?.(String(fd.get("q") ?? ""));
      }}
      className={cn("relative w-full", containerClassName)}
    >
      <label htmlFor={rest.id ?? "ai-search"} className="sr-only">Search</label>
      <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <input
        id={rest.id ?? "ai-search"}
        name="q"
        type="search"
        placeholder={placeholder}
        className={cn(
          "w-full pl-12 pr-28 rounded-2xl border border-border bg-background shadow-soft outline-none text-sm",
          "focus:border-ring focus:ring-2 focus:ring-ring/30 transition",
          h,
          className,
        )}
        {...rest}
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl primary-gradient px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-95 transition"
      >
        {actionLabel}
      </button>
    </form>
  );
}

/* Suggestion list container + item */
export function SearchSuggestions({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      role="listbox"
      className={cn(
        "w-full overflow-hidden rounded-xl border border-border bg-popover shadow-card",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SearchSuggestionItem({
  icon: Icon = Search,
  label,
  hint,
  onSelect,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  hint?: string;
  onSelect?: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      onClick={onSelect}
      className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-sm hover:bg-accent focus-visible:bg-accent outline-none transition"
    >
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="flex-1 truncate">{label}</span>
      {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
    </button>
  );
}

/* Recent searches */
export function RecentSearches({ items, onPick, onClear }: {
  items: string[]; onPick?: (q: string) => void; onClear?: () => void;
}) {
  if (!items.length) return null;
  return (
    <section aria-label="Recent searches" className="space-y-2">
      <header className="flex items-center justify-between">
        <h4 className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Clock className="h-3.5 w-3.5" /> Recent
        </h4>
        {onClear ? (
          <button type="button" onClick={onClear} className="text-xs text-muted-foreground hover:text-foreground">Clear</button>
        ) : null}
      </header>
      <div className="flex flex-wrap gap-1.5">
        {items.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onPick?.(q)}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-3 py-1 text-xs hover:border-primary/40 hover:text-primary transition"
          >
            <Clock className="h-3 w-3" /> {q}
          </button>
        ))}
      </div>
    </section>
  );
}

/* Popular searches */
export function PopularSearches({ items, onPick }: { items: string[]; onPick?: (q: string) => void }) {
  return (
    <section aria-label="Popular searches" className="space-y-2">
      <h4 className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Flame className="h-3.5 w-3.5" /> Popular
      </h4>
      <div className="flex flex-wrap gap-1.5">
        {items.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onPick?.(q)}
            className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary hover:bg-primary/15 transition"
          >
            {q}
          </button>
        ))}
      </div>
    </section>
  );
}

export function NoSearchResults({ query, action }: { query?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-10 text-center">
      <SearchX className="h-8 w-8 text-muted-foreground" />
      <h3 className="mt-3 text-base font-semibold">No results found</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {query ? <>We couldn't find anything for "<span className="font-medium text-foreground">{query}</span>".</> : "Try a different keyword."}
      </p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function LoadingSearch() {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-popover px-3 py-2.5 shadow-soft">
      <Loader2 className="h-4 w-4 animate-spin text-primary" />
      <span className="text-sm text-muted-foreground">Searching…</span>
      <div className="ml-auto flex gap-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-10" />
      </div>
    </div>
  );
}
