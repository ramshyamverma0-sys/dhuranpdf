import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  Flame,
  Sparkles,
  Star,
  BadgeCheck,
  ShieldCheck,
  TrendingUp,
  Code2,
  Gift,
  Zap,
  CircleDollarSign,
  Building2,
  GraduationCap,
  MapPin,
  Cable,
  Monitor,
  Smartphone,
  Apple,
} from "lucide-react";

export type AiBadgeVariant =
  | "trending"
  | "new"
  | "editors-choice"
  | "verified"
  | "official"
  | "popular"
  | "open-source"
  | "free"
  | "freemium"
  | "paid"
  | "enterprise"
  | "student"
  | "indian"
  | "api"
  | "desktop"
  | "android"
  | "ios";

type BadgeMeta = { label: string; icon?: React.ComponentType<{ className?: string }>; cls: string };

const MAP: Record<AiBadgeVariant, BadgeMeta> = {
  trending:         { label: "Trending",        icon: Flame,          cls: "bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400" },
  new:              { label: "New",              icon: Sparkles,       cls: "bg-pink-500/10 text-pink-600 border-pink-500/20 dark:text-pink-400" },
  "editors-choice": { label: "Editor's Choice",  icon: Star,           cls: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400" },
  verified:         { label: "Verified",         icon: BadgeCheck,     cls: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400" },
  official:         { label: "Official",         icon: ShieldCheck,    cls: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-400" },
  popular:          { label: "Popular",          icon: TrendingUp,     cls: "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400" },
  "open-source":    { label: "Open Source",      icon: Code2,          cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400" },
  free:             { label: "Free",             icon: Gift,           cls: "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400" },
  freemium:         { label: "Freemium",         icon: Zap,            cls: "bg-teal-500/10 text-teal-600 border-teal-500/20 dark:text-teal-400" },
  paid:             { label: "Paid",             icon: CircleDollarSign, cls: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20 dark:text-yellow-400" },
  enterprise:       { label: "Enterprise",       icon: Building2,      cls: "bg-slate-500/10 text-slate-700 border-slate-500/20 dark:text-slate-300" },
  student:          { label: "Student Friendly", icon: GraduationCap,  cls: "bg-sky-500/10 text-sky-600 border-sky-500/20 dark:text-sky-400" },
  indian:           { label: "Indian",           icon: MapPin,         cls: "bg-orange-500/10 text-orange-700 border-orange-500/20 dark:text-orange-400" },
  api:              { label: "API",              icon: Cable,          cls: "bg-violet-500/10 text-violet-600 border-violet-500/20 dark:text-violet-400" },
  desktop:          { label: "Desktop",          icon: Monitor,        cls: "bg-zinc-500/10 text-zinc-700 border-zinc-500/20 dark:text-zinc-300" },
  android:          { label: "Android",          icon: Smartphone,     cls: "bg-lime-500/10 text-lime-700 border-lime-500/20 dark:text-lime-400" },
  ios:              { label: "iOS",              icon: Apple,          cls: "bg-neutral-500/10 text-neutral-700 border-neutral-500/20 dark:text-neutral-300" },
};

export interface AiBadgeProps {
  variant: AiBadgeVariant;
  className?: string;
  showIcon?: boolean;
  children?: ReactNode;
}

export function AiBadge({ variant, className, showIcon = true, children }: AiBadgeProps) {
  const m = MAP[variant];
  const Icon = m.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        m.cls,
        className,
      )}
    >
      {showIcon && Icon ? <Icon className="h-3 w-3" aria-hidden /> : null}
      {children ?? m.label}
    </span>
  );
}

export function AiBadgeGroup({ variants, className }: { variants: AiBadgeVariant[]; className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {variants.map((v) => (
        <AiBadge key={v} variant={v} />
      ))}
    </div>
  );
}
