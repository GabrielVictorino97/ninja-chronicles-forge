import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/game/SectionTitle";
import { StatBar } from "@/components/game/StatBar";
import { battleService } from "@/services/battleService";
import { mockJutsus } from "@/mocks/jutsus";
import { useGameStore } from "@/store/gameStore";
import { mockCharacter } from "@/mocks/character";
import type { Battle } from "@/types";
import { Swords, Shield, FlaskConical, DoorOpen, Sparkles, RefreshCcw } from "lucide-react";

export const Route = createFileRoute("/_app/battle")({
  component: BattlePage,
  head: () => ({ meta: [{ title: "Batalha — Naruto Players Fan Game" }] }),
});

function BattlePage() {
  const character = useGameStore((s) => s.character) ?? mockCharacter;
  const [battle, setBattle] = useState<Battle | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const equipped = mockJutsus.filter((j) => character.equippedJutsus.includes(j.id));

  useEffect(() => { battleService.start().then(setBattle); }, []);
  useEffect(() => { logRef.current?.scrollTo({ top: 9999, behavior: "smooth" }); }, [battle]);

  if (!battle) return <div className="grid h-72 place-items-center text-muted-foreground">Carregando arena...</div>;

  function act(action: "basic" | "defend" | "item" | "flee" | "jutsu", name?: string) {
    setBattle((b) => (b ? battleService.simulateAction(b, action, name) : b));
  }
  async function reset() { setBattle(await battleService.start()); }

  return (
    <div className="space-y-5">
      <SectionTitle title="Arena" icon={<Swords className="size-6 text-hp" />}
        description="Batalha por turnos simulada — o backend C# será autoritativo." />

      <div className="grid gap-3 md:grid-cols-2">
        <FighterCard side="player" name={battle.player.name} avatar={battle.player.avatar}
          hp={battle.player.hp} hpMax={battle.player.hpMax}
          chakra={battle.player.chakra} chakraMax={battle.player.chakraMax}
          level={battle.player.level} />
        <FighterCard side="enemy" name={battle.enemy.name} avatar={battle.enemy.avatar}
          hp={battle.enemy.hp} hpMax={battle.enemy.hpMax}
          chakra={battle.enemy.chakra} chakraMax={battle.enemy.chakraMax}
          level={battle.enemy.level} />
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-card">
          <CardContent className="space-y-3 p-4">
            <div className="text-xs uppercase text-muted-foreground">Ações — Turno {battle.turn}</div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Button onClick={() => act("basic")} disabled={battle.status !== "ongoing"}><Swords className="size-4" /> Atacar</Button>
              <Button variant="outline" onClick={() => act("defend")} disabled={battle.status !== "ongoing"}><Shield className="size-4" /> Defender</Button>
              <Button variant="outline" onClick={() => act("item")} disabled={battle.status !== "ongoing"}><FlaskConical className="size-4" /> Item</Button>
              <Button variant="ghost" onClick={() => act("flee")} disabled={battle.status !== "ongoing"}><DoorOpen className="size-4" /> Fugir</Button>
            </div>
            <div className="text-xs uppercase text-muted-foreground pt-2">Jutsus equipados</div>
            <div className="grid gap-2 sm:grid-cols-2">
              {equipped.map((j) => (
                <Button key={j.id} variant="secondary" className="justify-start"
                  disabled={battle.status !== "ongoing" || battle.player.chakra < j.chakraCost}
                  onClick={() => act("jutsu", j.name)}>
                  <Sparkles className="size-4 text-chakra" />
                  <span className="flex-1 text-left">{j.name}</span>
                  <span className="text-[10px] text-muted-foreground">{j.chakraCost} ck</span>
                </Button>
              ))}
            </div>
            {battle.status !== "ongoing" && (
              <div className="rounded-lg border border-primary/30 bg-primary/10 p-3 text-center">
                <div className="text-sm font-bold uppercase text-primary">
                  {battle.status === "victory" ? "Vitória!" : battle.status === "defeat" ? "Derrota..." : "Você fugiu"}
                </div>
                <Button size="sm" className="mt-2" onClick={reset}><RefreshCcw className="size-4" /> Nova batalha</Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-3">
            <div className="mb-2 text-xs uppercase text-muted-foreground">Log da batalha</div>
            <div ref={logRef} className="scroll-thin h-72 space-y-1 overflow-y-auto pr-2 text-xs">
              {battle.log.map((l) => (
                <div key={l.id} className={
                  l.actor === "player" ? "text-foreground" :
                  l.actor === "enemy" ? "text-destructive" : "text-muted-foreground italic"
                }>
                  <span className="text-[10px] tabular-nums text-muted-foreground">[T{l.turn}]</span> {l.message}
                  {typeof l.damage === "number" && (
                    <span className={`ml-1 font-bold ${l.damage < 0 ? "text-xp" : "text-hp"}`}>
                      {l.damage < 0 ? `+${-l.damage}` : `-${l.damage}`}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FighterCard({ side, name, avatar, hp, hpMax, chakra, chakraMax, level }: {
  side: "player" | "enemy"; name: string; avatar: string;
  hp: number; hpMax: number; chakra: number; chakraMax: number; level: number;
}) {
  return (
    <Card className={`bg-scroll-paper shadow-card ${side === "enemy" ? "border-destructive/30" : "border-primary/30"}`}>
      <CardContent className="flex items-center gap-4 p-4">
        <div className={`grid size-20 place-items-center rounded-2xl text-4xl ring-2 ${side === "enemy" ? "bg-destructive/20 ring-destructive/40" : "bg-primary/20 ring-primary/40"}`}>
          {avatar}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold">{name}</span>
            <span className="text-xs text-muted-foreground">Lv {level}</span>
          </div>
          <StatBar value={hp} max={hpMax} tone="hp" label="HP" />
          <StatBar value={chakra} max={chakraMax} tone="chakra" label="Chakra" />
        </div>
      </CardContent>
    </Card>
  );
}
