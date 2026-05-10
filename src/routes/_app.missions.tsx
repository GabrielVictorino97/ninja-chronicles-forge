import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/game/SectionTitle";
import { RankBadge } from "@/components/game/RankBadge";
import { mockMissions } from "@/mocks/missions";
import { missionService } from "@/services/missionService";
import { ScrollText, Coins, Zap, Star, Play, Check } from "lucide-react";
import { toast } from "sonner";
import type { Rank } from "@/types";

export const Route = createFileRoute("/_app/missions")({
  component: MissionsPage,
  head: () => ({ meta: [{ title: "Missões — Naruto Players Fan Game" }] }),
});

const RANKS: Rank[] = ["D", "C", "B", "A", "S"];

function MissionsPage() {
  const [filter, setFilter] = useState<Rank | "ALL">("ALL");
  const list = mockMissions.filter((m) => filter === "ALL" || m.rank === filter);

  async function start(id: string, title: string) {
    await missionService.start(id);
    toast.info(`Missão iniciada: ${title}`);
  }
  async function complete(id: string) {
    const r = await missionService.complete(id);
    toast.success(`Missão concluída! +${r.xp} XP, +${r.ryous} ryous`);
  }

  return (
    <div className="space-y-5">
      <SectionTitle title="Missões" icon={<ScrollText className="size-6 text-primary" />}
        description="Aceite contratos para ganhar XP, ryous e itens." />

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant={filter === "ALL" ? "default" : "outline"} onClick={() => setFilter("ALL")}>
          Todas
        </Button>
        {RANKS.map((r) => (
          <Button key={r} size="sm" variant={filter === r ? "default" : "outline"} onClick={() => setFilter(r)}>
            Rank {r}
          </Button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {list.map((m) => (
          <Card key={m.id} className="bg-scroll-paper shadow-card transition hover:border-primary/50">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <RankBadge rank={m.rank} />
                    <h3 className="font-bold leading-tight">{m.title}</h3>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{m.description}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="inline-flex items-center gap-1 rounded bg-energy/10 px-2 py-1 font-semibold text-energy">
                  <Zap className="size-3" /> {m.energyCost} energia
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-xp/10 px-2 py-1 font-semibold text-xp">
                  <Star className="size-3" /> +{m.xpReward} XP
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-ryous/10 px-2 py-1 font-semibold text-ryous">
                  <Coins className="size-3" /> +{m.ryousReward}
                </span>
              </div>
              {m.drops.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  Drops: <span className="text-foreground">{m.drops.join(", ")}</span>
                </div>
              )}
              <div className="text-[11px] text-muted-foreground">
                Requer: {m.requirements.graduation ?? "qualquer graduação"}
                {m.requirements.level ? ` • Lv ${m.requirements.level}+` : ""}
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1" onClick={() => start(m.id, m.title)}>
                  <Play className="size-3.5" /> Iniciar
                </Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => complete(m.id)}>
                  <Check className="size-3.5" /> Concluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
