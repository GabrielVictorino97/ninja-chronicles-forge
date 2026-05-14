import { http, HttpResponse, delay } from "msw";
import type {
  Character,
  HuntStatus,
  ElementOption,
  AuthResponse,
  BaseAttributes,
} from "@/types";
import { mockVillages } from "./villages";
import { mockBloodlineClans } from "./clans";
import { mockJutsus } from "./jutsus";
import { mockMissions } from "./missions";
import { mockRanking } from "./ranking";
import { mockItems, mockInventory } from "./items";
import { mockLocations } from "./locations";
import { mockCharacter, mockUser, mockNotifications } from "./character";
import { mockPlayerClan } from "./clan";
import {
  mockAdminUsers,
  mockAdminCharacters,
  mockAdminVillages,
  mockAdminBloodlineClans,
  mockAdminMissions,
  mockAdminJutsus,
  mockAdminItems,
  mockAdminEvents,
  mockAdminBattles,
  mockAdminAuditLogs,
  mockAdminDashboard,
  mockAdminRankings,
  mockBalanceSettings,
} from "./admin";

const BASE = "http://localhost:5271/api";
const DELAY = 150;

// Mutable in-memory state that survives across requests within a session
let character: Character = structuredClone(mockCharacter);
const knownJutsus: Set<string> = new Set(character.knownJutsus);
const equippedJutsus: Set<string> = new Set(character.equippedJutsus);
const inventory: Map<string, { itemId: string; quantity: number; equipped: boolean; slot: string | null }> = new Map(
  mockInventory.map((i) => [i.itemId, { itemId: i.itemId, quantity: i.quantity, equipped: i.equipped ?? false, slot: i.slot ?? null }])
);

function resetCharacterState() {
  character = structuredClone(mockCharacter);
  knownJutsus.clear();
  character.knownJutsus.forEach((id) => knownJutsus.add(id));
  equippedJutsus.clear();
  character.equippedJutsus.forEach((id) => equippedJutsus.add(id));
  inventory.clear();
  mockInventory.forEach((i) => inventory.set(i.itemId, { itemId: i.itemId, quantity: i.quantity, equipped: i.equipped ?? false, slot: i.slot ?? null }));
}

function charToDto(c: Character) {
  return { ...c };
}

function jwtPayload() {
  return { sub: mockUser.id, email: mockUser.email, name: mockUser.name, role: "Player" };
}

const MOCK_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-access";
const MOCK_REFRESH = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-refresh";

