import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, LogOut, Sword } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { characterService } from "@/services/characterService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Character } from "@/types";

export const Route = createFileRoute("/select-character")({
  beforeLoad: () => {
    const s = useGameStore.getState();
    if (!s.isAuthenticated) throw redirect({ to: "/login" });
  },
  component: SelectCharacterPage,
  head: () => ({ meta: [{ title: "Selecionar Personagem — Naruto Players Fan Game" }] }),
});

function SelectCharacterPage() {
  const navigate = useNavigate();
  const setCharacter = useGameStore((s) => s.setCharacter);
  const setCharacters = useGameStore((s) => s.setCharacters);
  const charactersInStore = useGameStore((s) => s.characters);
  const logout = useGameStore((s) => s.logout);
  const user = useGameStore((s) => s.user);

  const [list, setList] = useState<Character[] | null>(charactersInStore.length ? charactersInStore : null);
  const [loading, setLoading] = useState(!charactersInStore.length);
  const [selectingId, setSelectingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    characterService
      .list()
      .then((cs) => { if (!cancelled) { setList(cs); setCharacters(cs); } })
      .catch((e) => { if (!cancelled) { toast.error(e instanceof Error ? e.message : "Falha ao carregar personagens"); setList([]); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [setCharacters]);

  async function select(c: Character) {
    setSelectingId(c.id);
    try {
      const fresh = await characterService.getById(c.id);
      setCharacter(fresh);
      navigate({ to: "/dashboard" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao selecionar personagem");
    } finally {
      setSelectingId(null);
    }
  }

  return (
    <div className="relative min-h-screen px-4 py-10">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]">
        <div className="absolute -left-20 top-1/4 size-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -right-20 bottom-1/4 size-80 rounded-full bg-accent/30 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gradient-primary">Escolha seu Shinobi</h1>
            <p className="text-sm text-muted-foreground">
              {user?.name ? `Bem-vindo, ${user.name}.` : "Bem-vindo."} Selecione um personagem para entrar no mundo.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { logout(); navigate({ to: "/login" }); }}>
            <LogOut className="size-4" /> Sair
          </Button>
        </div>

        {loading ? (
          <div className="grid h-64 place-items-center">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list?.map((c) => {
              const isSelecting = selectingId === c.id;
              return (
                <Card
                  key={c.id}
                  className={cn(
                    "group cursor-pointer border-border/60 bg-card/80 backdrop-blur shadow-card transition hover:border-primary/60 hover:shadow-glow-primary",
                    isSelecting && "border-primary",
                  )}
                  onClick={() => !selectingId && select(c)}
                >
                  <CardHeader className="flex flex-row items-center gap-3 pb-2">
                    <div className="grid size-14 place-items-center rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 text-3xl">
                      {c.avatar}
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="truncate text-lg">{c.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {c.graduation} • Nível {c.level}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>HP</span>
                      <span className="tabular-nums">{c.hp}/{c.hpMax}</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Chakra</span>
                      <span className="tabular-nums">{c.chakra}/{c.chakraMax}</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Ryous</span>
                      <span className="tabular-nums">{c.ryous.toLocaleString("pt-BR")}</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Poder</span>
                      <span className="tabular-nums text-primary">{c.power.toLocaleString("pt-BR")}</span>
                    </div>
                    <Button
                      className="mt-3 w-full"
                      size="sm"
                      disabled={!!selectingId}
                      onClick={(e) => { e.stopPropagation(); select(c); }}
                    >
                      {isSelecting ? <Loader2 className="size-4 animate-spin" /> : <Sword className="size-4" />}
                      Jogar
                    </Button>
                  </CardContent>
                </Card>
              );
            })}

            <Link
              to="/create-character"
              className="group grid min-h-[220px] place-items-center rounded-xl border border-dashed border-border/60 bg-card/40 p-6 text-center transition hover:border-primary/60 hover:bg-card/80"
            >
              <div>
                <div className="mx-auto mb-3 grid size-14 place-items-center rounded-xl bg-primary/15 text-primary group-hover:bg-primary/25">
                  <Plus className="size-7" />
                </div>
                <div className="font-semibold">Criar novo personagem</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Inicie uma nova jornada shinobi.
                </p>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
