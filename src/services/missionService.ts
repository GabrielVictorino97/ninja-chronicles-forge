import { mockMissions } from "@/mocks/missions";
import type { Mission } from "@/types";
import { mockRequest } from "./api";

export const missionService = {
  async list(): Promise<Mission[]> { return mockRequest(mockMissions); },
  async start(id: string) {
    // Backend will validate energy and pre-roll outcome.
    return mockRequest({ ok: true, missionId: id });
  },
  async complete(id: string) {
    // Backend computes XP/Ryous/drops.
    const m = mockMissions.find((x) => x.id === id);
    return mockRequest({ ok: true, xp: m?.xpReward ?? 0, ryous: m?.ryousReward ?? 0, drops: m?.drops ?? [] });
  },
};
