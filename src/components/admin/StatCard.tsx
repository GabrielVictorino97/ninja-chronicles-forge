import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label, value, icon: Icon, trend, accent = "primary",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  accent?: "primary" | "success" | "warning" | "destructive" | "info";
}) {
  const tones: Record<string, string> = {
    primary: "from-primary/20 to-primary/5 text-primary",
    success: "from-emerald-500/20 to-emerald-500/5 text-emerald-400",
    warning: "from-amber-500/20 to-amber-500/5 text-amber-400",
    destructive: "from-rose-500/20 to-rose-500/5 text-rose-400",
    info: "from-sky-500/20 to-sky-500/5 text-sky-400",
  };
  return (
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-2 hover:border-primary/40 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
        <div className={cn("h-9 w-9 rounded-lg bg-gradient-to-br grid place-items-center", tones[accent])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {trend && <div className="text-xs text-muted-foreground">{trend}</div>}
    </div>
  );
}