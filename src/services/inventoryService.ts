import type { InventoryItem, Item } from "@/types";
import { apiClient } from "@/lib/api";

interface InventoryItemDto {
  itemId: string;
  name: string;
  type: string;
  rarity: string;
  icon: string;
  quantity: number;
  equipped: boolean;
  slot: string | null;
  bonuses: {
    attack: number;
    defense: number;
    intelligence: number;
    agility: number;
    vitality: number;
    chakra: number;
    luck: number;
  };
}

export const inventoryService = {
  async list(characterId: string): Promise<{ items: InventoryItem[]; catalog: Item[] }> {
    const invItems = await apiClient.get<InventoryItemDto[]>(`/characters/${characterId}/inventory`);
    const catalogItems = invItems.map(i => ({
      id: i.itemId,
      name: i.name,
      type: i.type as Item["type"],
      rarity: i.rarity as Item["rarity"],
      description: "",
      price: 0,
      icon: i.icon,
    }));
    const items: InventoryItem[] = invItems.map(i => ({
      itemId: i.itemId,
      quantity: i.quantity,
      equipped: i.equipped,
      slot: i.slot as InventoryItem["slot"],
    }));
    return { items, catalog: catalogItems };
  },
  async equip(characterId: string, itemId: string): Promise<void> {
    return apiClient.post<void>(`/characters/${characterId}/inventory/${itemId}/equip`);
  },
  async unequip(characterId: string, itemId: string): Promise<void> {
    return apiClient.post<void>(`/characters/${characterId}/inventory/${itemId}/unequip`);
  },
};
