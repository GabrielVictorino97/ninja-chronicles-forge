import type { RankingPlayer } from "@/types";
import { apiClient } from "@/lib/api";

export const rankingService = {
  async list(): Promise<RankingPlayer[]> {
    return apiClient.get<RankingPlayer[]>("/ranking", { auth: false });
  },
};
