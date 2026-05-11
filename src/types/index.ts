// Core domain types for the Naruto Players Fan Game prototype.
// All sensitive game logic (damage, rewards, XP, energy, cooldowns, real
// battles) will be computed by the future C# .NET backend. The frontend
// only models data shapes and simulates flows.

export type ID = string;

export type Rank = "D" | "C" | "B" | "A" | "S";

export type Graduation =
  | "Estudante"
  | "Genin"
  | "Chunin"
  | "Tokubetsu Jounin"
  | "Jounin"
  | "ANBU"
  | "Kage";

export type ElementAffinity =
  | "Katon"
  | "Suiton"
  | "Doton"
  | "Fuuton"
  | "Raiton";

export type VillageId =
  | "konoha"
  | "suna"
  | "kiri"
  | "kumo"
  | "iwa"
  | "ame"
  | "oto";

export interface Village {
  id: VillageId;
  name: string;
  fullName: string;
  country: string;
  description: string;
  symbol: string; // emoji / glyph placeholder
  accentColor: string; // semantic token name
}

export type BloodlineClanId =
  | "uchiha" | "hyuga" | "uzumaki" | "senju" | "nara" | "akimichi"
  | "yamanaka" | "aburame" | "inuzuka" | "sarutobi" | "kaguya"
  | "hozuki" | "hatake" | "sabaku";

export interface BloodlineClan {
  id: BloodlineClanId;
  name: string;
  description: string;
  bonus: string;
  symbol: string;
}

export type JutsuType =
  | "Taijutsu" | "Ninjutsu" | "Genjutsu" | "Fuinjutsu" | "Iryo Ninjutsu"
  | "Senjutsu" | "Doujutsu" | "Kinjutsu" | "Kuchiyose" | "Kekkei Genkai";

export interface Jutsu {
  id: ID;
  name: string;
  type: JutsuType;
  element?: ElementAffinity;
  chakraCost: number;
  cooldown: number;
  baseDamage: number;
  description: string;
  requirements: { level: number; attribute?: keyof BaseAttributes; value?: number };
}

export interface BaseAttributes {
  taijutsu: number;
  ninjutsu: number;
  genjutsu: number;
  intelligence: number;
  vitality: number;
  chakra: number;
  agility: number;
  luck: number;
}

export interface DerivedAttributes {
  hpMax: number;
  chakraMax: number;
  physicalAttack: number;
  ninjutsuAttack: number;
  genjutsuAttack: number;
  physicalDefense: number;
  spiritualDefense: number;
  mentalResistance: number;
  initiative: number;
  critChance: number;
  dodge: number;
  precision: number;
}

export interface User {
  id: ID;
  email: string;
  name: string;
  createdAt: string;
}

export interface Character {
  id: ID;
  userId: ID;
  name: string;
  avatar: string;
  villageId: VillageId;
  clanId: BloodlineClanId;
  /** Backend retorna lista — personagem começa sem elementos e aprende a partir do nível 20. */
  elements: ElementAffinity[];
  graduation: Graduation;
  level: number;
  xp: number;
  xpToNext: number;
  hp: number;
  hpMax: number;
  chakra: number;
  chakraMax: number;
  energy: number;
  energyMax: number;
  ryous: number;
  power: number;
  attributes: BaseAttributes;
  unspentPoints: number;
  equippedJutsus: ID[];
  knownJutsus: ID[];
  createdAt: string;
}

export interface Mission {
  id: ID;
  title: string;
  rank: Rank;
  description: string;
  energyCost: number;
  xpReward: number;
  ryousReward: number;
  drops: string[];
  requirements: { graduation?: Graduation; level?: number };
}

export type ItemType =
  | "weapon" | "armor" | "accessory" | "tool" | "consumable" | "summon";

export type ItemRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface Item {
  id: ID;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  description: string;
  price: number;
  icon: string; // lucide icon name
}

export interface InventoryItem {
  itemId: ID;
  quantity: number;
  equipped?: boolean;
  slot?: EquipSlot;
}

export type EquipSlot =
  | "weapon" | "armor" | "accessory1" | "accessory2" | "tool" | "summon";

export interface BattleActor {
  id: ID;
  name: string;
  avatar: string;
  hp: number;
  hpMax: number;
  chakra: number;
  chakraMax: number;
  level: number;
}

export interface BattleLogEntry {
  id: ID;
  turn: number;
  actor: "player" | "enemy" | "system";
  message: string;
  damage?: number;
}

export interface Battle {
  id: ID;
  player: BattleActor;
  enemy: BattleActor;
  turn: number;
  isPlayerTurn: boolean;
  log: BattleLogEntry[];
  status: "ongoing" | "victory" | "defeat" | "fled";
  statusEffects: { actor: "player" | "enemy"; name: string; turns: number }[];
}

export type ClanRole = "Líder" | "Sub-líder" | "Oficial" | "Membro" | "Recruta";

export interface PlayerClanMember {
  characterId: ID;
  name: string;
  level: number;
  role: ClanRole;
  donations: number;
}

export interface PlayerClan {
  id: ID;
  name: string;
  tag: string;
  level: number;
  xp: number;
  xpToNext: number;
  members: PlayerClanMember[];
  ranking: number;
  wall: { id: ID; author: string; message: string; date: string }[];
}

export interface RankingPlayer {
  position: number;
  name: string;
  village: string;
  clan: string;
  level: number;
  graduation: Graduation;
  power: number;
  wins: number;
}

export interface Location {
  id: ID;
  name: string;
  type: "país" | "região" | "santuário" | "esconderijo";
  graduationRequired: Graduation;
  enemies: string[];
  missionIds: ID[];
  description: string;
}

export interface Notification {
  id: ID;
  title: string;
  description: string;
  date: string;
  read: boolean;
  type: "info" | "success" | "warning" | "battle" | "mission";
}

// ----- Backend extras -----

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User & { role?: string };
}

export interface HuntStatus {
  active: boolean;
  huntLevel: number;
  durationMinutes: number;
  xpReward: number;
  ryousReward: number;
  startTime: string;
  endTime: string;
  secondsRemaining: number;
  availableDurations: number[];
}

export interface ElementOption {
  name: ElementAffinity;
  description: string;
  requiredLevel: number;
}
