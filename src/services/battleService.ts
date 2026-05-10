import { mockBattle } from "@/mocks/battle";
import type { Battle, BattleLogEntry } from "@/types";
import { mockRequest } from "./api";

// Frontend-only simulation. Real damage formulas, RNG seeds, status effects,
// and validations will be authoritative on the C# backend.
export const battleService = {
  async start(): Promise<Battle> {
    return mockRequest(structuredClone(mockBattle));
  },
  simulateAction(state: Battle, action: "basic" | "defend" | "item" | "flee" | "jutsu", jutsuName?: string): Battle {
    if (state.status !== "ongoing") return state;
    const next = structuredClone(state);
    const log: BattleLogEntry[] = [...next.log];
    const id = () => `lg${log.length + 1}`;

    if (action === "flee") {
      log.push({ id: id(), turn: next.turn, actor: "system", message: "Você fugiu da batalha." });
      next.status = "fled";
      next.log = log;
      return next;
    }

    if (action === "basic") {
      const dmg = 40 + Math.floor(Math.random() * 30);
      next.enemy.hp = Math.max(0, next.enemy.hp - dmg);
      log.push({ id: id(), turn: next.turn, actor: "player", message: `Ataque básico em ${next.enemy.name}.`, damage: dmg });
    } else if (action === "defend") {
      log.push({ id: id(), turn: next.turn, actor: "player", message: "Você assume postura defensiva." });
    } else if (action === "item") {
      const heal = 80 + Math.floor(Math.random() * 40);
      next.player.hp = Math.min(next.player.hpMax, next.player.hp + heal);
      log.push({ id: id(), turn: next.turn, actor: "player", message: `Usou Pílula de soldado (+${heal} HP).`, damage: -heal });
    } else if (action === "jutsu") {
      const cost = 25;
      if (next.player.chakra < cost) {
        log.push({ id: id(), turn: next.turn, actor: "system", message: "Chakra insuficiente!" });
        next.log = log;
        return next;
      }
      next.player.chakra -= cost;
      const dmg = 60 + Math.floor(Math.random() * 50);
      next.enemy.hp = Math.max(0, next.enemy.hp - dmg);
      log.push({ id: id(), turn: next.turn, actor: "player", message: `Usou ${jutsuName ?? "Jutsu"} em ${next.enemy.name}.`, damage: dmg });
    }

    if (next.enemy.hp <= 0) {
      log.push({ id: id(), turn: next.turn, actor: "system", message: "Vitória! Você derrotou o inimigo." });
      next.status = "victory";
      next.log = log;
      return next;
    }

    // Enemy turn (simulated)
    const enemyDmg = 25 + Math.floor(Math.random() * 25);
    next.player.hp = Math.max(0, next.player.hp - enemyDmg);
    log.push({ id: id(), turn: next.turn, actor: "enemy", message: `${next.enemy.name} contra-atacou.`, damage: enemyDmg });

    if (next.player.hp <= 0) {
      log.push({ id: id(), turn: next.turn, actor: "system", message: "Você foi derrotado..." });
      next.status = "defeat";
    }

    next.turn += 1;
    next.log = log;
    return next;
  },
};
