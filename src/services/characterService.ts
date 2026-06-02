import type { BaseAttributes, Character, ElementOption, BloodlineClan, Village } from "@/types";
import { apiClient } from "@/lib/api";

interface CreateCharacterInput {
  name: string;
  avatar: string;
  villageId: string;
  clanId: string;
}

export const characterService = {
  get(): Promise<Character | null> {
    return apiClient.get<Character | null>("/characters/me");
  },
  list(): Promise<Character[]> {
    return apiClient.get<Character[]>("/characters");
  },
  getById(id: string): Promise<Character> {
    return apiClient.get<Character>(`/characters/${id}`);
  },
  create(input: CreateCharacterInput): Promise<Character> {
    return apiClient.post<Character>("/characters", input);
  },
  distributePoints(characterId: string, attributes: Partial<BaseAttributes>): Promise<Character> {
    return apiClient.put<Character>(`/characters/${characterId}/attributes`, { attributes });
  },
  listVillages(): Promise<Village[]> {
    return apiClient.get<Village[]>("/villages", { auth: false });
  },
  listBloodlineClans(): Promise<BloodlineClan[]> {
    return apiClient.get<BloodlineClan[]>("/bloodline-clans", { auth: false });
  },
  listElements(): Promise<ElementOption[]> {
    return apiClient.get<ElementOption[]>("/elements");
  },
  learnElement(characterId: string, element: string): Promise<void> {
    return apiClient.post<void>(`/characters/${characterId}/elements/${element}/learn`);
  },
};
