import { mockCharacter } from "@/mocks/character";
import type { Character, BaseAttributes } from "@/types";
import { mockRequest } from "./api";

export const characterService = {
  async get(): Promise<Character> {
    return mockRequest(mockCharacter);
  },
  async create(input: Partial<Character>): Promise<Character> {
    // Real attribute validation/calculation will run on the backend.
    return mockRequest({ ...mockCharacter, ...input, id: "c-new" });
  },
  async distributePoints(_attrs: Partial<BaseAttributes>): Promise<Character> {
    return mockRequest(mockCharacter);
  },
};
