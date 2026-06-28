import { Link } from "@tanstack/react-router";
import { ChevronRight, Share2, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { getCategory } from "@/lib/tools";

export function ToolPage({
  title,
  description,
  category,
  onReset,
  children,
}: {
  title: string;
  description: string;
  category: string;
  onReset?: () => void;
  children: ReactNode;
}) {
  const cat = getCategory(category);
  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) await navigator.share({ title, text: description, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      }
    } catch {}
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/all-tools" className="hover:text-primary">Tools</Link>
        {cat && (
          <>
            <ChevronRight className="h-3 w-3" />
            <Link to="/category/$slug" params={{ slug: cat.slug }} className="hover:text-primary">{cat.name}</Link>
          </>
        )}
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{title}</span>
      </nav>

      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 text-muted-foreground text-sm sm:text-base">{description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {onReset && (
            <button onClick={onReset} className="inline-flex items-center gap-1.5 px-3 h-9 rounded-md border border-border bg-card hover:bg-accent text-sm transition">
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          )}
          <button onClick={share} className="inline-flex items-center gap-1.5 px-3 h-9 rounded-md border border-border bg-card hover:bg-accent text-sm transition">
            <Share2 className="h-3.5 w-3.5" /> Share
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-soft p-5 sm:p-7">
        {children}
      </div>
    </div>
  );
}

// Common form primitives
export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground mt-1">{hint}</span>}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full h-10 px-3 rounded-md border border-input bg-background focus:border-ring focus:ring-2 focus:ring-ring/20 outline-none text-sm transition ${props.className ?? ""}`}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full px-3 py-2 rounded-md border border-input bg-background focus:border-ring focus:ring-2 focus:ring-ring/20 outline-none text-sm transition font-mono ${props.className ?? ""}`}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full h-10 px-3 rounded-md border border-input bg-background focus:border-ring focus:ring-2 focus:ring-ring/20 outline-none text-sm transition ${props.className ?? ""}`}
    />
  );
}

export function Btn({ variant = "primary", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  const base = "inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";
  const styles =
    variant === "primary"
      ? "primary-gradient hover:opacity-90 shadow-soft"
      : variant === "secondary"
      ? "bg-secondary text-secondary-foreground hover:bg-accent"
      : "hover:bg-accent";
  return <button {...props} className={`${base} ${styles} ${props.className ?? ""}`} />;
}

export function ResultBox({ children }: { children: ReactNode }) {
  return <div className="mt-6 rounded-xl border border-border bg-surface p-5">{children}</div>;
}
