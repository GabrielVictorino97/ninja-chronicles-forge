import type { Battle } from "@/types";

export const mockBattle: Battle = {
  id: "b1",
  player: { id: "c1", name: "Kazumi", avatar: "🦊", hp: 820, hpMax: 980, chakra: 540, chakraMax: 720, level: 18 },
  enemy: { id: "e1", name: "Bandido Errante", avatar: "👺", hp: 600, hpMax: 600, chakra: 200, chakraMax: 200, level: 16 },
  turn: 1,
  isPlayerTurn: true,
  log: [{ id: "lg0", turn: 0, actor: "system", message: "A batalha começou! Cuidado, ninja." }],
  status: "ongoing",
  statusEffects: [],
};
