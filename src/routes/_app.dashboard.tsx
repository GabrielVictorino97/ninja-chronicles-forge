import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { useGameStore } from "@/store/gameStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatBar } from "@/components/game/StatBar";
import { SectionTitle } from "@/components/game/SectionTitle";
import { RankBadge } from "@/components/game/RankBadge";
import { missionService } from "@/services/missionService";
import { jutsuService } from "@/services/jutsuService";
import type { CharacterJutsuDto } from "@/services/jutsuService";
import { rankingService } from "@/services/rankingService";
import { characterService } from "@/services/characterService";
import type { Mission, RankingPlayer, Village, BloodlineClan } from "@/types";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ScrollText,
  Sparkles,
  Trophy,
  Bell,
  Coins,
  Swords,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
  head: () => ({ meta: [{ title: "Dashboard — Naruto Players Fan Game" }] }),
});

function DashboardPage() {
  const character = useGameStore((s) => s.character);
  const [missions, setMissions] = useState<Mission[] | null>(null);
  const [equipped, setEquipped] = useState<CharacterJutsuDto[] | null>(null);
  const [ranking, setRanking] = useState<RankingPlayer[] | null>(null);
  const [villages, setVillages] = useState<Village[]>([]);
  const [clans, setClans] = useState<BloodlineClan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!character) return;
    Promise.all([
      missionService.list(),
      jutsuService.myJutsus(character.id),
      rankingService.list(),
      characterService.listVillages(),
      characterService.listBloodlineClans(),
    ])
      .then(([m, j, r, v, c]) => {
        setMissions(m);
        setEquipped(j.filter((x) => x.equipped));
        setRanking(r);
        setVillages(v);
        setClans(c);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [character?.id]);

  const village = useMemo(
    () => villages.find((v) => v.id === character?.villageId),
    [villages, character?.villageId],
  );
  const clan = useMemo(
    () => clans.find((c) => c.id === character?.clanId),
    [clans, character?.clanId],
  );

  if (!character) return null;

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Dashboard"
        icon={<LayoutDashboard className="size-6 text-primary" />}
        description={`Bem-vindo de volta, ${character.name}.`}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="bg-scroll-paper border-primary/20 shadow-card lg:col-span-2">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row">
            <div className="grid size-24 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 text-5xl shadow-glow-primary ring-2 ring-primary/40">
              {character.avatar}
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-2xl font-black">{character.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {village?.fullName ?? "Sem vila"} • Clã {clan?.name ?? "Nenhum"} •{" "}
                  {character.elements?.[0] ?? "Sem elemento"} • {character.graduation}
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <StatBar label="HP" value={character.hp} max={character.hpMax} tone="hp" />
                <StatBar
                  label="Chakra"
                  value={character.chakra}
                  max={character.chakraMax}
                  tone="chakra"
                />
                <StatBar
                  label="Energia"
                  value={character.energy}
                  max={character.energyMax}
                  tone="energy"
                />
                <StatBar
                  label={`XP — Lv ${character.level}`}
                  value={character.xp}
                  max={character.xpToNext}
                  tone="xp"
                />
              </div>
            </div>
            <div className="flex flex-col items-end justify-between gap-3 sm:w-32">
              <div className="text-right">
                <div className="text-xs uppercase text-muted-foreground">Poder</div>
                <div className="text-2xl font-black text-gradient-primary">
                  {character.power.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-1.5 rounded-md border border-ryous/30 bg-ryous/10 px-2 py-1 text-sm font-bold text-ryous">
                <Coins className="size-4" /> {character.ryous.toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="size-4 text-accent" /> Notificações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-dashed py-10 text-center text-xs text-muted-foreground">
              Nenhuma notificação no momento.
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <ScrollText className="size-4 text-primary" /> Missões disponíveis
            </CardTitle>
            <Button asChild size="sm" variant="ghost">
              <Link to="/missions">Ver todas</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? (
              <div className="grid h-32 place-items-center">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : missions && missions.length > 0 ? (
              missions.slice(0, 4).map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <RankBadge rank={m.rank} />
                      <span className="truncate text-sm font-medium">{m.title}</span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{m.description}</p>
                  </div>
                  <span className="ml-2 shrink-0 text-xs font-semibold text-xp">
                    +{m.xpReward} XP
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-muted-foreground">
                Nenhuma missão disponível.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="size-4 text-chakra" /> Jutsus equipados
            </CardTitle>
            <Button asChild size="sm" variant="ghost">
              <Link to="/jutsus">Gerenciar</Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2">
            {loading ? (
              <div className="col-span-full grid h-32 place-items-center">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : equipped && equipped.length > 0 ? (
              equipped.map((j) => (
                <div key={j.id} className="rounded-lg border bg-muted/30 px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{j.name}</span>
                    <span className="text-[10px] text-muted-foreground">{j.type}</span>
                  </div>
                  <div className="mt-1 flex gap-2 text-[11px] text-muted-foreground">
                    <span>Chakra {j.chakraCost}</span>
                    <span>Dano {j.baseDamage}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-xs text-muted-foreground">
                Nenhum jutsu equipado.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Swords className="size-4 text-hp" /> Últimas batalhas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-dashed py-10 text-center text-xs text-muted-foreground">
              Histórico de batalhas estará disponível em breve.
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="size-4 text-primary" /> Top 5 ninjas
            </CardTitle>
            <Button asChild size="sm" variant="ghost">
              <Link to="/ranking">Ver tudo</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {loading ? (
              <div className="grid h-32 place-items-center">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : ranking && ranking.length > 0 ? (
              ranking.slice(0, 5).map((p) => (
                <div
                  key={p.position}
                  className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-1.5 text-sm"
                >
                  <span className="flex items-center gap-2">
                    <span className="grid size-6 place-items-center rounded-md bg-primary/15 text-xs font-bold text-primary">
                      {p.position}
                    </span>
                    <span className="font-medium">{p.name}</span>
                    <span className="text-[11px] text-muted-foreground">{p.village}</span>
                  </span>
                  <span className="text-xs font-semibold tabular-nums">
                    {p.power.toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-muted-foreground">
                Ranking indisponível.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
