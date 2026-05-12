import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/game/SectionTitle";
import { characterService } from "@/services/characterService";
import { useGameStore } from "@/store/gameStore";
import type { ElementOption } from "@/types";
import { Flame, Droplets, Mountain, Wind, Zap, Loader2, CheckCircle2, Lock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/elements")({
  component: ElementsPage,
  head: () => ({ meta: [{ title: "Elementos — Naruto Players Fan Game" }] }),
});

const ICONS: Record<string, React.ReactNode> = {
  Katon: <Flame className="size-5 text-hp" />,
  Suiton: <Droplets className="size-5 text-chakra" />,
  Doton: <Mountain className="size-5 text-energy" />,
  Fuuton: <Wind className="size-5 text-foreground" />,
  Raiton: <Zap className="size-5 text-xp" />,
};

function ElementsPage() {
  const character = useGameStore((s) => s.character);
  const setCharacter = useGameStore((s) => s.setCharacter);
  const [list, setList] = useState<ElementOption[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function refresh() {
    try {
      const els = await characterService.listElements();
      setList(els);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao carregar elementos");
    }
  }

  useEffect(() => { refresh(); }, []);

  if (!character) return null;

  async function learn(name: string) {
    if (!character) return;
    setBusy(name);
    try {
      await characterService.learnElement(character.id, name);
      toast.success(`${name} aprendido!`);
      const updated = await characterService.get();
      setCharacter(updated);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao aprender elemento");
    } finally { setBusy(null); }
  }

  return (
    <div className="space-y-5">
      <SectionTitle
        title="Elementos"
        icon={<Flame className="size-6 text-primary" />}
        description="Aprenda afinidades elementais. O 1º elemento exige nível 20; cada um a mais soma +7 níveis."
      />

      {!list ? (
        <div className="grid h-40 place-items-center text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((el) => {
            const canLearn = !el.learned && character.level >= el.requiredLevel;
            return (
              <Card key={el.name} className="shadow-card">
                <CardContent className="flex flex-col gap-3 p-4">
                  <div className="flex items-center gap-2">
                    {ICONS[el.name]}
                    <span className="text-base font-bold">{el.name}</span>
                    {el.learned && <CheckCircle2 className="ml-auto size-4 text-primary" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{el.description}</p>
                  <div className="text-xs">
                    <span className="text-muted-foreground">Nível requerido: </span>
                    <span className="font-bold">{el.requiredLevel}</span>
                  </div>
                  {el.learned ? (
                    <Button size="sm" disabled variant="secondary">Aprendido</Button>
                  ) : canLearn ? (
                    <Button size="sm" onClick={() => learn(el.name)} disabled={busy === el.name}>
                      Aprender
                    </Button>
                  ) : (
                    <Button size="sm" disabled variant="outline">
                      <Lock className="size-3.5" /> Nível {el.requiredLevel}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}