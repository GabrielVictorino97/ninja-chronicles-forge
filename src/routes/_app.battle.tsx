import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionTitle } from "@/components/game/SectionTitle";
import { useGameStore } from "@/store/gameStore";
import { characterService } from "@/services/characterService";
import { npcBattle, pvpBattle, type BattleResult, type Difficulty } from "@/services/battleService";
import { Swords, Users, Loader2, Trophy, Skull } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/battle")({
  component: BattlePage,
  head: () => ({ meta: [{ title: "Batalha — Naruto Players Fan Game" }] }),
});

function BattlePage() {
  const character = useGameStore((s) => s.character);
  const setCharacter = useGameStore((s) => s.setCharacter);
  const [tab, setTab] = useState<"npc" | "pvp">("npc");
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [target, setTarget] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<BattleResult | null>(null);

  if (!character) return null;

  async function fight() {
    if (!character) return;
    setBusy(true);
    setResult(null);
    try {
      const r = tab === "npc"
        ? await npcBattle(character.id, difficulty)
        : await pvpBattle(character.id, target.trim());
      setResult(r);
      const prevLevel = character.level;
      const updated = await characterService.get();
      setCharacter(updated);
      if (r.result === "Vitoria") {
        toast.success(`Vitória contra ${r.enemyName}! +${r.xpReward} XP, +${r.ryousReward} ryous`);
        if (r.leveledUp || (updated?.level ?? 0) > prevLevel) {
          toast.success(`Subiu de nível! Agora você é nível ${updated?.level}.`);
        }
      } else {
        toast.error(`Derrota para ${r.enemyName}. ${r.ryousReward} ryous`);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha na batalha");
    } finally { setBusy(false); }
  }

  return (
    <div className="space-y-5">
      <SectionTitle
        title="Arena"
        icon={<Swords className="size-6 text-hp" />}
        description="Batalhas instantâneas — o backend resolve combate baseado em poder, atributos, jutsus e itens."
      />

      <div className="flex gap-2">
        <Button variant={tab === "npc" ? "default" : "outline"} onClick={() => setTab("npc")}>
          <Swords className="size-4" /> NPC
        </Button>
        <Button variant={tab === "pvp" ? "default" : "outline"} onClick={() => setTab("pvp")}>
          <Users className="size-4" /> PvP
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardContent className="space-y-4 p-5">
            {tab === "npc" ? (
              <>
                <div className="text-sm uppercase text-muted-foreground">Dificuldade</div>
                <div className="grid grid-cols-3 gap-2">
                  {(["easy", "normal", "hard"] as Difficulty[]).map((d) => (
                    <Button
                      key={d}
                      size="sm"
                      variant={difficulty === d ? "default" : "outline"}
                      onClick={() => setDifficulty(d)}
                    >
                      {d === "easy" ? "Fácil" : d === "normal" ? "Normal" : "Difícil"}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Fácil: nível -1 a -10. Normal: ±3. Difícil: +1 a +10. Recompensas escalam com a dificuldade.
                </p>
                <Button onClick={fight} disabled={busy} className="w-full">
                  {busy ? <Loader2 className="size-4 animate-spin" /> : <Swords className="size-4" />}
                  Batalhar contra NPC
                </Button>
              </>
            ) : (
              <>
                <div className="text-sm uppercase text-muted-foreground">Alvo PvP</div>
                <Input
                  placeholder="Nome do personagem"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Ataca outro jogador. Vitória/derrota é decidida pelo poder de combate de ambos.
                </p>
                <Button onClick={fight} disabled={busy || target.trim().length < 2} className="w-full">
                  {busy ? <Loader2 className="size-4 animate-spin" /> : <Users className="size-4" />}
                  Atacar jogador
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="space-y-3 p-5 text-sm">
            <div className="text-xs uppercase text-muted-foreground">Resultado</div>
            {!result ? (
              <div className="grid h-40 place-items-center text-muted-foreground">
                Nenhum combate ainda
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  {result.result === "Vitoria"
                    ? <Trophy className="size-5 text-primary" />
                    : <Skull className="size-5 text-destructive" />}
                  <span className="text-lg font-bold">
                    {result.result === "Vitoria" ? "Vitória" : "Derrota"}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">{result.difficulty}</span>
                </div>
                <Row label="Inimigo" value={`${result.enemyName} (Lv ${result.enemyLevel})`} />
                <Row label="Seu poder" value={result.playerPower.toLocaleString()} />
                <Row label="Poder inimigo" value={result.enemyPower.toLocaleString()} />
                <Row label="Comparação" value={result.powerComparison} />
                <Row label="XP" value={result.xpReward >= 0 ? `+${result.xpReward}` : String(result.xpReward)} />
                <Row label="Ryous" value={result.ryousReward >= 0 ? `+${result.ryousReward}` : String(result.ryousReward)} />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 pb-1 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-bold tabular-nums">{value}</span>
    </div>
  );
}