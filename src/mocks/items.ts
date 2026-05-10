import type { Item, InventoryItem } from "@/types";

export const mockItems: Item[] = [
  { id: "i-kunai", name: "Kunai", type: "tool", rarity: "common", description: "Arma básica de arremesso.", price: 25, icon: "Sword" },
  { id: "i-shuriken", name: "Shuriken", type: "tool", rarity: "common", description: "Estrela ninja afiada.", price: 30, icon: "Star" },
  { id: "i-senbon", name: "Senbon", type: "tool", rarity: "uncommon", description: "Agulhas precisas para pontos vitais.", price: 70, icon: "Pin" },
  { id: "i-bomb", name: "Papel bomba", type: "tool", rarity: "uncommon", description: "Pergaminho explosivo.", price: 120, icon: "Bomb" },
  { id: "i-katana", name: "Katana", type: "weapon", rarity: "rare", description: "Espada longa e mortal.", price: 800, icon: "Swords" },
  { id: "i-scroll", name: "Pergaminho", type: "tool", rarity: "uncommon", description: "Pergaminho selado para invocar técnicas.", price: 200, icon: "ScrollText" },
  { id: "i-vest", name: "Colete Chunin", type: "armor", rarity: "rare", description: "Colete tático verde.", price: 1200, icon: "Shirt" },
  { id: "i-bandana", name: "Bandana ninja", type: "accessory", rarity: "common", description: "Bandana com símbolo da vila.", price: 100, icon: "Crown" },
  { id: "i-pill", name: "Pílula de soldado", type: "consumable", rarity: "uncommon", description: "Restaura energia rapidamente.", price: 90, icon: "Pill" },
  { id: "i-antidote", name: "Antídoto", type: "consumable", rarity: "uncommon", description: "Cura efeitos de veneno.", price: 110, icon: "FlaskConical" },
];

export const mockInventory: InventoryItem[] = [
  { itemId: "i-kunai", quantity: 12, equipped: true, slot: "tool" },
  { itemId: "i-shuriken", quantity: 8 },
  { itemId: "i-bandana", quantity: 1, equipped: true, slot: "accessory1" },
  { itemId: "i-katana", quantity: 1, equipped: true, slot: "weapon" },
  { itemId: "i-pill", quantity: 3 },
  { itemId: "i-scroll", quantity: 2 },
];
