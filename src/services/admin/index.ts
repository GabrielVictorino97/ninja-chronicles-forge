import { mockRequest } from "@/services/api";
import {
  mockAdminDashboard, mockAdminUsers, mockAdminCharacters,
  mockAdminVillages, mockAdminBloodlineClans, mockAdminJutsus,
  mockAdminMissions, mockAdminItems, mockAdminEvents,
  mockAdminBattles, mockAdminAuditLogs, mockBalanceSettings,
  mockAdminRankings,
} from "@/mocks/admin";
import type {
  AdminUser, AdminCharacter, AdminVillage, AdminBloodlineClan,
  AdminJutsu, AdminMission, AdminItem, AdminEvent, AdminBattle,
  AdminAuditLog, BalanceSettings, AdminRole,
} from "@/types/admin";

// Each service mirrors a future REST endpoint on the C# .NET backend.
// Replace mockRequest(...) with fetch("/api/admin/...") when integrating.

function crud<T extends { id: string }>(seed: T[]) {
  let data = [...seed];
  return {
    list: () => mockRequest(data),
    get: (id: string) => mockRequest(data.find((d) => d.id === id) ?? null),
    create: (item: T) => { data = [...data, item]; return mockRequest(item); },
    update: (id: string, patch: Partial<T>) => {
      data = data.map((d) => (d.id === id ? { ...d, ...patch } : d));
      return mockRequest(data.find((d) => d.id === id)!);
    },
    remove: (id: string) => { data = data.filter((d) => d.id !== id); return mockRequest({ id }); },
    raw: () => data,
  };
}

export const adminDashboardService = {
  get: () => mockRequest(mockAdminDashboard),
};

const userStore = crud<AdminUser>(mockAdminUsers);
export const adminUserService = {
  ...userStore,
  ban: (id: string) => userStore.update(id, { status: "banned" } as Partial<AdminUser>),
  unban: (id: string) => userStore.update(id, { status: "active" } as Partial<AdminUser>),
  block: (id: string) => userStore.update(id, { status: "blocked" } as Partial<AdminUser>),
  setRole: (id: string, role: AdminRole) => userStore.update(id, { role } as Partial<AdminUser>),
};

const charStore = crud<AdminCharacter>(mockAdminCharacters);
export const adminCharacterService = {
  ...charStore,
  reset: (id: string) => charStore.update(id, { level: 1, power: 100 } as Partial<AdminCharacter>),
  block: (id: string) => charStore.update(id, { status: "blocked" } as Partial<AdminCharacter>),
};

export const adminVillageService = crud<AdminVillage>(mockAdminVillages);
export const adminBloodlineClanService = crud<AdminBloodlineClan>(mockAdminBloodlineClans);
export const adminJutsuService = crud<AdminJutsu>(mockAdminJutsus);
export const adminMissionService = crud<AdminMission>(mockAdminMissions);
export const adminItemService = crud<AdminItem>(mockAdminItems);
export const adminEventService = crud<AdminEvent>(mockAdminEvents);

export const adminBattleService = {
  list: () => mockRequest(mockAdminBattles),
  get: (id: string) => mockRequest(mockAdminBattles.find((b) => b.id === id) ?? null),
};

export const adminAuditLogService = {
  list: () => mockRequest(mockAdminAuditLogs),
};

export const adminRankingService = {
  list: () => mockRequest(mockAdminRankings),
};

let balance = { ...mockBalanceSettings };
export const adminSettingsService = {
  get: () => mockRequest(balance),
  update: (patch: Partial<BalanceSettings>) => {
    balance = { ...balance, ...patch };
    return mockRequest(balance);
  },
};