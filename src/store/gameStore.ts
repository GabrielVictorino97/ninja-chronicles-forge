import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Character, User } from "@/types";
import { mockCharacter, mockUser } from "@/mocks/character";

interface GameState {
  isAuthenticated: boolean;
  user: User | null;
  character: Character | null;
  hasCharacter: boolean;
  login: (user: User) => void;
  logout: () => void;
  setCharacter: (c: Character) => void;
  patchCharacter: (p: Partial<Character>) => void;
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
      logout: () => set({ isAuthenticated: false, user: null, character: null, hasCharacter: false }),
      setCharacter: (c) => set({ character: c, hasCharacter: true }),
      patchCharacter: (p) => {
        const cur = get().character;
        if (!cur) return;
        set({ character: { ...cur, ...p } });
      },
      seedDemo: () => set({ isAuthenticated: true, user: mockUser, character: mockCharacter, hasCharacter: true }),
    }),
    { name: "naruto-players-fan-game" },
  ),
);