export const handlers = [
  // ── Auth ──────────────────────────────────────────────
  http.post(`${BASE}/auth/login`, async ({ request }) => {
    await delay(DELAY);
    const body = (await request.json()) as { email: string; password: string };
    if (!body.email || !body.password) {
      return HttpResponse.json({ errors: { email: ["Email e senha obrigatórios."] } }, { status: 400 });
    }
    const res: AuthResponse = {
      accessToken: MOCK_JWT,
      refreshToken: MOCK_REFRESH,
      user: { ...mockUser, role: "Player" },
    };
    return HttpResponse.json(res);
  }),

  http.post(`${BASE}/auth/register`, async ({ request }) => {
    await delay(DELAY);
    const body = (await request.json()) as { name: string; email: string; password: string };
    if (!body.name || !body.email || !body.password) {
      return HttpResponse.json({ errors: { name: ["Todos os campos são obrigatórios."] } }, { status: 400 });
    }
    const res: AuthResponse = {
      accessToken: MOCK_JWT,
      refreshToken: MOCK_REFRESH,
      user: { id: "u1", email: body.email, name: body.name, createdAt: new Date().toISOString(), role: "Player" },
    };
    return HttpResponse.json(res);
  }),

  http.post(`${BASE}/auth/refresh`, async () => {
    await delay(DELAY);
    return HttpResponse.json({ accessToken: MOCK_JWT, refreshToken: MOCK_REFRESH });
  }),

  http.get(`${BASE}/me`, async () => {
    await delay(DELAY);
    return HttpResponse.json({ ...mockUser, role: "Player" });
  }),

  // ── Characters ────────────────────────────────────────
  http.get(`${BASE}/characters/me`, async () => {
    await delay(DELAY);
    const hasCharacter = character.name !== mockCharacter.name || character.id !== mockCharacter.id;
    if (hasCharacter || character.id === mockCharacter.id) {
      return HttpResponse.json(charToDto(character));
    }
    return HttpResponse.json(null, { status: 204 });
  }),

  http.get(`${BASE}/characters/:id`, async ({ params }) => {
    await delay(DELAY);
    const { id } = params;
    if (id === character.id || id === "c1") {
      return HttpResponse.json(charToDto(character));
    }
    return HttpResponse.json({ detail: "Personagem não encontrado." }, { status: 404 });
  }),

  http.post(`${BASE}/characters`, async ({ request }) => {
    await delay(DELAY);
    type CreateInput = { name: string; avatar: string; villageId: string; clanId: string };
    const body = (await request.json()) as CreateInput;
    const village = mockVillages.find((v) => v.id === body.villageId);
    const clan = mockBloodlineClans.find((c) => c.id === body.clanId);
    if (!village || !clan) {
      return HttpResponse.json({ errors: { villageId: ["Vila ou clã inválido."] } }, { status: 400 });
    }
    resetCharacterState();
    character = {
      id: `c-${Date.now()}`,
      userId: mockUser.id,
      name: body.name,
      avatar: body.avatar,
      villageId: body.villageId,
      clanId: body.clanId,
      elements: [],
      graduation: "Estudante",
      level: 1,
      xp: 0,
      xpToNext: 100,
      hp: 200,
      hpMax: 200,
      chakra: 100,
      chakraMax: 100,
      energy: 100,
      energyMax: 100,
      ryous: 100,
      power: 100,
      attributes: {
        taijutsu: 5, ninjutsu: 5, genjutsu: 5,
        intelligence: 5, vitality: 5, chakra: 5,
        agility: 5, luck: 5,
      },
      unspentPoints: 0,
      equippedJutsus: [],
      knownJutsus: ["j-bunshin", "j-henge", "j-kawarimi"],
      createdAt: new Date().toISOString(),
    };
    knownJutsus.clear();
    character.knownJutsus.forEach((id) => knownJutsus.add(id));
    equippedJutsus.clear();
    return HttpResponse.json(charToDto(character), { status: 201 });
  }),

  http.put(`${BASE}/characters/:id/attributes`, async ({ request }) => {
    await delay(DELAY);
    const body = (await request.json()) as { attributes: Partial<BaseAttributes> };
    if (body.attributes) {
      for (const [k, v] of Object.entries(body.attributes)) {
        const key = k as keyof BaseAttributes;
        character.attributes[key] += v as number;
        character.power += (v as number) * 120;
      }
    }
    return HttpResponse.json(charToDto(character));
  }),

  // ── Villages & Clans ──────────────────────────────────
  http.get(`${BASE}/villages`, async () => {
    await delay(DELAY);
    return HttpResponse.json(mockVillages);
  }),

  http.get(`${BASE}/bloodline-clans`, async () => {
    await delay(DELAY);
    return HttpResponse.json(mockBloodlineClans);
  }),

  // ── Jutsus ────────────────────────────────────────────
  http.get(`${BASE}/jutsus`, async () => {
    await delay(DELAY);
    return HttpResponse.json(mockJutsus);
  }),

  http.get(`${BASE}/characters/:id/jutsus`, async () => {
    await delay(DELAY);
    const jutsus = mockJutsus
      .filter((j) => knownJutsus.has(j.id))
      .map((j) => ({
        id: j.id,
        name: j.name,
        type: j.type,
        element: j.element ?? null,
        chakraCost: j.chakraCost,
        cooldown: j.cooldown,
        baseDamage: j.baseDamage,
        description: j.description,
        equipped: equippedJutsus.has(j.id),
        learnedLevel: j.requirements.level,
      }));
    return HttpResponse.json(jutsus);
  }),

  http.post(`${BASE}/characters/:id/jutsus/:jutsuId/learn`, async ({ params }) => {
    await delay(DELAY);
    knownJutsus.add(params.jutsuId as string);
    character.knownJutsus = [...knownJutsus];
    return HttpResponse.json(null, { status: 204 });
  }),

  http.post(`${BASE}/characters/:id/jutsus/:jutsuId/equip`, async ({ params }) => {
    await delay(DELAY);
    const jId = params.jutsuId as string;
    if (!knownJutsus.has(jId)) {
      return HttpResponse.json({ detail: "Jutsu não aprendido." }, { status: 400 });
    }
    equippedJutsus.add(jId);
    character.equippedJutsus = [...equippedJutsus];
    return HttpResponse.json(null, { status: 204 });
  }),

  http.post(`${BASE}/characters/:id/jutsus/:jutsuId/unequip`, async ({ params }) => {
    await delay(DELAY);
    equippedJutsus.delete(params.jutsuId as string);
    character.equippedJutsus = [...equippedJutsus];
    return HttpResponse.json(null, { status: 204 });
  }),

  // ── Elements ──────────────────────────────────────────
  http.get(`${BASE}/elements`, async () => {
    await delay(DELAY);
    const elements: ElementOption[] = [
      { name: "Katon", description: "Estilo Fogo — ofensivo e destrutivo.", requiredLevel: 10, learned: character.elements.includes("Katon") },
      { name: "Suiton", description: "Estilo Água — versátil e adaptável.", requiredLevel: 10, learned: character.elements.includes("Suiton") },
      { name: "Doton", description: "Estilo Terra — defensivo e resistente.", requiredLevel: 12, learned: character.elements.includes("Doton") },
      { name: "Fuuton", description: "Estilo Vento — cortante e rápido.", requiredLevel: 14, learned: character.elements.includes("Fuuton") },
      { name: "Raiton", description: "Estilo Raio — veloz e perfurante.", requiredLevel: 16, learned: character.elements.includes("Raiton") },
    ];
    return HttpResponse.json(elements);
  }),

  http.post(`${BASE}/characters/:id/elements/:element/learn`, async ({ params }) => {
    await delay(DELAY);
    const el = params.element as string;
    if (!character.elements.includes(el as Character["elements"][number])) {
      character.elements = [...character.elements, el as Character["elements"][number]];
    }
    return HttpResponse.json(null, { status: 204 });
  }),

  // ── Missions ──────────────────────────────────────────
  http.get(`${BASE}/missions`, async () => {
    await delay(DELAY);
    return HttpResponse.json(
      mockMissions.map((m) => ({
        ...m,
        durationMinutes: (["D","C","B","A","S"].indexOf(m.rank) + 1) * 3 + 2,
      }))
    );
  }),

  http.post(`${BASE}/characters/:id/missions/:missionId/start`, async () => {
    await delay(DELAY);
    return HttpResponse.json(null, { status: 204 });
  }),

  http.post(`${BASE}/characters/:id/missions/:missionId/complete`, async ({ params }) => {
    await delay(DELAY);
    const mission = mockMissions.find((m) => m.id === params.missionId);
    if (!mission) return HttpResponse.json({ detail: "Missão não encontrada." }, { status: 404 });
    character.xp += mission.xpReward;
    character.ryous += mission.ryousReward;
    return HttpResponse.json({ xp: mission.xpReward, ryous: mission.ryousReward, drops: mission.drops });
  }),

  // ── Inventory ─────────────────────────────────────────
  http.get(`${BASE}/characters/:id/inventory`, async () => {
    await delay(DELAY);
    const result = [...inventory.values()].map((inv) => {
      const item = mockItems.find((it) => it.id === inv.itemId);
      return {
        itemId: inv.itemId,
        name: item?.name ?? "Desconhecido",
        type: item?.type ?? "tool",
        rarity: item?.rarity ?? "common",
        icon: item?.icon ?? "Package",
        quantity: inv.quantity,
        equipped: inv.equipped,
        slot: inv.slot,
        bonuses: { attack: 0, defense: 0, intelligence: 0, agility: 0, vitality: 0, chakra: 0, luck: 0 },
      };
    });
    return HttpResponse.json(result);
  }),

  http.post(`${BASE}/characters/:id/inventory/:itemId/equip`, async ({ params }) => {
    await delay(DELAY);
    const entry = inventory.get(params.itemId as string);
    if (entry) entry.equipped = true;
    return HttpResponse.json(null, { status: 204 });
  }),

  http.post(`${BASE}/characters/:id/inventory/:itemId/unequip`, async ({ params }) => {
    await delay(DELAY);
    const entry = inventory.get(params.itemId as string);
    if (entry) entry.equipped = false;
    return HttpResponse.json(null, { status: 204 });
  }),

  // ── Shop ──────────────────────────────────────────────
  http.get(`${BASE}/shop/items`, async () => {
    await delay(DELAY);
    return HttpResponse.json(
      mockItems.map((i) => ({
        ...i,
        bonuses: { attack: 0, defense: 0, intelligence: 0, agility: 0, vitality: 0, chakra: 0, luck: 0 },
      }))
    );
  }),

  http.post(`${BASE}/characters/:id/shop/buy/:itemId`, async ({ params }) => {
    await delay(DELAY);
    const item = mockItems.find((it) => it.id === params.itemId);
    if (!item) return HttpResponse.json({ detail: "Item não encontrado." }, { status: 404 });
    if (character.ryous < item.price) {
      return HttpResponse.json({ detail: "Ryous insuficientes." }, { status: 400 });
    }
    character.ryous -= item.price;
    const existing = inventory.get(item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      inventory.set(item.id, { itemId: item.id, quantity: 1, equipped: false, slot: null });
    }
    return HttpResponse.json(null, { status: 204 });
  }),

  // ── Ranking ───────────────────────────────────────────
  http.get(`${BASE}/ranking`, async () => {
    await delay(DELAY);
    return HttpResponse.json(mockRanking);
  }),

  // ── Clans ─────────────────────────────────────────────
  http.get(`${BASE}/clans/me`, async () => {
    await delay(DELAY);
    return HttpResponse.json(mockPlayerClan);
  }),

  http.post(`${BASE}/clans/donate`, async ({ request }) => {
    await delay(DELAY);
    const body = (await request.json()) as { amount: number };
    return HttpResponse.json({ ok: true, amount: body.amount });
  }),

  http.post(`${BASE}/clans`, async () => {
    await delay(DELAY);
    return HttpResponse.json(null, { status: 201 });
  }),

  http.post(`${BASE}/clans/:id/join`, async () => {
    await delay(DELAY);
    return HttpResponse.json(null, { status: 204 });
  }),

  // ── World ─────────────────────────────────────────────
  http.get(`${BASE}/world/locations`, async () => {
    await delay(DELAY);
    return HttpResponse.json(mockLocations);
  }),

  http.post(`${BASE}/world/travel/:id`, async ({ params }) => {
    await delay(DELAY);
    return HttpResponse.json({ ok: true, locationId: params.id });
  }),

  // ── Hunts ─────────────────────────────────────────────
  http.get(`${BASE}/characters/:id/hunts/status`, async () => {
    await delay(DELAY);
    const status: HuntStatus = {
      active: false,
      huntLevel: 0,
      durationMinutes: 0,
      xpReward: 0,
      ryousReward: 0,
      startTime: "",
      endTime: "",
      secondsRemaining: 0,
      availableDurations: [30, 60, 120, 240],
      todayHuntsUsed: 0,
      todayHuntsRemaining: 5,
      totalAvailableMinutes: 300,
    };
    return HttpResponse.json(status);
  }),

  http.post(`${BASE}/characters/:id/hunts/start`, async ({ request }) => {
    await delay(DELAY);
    const body = (await request.json()) as { durationMinutes: number };
    return HttpResponse.json(null, { status: 204 });
  }),

  http.post(`${BASE}/characters/:id/hunts/complete`, async () => {
    await delay(DELAY);
    const xp = 150;
    const ryous = 200;
    character.xp += xp;
    character.ryous += ryous;
    return HttpResponse.json({ xp, ryous, durationMinutes: 30 });
  }),

  // ── Battles ───────────────────────────────────────────
  http.post(`${BASE}/characters/:id/battles/npc`, async () => {
    await delay(DELAY);
    return HttpResponse.json({
      result: "Vitoria",
      enemyName: "Bandido Errante",
      enemyLevel: 16,
      difficulty: "normal",
      xpReward: 150,
      ryousReward: 120,
      playerLevel: character.level,
      playerGraduation: character.graduation,
      playerPower: character.power,
      enemyPower: 3500,
      powerComparison: "Esmagadora",
    });
  }),

  http.post(`${BASE}/characters/:id/battles/pvp`, async () => {
    await delay(DELAY);
    return HttpResponse.json({
      result: "Vitoria",
      enemyName: "Ninja Oponente",
      enemyLevel: character.level + 1,
      difficulty: "pvp",
      xpReward: 200,
      ryousReward: 180,
      playerLevel: character.level,
      playerGraduation: character.graduation,
      playerPower: character.power,
      enemyPower: character.power + 500,
      powerComparison: "Equilibrado",
    });
  }),

  // ── Admin ─────────────────────────────────────────────
  http.get(`${BASE}/admin/dashboard`, async () => {
    await delay(DELAY);
    return HttpResponse.json(mockAdminDashboard);
  }),

  http.get(`${BASE}/admin/users`, async () => {
    await delay(DELAY);
    return HttpResponse.json(
      mockAdminUsers.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status,
        createdAt: u.createdAt,
        lastLogin: u.lastLogin,
        ip: u.ip,
      }))
    );
  }),

  http.post(`${BASE}/admin/users/:id/ban`, async () => {
    await delay(DELAY);
    return HttpResponse.json(null, { status: 204 });
  }),

  http.post(`${BASE}/admin/users/:id/unban`, async () => {
    await delay(DELAY);
    return HttpResponse.json(null, { status: 204 });
  }),

  http.put(`${BASE}/admin/users/:id/role`, async () => {
    await delay(DELAY);
    return HttpResponse.json(null, { status: 204 });
  }),

  http.get(`${BASE}/admin/characters`, async () => {
    await delay(DELAY);
    return HttpResponse.json(mockAdminCharacters);
  }),

  http.get(`${BASE}/admin/characters/:id`, async ({ params }) => {
    await delay(DELAY);
    const found = mockAdminCharacters.find((c) => c.id === params.id);
    if (!found) return HttpResponse.json({ detail: "Não encontrado." }, { status: 404 });
    return HttpResponse.json(found);
  }),

  http.put(`${BASE}/admin/characters/:id`, async () => {
    await delay(DELAY);
    return HttpResponse.json(null, { status: 204 });
  }),

  http.post(`${BASE}/admin/characters/:id/reset`, async () => {
    await delay(DELAY);
    return HttpResponse.json(null, { status: 204 });
  }),

  http.post(`${BASE}/admin/characters/:id/block`, async () => {
    await delay(DELAY);
    return HttpResponse.json(null, { status: 204 });
  }),

  http.get(`${BASE}/admin/villages`, async () => {
    await delay(DELAY);
    return HttpResponse.json(mockAdminVillages);
  }),

  http.get(`${BASE}/admin/battles`, async () => {
    await delay(DELAY);
    return HttpResponse.json(mockAdminBattles);
  }),

  http.get(`${BASE}/admin/rankings`, async () => {
    await delay(DELAY);
    return HttpResponse.json(mockAdminRankings);
  }),

  http.get(`${BASE}/admin/audit`, async () => {
    await delay(DELAY);
    return HttpResponse.json(mockAdminAuditLogs);
  }),

  http.get(`${BASE}/admin/settings`, async () => {
    await delay(DELAY);
    return HttpResponse.json(mockBalanceSettings);
  }),

  http.get(`${BASE}/events`, async () => {
    await delay(DELAY);
    return HttpResponse.json(mockAdminEvents);
  }),
];
