import { mockRanking } from "@/mocks/ranking";
import { mockRequest } from "./api";

export const rankingService = {
  async list() { return mockRequest(mockRanking); },
};
