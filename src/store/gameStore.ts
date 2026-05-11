import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Character, User } from "@/types";
import { mockCharacter, mockUser } from "@/mocks/character";
import { tokenStorage } from "@/lib/api";
import { authService } from "@/services/authService";
import { characterService } from "@/services/characterService";

interface GameState {
  isAuthenticated: boolean;
  user: User | null;
  character: Character | null;
  hasCharacter: boolean;
  login: (user: User) => void;
  logout: () => void;
  setCharacter: (c: Character) => void;
  patchCharacter: (p: Partial<Character>) => void;
  gainXp: (amount: number) => { leveledUp: boolean; newLevel: number; gained: number };
  gainRyous: (amount: number) => void;
  /** Reidrata sessão a partir do JWT salvo no localStorage. */
  hydrate: () => Promise<void>;
  // Dev seed for prototype usage
  seedDemo: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      character: null,
      hasCharacter: false,
      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => {
        void authService.logout();
        set({ isAuthenticated: false, user: null, character: null, hasCharacter: false });
      },
      setCharacter: (c) => set({ character: c, hasCharacter: true }),
      patchCharacter: (p) => {
        const cur = get().character;
        if (!cur) return;
        set({ character: { ...cur, ...p } });
      },
      gainXp: (amount) => {
        const cur = get().character;
        if (!cur || amount <= 0) return { leveledUp: false, newLevel: cur?.level ?? 1, gained: 0 };
        let { level, xp, xpToNext, hpMax, chakraMax, hp, chakra, unspentPoints, power } = cur;
        xp += amount;
        let leveledUp = false;
        while (xp >= xpToNext) {
          xp -= xpToNext;
          level += 1;
          leveledUp = true;
          // Simple growth curve — backend C# será autoritativo no futuro.
          xpToNext = Math.round(xpToNext * 1.25);
          hpMax += 40;
          chakraMax += 30;
          hp = hpMax;
          chakra = chakraMax;
          unspentPoints += 5;
          power += 350;
        }
        set({ character: { ...cur, level, xp, xpToNext, hpMax, chakraMax, hp, chakra, unspentPoints, power } });
        return { leveledUp, newLevel: level, gained: amount };
      },
      gainRyous: (amount) => {
        const cur = get().character;
        if (!cur || amount === 0) return;
        set({ character: { ...cur, ryous: Math.max(0, cur.ryous + amount) } });
      },
      hydrate: async () => {
        if (!tokenStorage.access) return;
        try {
          const user = await authService.me();
          set({ isAuthenticated: true, user });
          try {
            const character = await characterService.get();
            set({ character, hasCharacter: true });
          } catch {
            set({ character: null, hasCharacter: false });
          }
        } catch {
          tokenStorage.clear();
          set({ isAuthenticated: false, user: null, character: null, hasCharacter: false });
        }
      },
      seedDemo: () => set({ isAuthenticated: true, user: mockUser, character: mockCharacter, hasCharacter: true }),
    }),
    { name: "naruto-players-fan-game" },
  ),
);
