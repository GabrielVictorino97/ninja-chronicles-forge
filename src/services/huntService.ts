import type { HuntStatus } from "@/types";
import { apiClient } from "@/lib/api";

export interface HuntReward {
  xp: number;
  ryous: number;
  durationMinutes: number;
  leveledUp?: boolean;
  newLevel?: number;
}

export const huntService = {
  status(characterId: string): Promise<HuntStatus> {
    return apiClient.get<HuntStatus>(`/characters/${characterId}/hunts/status`);
  },
  start(characterId: string, durationMinutes: number): Promise<void> {
    return apiClient.post<void>(`/characters/${characterId}/hunts/start`, { durationMinutes });
  },
  complete(characterId: string): Promise<HuntReward> {
    return apiClient.post<HuntReward>(`/characters/${characterId}/hunts/complete`);
  },
};
