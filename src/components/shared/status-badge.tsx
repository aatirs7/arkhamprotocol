import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-muted/20 text-muted",
  in_progress: "bg-accent/20 text-accent",
  done: "bg-success/20 text-success",
  active: "bg-accent/20 text-accent",
  paused: "bg-warning/20 text-warning",
  completed: "bg-success/20 text-success",
  archived: "bg-muted/20 text-muted",
  abandoned: "bg-danger/20 text-danger",
  low: "bg-muted/20 text-muted",
  medium: "bg-accent/20 text-accent",
  high: "bg-warning/20 text-warning",
  critical: "bg-danger/20 text-danger",
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize",
        STATUS_STYLES[status] ?? "bg-muted/20 text-muted",
        className
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
