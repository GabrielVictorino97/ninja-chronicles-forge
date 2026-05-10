import { cn } from "@/lib/utils";
import type { Rank } from "@/types";

const map: Record<Rank, string> = {
  D: "bg-rank-d/20 text-rank-d border-rank-d/40",
  C: "bg-rank-c/20 text-rank-c border-rank-c/40",
  B: "bg-rank-b/20 text-rank-b border-rank-b/40",
  A: "bg-rank-a/20 text-rank-a border-rank-a/40",
  S: "bg-rank-s/20 text-rank-s border-rank-s/40",
};

export function RankBadge({ rank, className }: { rank: Rank; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 min-w-6 items-center justify-center rounded-md border px-2 text-xs font-bold uppercase",
        map[rank],
        className,
      )}
    >
      {rank}
    </span>
  );
}
