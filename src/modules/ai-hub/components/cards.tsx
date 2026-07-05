import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { AiBadge, type AiBadgeVariant } from "./badges";
import { VisitWebsiteButton, ViewDetailsButton, IconActionButton } from "./buttons";
import { Bookmark, Heart, Share2, ArrowRight, Star } from "lucide-react";

type Icon = React.ComponentType<{ className?: string }>;

/* -------------------------------------------------------------------------- */
/*  Shared card shell                                                         */
/* -------------------------------------------------------------------------- */

export interface AiCardShellProps {
  as?: "article" | "div";
  className?: string;
  interactive?: boolean;
  children: ReactNode;
}

export function AiCardShell({ as: Tag = "article", className, interactive = true, children }: AiCardShellProps) {
  return (
    <Tag
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft",
        interactive && "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card hover:border-primary/40",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/*  Media / thumbnail                                                          */
/* -------------------------------------------------------------------------- */

export function AiCardMedia({
  image,
  logo,
  icon: Icon,
  alt = "",
  ratio = "16/9",
}: {
  image?: string;
  logo?: string;
  icon?: Icon;
  alt?: string;
  ratio?: "16/9" | "4/3" | "1/1";
}) {
  return (
    <div
      className="relative w-full overflow-hidden bg-primary-soft"
      style={{ aspectRatio: ratio }}
    >
      {image ? (
        <img
          src={image}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="grid h-full w-full place-items-center">
          {logo ? (
            <img src={logo} alt={alt} loading="lazy" className="max-h-16 max-w-[60%] object-contain" />
          ) : Icon ? (
            <Icon className="h-10 w-10 text-primary" />
          ) : null}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Header (icon/logo + title + description)                                   */
/* -------------------------------------------------------------------------- */

export function AiCardHeader({
  icon: Icon,
  logo,
  title,
  description,
  eyebrow,
}: {
  icon?: Icon;
  logo?: string;
  title: string;
  description?: string;
  eyebrow?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 p-5 pb-3">
      {(logo || Icon) && (
        <span className="inline-grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
          {logo ? (
            <img src={logo} alt="" className="h-8 w-8 object-contain" loading="lazy" />
          ) : Icon ? (
            <Icon className="h-5 w-5" />
          ) : null}
        </span>
      )}
      <div className="min-w-0 flex-1">
        {eyebrow ? <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{eyebrow}</div> : null}
        <h3 className="text-base font-semibold leading-tight text-foreground line-clamp-2">{title}</h3>
        {description ? (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Card composition primitives                                                */
/* -------------------------------------------------------------------------- */

export function AiCardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex flex-1 flex-col px-5 pb-3", className)}>{children}</div>;
}

export function AiCardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border/60 bg-secondary/40 px-5 py-3", className)}>
      {children}
    </div>
  );
}

export function AiTagList({ tags, className }: { tags: string[]; className?: string }) {
  if (!tags?.length) return null;
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {tags.map((t) => (
        <span
          key={t}
          className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground"
        >
          #{t}
        </span>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Concrete card variants                                                    */
/* -------------------------------------------------------------------------- */

interface BaseCardProps {
  title: string;
  description?: string;
  image?: string;
  logo?: string;
  icon?: Icon;
  badges?: AiBadgeVariant[];
  tags?: string[];
  href?: string;
  onDetails?: () => void;
  className?: string;
}

export function AIToolCard({
  title, description, logo, icon, badges, tags, href, onDetails, className,
  rating,
}: BaseCardProps & { rating?: number }) {
  return (
    <AiCardShell className={className}>
      <div className="absolute right-3 top-3 z-10 flex gap-1.5">
        <IconActionButton icon={Bookmark} label="Bookmark" />
        <IconActionButton icon={Heart} label="Favorite" />
      </div>
      <AiCardHeader icon={icon} logo={logo} title={title} description={description} />
      <AiCardBody>
        {badges?.length ? (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {badges.map((b) => <AiBadge key={b} variant={b} />)}
          </div>
        ) : null}
        {tags?.length ? <AiTagList tags={tags} className="mb-3" /> : null}
        {typeof rating === "number" && (
          <div className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
            <span>rating</span>
          </div>
        )}
      </AiCardBody>
      <AiCardFooter>
        <VisitWebsiteButton href={href} />
        <ViewDetailsButton onClick={onDetails} />
      </AiCardFooter>
    </AiCardShell>
  );
}

export function CategoryCard({ title, description, icon: Icon, count, className, onClick }: {
  title: string; description?: string; icon?: Icon; count?: number; className?: string; onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex h-full flex-col items-start gap-3 rounded-2xl border border-border bg-card p-5 text-left shadow-soft",
        "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card hover:border-primary/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {Icon ? (
        <span className="inline-grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary transition group-hover:primary-gradient">
          <Icon className="h-5 w-5" />
        </span>
      ) : null}
      <div>
        <div className="text-base font-semibold">{title}</div>
        {description ? <div className="mt-0.5 text-sm text-muted-foreground line-clamp-2">{description}</div> : null}
      </div>
      {typeof count === "number" ? (
        <span className="mt-auto text-xs font-medium text-muted-foreground">{count.toLocaleString()} tools</span>
      ) : null}
    </button>
  );
}

export function PromptCard({ title, description, tags, badges, className, onCopy }: BaseCardProps & { onCopy?: () => void }) {
  return (
    <AiCardShell className={className}>
      <AiCardHeader title={title} description={description} eyebrow="Prompt" />
      <AiCardBody>
        {badges?.length ? <div className="mb-3 flex flex-wrap gap-1.5">{badges.map((b) => <AiBadge key={b} variant={b} />)}</div> : null}
        {tags?.length ? <AiTagList tags={tags} /> : null}
      </AiCardBody>
      <AiCardFooter>
        <ViewDetailsButton>Preview</ViewDetailsButton>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition"
        >
          Copy Prompt
        </button>
      </AiCardFooter>
    </AiCardShell>
  );
}

export function TutorialCard({ title, description, image, badges, tags, className, duration }: BaseCardProps & { duration?: string }) {
  return (
    <AiCardShell className={className}>
      <AiCardMedia image={image} alt={title} />
      <AiCardHeader title={title} description={description} eyebrow={duration ? `Tutorial · ${duration}` : "Tutorial"} />
      <AiCardBody>
        {badges?.length ? <div className="mb-2 flex flex-wrap gap-1.5">{badges.map((b) => <AiBadge key={b} variant={b} />)}</div> : null}
        {tags?.length ? <AiTagList tags={tags} /> : null}
      </AiCardBody>
      <AiCardFooter>
        <ViewDetailsButton>Read Tutorial</ViewDetailsButton>
        <span className="text-xs text-muted-foreground inline-flex items-center gap-1">Read <ArrowRight className="h-3 w-3" /></span>
      </AiCardFooter>
    </AiCardShell>
  );
}

export function NewsCard({ title, description, image, className, source, date }: BaseCardProps & { source?: string; date?: string }) {
  return (
    <AiCardShell className={className}>
      <AiCardMedia image={image} alt={title} />
      <AiCardHeader title={title} description={description} eyebrow={[source, date].filter(Boolean).join(" · ") || "News"} />
      <AiCardFooter>
        <ViewDetailsButton>Read Article</ViewDetailsButton>
        <IconActionButton icon={Share2} label="Share" />
      </AiCardFooter>
    </AiCardShell>
  );
}

export function ComparisonCard({ title, description, className, toolA, toolB }: BaseCardProps & { toolA?: string; toolB?: string }) {
  return (
    <AiCardShell className={className}>
      <AiCardHeader title={title} description={description} eyebrow="Comparison" />
      <AiCardBody>
        {toolA && toolB ? (
          <div className="flex items-center justify-between rounded-xl bg-secondary px-4 py-3 text-sm font-semibold">
            <span className="truncate">{toolA}</span>
            <span className="mx-3 text-xs uppercase tracking-wide text-muted-foreground">vs</span>
            <span className="truncate text-right">{toolB}</span>
          </div>
        ) : null}
      </AiCardBody>
      <AiCardFooter>
        <ViewDetailsButton>View Comparison</ViewDetailsButton>
      </AiCardFooter>
    </AiCardShell>
  );
}

export function CollectionCard({ title, description, icon, image, className, count }: BaseCardProps & { count?: number }) {
  return (
    <AiCardShell className={className}>
      {image ? <AiCardMedia image={image} alt={title} /> : null}
      <AiCardHeader icon={icon} title={title} description={description} eyebrow="Collection" />
      <AiCardFooter>
        <ViewDetailsButton>Open Collection</ViewDetailsButton>
        {typeof count === "number" ? <span className="text-xs text-muted-foreground">{count} tools</span> : null}
      </AiCardFooter>
    </AiCardShell>
  );
}

export function MarketplaceCard({ title, description, image, badges, className, price }: BaseCardProps & { price?: string }) {
  return (
    <AiCardShell className={className}>
      <AiCardMedia image={image} alt={title} />
      <AiCardHeader title={title} description={description} eyebrow="Marketplace" />
      <AiCardBody>
        {badges?.length ? <div className="flex flex-wrap gap-1.5">{badges.map((b) => <AiBadge key={b} variant={b} />)}</div> : null}
      </AiCardBody>
      <AiCardFooter>
        <span className="text-sm font-bold text-primary">{price ?? "—"}</span>
        <ViewDetailsButton>View</ViewDetailsButton>
      </AiCardFooter>
    </AiCardShell>
  );
}

export function ResourceCard({ title, description, icon, tags, className }: BaseCardProps) {
  return (
    <AiCardShell className={className}>
      <AiCardHeader icon={icon} title={title} description={description} eyebrow="Resource" />
      <AiCardBody>
        {tags?.length ? <AiTagList tags={tags} /> : null}
      </AiCardBody>
      <AiCardFooter>
        <ViewDetailsButton>Open Resource</ViewDetailsButton>
      </AiCardFooter>
    </AiCardShell>
  );
}

export function ModelCard({ title, description, logo, icon, badges, className, provider, params }: BaseCardProps & { provider?: string; params?: string }) {
  return (
    <AiCardShell className={className}>
      <AiCardHeader icon={icon} logo={logo} title={title} description={description} eyebrow={provider ? `Model · ${provider}` : "Model"} />
      <AiCardBody>
        <div className="flex flex-wrap gap-1.5">
          {params ? <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium">{params}</span> : null}
          {badges?.map((b) => <AiBadge key={b} variant={b} />)}
        </div>
      </AiCardBody>
      <AiCardFooter>
        <ViewDetailsButton>Details</ViewDetailsButton>
      </AiCardFooter>
    </AiCardShell>
  );
}

/* -------------------------------------------------------------------------- */
/*  Loading states                                                            */
/* -------------------------------------------------------------------------- */

export function AiCardSkeleton({ withMedia = false }: { withMedia?: boolean }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      {withMedia ? <Skeleton className="aspect-[16/9] w-full rounded-none" /> : null}
      <div className="flex items-start gap-3 p-5 pb-3">
        <Skeleton className="h-11 w-11 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      </div>
      <div className="px-5 pb-3 space-y-2">
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="flex items-center justify-between border-t border-border/60 bg-secondary/40 px-5 py-3">
        <Skeleton className="h-8 w-24 rounded-md" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  );
}
