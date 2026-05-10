import { cn } from "@/lib/utils";

type Tone = "hp" | "chakra" | "energy" | "xp";

const toneClass: Record<Tone, string> = {
  hp: "bg-hp",
  chakra: "bg-chakra",
  energy: "bg-energy",
  xp: "bg-xp",
};

export function StatBar({
  label,
  value,
  max,
  tone,
  showValue = true,
  className,
}: {
  label?: string;
  value: number;
  max: number;
  tone: Tone;
  showValue?: boolean;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium">{label}</span>
          {showValue && (
            <span className="tabular-nums">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", toneClass[tone])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
