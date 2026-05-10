import type {
  AdminUser, AdminCharacter, AdminVillage, AdminBloodlineClan,
  AdminMission, AdminJutsu, AdminItem, AdminEvent, AdminBattle,
  AdminAuditLog, BalanceSettings, AdminDashboardData, RankingEntry,
} from "@/types/admin";
import { mockVillages } from "./villages";
import { mockBloodlineClans } from "./clans";

const NAMES = ["Kazumi", "Ryuji", "Hikari", "Daichi", "Aiko", "Hideo", "Sakura", "Naoki", "Yuki", "Ren", "Mei", "Takeshi", "Asuka", "Kenji", "Mio", "Sora", "Hana", "Kaito", "Rina", "Shou"];
const GRADUATIONS = ["Estudante", "Genin", "Chunin", "Tokubetsu Jounin", "Jounin", "ANBU", "Kage"] as const;
const ELEMENTS = ["Katon", "Suiton", "Doton", "Fuuton", "Raiton"] as const;

const rand = (n: number) => Math.floor(Math.random() * n);
const dateAgo = (days: number) => new Date(Date.now() - days * 86400000).toISOString();

export const mockAdminUsers: AdminUser[] = Array.from({ length: 32 }, (_, i) => ({
  id: `u-${i + 1}`,
  name: `${NAMES[i % NAMES.length]}${i}`,
  email: `player${i + 1}@vila.gg`,
  role: i === 0 ? "SuperAdmin" : i < 3 ? "Admin" : i < 6 ? "Moderator" : "Player",
  status: i % 11 === 0 ? "banned" : i % 13 === 0 ? "blocked" : "active",
  createdAt: dateAgo(60 - i),
  lastLogin: dateAgo(i % 7),
  ip: `192.168.${i}.${(i * 3) % 255}`,
  loginHistory: Array.from({ length: 5 }, (_, j) => ({
    date: dateAgo(j),
    ip: `192.168.${i}.${(i * 3 + j) % 255}`,
    device: j % 2 === 0 ? "Chrome / Windows" : "Safari / iOS",
  })),
}));

export const mockAdminCharacters: AdminCharacter[] = mockAdminUsers.slice(0, 24).map((u, i) => ({
  id: `c-${i + 1}`,
  name: `${NAMES[i % NAMES.length]}-${i}`,
  userId: u.id,
  userName: u.name,
  villageId: mockVillages[i % mockVillages.length].id,
  clanId: mockBloodlineClans[i % mockBloodlineClans.length].id,
  level: 5 + (i * 3) % 60,
  graduation: GRADUATIONS[i % GRADUATIONS.length],
  power: 1500 + i * 312,
  ryous: 500 + i * 187,
  status: i % 9 === 0 ? "blocked" : "active",
  attributes: {
    taijutsu: 20 + rand(40), ninjutsu: 20 + rand(40), genjutsu: 10 + rand(30),
    intelligence: 15 + rand(30), vitality: 25 + rand(40), chakra: 25 + rand(40),
    agility: 20 + rand(35), luck: 5 + rand(25),
  },
}));

export const mockAdminVillages: AdminVillage[] = mockVillages.map((v, i) => ({
  ...v,
  active: true,
  bonus: ["+5% XP", "+5% Drop", "+10% Defesa", "+10% Crítico", "+5% Ataque", "+8% Esquiva", "+10% Chakra"][i],
  themeColor: ["#ef4444", "#eab308", "#3b82f6", "#a855f7", "#92400e", "#0ea5e9", "#7c3aed"][i],
}));

export const mockAdminBloodlineClans: AdminBloodlineClan[] = mockBloodlineClans.map((c, i) => ({
  id: c.id,
  name: c.name,
  villageId: mockVillages[i % mockVillages.length].id,
  description: c.description,
  passiveBonus: c.bonus,
  kekkeiGenkai: ["Sharingan", "Byakugan", "Chakra Vital", "Mokuton", "Kageyose", "Baika", "Shintenshin", "Mushi", "Inu", "Enkō", "Shikotsumyaku", "Suika", "Hakkō", "Sajin"][i] || "Nenhum",
  active: true,
  exclusiveJutsus: [`${c.name} Secret Art I`, `${c.name} Secret Art II`],
}));

const RANKS = ["D", "C", "B", "A", "S"] as const;
const MTYPES = ["Entrega", "Patrulha", "Escolta", "Investigação", "Captura", "Defesa da vila", "Assassinato", "Infiltração", "Resgate", "Treinamento", "Boss", "História", "Diária", "Semanal", "Clã"] as const;

