import { mockItems } from "@/mocks/items";
import { mockRequest } from "./api";

export const shopService = {
  async list() { return mockRequest(mockItems); },
  async buy(itemId: string) { return mockRequest({ ok: true, itemId }); },
  async sell(itemId: string) { return mockRequest({ ok: true, itemId }); },
};
