import { mockInventory, mockItems } from "@/mocks/items";
import type { InventoryItem, Item } from "@/types";
import { mockRequest } from "./api";

export const inventoryService = {
  async list(): Promise<{ items: InventoryItem[]; catalog: Item[] }> {
    return mockRequest({ items: mockInventory, catalog: mockItems });
  },
  async equip(itemId: string) { return mockRequest({ ok: true, itemId }); },
  async use(itemId: string) { return mockRequest({ ok: true, itemId }); },
  async sell(itemId: string) { return mockRequest({ ok: true, itemId }); },
};
