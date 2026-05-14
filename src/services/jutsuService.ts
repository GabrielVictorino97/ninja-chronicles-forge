import type { Jutsu } from "@/types";
import { apiClient } from "@/lib/api";

export interface CharacterJutsuDto {
  id: string;
  name: string;
  type: string;
  element: string | null;
  chakraCost: number;
  cooldown: number;
  baseDamage: number;
  description: string;
  equipped: boolean;
  learnedLevel: number;
}

export const jutsuService = {
  async list(): Promise<Jutsu[]> {
    const jutsus = await apiClient.get<Jutsu[]>("/jutsus", { auth: false });
    return jutsus;
  },
  async myJutsus(characterId: string): Promise<CharacterJutsuDto[]> {
    return apiClient.get<CharacterJutsuDto[]>(`/characters/${characterId}/jutsus`);
  },
  async learn(characterId: string, jutsuId: string): Promise<void> {
    return apiClient.post<void>(`/characters/${characterId}/jutsus/${jutsuId}/learn`);
  },
  async equip(characterId: string, jutsuId: string): Promise<void> {
    return apiClient.post<void>(`/characters/${characterId}/jutsus/${jutsuId}/equip`);
  },
  async unequip(characterId: string, jutsuId: string): Promise<void> {
    return apiClient.post<void>(`/characters/${characterId}/jutsus/${jutsuId}/unequip`);
  },
};
