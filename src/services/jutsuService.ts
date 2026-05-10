import { mockJutsus } from "@/mocks/jutsus";
import type { Jutsu } from "@/types";
import { mockRequest } from "./api";

export const jutsuService = {
  async list(): Promise<Jutsu[]> { return mockRequest(mockJutsus); },
  async learn(id: string) { return mockRequest({ ok: true, id }); },
  async equip(id: string) { return mockRequest({ ok: true, id }); },
};
