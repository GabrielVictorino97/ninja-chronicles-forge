import { createFileRoute, Link } from "@tanstack/react-router";
import { useGameStore } from "@/store/gameStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatBar } from "@/components/game/StatBar";
import { SectionTitle } from "@/components/game/SectionTitle";
import { RankBadge } from "@/components/game/RankBadge";
import { mockMissions } from "@/mocks/missions";
import { mockJutsus } from "@/mocks/jutsus";
import { mockRanking } from "@/mocks/ranking";
import { mockNotifications, mockCharacter } from "@/mocks/character";
import { mockVillages } from "@/mocks/villages";
import { mockBloodlineClans } from "@/mocks/clans";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ScrollText, Sparkles, Trophy, Bell, Coins, Swords } from "lucide-react";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
  head: () => ({ meta: [{ title: "Dashboard — Naruto Players Fan Game" }] }),
});

function DashboardPage() {
  const character = useGameStore((s) => s.character) ?? mockCharacter;
  const village = mockVillages.find((v) => v.id === character.villageId);
  const clan = mockBloodlineClans.find((c) => c.id === character.clanId);
  const equipped = mockJutsus.filter((j) => character.equippedJutsus.includes(j.id));

  return (
    <div className="space-y-6">
      <SectionTitle title="Dashboard" icon={<LayoutDashboard className="size-6 text-primary" />}
        description={`Bem-vindo de volta, ${character.name}.`} />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Character card */}
        <Card className="bg-scroll-paper border-primary/20 shadow-card lg:col-span-2">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row">
            <div className="grid size-24 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 text-5xl shadow-glow-primary ring-2 ring-primary/40">
              {character.avatar}
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-2xl font-black">{character.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {village?.fullName} • Clã {clan?.name} • {character.elements?.[0] ?? "Sem elemento"} • {character.graduation}
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <StatBar label="HP" value={character.hp} max={character.hpMax} tone="hp" />
                <StatBar label="Chakra" value={character.chakra} max={character.chakraMax} tone="chakra" />
                <StatBar label="Energia" value={character.energy} max={character.energyMax} tone="energy" />
                <StatBar label={`XP — Lv ${character.level}`} value={character.xp} max={character.xpToNext} tone="xp" />
              </div>
            </div>
            <div className="flex flex-col items-end justify-between gap-3 sm:w-32">
              <div className="text-right">
                <div className="text-xs uppercase text-muted-foreground">Poder</div>
                <div className="text-2xl font-black text-gradient-primary">{character.power.toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-1.5 rounded-md border border-ryous/30 bg-ryous/10 px-2 py-1 text-sm font-bold text-ryous">
                <Coins className="size-4" /> {character.ryous.toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="size-4 text-accent" /> Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockNotifications.slice(0, 4).map((n) => (
              <div key={n.id} className="rounded-lg border bg-muted/30 px-3 py-2">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>{n.title}</span>
                  <span className="text-[10px] text-muted-foreground">{n.date}</span>
                </div>
                <p className="text-xs text-muted-foreground">{n.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Available missions */}
        <Card className="shadow-card">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2 text-base"><ScrollText className="size-4 text-primary" /> Missões disponíveis</CardTitle>
            <Button asChild size="sm" variant="ghost"><Link to="/missions">Ver todas</Link></Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockMissions.slice(0, 4).map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <RankBadge rank={m.rank} />
                    <span className="truncate text-sm font-medium">{m.title}</span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{m.description}</p>
                </div>
                <span className="ml-2 shrink-0 text-xs font-semibold text-xp">+{m.xpReward} XP</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Equipped jutsus */}
        <Card className="shadow-card">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2 text-base"><Sparkles className="size-4 text-chakra" /> Jutsus equipados</CardTitle>
            <Button asChild size="sm" variant="ghost"><Link to="/jutsus">Gerenciar</Link></Button>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2">
            {equipped.map((j) => (
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
            ))}
          </CardContent>
        </Card>

        {/* Latest battles */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base"><Swords className="size-4 text-hp" /> Últimas batalhas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { foe: "Bandido Errante", result: "Vitória", color: "text-xp" },
              { foe: "Espião de Ame", result: "Vitória", color: "text-xp" },
              { foe: "Caçador de recompensas", result: "Derrota", color: "text-destructive" },
            ].map((b, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2 text-sm">
                <span>{b.foe}</span>
                <span className={`font-semibold ${b.color}`}>{b.result}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Ranking summary */}
        <Card className="shadow-card">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2 text-base"><Trophy className="size-4 text-primary" /> Top 5 ninjas</CardTitle>
            <Button asChild size="sm" variant="ghost"><Link to="/ranking">Ver tudo</Link></Button>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {mockRanking.slice(0, 5).map((p) => (
              <div key={p.position} className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-1.5 text-sm">
                <span className="flex items-center gap-2">
                  <span className="grid size-6 place-items-center rounded-md bg-primary/15 text-xs font-bold text-primary">{p.position}</span>
                  <span className="font-medium">{p.name}</span>
                  <span className="text-[11px] text-muted-foreground">{p.village}</span>
                </span>
                <span className="text-xs font-semibold tabular-nums">{p.power.toLocaleString()}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
