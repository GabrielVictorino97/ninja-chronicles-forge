import { cn } from "@/lib/utils";
import type { ItemRarity } from "@/types";

const map: Record<ItemRarity, string> = {
  common: "bg-muted text-muted-foreground border-border",
  uncommon: "bg-xp/15 text-xp border-xp/30",
  rare: "bg-chakra/15 text-chakra border-chakra/30",
  epic: "bg-accent/15 text-accent border-accent/30",
  legendary: "bg-primary/15 text-primary border-primary/30",
};

const labels: Record<ItemRarity, string> = {
  common: "Comum", uncommon: "Incomum", rare: "Rara", epic: "Épica", legendary: "Lendária",
};

export function RarityBadge({ rarity }: { rarity: ItemRarity }) {
  return (
    <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", map[rarity])}>
      {labels[rarity]}
    </span>
  );
}
