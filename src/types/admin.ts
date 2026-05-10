import type { ID, Rank, Graduation, ElementAffinity, JutsuType, ItemType, ItemRarity, BaseAttributes, VillageId, BloodlineClanId } from "./index";

export type AdminRole = "Player" | "Moderator" | "Admin" | "SuperAdmin";
export type UserStatus = "active" | "banned" | "blocked" | "pending";

export interface AdminUser {
  id: ID;
  name: string;
  email: string;
  role: AdminRole;
  status: UserStatus;
  createdAt: string;
  lastLogin: string;
  ip: string;
  loginHistory: { date: string; ip: string; device: string }[];
}

export interface AdminCharacter {
  id: ID;
  name: string;
  userId: ID;
  userName: string;
  villageId: VillageId;
  clanId: BloodlineClanId;
  level: number;
  graduation: Graduation;
  power: number;
  ryous: number;
  status: "active" | "blocked";
  attributes: BaseAttributes;
}

export interface AdminVillage {
  id: VillageId | string;
  name: string;
  fullName: string;
  country: string;
  description: string;
  active: boolean;
  bonus: string;
  themeColor: string;
}

export interface AdminBloodlineClan {
  id: ID;
  name: string;
  villageId: VillageId | string;
  description: string;
  passiveBonus: string;
  kekkeiGenkai: string;
  active: boolean;
  exclusiveJutsus: string[];
}

export type MissionType =
  | "Entrega" | "Patrulha" | "Escolta" | "Investigação" | "Captura"
  | "Defesa da vila" | "Assassinato" | "Infiltração" | "Resgate"
  | "Treinamento" | "Boss" | "História" | "Diária" | "Semanal" | "Clã";

export interface AdminMission {
  id: ID;
  name: string;
  description: string;
  rank: Rank;
  type: MissionType;
  energyCost: number;
  minLevel: number;
  minGraduation: Graduation;
  xpReward: number;
  ryousReward: number;
  itemRewards: string[];
  enemies: string[];
  cooldown: number;
  repeatable: boolean;
  active: boolean;
}

export interface AdminJutsu {
  id: ID;
  name: string;
  description: string;
  type: JutsuType;
  element?: ElementAffinity;
  chakraCost: number;
  cooldown: number;
  baseDamage: number;
  scalesWith: keyof BaseAttributes;
  precision: number;
  critChance: number;
  minLevel: number;
  minGraduation: Graduation;
  clanRequirement?: string;
  elementRequirement?: ElementAffinity;
  pvp: boolean;
  pve: boolean;
  active: boolean;
}

export type AdminItemType = "Arma" | "Armadura" | "Acessório" | "Ferramenta Ninja" | "Consumível" | "Pergaminho" | "Material" | "Evento";
export type AdminItemRarity = "Comum" | "Incomum" | "Raro" | "Épico" | "Lendário" | "Mítico";

export interface AdminItem {
  id: ID;
  name: string;
  description: string;
  type: AdminItemType;
  rarity: AdminItemRarity;
  price: number;
  sellable: boolean;
  equippable: boolean;
  consumable: boolean;
  minLevel: number;
  minGraduation: Graduation;
  attributeBonus: Partial<BaseAttributes>;
  active: boolean;
}

export type EventType = "Boss" | "Torneio" | "Invasão" | "Bônus" | "História";
export type EventStatus = "scheduled" | "ongoing" | "ended";

export interface AdminEvent {
  id: ID;
  name: string;
  description: string;
  type: EventType;
  startsAt: string;
  endsAt: string;
  xpMultiplier: number;
  dropMultiplier: number;
  rewards: string[];
  status: EventStatus;
  banner: string;
}

export interface AdminBattle {
  id: ID;
  player1: string;
  player2: string;
  type: "PvP" | "PvE" | "Boss" | "Arena";
  winner: string;
  duration: string;
  date: string;
  status: "completed" | "abandoned";
  turns: { n: number; actor: string; action: string; damage: number }[];
  rewards: string[];
}

export interface AdminAuditLog {
  id: ID;
  user: string;
  action: string;
  entity: string;
  entityId: string;
  date: string;
  ip: string;
  description: string;
}

export interface BalanceSettings {
  baseXpPerLevel: number;
  maxEnergy: number;
  energyRegenMinutes: number;
  critDamageMultiplier: number;
  elementalAdvantageMultiplier: number;
  defeatPenalty: number;
  clanCreationCost: number;
  clanMembersLimit: number;
  baseDropRate: number;
}

export interface AdminDashboardData {
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
  missionsByRank: { rank: Rank; value: number }[];
  villagesDistribution: { name: string; value: number }[];
  clansDistribution: { name: string; value: number }[];
}

export interface RankingEntry {
  position: number;
  name: string;
  village: string;
  clan: string;
  level: number;
  power: number;
  wins: number;
  losses: number;
}