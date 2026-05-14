import type { Mission } from "@/types";
import { apiClient } from "@/lib/api";

interface MissionDto {
  id: string;
  title: string;
  rank: string;
  description: string;
  energyCost: number;
  xpReward: number;
  ryousReward: number;
  drops: string[];
  durationMinutes: number;
  requirements: { graduation: string | null; level: number | null };
}

interface CompleteMissionResponse {
  xp: number;
  ryous: number;
  drops: string[];
}

export const missionService = {
  async list(): Promise<Mission[]> {
    const missions = await apiClient.get<MissionDto[]>("/missions", { auth: false });
    return missions.map(m => ({
      id: m.id,
      title: m.title,
      rank: m.rank as Mission["rank"],
      description: m.description,
      energyCost: m.energyCost,
      xpReward: m.xpReward,
      ryousReward: m.ryousReward,
      drops: m.drops,
      requirements: { graduation: m.requirements.graduation, level: m.requirements.level },
    } as Mission));
  },
  async start(characterId: string, missionId: string): Promise<void> {
    return apiClient.post<void>(`/characters/${characterId}/missions/${missionId}/start`);
  },
  async complete(characterId: string, missionId: string): Promise<CompleteMissionResponse> {
    return apiClient.post<CompleteMissionResponse>(`/characters/${characterId}/missions/${missionId}/complete`);
  },
};
