import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/game/SectionTitle";
import { RarityBadge } from "@/components/game/RarityBadge";
import { inventoryService } from "@/services/inventoryService";
import { useGameStore } from "@/store/gameStore";
import type { ItemType, EquipSlot, InventoryItem, Item } from "@/types";
import { Backpack, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/inventory")({
  component: InventoryPage,
  head: () => ({ meta: [{ title: "Inventário — Naruto Players Fan Game" }] }),
});

const TYPES: { id: ItemType | "all"; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "weapon", label: "Armas" },
  { id: "armor", label: "Armaduras" },
  { id: "accessory", label: "Acessórios" },
  { id: "tool", label: "Ferramentas" },
  { id: "consumable", label: "Consumíveis" },
];
const SLOTS: { id: EquipSlot; label: string }[] = [
  { id: "weapon", label: "Arma" },
  { id: "armor", label: "Armadura" },
  { id: "accessory1", label: "Acessório 1" },
  { id: "accessory2", label: "Acessório 2" },
  { id: "tool", label: "Ferramenta" },
  { id: "summon", label: "Invocação" },
];

function InventoryPage() {
  const character = useGameStore((s) => s.character);
  const [invItems, setInvItems] = useState<InventoryItem[]>([]);
  const [catalog, setCatalog] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ItemType | "all">("all");

  useEffect(() => {
    if (!character) {
      setLoading(false);
      return;
    }
    inventoryService
      .list(character.id)
      .then(({ items, catalog: cat }) => {
        setInvItems(items);
        setCatalog(cat);
      })
      .catch(() => {
        setInvItems([]);
        setCatalog([]);
      })
      .finally(() => setLoading(false));
  }, [character?.id]);

  const merged = invItems
    .map((inv) => ({
      ...inv,
      item: catalog.find((i) => i.id === inv.itemId) ?? {
        id: inv.itemId,
        name: "Desconhecido",
        type: "consumable" as ItemType,
        rarity: "common" as const,
        description: "",
        price: 0,
        icon: "",
      },
    }))
    .filter((x) => filter === "all" || x.item.type === filter);

  async function handleEquip(itemId: string) {
    if (!character) return;
    try {
      await inventoryService.equip(character.id, itemId);
      toast.success("Item equipado");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao equipar");
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
        title="Inventário"
        icon={<Backpack className="size-6 text-primary" />}
        description="Equipamentos e itens do seu shinobi."
      />

      <Card className="shadow-card">
        <CardContent className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3 lg:grid-cols-6">
          {SLOTS.map((s) => {
            const eq = invItems.find((i) => i.slot === s.id && i.equipped);
            const item = eq ? catalog.find((i) => i.id === eq.itemId) : null;
            return (
              <div key={s.id} className="rounded-lg border bg-muted/30 p-3 text-center">
                <div className="text-[10px] uppercase text-muted-foreground">{s.label}</div>
                <div className="mt-1 truncate text-sm font-semibold">{item?.name ?? "Vazio"}</div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <Button
            key={t.id}
            size="sm"
            variant={filter === t.id ? "default" : "outline"}
            onClick={() => setFilter(t.id)}
          >
            {t.label}
          </Button>
        ))}
      </div>

      {merged.length === 0 ? (
        <div className="rounded-xl border border-dashed py-12 text-center text-muted-foreground">
          Nenhum item neste filtro.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {merged.map((x) => (
            <Card key={x.itemId} className="bg-scroll-paper shadow-card">
              <CardContent className="space-y-2 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold">{x.item.name}</h3>
                    <div className="mt-0.5 flex items-center gap-2">
                      <RarityBadge rarity={x.item.rarity} />
                      <span className="text-[10px] text-muted-foreground capitalize">
                        {x.item.type}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold tabular-nums">
                    {x.equipped ? "Eq" : `x${x.quantity}`}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{x.item.description}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    disabled={x.equipped}
                    onClick={() => handleEquip(x.itemId)}
                  >
                    Equipar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
