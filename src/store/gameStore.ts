import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Character, User } from "@/types";
import { tokenStorage, ApiError } from "@/lib/api";
import { authService } from "@/services/authService";
import { characterService } from "@/services/characterService";

interface GameState {
  isAuthenticated: boolean;
  user: User | null;
  characters: Character[];
  character: Character | null;
  hasCharacter: boolean;
  login: (user: User) => void;
  logout: () => void;
  setCharacters: (list: Character[]) => void;
  setCharacter: (c: Character | null) => void;
  patchCharacter: (p: Partial<Character>) => void;
  clearSelectedCharacter: () => void;
  hydrate: () => Promise<void>;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      characters: [],
      character: null,
      hasCharacter: false,
      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => {
        void authService.logout();
        set({ isAuthenticated: false, user: null, character: null, hasCharacter: false, characters: [] });
      },
      setCharacters: (list) => set({ characters: list }),
      setCharacter: (c) => set({ character: c, hasCharacter: !!c }),
      clearSelectedCharacter: () => set({ character: null, hasCharacter: false }),
      patchCharacter: (p) => {
        const cur = get().character;
        if (!cur) return;
        set({ character: { ...cur, ...p } });
      },
      hydrate: async () => {
        if (!tokenStorage.access) return;
        try {
          const user = await authService.me();
          set({ isAuthenticated: true, user });
          try {
            const c = await characterService.get();
            if (c) {
              set({ character: c, hasCharacter: true });
            } else {
              set({ character: null, hasCharacter: false });
            }
          } catch {
            set({ character: null, hasCharacter: false });
          }
        } catch (e) {
          // Só limpa a sessão se for erro de autenticação (401/403).
          // Erros de rede ou servidor não devem destruir os tokens.
          if (e instanceof ApiError && (e.status === 401 || e.status === 403)) {
            tokenStorage.clear();
            set({ isAuthenticated: false, user: null, character: null, hasCharacter: false });
          } else {
            // Mantém isAuthenticated mesmo com erro de rede — tenta de novo depois.
            set({ isAuthenticated: true });
          }
        }
      },
    }),
    { name: "naruto-players-fan-game" },
  ),
);
