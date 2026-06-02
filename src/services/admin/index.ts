import { apiClient } from "@/lib/api";
import type {
  AdminUser,
  AdminCharacter,
  AdminVillage,
  AdminBloodlineClan,
  AdminBattle,
  AdminAuditLog,
  BalanceSettings,
  AdminRole,
  AdminMission,
  AdminJutsu,
  AdminItem,
  AdminEvent,
  AdminDashboardData,
  RankingEntry,
} from "@/types/admin";

interface DashboardDto {
  totalUsers: number;
  activeUsers: number;
  charactersCreated: number;
  battlesToday: number;
  missionsToday: number;
  activeClans: number;
  activeEvents: number;
  pendingReports: number;
  bannedUsers: number;
  transactions: number;
  newUsersByDay: { date: string; value: number }[];
  battlesByDay: { date: string; value: number }[];
  missionsByRank: { rank: string; value: number }[];
  villagesDistribution: { name: string; value: number }[];
  clansDistribution: { name: string; value: number }[];
}

interface AdminUserDto {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin: string;
  ip: string;
}

function mapUser(dto: AdminUserDto): AdminUser {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    role: dto.role as AdminRole,
    status: dto.status as AdminUser["status"],
    createdAt: dto.createdAt,
    lastLogin: dto.lastLogin,
    ip: dto.ip,
    loginHistory: [],
  };
}

export const adminDashboardService = {
  get: () => apiClient.get<DashboardDto>("/admin/dashboard"),
};

export const adminUserService = {
  list: async (): Promise<AdminUser[]> => {
    const users = await apiClient.get<AdminUserDto[]>("/admin/users");
    return users.map(mapUser);
  },
  get: async (id: string): Promise<AdminUser | null> => {
    const users = await apiClient.get<AdminUserDto[]>("/admin/users");
    const u = users.find((u) => u.id === id);
    return u ? mapUser(u) : null;
  },
  ban: (id: string) => apiClient.post(`/admin/users/${id}/ban`),
  unban: (id: string) => apiClient.post(`/admin/users/${id}/unban`),
  block: (id: string) => apiClient.post(`/admin/users/${id}/ban`),
  setRole: (id: string, role: AdminRole) => apiClient.put(`/admin/users/${id}/role`, { role }),
};

export const adminCharacterService = {
  list: async () => apiClient.get<AdminCharacter[]>("/admin/characters"),
  get: async (id: string) => apiClient.get<AdminCharacter>(`/admin/characters/${id}`),
  update: async (id: string, patch: Partial<AdminCharacter>) =>
    apiClient.put<AdminCharacter>(`/admin/characters/${id}`, patch),
  reset: (id: string) => apiClient.post(`/admin/characters/${id}/reset`),
  block: (id: string) => apiClient.post(`/admin/characters/${id}/block`),
};

export const adminVillageService = {
  list: async (): Promise<AdminVillage[]> => {
    return apiClient.get<AdminVillage[]>("/admin/villages");
  },
  create: async (_item: AdminVillage): Promise<AdminVillage> => {
    throw new Error("Criação de vila ainda não disponível na API.");
  },
  update: async (_id: string, _patch: Partial<AdminVillage>): Promise<AdminVillage> => {
    throw new Error("Atualização de vila ainda não disponível na API.");
  },
  remove: async (_id: string): Promise<{ id: string }> => {
    throw new Error("Remoção de vila ainda não disponível na API.");
  },
};

export const adminBloodlineClanService = {
  list: async (): Promise<AdminBloodlineClan[]> => {
    return apiClient.get<AdminBloodlineClan[]>("/bloodline-clans", { auth: false });
  },
};

export const adminBattleService = {
  list: async (): Promise<AdminBattle[]> => {
    return apiClient.get<AdminBattle[]>("/admin/battles");
  },
};

export const adminRankingService = {
  list: async (): Promise<RankingEntry[]> => apiClient.get<RankingEntry[]>("/admin/rankings"),
};

// Placeholder for features not yet fully implemented server-side
const defaultSettings: BalanceSettings = {
  baseXpPerLevel: 100,
  maxEnergy: 100,
  energyRegenMinutes: 5,
  critDamageMultiplier: 1.5,
  elementalAdvantageMultiplier: 1.2,
  defeatPenalty: 0.05,
  clanCreationCost: 500,
  clanMembersLimit: 30,
  baseDropRate: 0.1,
};

export const adminSettingsService = {
  get: async (): Promise<BalanceSettings> => defaultSettings,
  update: async (_patch: Partial<BalanceSettings>): Promise<BalanceSettings> => defaultSettings,
};

export const adminJutsuService = {
  list: async (): Promise<AdminJutsu[]> => apiClient.get("/jutsus", { auth: false }),
};

export const adminMissionService = {
  list: async (): Promise<AdminMission[]> => apiClient.get("/missions", { auth: false }),
};

export const adminItemService = {
  list: async (): Promise<AdminItem[]> => apiClient.get("/shop/items", { auth: false }),
};

export const adminEventService = {
  list: async (): Promise<AdminEvent[]> => apiClient.get("/events", { auth: false }),
};

export const adminAuditLogService = {
  list: async (): Promise<AdminAuditLog[]> => apiClient.get("/admin/audit"),
};
