import type { Item } from "@/types";
import { apiClient } from "@/lib/api";

interface ItemDto {
  id: string;
  name: string;
  type: string;
  rarity: string;
  description: string;
  price: number;
  icon: string;
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

export const shopService = {
  async list(): Promise<Item[]> {
    const items = await apiClient.get<ItemDto[]>("/shop/items", { auth: false });
    return items.map((i) => ({
      id: i.id,
      name: i.name,
      type: i.type as Item["type"],
      rarity: i.rarity as Item["rarity"],
      description: i.description,
      price: i.price,
      icon: i.icon,
    }));
  },
  async buy(characterId: string, itemId: string): Promise<void> {
    return apiClient.post<void>(`/characters/${characterId}/shop/buy/${itemId}`);
  },
};
