import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/game/SectionTitle";
import { rankingService } from "@/services/rankingService";
import type { RankingPlayer } from "@/types";
import { Trophy, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_app/ranking")({
  component: RankingPage,
  head: () => ({ meta: [{ title: "Ranking — Naruto Players Fan Game" }] }),
});

const TABS = ["Jogadores", "Clãs", "Arena", "Missões", "Poder total"] as const;

function RankingPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Jogadores");
  const [ranking, setRanking] = useState<RankingPlayer[] | null>(null);

  useEffect(() => {
    rankingService
      .list()
      .then(setRanking)
      .catch(() => setRanking([]));
  }, []);

  return (
    <div className="space-y-5">
      <SectionTitle
        title="Ranking"
        icon={<Trophy className="size-6 text-primary" />}
        description="Os shinobis mais poderosos do mundo."
      />
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Button
            key={t}
            size="sm"
            variant={tab === t ? "default" : "outline"}
            onClick={() => setTab(t)}
          >
            {t}
          </Button>
        ))}
      </div>
      <Card className="shadow-card">
        <CardContent className="p-0">
          {!ranking ? (
            <div className="grid h-40 place-items-center text-muted-foreground">
              <Loader2 className="size-6 animate-spin" />
            </div>
          ) : ranking.length === 0 ? (
            <div className="rounded-xl py-12 text-center text-muted-foreground">
              Nenhum jogador no ranking.
            </div>
          ) : (
            <div className="scroll-thin overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/40 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 text-left">#</th>
                    <th className="px-3 py-2 text-left">Nome</th>
                    <th className="px-3 py-2 text-left">Vila</th>
                    <th className="px-3 py-2 text-left">Clã</th>
                    <th className="px-3 py-2 text-right">Lv</th>
                    <th className="px-3 py-2 text-left">Graduação</th>
                    <th className="px-3 py-2 text-right">Poder</th>
                    <th className="px-3 py-2 text-right">Vitórias</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.map((p) => (
                    <tr key={p.position} className="border-b hover:bg-muted/30">
                      <td className="px-3 py-2 font-bold text-primary">{p.position}</td>
                      <td className="px-3 py-2 font-semibold">{p.name}</td>
                      <td className="px-3 py-2 text-muted-foreground">{p.village}</td>
                      <td className="px-3 py-2 text-muted-foreground">{p.clan}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{p.level}</td>
                      <td className="px-3 py-2 text-xs">{p.graduation}</td>
                      <td className="px-3 py-2 text-right font-bold tabular-nums">
                        {p.power.toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums text-xp">{p.wins}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