export const mockAdminMissions: AdminMission[] = Array.from({ length: 22 }, (_, i) => ({
  id: `m-${i + 1}`,
  name: `Missão ${MTYPES[i % MTYPES.length]} #${i + 1}`,
  description: "Descrição da missão gerada para o painel administrativo.",
  rank: RANKS[i % 5],
  type: MTYPES[i % MTYPES.length],
  energyCost: 5 + (i % 10) * 3,
  minLevel: 1 + (i % 8) * 5,
  minGraduation: GRADUATIONS[i % GRADUATIONS.length],
  xpReward: 50 + i * 35,
  ryousReward: 80 + i * 40,
  itemRewards: i % 3 === 0 ? ["Kunai"] : ["Pergaminho", "Pílula"],
  enemies: ["Bandido Errante", "Ninja Renegado"],
  cooldown: i % 4 === 0 ? 0 : 30,
  repeatable: i % 4 !== 0,
  active: i % 7 !== 0,
}));

const JTYPES = ["Taijutsu", "Ninjutsu", "Genjutsu", "Fuinjutsu", "Iryo Ninjutsu", "Senjutsu", "Doujutsu", "Kinjutsu", "Kuchiyose", "Kekkei Genkai"] as const;
const ATTR_KEYS = ["taijutsu", "ninjutsu", "genjutsu", "intelligence", "chakra", "agility"] as const;

export const mockAdminJutsus: AdminJutsu[] = Array.from({ length: 24 }, (_, i) => ({
  id: `j-${i + 1}`,
  name: `${JTYPES[i % JTYPES.length]} Técnica ${i + 1}`,
  description: "Jutsu gerado para administração do balanceamento.",
  type: JTYPES[i % JTYPES.length],
  element: i % 3 === 0 ? ELEMENTS[i % ELEMENTS.length] : undefined,
  chakraCost: 10 + (i % 8) * 8,
  cooldown: 1 + (i % 6),
  baseDamage: 20 + i * 6,
  scalesWith: ATTR_KEYS[i % ATTR_KEYS.length],
  precision: 70 + (i * 3) % 30,
  critChance: 5 + (i * 2) % 20,
  minLevel: 1 + (i * 2) % 50,
  minGraduation: GRADUATIONS[i % GRADUATIONS.length],
  clanRequirement: i % 5 === 0 ? mockBloodlineClans[i % mockBloodlineClans.length].name : undefined,
  elementRequirement: i % 4 === 0 ? ELEMENTS[i % ELEMENTS.length] : undefined,
  pvp: i % 9 !== 0,
  pve: true,
  active: i % 11 !== 0,
}));

const ITYPES = ["Arma", "Armadura", "Acessório", "Ferramenta Ninja", "Consumível", "Pergaminho", "Material", "Evento"] as const;
const RARITIES = ["Comum", "Incomum", "Raro", "Épico", "Lendário", "Mítico"] as const;

export const mockAdminItems: AdminItem[] = Array.from({ length: 26 }, (_, i) => ({
  id: `it-${i + 1}`,
  name: `Item ${ITYPES[i % ITYPES.length]} ${i + 1}`,
  description: "Item gerado para o painel.",
  type: ITYPES[i % ITYPES.length],
  rarity: RARITIES[i % RARITIES.length],
  price: 50 + i * 90,
  sellable: i % 8 !== 0,
  equippable: i % 3 === 0,
  consumable: i % 5 === 0,
  minLevel: 1 + (i * 2) % 40,
  minGraduation: GRADUATIONS[i % GRADUATIONS.length],
  attributeBonus: { taijutsu: i % 5, vitality: i % 4 },
  active: i % 13 !== 0,
}));

const EVENT_NAMES = ["Invasão da Akatsuki", "Exame Chunin", "Guerra Ninja", "Ataque da Kurama", "Boss Orochimaru", "Boss Pain", "Torneio dos Cinco Kages", "XP Dobrado", "Drop Aumentado"];
const ETYPES = ["Invasão", "Torneio", "Boss", "Bônus", "História"] as const;

