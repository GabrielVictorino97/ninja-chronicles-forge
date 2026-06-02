import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/game/SectionTitle";
import { StatBar } from "@/components/game/StatBar";
import { huntService } from "@/services/huntService";
import { useGameStore } from "@/store/gameStore";
import { characterService } from "@/services/characterService";
import type { HuntStatus } from "@/types";
import { Crosshair, Coins, Star, Timer, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/hunt")({
  component: HuntPage,
  head: () => ({ meta: [{ title: "Caçada — Naruto Players Fan Game" }] }),
});

function HuntPage() {
  const character = useGameStore((s) => s.character);
  const setCharacter = useGameStore((s) => s.setCharacter);
  const [status, setStatus] = useState<HuntStatus | null>(null);
  const [duration, setDuration] = useState<number>(5);
  const [now, setNow] = useState(Date.now());
  const [busy, setBusy] = useState(false);

  async function refresh() {
    if (!character) return;
    try {
      const s = await huntService.status(character.id);
      setStatus(s);
      if (s.availableDurations.length && !s.availableDurations.includes(duration)) {
        setDuration(s.availableDurations[0]);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao carregar caçada");
    }
  }

  useEffect(() => {
    refresh(); /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [character?.id]);
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!character) return null;

  const remaining = status?.active
    ? Math.max(0, Math.floor((new Date(status.endTime).getTime() - now) / 1000))
    : 0;
  const totalSec = status?.active ? status.durationMinutes * 60 : 0;
  const elapsedPct = totalSec ? ((totalSec - remaining) / totalSec) * 100 : 0;

  async function start() {
    if (!character) return;
    setBusy(true);
    try {
      await huntService.start(character.id, duration);
      toast.success(`Caçada iniciada (${duration} min).`);
      const updated = await characterService.get();
      setCharacter(updated);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao iniciar caçada");
    } finally {
      setBusy(false);
    }
  }

  async function complete() {
    if (!character) return;
    setBusy(true);
    try {
      const r = await huntService.complete(character.id);
      const updated = await characterService.get();
      setCharacter(updated);
      toast.success(`Caçada concluída! +${r.xp} XP, +${r.ryous} ryous`);
      if (r.leveledUp || (updated?.level ?? 0) > character.level) {
        toast.success(`Subiu de nível! Agora você é nível ${updated?.level}.`);
      }
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao concluir caçada");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <SectionTitle
        title="Caçada"
        icon={<Crosshair className="size-6 text-primary" />}
        description="Envie seu ninja em uma caçada por XP e ryous. Caçadas mais curtas pagam mais por minuto."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-card">
          <CardContent className="space-y-4 p-5">
            {!status ? (
              <div className="grid h-40 place-items-center text-muted-foreground">
                <Loader2 className="size-6 animate-spin" />
              </div>
            ) : status.active && remaining > 0 ? (
              <>
                <div className="text-sm uppercase text-muted-foreground">Caçada em andamento</div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold tabular-nums">
                    {Math.floor(remaining / 60)}min {(remaining % 60).toString().padStart(2, "0")}s
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Nível da caçada: {status.huntLevel}
                  </div>
                </div>
                <StatBar value={Math.floor(elapsedPct)} max={100} tone="xp" showValue={false} />
                <div className="grid grid-cols-2 gap-3 pt-2 text-sm">
                  <Reward
                    icon={<Star className="size-4 text-xp" />}
                    label="XP"
                    value={status.xpReward}
                  />
                  <Reward
                    icon={<Coins className="size-4 text-ryous" />}
                    label="Ryous"
                    value={status.ryousReward}
                  />
                </div>
                <Button disabled className="w-full">
                  <Timer className="size-4" /> Aguardando término
                </Button>
              </>
            ) : status.active && remaining === 0 ? (
              <>
                <div className="text-sm uppercase text-muted-foreground">Caçada concluída</div>
                <div className="text-base">Sua caçada terminou. Resgate as recompensas!</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Reward
                    icon={<Star className="size-4 text-xp" />}
                    label="XP"
                    value={status.xpReward}
                  />
                  <Reward
                    icon={<Coins className="size-4 text-ryous" />}
                    label="Ryous"
                    value={status.ryousReward}
                  />
                </div>
                <Button onClick={complete} disabled={busy} className="w-full">
                  Resgatar recompensas
                </Button>
              </>
            ) : (
              <>
                <div className="text-sm uppercase text-muted-foreground">Iniciar nova caçada</div>
                {status.availableDurations.length === 0 ? (
                  <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm">
                    Limite diário de caçadas atingido. Volte amanhã.
                  </div>
                ) : (
                  <>
                    <div className="text-xs text-muted-foreground">
                      Custo: 10 de energia • Energia atual: {character.energy}/{character.energyMax}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {status.availableDurations.map((d) => (
                        <Button
                          key={d}
                          size="sm"
                          variant={duration === d ? "default" : "outline"}
                          onClick={() => setDuration(d)}
                        >
                          {d} min
                        </Button>
                      ))}
                    </div>
                    <Button
                      onClick={start}
                      disabled={busy || character.energy < 10}
                      className="w-full"
                    >
                      <Crosshair className="size-4" /> Iniciar caçada
                    </Button>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="space-y-3 p-5 text-sm">
            <div className="text-xs uppercase text-muted-foreground">Resumo do dia</div>
            <Row label="Caçadas usadas" value={status ? `${status.todayHuntsUsed}/10` : "—"} />
            <Row
              label="Caçadas restantes"
              value={status ? String(status.todayHuntsRemaining) : "—"}
            />
            <Row
              label="Tempo disponível hoje"
              value={status ? `${status.totalAvailableMinutes} min` : "—"}
            />
            <div className="pt-3 text-xs text-muted-foreground">
              Bônus: 5min +50%, 10min +30%, 15min +15%, 20min +5%.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Reward({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border/60 bg-background/50 px-3 py-2">
      {icon}
      <span className="text-xs uppercase text-muted-foreground">{label}</span>
      <span className="ml-auto font-bold tabular-nums">{value}</span>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-bold tabular-nums">{value}</span>
    </div>
  );
}
