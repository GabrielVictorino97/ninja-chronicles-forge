import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/game/SectionTitle";
import { mockJutsus } from "@/mocks/jutsus";
import { useGameStore } from "@/store/gameStore";
import { mockCharacter } from "@/mocks/character";
import { jutsuService } from "@/services/jutsuService";
import { Sparkles, Check, BookOpen } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/jutsus")({
  component: JutsusPage,
  head: () => ({ meta: [{ title: "Jutsus — Naruto Players Fan Game" }] }),
});

function JutsusPage() {
  const character = useGameStore((s) => s.character) ?? mockCharacter;
  const patch = useGameStore((s) => s.patchCharacter);
  const [tab, setTab] = useState<"known" | "available">("known");
  const known = mockJutsus.filter((j) => character.knownJutsus.includes(j.id));
  const available = mockJutsus.filter((j) => !character.knownJutsus.includes(j.id));
  const list = tab === "known" ? known : available;

  async function learn(id: string) {
    await jutsuService.learn(id);
    patch({ knownJutsus: [...character.knownJutsus, id] });
    toast.success("Jutsu aprendido!");
  }
  async function toggleEquip(id: string) {
    await jutsuService.equip(id);
    const eq = character.equippedJutsus.includes(id)
      ? character.equippedJutsus.filter((x) => x !== id)
      : [...character.equippedJutsus.slice(-3), id];
    patch({ equippedJutsus: eq });
  }

  return (
    <div className="space-y-5">
      <SectionTitle title="Jutsus" icon={<Sparkles className="size-6 text-chakra" />}
        description="Aprenda novas técnicas e equipe até 4 para batalha." />
      <div className="flex gap-2">
        <Button variant={tab === "known" ? "default" : "outline"} size="sm" onClick={() => setTab("known")}>Conhecidos ({known.length})</Button>
        <Button variant={tab === "available" ? "default" : "outline"} size="sm" onClick={() => setTab("available")}>Disponíveis ({available.length})</Button>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {list.map((j) => {
          const equipped = character.equippedJutsus.includes(j.id);
          const isKnown = character.knownJutsus.includes(j.id);
          return (
            <Card key={j.id} className="bg-scroll-paper shadow-card">
              <CardContent className="space-y-2 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold">{j.name}</h3>
                    <p className="text-[11px] text-muted-foreground">{j.type}{j.element ? ` • ${j.element}` : ""}</p>
                  </div>
                  {equipped && <span className="rounded bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">EQUIPADO</span>}
                </div>
                <p className="text-xs text-muted-foreground">{j.description}</p>
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  <span className="rounded bg-chakra/10 px-2 py-0.5 text-chakra">Chakra {j.chakraCost}</span>
                  <span className="rounded bg-muted px-2 py-0.5">CD {j.cooldown}</span>
                  <span className="rounded bg-hp/10 px-2 py-0.5 text-hp">Dano {j.baseDamage}</span>
                  <span className="rounded bg-muted px-2 py-0.5">Lv {j.requirements.level}+</span>
                </div>
                {isKnown ? (
                  <Button size="sm" variant={equipped ? "outline" : "default"} className="w-full" onClick={() => toggleEquip(j.id)}>
                    <Check className="size-3.5" /> {equipped ? "Desequipar" : "Equipar"}
                  </Button>
                ) : (
                  <Button size="sm" className="w-full" onClick={() => learn(j.id)}>
                    <BookOpen className="size-3.5" /> Aprender
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