export const mockAdminEvents: AdminEvent[] = EVENT_NAMES.map((name, i) => ({
  id: `e-${i + 1}`,
  name,
  description: "Evento programado da temporada.",
  type: ETYPES[i % ETYPES.length],
  startsAt: dateAgo(5 - i),
  endsAt: dateAgo(-7 + i),
  xpMultiplier: 1 + (i % 3) * 0.5,
  dropMultiplier: 1 + (i % 4) * 0.25,
  rewards: ["Caixa rara", "Kunai dourada", "Título exclusivo"],
  status: i < 2 ? "ended" : i < 6 ? "ongoing" : "scheduled",
  banner: `linear-gradient(135deg, hsl(${i * 40} 70% 45%), hsl(${i * 40 + 60} 70% 30%))`,
}));

export const mockAdminBattles: AdminBattle[] = Array.from({ length: 30 }, (_, i) => ({
  id: `b-${i + 1}`,
  player1: `${NAMES[i % NAMES.length]}${i}`,
  player2: i % 3 === 0 ? `Bandido ${i}` : `${NAMES[(i + 5) % NAMES.length]}${i + 1}`,
  type: (["PvP", "PvE", "Boss", "Arena"] as const)[i % 4],
  winner: i % 2 === 0 ? `${NAMES[i % NAMES.length]}${i}` : `${NAMES[(i + 5) % NAMES.length]}${i + 1}`,
  duration: `${1 + i % 10}m ${10 + i * 3 % 50}s`,
  date: dateAgo(i % 14),
  status: i % 17 === 0 ? "abandoned" : "completed",
  turns: Array.from({ length: 6 }, (_, t) => ({
    n: t + 1,
    actor: t % 2 === 0 ? "Jogador" : "Inimigo",
    action: t % 2 === 0 ? "Rasengan" : "Katon: Goukakyuu",
    damage: 30 + t * 12,
  })),
  rewards: ["+250 XP", "+180 Ryous"],
}));

export const mockAdminAuditLogs: AdminAuditLog[] = Array.from({ length: 40 }, (_, i) => ({
  id: `al-${i + 1}`,
  user: i % 5 === 0 ? "system" : mockAdminUsers[i % mockAdminUsers.length].name,
  action: ["create", "update", "delete", "ban", "unban", "reset"][i % 6],
  entity: ["user", "character", "jutsu", "mission", "item", "event"][i % 6],
  entityId: `${1000 + i}`,
  date: dateAgo(i % 20),
  ip: `10.0.${i % 200}.${i % 255}`,
  description: "Operação registrada para auditoria.",
}));

export const mockBalanceSettings: BalanceSettings = {
  baseXpPerLevel: 100,
  maxEnergy: 120,
  energyRegenMinutes: 5,
  critDamageMultiplier: 1.75,
  elementalAdvantageMultiplier: 1.3,
  defeatPenalty: 0.1,
  clanCreationCost: 50000,
  clanMembersLimit: 30,
  baseDropRate: 0.15,
};

export const mockAdminDashboard: AdminDashboardData = {
  totalUsers: 12480,
  activeUsers: 3287,
  charactersCreated: 14920,
  battlesToday: 842,
  missionsToday: 1280,
  activeClans: 73,
  activeEvents: mockAdminEvents.filter((e) => e.status === "ongoing").length,
  pendingReports: 12,
  bannedUsers: mockAdminUsers.filter((u) => u.status === "banned").length,
  transactions: 318,
  newUsersByDay: Array.from({ length: 14 }, (_, i) => ({
    date: dateAgo(13 - i).slice(5, 10),
    value: 40 + Math.round(Math.sin(i / 2) * 25 + i * 4),
  })),
  battlesByDay: Array.from({ length: 14 }, (_, i) => ({
    date: dateAgo(13 - i).slice(5, 10),
    value: 200 + Math.round(Math.cos(i / 2) * 80 + i * 12),
  })),
  missionsByRank: RANKS.map((r, i) => ({ rank: r, value: 600 - i * 110 })),
  villagesDistribution: mockVillages.map((v, i) => ({ name: v.name, value: 800 - i * 90 })),
  clansDistribution: mockBloodlineClans.slice(0, 8).map((c, i) => ({ name: c.name, value: 400 - i * 35 })),
};

export const mockAdminRankings: RankingEntry[] = mockAdminCharacters.map((c, i) => ({
  position: i + 1,
  name: c.name,
  village: mockVillages.find((v) => v.id === c.villageId)?.name || "—",
  clan: mockBloodlineClans.find((b) => b.id === c.clanId)?.name || "—",
  level: c.level,
  power: c.power,
  wins: 50 + i * 4,
  losses: 10 + i,
})).sort((a, b) => b.power - a.power).map((r, i) => ({ ...r, position: i + 1 }));