import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { mockVillages } from "@/mocks/villages";
import { mockBloodlineClans } from "@/mocks/clans";
import { cn } from "@/lib/utils";
import type { BloodlineClanId, VillageId, BaseAttributes } from "@/types";
import { useGameStore } from "@/store/gameStore";
import { characterService } from "@/services/characterService";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

const AVATARS = ["🦊", "🐉", "🐺", "🦅", "🐍", "🐢", "🦂", "🐅", "🦉", "🐝", "🦇", "🐲"];
const ATTR_LABELS: Record<keyof BaseAttributes, string> = {
  taijutsu: "Taijutsu", ninjutsu: "Ninjutsu", genjutsu: "Genjutsu",
  intelligence: "Inteligência", vitality: "Vitalidade", chakra: "Chakra",
  agility: "Agilidade", luck: "Sorte",
};
const STARTING_POOL = 20;
const STARTING_BASE = 5;

export const Route = createFileRoute("/create-character")({
  component: CreateCharacterPage,
});

function CreateCharacterPage() {
  const navigate = useNavigate();
  const setCharacter = useGameStore((s) => s.setCharacter);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [village, setVillage] = useState<VillageId | null>(null);
  const [clan, setClan] = useState<BloodlineClanId | null>(null);
  const [attrs, setAttrs] = useState<BaseAttributes>({
    taijutsu: STARTING_BASE, ninjutsu: STARTING_BASE, genjutsu: STARTING_BASE,
    intelligence: STARTING_BASE, vitality: STARTING_BASE, chakra: STARTING_BASE,
    agility: STARTING_BASE, luck: STARTING_BASE,
  });
  const used = Object.values(attrs).reduce((s, v) => s + v - STARTING_BASE, 0);
  const remaining = STARTING_POOL - used;

  const canNext: Record<number, boolean> = {
    1: name.trim().length >= 3,
    2: !!village,
    3: !!clan,
    4: remaining === 0,
  };

  async function finish() {
    try {
      const created = await characterService.create({
        name,
        avatar,
        villageId: village!,
        clanId: clan!,
      });
      // Distribui pontos iniciais (delta sobre o base 5).
      const delta: Partial<BaseAttributes> = {};
      (Object.keys(attrs) as (keyof BaseAttributes)[]).forEach((k) => {
        const d = attrs[k] - STARTING_BASE;
        if (d > 0) delta[k] = d;
      });
      const final = Object.keys(delta).length
        ? await characterService.distributePoints(delta)
        : created;
      setCharacter(final);
      toast.success(`${name} entrou no mundo ninja!`);
      navigate({ to: "/dashboard" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao criar personagem");
    }
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-4xl px-4 py-8">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-black text-gradient-primary">Forje seu Ninja</h1>
        <p className="text-sm text-muted-foreground">Etapa {step} de 4</p>
        <Progress value={(step / 4) * 100} className="mx-auto mt-3 max-w-md" />
      </div>

      <Card className="bg-card/80 backdrop-blur shadow-card">
        <CardHeader>
          <CardTitle>{titles[step - 1]}</CardTitle>
          <CardDescription>{descriptions[step - 1]}</CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nome do ninja</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Kazumi" />
              </div>
              <div>
                <Label className="mb-2 block">Avatar</Label>
                <div className="grid grid-cols-6 gap-2 sm:grid-cols-12">
                  {AVATARS.map((a) => (
                    <button key={a} onClick={() => setAvatar(a)}
                      className={cn(
                        "grid aspect-square place-items-center rounded-lg border bg-muted text-2xl transition",
                        avatar === a ? "border-primary bg-primary/15 shadow-glow-primary" : "hover:border-primary/50",
                      )}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {mockVillages.map((v) => (
                <button key={v.id} onClick={() => setVillage(v.id)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border bg-muted/40 p-4 text-left transition",
                    village === v.id ? "border-primary bg-primary/10 shadow-glow-primary" : "hover:border-primary/50",
                  )}>
                  <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-background text-xl">{v.symbol}</div>
                  <div>
                    <div className="font-semibold">{v.fullName}</div>
                    <div className="text-xs text-muted-foreground">{v.country}</div>
                    <p className="mt-1 text-xs text-muted-foreground/80">{v.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {mockBloodlineClans.map((c) => (
                <button key={c.id} onClick={() => setClan(c.id)}
                  className={cn(
                    "flex flex-col items-start gap-2 rounded-xl border bg-muted/40 p-4 text-left transition",
                    clan === c.id ? "border-primary bg-primary/10 shadow-glow-primary" : "hover:border-primary/50",
                  )}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{c.symbol}</span>
                    <span className="font-bold">{c.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{c.description}</p>
                  <span className="rounded bg-accent/15 px-2 py-0.5 text-[11px] font-semibold text-accent">{c.bonus}</span>
                </button>
              ))}
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="mb-4 flex items-center justify-between rounded-lg border border-primary/30 bg-primary/10 p-3">
                <span className="text-sm font-medium">Pontos restantes</span>
                <span className="text-lg font-black text-primary tabular-nums">{remaining}</span>
              </div>
              <p className="mb-3 text-xs text-muted-foreground">
                Você começa sem elemento — aprenda o seu primeiro a partir do nível 20 na tela de personagem.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {(Object.keys(attrs) as (keyof BaseAttributes)[]).map((k) => (
                  <div key={k} className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2">
                    <div>
                      <div className="text-sm font-medium">{ATTR_LABELS[k]}</div>
                      <div className="text-xs text-muted-foreground">Base 5 + investido</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="outline" disabled={attrs[k] <= STARTING_BASE}
                        onClick={() => setAttrs({ ...attrs, [k]: attrs[k] - 1 })}>−</Button>
                      <span className="w-8 text-center text-base font-bold tabular-nums">{attrs[k]}</span>
                      <Button size="icon" variant="outline" disabled={remaining <= 0}
                        onClick={() => setAttrs({ ...attrs, [k]: attrs[k] + 1 })}>+</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
              <ArrowLeft className="size-4" /> Voltar
            </Button>
            {step < 4 ? (
              <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext[step]}>
                Continuar <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button onClick={finish} disabled={!canNext[4]}>
                Concluir <Check className="size-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const titles = ["Identidade", "Vila Natal", "Clã de Sangue", "Distribuir Atributos"];
const descriptions = [
  "Escolha o nome e o avatar do seu shinobi.",
  "Onde sua jornada começa.",
  "Sua linhagem definirá habilidades únicas.",
  "Distribua 20 pontos entre os atributos iniciais.",
];
