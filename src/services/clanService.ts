import type { ClanRole, PlayerClan } from "@/types";
import { apiClient } from "@/lib/api";

interface PlayerClanDto {
  id: string;
  name: string;
  tag: string;
  level: number;
  xp: number;
  xpToNext: number;
  members: { characterId: string; name: string; level: number; role: string; donations: number }[];
  ranking: number;
  wall: { id: string; author: string; message: string; date: string }[];
}

function mapClan(dto: PlayerClanDto): PlayerClan {
  return {
    ...dto,
    members: dto.members.map((m) => ({ ...m, role: m.role as ClanRole })),
  };
}

export const clanService = {
  async getMine(): Promise<PlayerClan | null> {
    const dto = await apiClient.get<PlayerClanDto | null>("/clans/me");
    return dto ? mapClan(dto) : null;
  },
  async donate(amount: number): Promise<{ ok: boolean; amount: number }> {
    return apiClient.post("/clans/donate", { amount });
  },
  async create(name: string, tag?: string): Promise<void> {
    return apiClient.post("/clans", { name, tag });
  },
  async join(clanId: string): Promise<void> {
    return apiClient.post(`/clans/${clanId}/join`);
  },
};
