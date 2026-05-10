import type { PlayerClan } from "@/types";

export const mockPlayerClan: PlayerClan = {
  id: "pc1",
  name: "Folha Negra",
  tag: "FN",
  level: 12,
  xp: 8200,
  xpToNext: 12000,
  ranking: 7,
  members: [
    { characterId: "c1", name: "Kazumi", level: 18, role: "Sub-líder", donations: 1200 },
    { characterId: "c2", name: "Tenma", level: 25, role: "Líder", donations: 2400 },
    { characterId: "c3", name: "Rumi", level: 14, role: "Oficial", donations: 800 },
    { characterId: "c4", name: "Hayato", level: 12, role: "Membro", donations: 350 },
    { characterId: "c5", name: "Sora", level: 8, role: "Recruta", donations: 80 },
  ],
  wall: [
    { id: "w1", author: "Tenma", message: "Treinamento amanhã às 20h, todos presentes!", date: "1h" },
    { id: "w2", author: "Rumi", message: "Doei 500 ryous, vamos subir o clã 💪", date: "5h" },
    { id: "w3", author: "Kazumi", message: "Voltei da missão A com sucesso!", date: "ontem" },
  ],
};
