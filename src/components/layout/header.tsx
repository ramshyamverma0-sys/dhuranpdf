import { Link, useRouterState } from "@tanstack/react-router";
import { Moon, Sun, Search, FileText, Menu, X, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/components/theme-provider";
import { TOOLS, CATEGORIES } from "@/lib/tools";
import { cn } from "@/lib/utils";

export function Header() {
  const { theme, toggle } = useTheme();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const aiActive = pathname === "/ai" || pathname.startsWith("/ai/");

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const results = q.trim().length === 0 ? [] : TOOLS.filter((t) =>
    t.name.toLowerCase().includes(q.toLowerCase()) || t.description.toLowerCase().includes(q.toLowerCase())
  ).slice(0, 8);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="grid h-9 w-9 place-items-center rounded-xl primary-gradient shadow-soft">
            <FileText className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">Dhuran<span className="text-primary">Hub</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-4">
          <Link to="/" activeOptions={{ exact: true }} className="px-3 py-2 text-sm rounded-md hover:bg-accent transition" activeProps={{ className: "text-primary font-semibold" }}>Home</Link>
          <Link to="/all-tools" className="px-3 py-2 text-sm rounded-md hover:bg-accent transition" activeProps={{ className: "text-primary font-semibold" }}>All Tools</Link>
          <span className="group relative inline-flex items-center">
            <Link
              to="/ai"
              aria-label="AI Hub — Discover 2,500+ verified AI tools"
              className={cn(
                "relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold text-white cursor-pointer",
                "bg-[linear-gradient(120deg,#2563eb_0%,#7c3aed_55%,#2563eb_100%)] bg-[length:200%_100%] bg-[position:0%_50%]",
                "border border-white/20 shadow-[0_4px_14px_-2px_rgba(99,102,241,0.55)]",
                "transition-all duration-300 ease-out will-change-transform",
                "hover:-translate-y-0.5 hover:bg-[position:100%_50%] hover:shadow-[0_10px_28px_-6px_rgba(124,58,237,0.7)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-purple-500",
                aiActive && "ring-2 ring-offset-2 ring-offset-background ring-purple-400/70 shadow-[0_0_0_2px_rgba(124,58,237,0.35),0_10px_28px_-6px_rgba(124,58,237,0.7)]",
              )}
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              <span>AI Hub</span>
              <span
                aria-label="New"
                className="ml-0.5 inline-flex items-center rounded-full bg-pink-500 px-1.5 py-0.5 text-[9px] font-bold leading-none text-white shadow-sm"
              >
                NEW
              </span>
              {aiActive && (
                <span aria-hidden className="absolute -bottom-1 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-white/90" />
              )}
            </Link>
            <span
              role="tooltip"
              className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 dark:bg-neutral-800"
            >
              Discover 2,500+ Verified AI Tools
              <span aria-hidden className="absolute left-1/2 -top-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-neutral-900 dark:bg-neutral-800" />
            </span>
          </span>
          <Link to="/category/$slug" params={{ slug: "pdf" }} className="px-3 py-2 text-sm rounded-md hover:bg-accent transition">PDF</Link>
          <Link to="/category/$slug" params={{ slug: "finance" }} className="px-3 py-2 text-sm rounded-md hover:bg-accent transition">Finance</Link>
        </nav>

        <div ref={ref} className="relative ml-auto flex-1 max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Search 200+ tools..."
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-secondary border border-transparent focus:border-ring focus:bg-background outline-none text-sm transition"
          />
          {open && results.length > 0 && (
            <div className="absolute mt-2 w-full bg-popover border border-border rounded-xl shadow-card overflow-hidden">
              {results.map((t) => (
                <Link key={t.slug} to="/tools/$slug" params={{ slug: t.slug }} onClick={() => { setOpen(false); setQ(""); }} className="flex items-center gap-3 px-3 py-2.5 hover:bg-accent transition">
                  <t.icon className="h-4 w-4 text-primary shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{t.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{t.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <button onClick={toggle} aria-label="Toggle theme" className="grid h-10 w-10 place-items-center rounded-lg hover:bg-accent transition">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden grid h-10 w-10 place-items-center rounded-lg hover:bg-accent transition" aria-label="Menu">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-3 space-y-1">
            <Link to="/" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md hover:bg-accent text-sm">Home</Link>
            <Link to="/all-tools" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md hover:bg-accent text-sm">All Tools</Link>
            <Link
              to="/ai"
              onClick={() => setMobileOpen(false)}
              aria-label="AI Hub — Discover 2,500+ verified AI tools"
              className="flex items-center justify-between gap-2 rounded-full px-3.5 py-2 text-sm font-semibold text-white bg-[linear-gradient(120deg,#2563eb,#7c3aed)] shadow-[0_6px_20px_-4px_rgba(124,58,237,0.55)] border border-white/15"
            >
              <span className="flex items-center gap-1.5"><Sparkles className="h-4 w-4" aria-hidden /> AI Hub</span>
              <span className="rounded-full bg-pink-500 px-1.5 py-0.5 text-[9px] font-bold leading-none text-white">NEW</span>
            </Link>
            
            
            {CATEGORIES.slice(0, 6).map((c) => (
              <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} onClick={() => setMobileOpen(false)} className={cn("block px-3 py-2 rounded-md hover:bg-accent text-sm")}>{c.name}</Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
