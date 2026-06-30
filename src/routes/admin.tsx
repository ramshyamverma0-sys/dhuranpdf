import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, TOOLS } from "@/lib/tools";
import { Btn, Field, Input, Textarea, Select, ResultBox } from "@/components/tool-page";
import { toast } from "sonner";

type AdminTool = { slug: string; name: string; category: string; enabled: boolean; description: string; icon?: string };
const KEY = "dhuran-admin-tools";

export const Route = createFileRoute("/admin")({
  component: AdminPanel,
});

function AdminPanel() {
  const defaults = useMemo<AdminTool[]>(() => TOOLS.map((t) => ({ slug: t.slug, name: t.name, category: t.category, description: t.description, enabled: true })), []);
  const [tools, setTools] = useState<AdminTool[]>(defaults);
  const [selected, setSelected] = useState(defaults[0]?.slug || "");
  const [categoryName, setCategoryName] = useState("");
  const current = tools.find((t) => t.slug === selected) || tools[0];

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved) setTools(JSON.parse(saved));
  }, []);
  const persist = (next: AdminTool[]) => { setTools(next); localStorage.setItem(KEY, JSON.stringify(next)); };
  const update = (patch: Partial<AdminTool>) => {
    const next = tools.map((t) => t.slug === current.slug ? { ...t, ...patch } : t);
    persist(next); toast.success("Tool updated");
  };
  const addTool = () => {
    const slug = `custom-tool-${Date.now()}`;
    const next = [...tools, { slug, name: "New Tool", category: CATEGORIES[0].slug, description: "Custom admin-added tool", enabled: true }];
    persist(next); setSelected(slug); toast.success("Tool added");
  };
  const deleteTool = () => {
    if (!current) return;
    const next = tools.filter((t) => t.slug !== current.slug);
    persist(next); setSelected(next[0]?.slug || ""); toast.success("Tool deleted");
  };
  const analytics = { total: tools.length, enabled: tools.filter(t => t.enabled).length, disabled: tools.filter(t => !t.enabled).length, categories: new Set(tools.map(t => t.category)).size };

  return <main className="container py-8 space-y-6">
    <div><h1 className="text-3xl font-bold">Dhuran PDF Admin Panel</h1><p className="text-muted-foreground">Manage tools, categories, icons and local analytics.</p></div>
    <div className="grid gap-4 sm:grid-cols-4">{Object.entries(analytics).map(([k, v]) => <ResultBox key={k}><div className="text-xs uppercase text-muted-foreground">{k}</div><div className="text-2xl font-bold">{v}</div></ResultBox>)}</div>
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <section className="rounded-2xl border bg-card p-4 space-y-3">
        <div className="flex gap-2"><Btn onClick={addTool}>Add new tool</Btn><Btn variant="secondary" onClick={() => { persist(defaults); toast.success("Reset to defaults"); }}>Reset</Btn></div>
        <Field label="Tools"><Select value={selected} onChange={(e) => setSelected(e.target.value)}>{tools.map((t) => <option key={t.slug} value={t.slug}>{t.enabled ? "✅" : "⛔"} {t.name}</option>)}</Select></Field>
        <Field label="New category name"><Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="Business Tools" /></Field>
        <Btn variant="secondary" onClick={() => { if (!categoryName.trim()) return toast.error("Enter category name"); toast.success(`Category ready: ${categoryName}`); setCategoryName(""); }}>Add category</Btn>
      </section>
      {current && <section className="rounded-2xl border bg-card p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-xl font-semibold">Edit tool page</h2><div className="flex gap-2"><Btn variant="secondary" onClick={() => update({ enabled: !current.enabled })}>{current.enabled ? "Disable" : "Enable"}</Btn><Btn variant="secondary" onClick={deleteTool}>Delete</Btn></div></div>
        <div className="grid gap-3 sm:grid-cols-2"><Field label="Tool name"><Input value={current.name} onChange={(e) => update({ name: e.target.value })} /></Field><Field label="Slug"><Input value={current.slug} onChange={(e) => update({ slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} /></Field><Field label="Category"><Select value={current.category} onChange={(e) => update({ category: e.target.value })}>{CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</Select></Field><Field label="Upload icon"><Input type="file" accept="image/*" onChange={(e) => update({ icon: e.target.files?.[0]?.name || current.icon })} /></Field></div>
        <Field label="Description"><Textarea rows={4} value={current.description} onChange={(e) => update({ description: e.target.value })} /></Field>
        <ResultBox><div className="text-sm"><b>Status:</b> {current.enabled ? "Enabled" : "Disabled"}<br/><b>Icon:</b> {current.icon || "Default registry icon"}<br/><b>Analytics:</b> page views can be connected to a database provider when production auth is enabled.</div></ResultBox>
      </section>}
    </div>
  </main>;
}
