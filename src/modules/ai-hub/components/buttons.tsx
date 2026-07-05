import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  Info,
  Bookmark,
  Heart,
  GitCompare,
  Share2,
  Copy,
  BookOpen,
  PlusCircle,
  Flag,
  ArrowRight,
} from "lucide-react";

type IconBtnProps = Omit<ButtonProps, "children"> & { label?: string; children?: ReactNode };

function makeAction(
  Icon: React.ComponentType<{ className?: string }>,
  defaultLabel: string,
  defaultVariant: ButtonProps["variant"] = "outline",
) {
  return function ActionButton({ label, children, variant, size, className, ...rest }: IconBtnProps) {
    return (
      <Button
        type="button"
        variant={variant ?? defaultVariant}
        size={size ?? "sm"}
        className={cn("gap-1.5", className)}
        {...rest}
      >
        <Icon className="h-4 w-4" aria-hidden />
        <span>{children ?? label ?? defaultLabel}</span>
      </Button>
    );
  };
}

export const VisitWebsiteButton = ({ href, ...rest }: IconBtnProps & { href?: string }) => (
  <Button
    asChild={!!href}
    type="button"
    variant="default"
    size="sm"
    className={cn("gap-1.5", rest.className)}
  >
    {href ? (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Visit website (opens in new tab)">
        <ExternalLink className="h-4 w-4" aria-hidden />
        {rest.children ?? "Visit Website"}
      </a>
    ) : (
      <span className="inline-flex items-center gap-1.5">
        <ExternalLink className="h-4 w-4" aria-hidden />
        {rest.children ?? "Visit Website"}
      </span>
    )}
  </Button>
);

export const ViewDetailsButton = makeAction(Info, "View Details", "outline");
export const BookmarkButton = makeAction(Bookmark, "Bookmark", "ghost");
export const FavoriteButton = makeAction(Heart, "Favorite", "ghost");
export const CompareButton = makeAction(GitCompare, "Compare", "outline");
export const ShareButton = makeAction(Share2, "Share", "ghost");
export const CopyPromptButton = makeAction(Copy, "Copy Prompt", "secondary");
export const ReadMoreButton = makeAction(ArrowRight, "Read More", "link");
export const SuggestToolButton = makeAction(PlusCircle, "Suggest Tool", "outline");
export const ReportLinkButton = makeAction(Flag, "Report Link", "ghost");
export const ExploreCategoryButton = makeAction(BookOpen, "Explore Category", "secondary");

/** Icon-only variant of any of the above, for compact card headers. */
export function IconActionButton({
  icon: Icon,
  label,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "inline-grid h-8 w-8 place-items-center rounded-full border border-border bg-background/70 text-muted-foreground",
        "transition hover:text-primary hover:border-primary/40 hover:-translate-y-0.5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...rest}
    >
      <Icon className="h-4 w-4" aria-hidden />
    </button>
  );
}
