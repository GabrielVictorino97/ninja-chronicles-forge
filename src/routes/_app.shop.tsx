import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/game/SectionTitle";
import { RarityBadge } from "@/components/game/RarityBadge";
import { mockItems } from "@/mocks/items";
import { shopService } from "@/services/shopService";
import { Store, Coins } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/shop")({
  component: ShopPage,
  head: () => ({ meta: [{ title: "Loja — Naruto Players Fan Game" }] }),
});

function ShopPage() {
  const [history, setHistory] = useState<{ id: string; type: "buy" | "sell"; name: string; price: number; date: string }[]>([]);

  async function buy(itemId: string, name: string, price: number) {
    await shopService.buy(itemId);
    setHistory((h) => [{ id: `${Date.now()}`, type: "buy", name, price, date: "agora" }, ...h]);
    toast.success(`Comprou ${name}`);
  }

  return (
    <div className="space-y-5">
      <SectionTitle title="Loja" icon={<Store className="size-6 text-ryous" />}
        description="Compre e venda equipamentos." />
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {mockItems.map((it) => (
            <Card key={it.id} className="bg-scroll-paper shadow-card">
              <CardContent className="space-y-2 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold">{it.name}</h3>
                    <div className="mt-0.5 flex items-center gap-2"><RarityBadge rarity={it.rarity} /><span className="text-[10px] capitalize text-muted-foreground">{it.type}</span></div>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-bold text-ryous"><Coins className="size-3.5" /> {it.price}</div>
                </div>
                <p className="text-xs text-muted-foreground">{it.description}</p>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => buy(it.id, it.name, it.price)}>Comprar</Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={async () => { await shopService.sell(it.id); toast.success(`Vendeu ${it.name}`); }}>Vender</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="h-fit shadow-card">
          <CardContent className="p-4">
            <h3 className="mb-2 text-sm font-bold uppercase text-muted-foreground">Histórico</h3>
            {history.length === 0 ? (
              <p className="text-xs text-muted-foreground">Nenhuma transação ainda.</p>
            ) : (
              <div className="space-y-1.5">
                {history.map((h) => (
                  <div key={h.id} className="flex items-center justify-between rounded border bg-muted/30 px-2 py-1.5 text-xs">
                    <span><span className={h.type === "buy" ? "text-destructive" : "text-xp"}>{h.type === "buy" ? "−" : "+"}</span> {h.name}</span>
                    <span className="font-semibold tabular-nums text-ryous">{h.price}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
