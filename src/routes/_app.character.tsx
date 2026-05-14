import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/game/SectionTitle";
import { StatBar } from "@/components/game/StatBar";
import type { BaseAttributes, DerivedAttributes, Village, BloodlineClan } from "@/types";
import { characterService } from "@/services/characterService";
import { User, Plus, Minus, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

const ATTR_LABELS: Record<keyof BaseAttributes, string> = {
  taijutsu: "Taijutsu", ninjutsu: "Ninjutsu", genjutsu: "Genjutsu",
  intelligence: "Inteligência", vitality: "Vitalidade", chakra: "Chakra",
  agility: "Agilidade", luck: "Sorte",
};

// Derived attribute formulas are illustrative — backend will be authoritative.
function deriveAttributes(a: BaseAttributes, level: number): DerivedAttributes {
  return {
    hpMax: 100 + a.vitality * 12 + level * 20,
    chakraMax: 80 + a.chakra * 10 + level * 15,
    physicalAttack: a.taijutsu * 3 + level,
    ninjutsuAttack: a.ninjutsu * 3 + level,
    genjutsuAttack: a.genjutsu * 3 + level,
    physicalDefense: a.vitality * 2 + a.taijutsu,
    spiritualDefense: a.chakra * 2 + a.intelligence,
    mentalResistance: a.intelligence * 2 + a.genjutsu,
    initiative: a.agility * 2 + a.luck,
    critChance: Math.min(50, 5 + Math.floor(a.luck / 2)),
    dodge: Math.min(45, Math.floor(a.agility * 1.2)),
    precision: 50 + a.agility + Math.floor(a.luck / 2),
  };
}

const NEXT_GRAD: Record<string, { next: string; level: number }> = {
  Estudante: { next: "Genin", level: 5 },
  Genin: { next: "Chunin", level: 15 },
  Chunin: { next: "Tokubetsu Jounin", level: 25 },
  "Tokubetsu Jounin": { next: "Jounin", level: 35 },
  Jounin: { next: "ANBU", level: 45 },
  ANBU: { next: "Kage", level: 60 },
  Kage: { next: "—", level: 60 },
};

export const Route = createFileRoute("/_app/character")({
  component: CharacterPage,
  head: () => ({ meta: [{ title: "Personagem — Naruto Players Fan Game" }] }),
});

function CharacterPage() {
  const stored = useGameStore((s) => s.character);
  const patch = useGameStore((s) => s.patchCharacter);
  const [villages, setVillages] = useState<Village[]>([]);
  const [clans, setClans] = useState<BloodlineClan[]>([]);
  const [draft, setDraft] = useState<BaseAttributes | null>(null);
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    Promise.all([characterService.listVillages(), characterService.listBloodlineClans()])
      .then(([v, c]) => { setVillages(v); setClans(c); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (stored && !initialized) {
      setDraft(stored.attributes);
      setInitialized(true);
    }
  }, [stored, initialized]);

  if (!stored || !draft) return null;
  const used = (Object.keys(draft) as (keyof BaseAttributes)[]).reduce(
    (sum, k) => sum + (draft[k] - stored.attributes[k]), 0,
  );
  const remaining = stored.unspentPoints - used;
  const derived = deriveAttributes(draft, stored.level);
  const nextGrad = NEXT_GRAD[stored.graduation];

  async function save() {
    if (!stored || !draft) return;
    setSaving(true);
    try {
      const updated = await characterService.distributePoints(stored.id, draft);
      patch({ attributes: draft, unspentPoints: updated.unspentPoints ?? remaining });
      toast.success("Atributos salvos!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao salvar atributos");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <SectionTitle title="Personagem" icon={<User className="size-6 text-primary" />}
        description="Detalhes, atributos e progressão." />

      <Card className="bg-scroll-paper shadow-card">
        <CardContent className="grid gap-4 p-6 md:grid-cols-3">
          <div className="flex items-center gap-4">
            <div className="grid size-20 place-items-center rounded-2xl bg-primary/20 text-4xl ring-2 ring-primary/40">{stored.avatar}</div>
            <div>
              <div className="text-xl font-black">{stored.name}</div>
              <div className="text-sm text-muted-foreground">{villages.find(v => v.id === stored.villageId)?.name ?? "Vila"} • {clans.find(c => c.id === stored.clanId)?.name ?? "Clã"}</div>
              <div className="text-xs text-muted-foreground">Graduação: <span className="font-semibold text-primary">{stored.graduation}</span></div>
            </div>
          </div>
          <div className="space-y-2">
            <StatBar label={`Lv ${stored.level} • XP`} value={stored.xp} max={stored.xpToNext} tone="xp" />
            <StatBar label="HP" value={stored.hp} max={stored.hpMax} tone="hp" />
            <StatBar label="Chakra" value={stored.chakra} max={stored.chakraMax} tone="chakra" />
          </div>
          <div className="rounded-lg border bg-muted/30 p-4 text-sm">
            <div className="text-xs uppercase text-muted-foreground">Próxima graduação</div>
            <div className="text-lg font-bold">{nextGrad?.next}</div>
            <div className="mt-1 text-xs text-muted-foreground">Requer nível {nextGrad?.level}</div>
            <div className="mt-3 text-xs text-muted-foreground">Poder total</div>
            <div className="text-xl font-black text-gradient-primary">{stored.power.toLocaleString()}</div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Atributos base</CardTitle>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-primary/15 px-2 py-1 text-xs font-bold text-primary">Pontos: {remaining}</span>
              <Button size="sm" disabled={remaining < 0 || used === 0 || saving} onClick={save}>
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Salvar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {(Object.keys(draft) as (keyof BaseAttributes)[]).map((k) => (
              <div key={k} className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2">
                <div className="text-sm font-medium">{ATTR_LABELS[k]}</div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="outline" disabled={draft[k] <= stored.attributes[k]}
                    onClick={() => setDraft({ ...draft, [k]: draft[k] - 1 })}>
                    <Minus className="size-3" />
                  </Button>
                  <span className="w-10 text-center text-base font-bold tabular-nums">{draft[k]}</span>
                  <Button size="icon" variant="outline" disabled={remaining <= 0}
                    onClick={() => setDraft({ ...draft, [k]: draft[k] + 1 })}>
                    <Plus className="size-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader><CardTitle>Atributos derivados</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-2 text-sm">
            <Derived label="HP máximo" value={derived.hpMax} />
            <Derived label="Chakra máximo" value={derived.chakraMax} />
            <Derived label="Ataque físico" value={derived.physicalAttack} />
            <Derived label="Ataque ninjutsu" value={derived.ninjutsuAttack} />
            <Derived label="Ataque genjutsu" value={derived.genjutsuAttack} />
            <Derived label="Defesa física" value={derived.physicalDefense} />
            <Derived label="Defesa espiritual" value={derived.spiritualDefense} />
            <Derived label="Resistência mental" value={derived.mentalResistance} />
            <Derived label="Iniciativa" value={derived.initiative} />
            <Derived label="Crítico" value={`${derived.critChance}%`} />
            <Derived label="Esquiva" value={`${derived.dodge}%`} />
            <Derived label="Precisão" value={derived.precision} />
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader><CardTitle>Histórico de evolução</CardTitle></CardHeader>
        <CardContent className="space-y-1.5 text-sm">
          {[
            { date: "hoje", event: `Subiu para nível ${stored.level}` },
            { date: "ontem", event: "Concluiu missão Rank B: Defender a vila" },
            { date: "há 2 dias", event: "Aprendeu Katon: Goukakyuu no Jutsu" },
            { date: "há 4 dias", event: "Promovido a Chunin" },
          ].map((h, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2">
              <span>{h.event}</span>
              <span className="text-xs text-muted-foreground">{h.date}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Derived({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-bold tabular-nums">{value}</span>
    </div>
  );
}
