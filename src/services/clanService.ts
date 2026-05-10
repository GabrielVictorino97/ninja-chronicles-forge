import { mockPlayerClan } from "@/mocks/clan";
import type { PlayerClan } from "@/types";
import { mockRequest } from "./api";

export const clanService = {
  async getMine(): Promise<PlayerClan | null> { return mockRequest(mockPlayerClan); },
  async donate(amount: number) { return mockRequest({ ok: true, amount }); },
  async create(name: string) { return mockRequest({ ok: true, name }); },
  async join(clanId: string) { return mockRequest({ ok: true, clanId }); },
};
