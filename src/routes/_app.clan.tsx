import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionTitle } from "@/components/game/SectionTitle";
import { StatBar } from "@/components/game/StatBar";
import { clanService } from "@/services/clanService";
import type { PlayerClan } from "@/types";
import { Users, Coins, Trophy, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/clan")({
  component: ClanPage,
  head: () => ({ meta: [{ title: "Clã — Naruto Players Fan Game" }] }),
});

function ClanPage() {
  const [clan, setClan] = useState<PlayerClan | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [donate, setDonate] = useState(100);

  useEffect(() => {
    clanService.getMine().then(setClan).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>;

  if (!clan) {
    return (
      <div className="space-y-5">
        <SectionTitle title="Clã" icon={<Users className="size-6 text-accent" />} description="Junte-se a um clã ou crie o seu." />
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="shadow-card"><CardHeader><CardTitle>Criar clã</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Nome do clã" />
              <Button className="w-full" onClick={async () => {
                try {
                  await clanService.create("Novo Clã");
                  const c = await clanService.getMine();
                  setClan(c);
                  toast.success("Clã criado!");
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : "Erro ao criar clã");
                }
              }}>Criar</Button>
            </CardContent></Card>
          <Card className="shadow-card"><CardHeader><CardTitle>Buscar clãs</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} />
              {["Folha Negra", "Punho de Ferro", "Dragões da Areia"].filter((c) => c.toLowerCase().includes(search.toLowerCase())).map((c) => (
                <div key={c} className="flex items-center justify-between rounded border bg-muted/30 px-3 py-2 text-sm">
                  <span>{c}</span>
                  <Button size="sm" variant="outline" onClick={() => toast.info("Solicitação enviada")}>Solicitar</Button>
                </div>
              ))}
            </CardContent></Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <SectionTitle title={clan.name} icon={<Users className="size-6 text-accent" />}
        description={`Clã [${clan.tag}] • Ranking #${clan.ranking}`} />

      <Card className="bg-scroll-paper shadow-card">
        <CardContent className="grid gap-4 p-6 md:grid-cols-3">
          <div>
            <div className="text-xs uppercase text-muted-foreground">Level do clã</div>
            <div className="text-3xl font-black text-gradient-primary">{clan.level}</div>
            <StatBar label="XP" value={clan.xp} max={clan.xpToNext} tone="xp" className="mt-2" />
          </div>
          <div>
            <div className="text-xs uppercase text-muted-foreground">Seu cargo</div>
            <div className="text-2xl font-bold">{clan.members[0]?.role ?? "Membro"}</div>
          </div>
          <div className="space-y-2">
            <div className="text-xs uppercase text-muted-foreground">Doar ryous</div>
            <div className="flex gap-2">
              <Input type="number" value={donate} onChange={(e) => setDonate(Number(e.target.value))} />
              <Button onClick={async () => {
                try {
                  await clanService.donate(donate);
                  toast.success(`Doou ${donate} ryous`);
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : "Erro ao doar");
                }
              }}>
                <Coins className="size-4" /> Doar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Trophy className="size-4 text-primary" /> Membros</CardTitle></CardHeader>
          <CardContent className="space-y-1.5">
            {clan.members.map((m) => (
              <div key={m.characterId} className="flex items-center justify-between rounded border bg-muted/30 px-3 py-2 text-sm">
                <div>
                  <span className="font-semibold">{m.name}</span>
                  <span className="ml-2 text-[11px] text-muted-foreground">Lv {m.level} • {m.role}</span>
                </div>
                <span className="text-xs font-semibold text-ryous tabular-nums">{m.donations.toLocaleString()}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Mural</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {clan.wall.length === 0 ? (
              <p className="text-xs text-muted-foreground">Nenhuma mensagem no mural.</p>
            ) : (
              clan.wall.map((p) => (
                <div key={p.id} className="rounded border bg-muted/30 px-3 py-2">
                  <div className="flex items-center justify-between text-xs"><span className="font-semibold">{p.author}</span><span className="text-muted-foreground">{p.date}</span></div>
                  <p className="mt-1 text-sm">{p.message}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
