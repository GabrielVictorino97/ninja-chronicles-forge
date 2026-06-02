import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/game/SectionTitle";
import { useGameStore } from "@/store/gameStore";
import { jutsuService } from "@/services/jutsuService";
import type { CharacterJutsuDto } from "@/services/jutsuService";
import { Sparkles, BookOpen, Plus, Minus, Lock, Swords, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Jutsu } from "@/types";

export const Route = createFileRoute("/_app/jutsus")({
  component: JutsusPage,
  head: () => ({ meta: [{ title: "Jutsus — Naruto Players Fan Game" }] }),
});

const MAX_EQUIPPED = 5;

function JutsusPage() {
  const character = useGameStore((s) => s.character);
  const patch = useGameStore((s) => s.patchCharacter);

  const [allJutsus, setAllJutsus] = useState<Jutsu[]>([]);
  const [myJutsus, setMyJutsus] = useState<CharacterJutsuDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!character) {
      setLoading(false);
      return;
    }
    Promise.all([jutsuService.list(), jutsuService.myJutsus(character.id)])
      .then(([all, mine]) => {
        setAllJutsus(all);
        setMyJutsus(mine);
      })
      .catch(() => {
        setAllJutsus([]);
        setMyJutsus([]);
      })
      .finally(() => setLoading(false));
  }, [character?.id]);

  const learnedIds = new Set(myJutsus.map((j) => j.id));
  const equippedIds = new Set(myJutsus.filter((j) => j.equipped).map((j) => j.id));

  const equippedJutsus = allJutsus.filter((j) => equippedIds.has(j.id));
  const knownNotEquipped = allJutsus.filter((j) => learnedIds.has(j.id) && !equippedIds.has(j.id));
  const learnable = allJutsus.filter((j) => !learnedIds.has(j.id));

  async function learn(j: Jutsu) {
    if (!character) return;
    try {
      await jutsuService.learn(character.id, j.id);
      const updated = await jutsuService.myJutsus(character.id);
      setMyJutsus(updated);
      patch({ knownJutsus: [...character.knownJutsus, j.id] });
      toast.success(`${j.name} aprendido!`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao aprender jutsu");
    }
  }

  async function equipJutsu(id: string) {
    if (!character) return;
    if (equippedIds.has(id)) return;
    if (equippedIds.size >= MAX_EQUIPPED) {
      toast.error(`Você já equipou o máximo de ${MAX_EQUIPPED} jutsus.`);
      return;
    }
    try {
      await jutsuService.equip(character.id, id);
      const updated = await jutsuService.myJutsus(character.id);
      setMyJutsus(updated);
      toast.success("Jutsu equipado!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao equipar");
    }
  }

  async function unequipJutsu(id: string) {
    if (!character) return;
    if (equippedIds.size <= 1) {
      toast.error("Você precisa manter pelo menos 1 jutsu equipado.");
      return;
    }
    try {
      await jutsuService.unequip(character.id, id);
      const updated = await jutsuService.myJutsus(character.id);
      setMyJutsus(updated);
      toast.info("Jutsu desequipado.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao desequipar");
    }
  }

  if (!character) return null;
  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <div className="space-y-5">
      <SectionTitle
        title="Jutsus"
        icon={<Sparkles className="size-6 text-chakra" />}
        description={`Equipe entre 1 e ${MAX_EQUIPPED} jutsus para batalha. Aprenda novos respeitando seu nível atual (Lv ${character.level}).`}
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        {/* Equipped column */}
        <Card className="bg-scroll-paper shadow-card border-primary/30">
          <CardContent className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-bold">
                <Swords className="size-4 text-primary" />
                Equipados
              </h2>
              <span className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-bold text-primary">
                {equippedJutsus.length}/{MAX_EQUIPPED}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Esses jutsus estarão disponíveis na arena. Você pode usar de 1 até {MAX_EQUIPPED}.
            </p>
            <div className="space-y-2">
              {equippedJutsus.length === 0 && (
                <div className="rounded-md border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                  Nenhum jutsu equipado.
                </div>
              )}
              {equippedJutsus.map((j) => (
                <JutsuRow
                  key={j.id}
                  j={j}
                  action={
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => unequipJutsu(j.id)}
                      disabled={equippedJutsus.length <= 1}
                    >
                      <Minus className="size-3.5" /> Desequipar
                    </Button>
                  }
                />
              ))}
              {Array.from({ length: MAX_EQUIPPED - equippedJutsus.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="flex h-14 items-center justify-center rounded-md border border-dashed border-border/60 text-[11px] text-muted-foreground"
                >
                  Slot {equippedJutsus.length + i + 1} vazio
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Library column */}
        <div className="space-y-4">
          <Card className="shadow-card">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-bold">
                  <Sparkles className="size-4 text-chakra" />
                  Aprendidos ({knownNotEquipped.length})
                </h2>
                <span className="text-[11px] text-muted-foreground">Pronto para equipar</span>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {knownNotEquipped.length === 0 && (
                  <div className="md:col-span-2 rounded-md border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                    Todos os jutsus aprendidos estão equipados.
                  </div>
                )}
                {knownNotEquipped.map((j) => {
                  const full = character.equippedJutsus.length >= MAX_EQUIPPED;
                  return (
                    <JutsuRow
                      key={j.id}
                      j={j}
                      action={
                        <Button size="sm" onClick={() => equipJutsu(j.id)} disabled={full}>
                          <Plus className="size-3.5" /> {full ? "Cheio" : "Equipar"}
                        </Button>
                      }
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-bold">
                  <BookOpen className="size-4 text-accent" />
                  Disponíveis para aprender ({learnable.length})
                </h2>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {learnable.map((j) => {
                  const locked = j.requirements.level > character.level;
                  return (
                    <JutsuRow
                      key={j.id}
                      j={j}
                      locked={locked}
                      action={
                        <Button
                          size="sm"
                          variant={locked ? "outline" : "default"}
                          onClick={() => learn(j)}
                          disabled={locked}
                        >
                          {locked ? (
                            <Lock className="size-3.5" />
                          ) : (
                            <BookOpen className="size-3.5" />
                          )}
                          {locked ? `Lv ${j.requirements.level}` : "Aprender"}
                        </Button>
                      }
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function JutsuRow({ j, action, locked }: { j: Jutsu; action: React.ReactNode; locked?: boolean }) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-lg border bg-muted/30 p-3 sm:flex-row sm:items-center ${
        locked ? "opacity-60" : ""
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-sm font-bold">{j.name}</h3>
          <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold">
            Lv {j.requirements.level}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground">
          {j.type}
          {j.element ? ` • ${j.element}` : ""}
        </p>
        <div className="mt-1 flex flex-wrap gap-1 text-[10px]">
          <span className="rounded bg-chakra/10 px-1.5 py-0.5 text-chakra">CK {j.chakraCost}</span>
          <span className="rounded bg-muted px-1.5 py-0.5">CD {j.cooldown}</span>
          <span className="rounded bg-hp/10 px-1.5 py-0.5 text-hp">DMG {j.baseDamage}</span>
        </div>
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}
