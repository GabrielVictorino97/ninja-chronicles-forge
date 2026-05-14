import type { Location } from "@/types";
import { apiClient } from "@/lib/api";

interface LocationDto {
  id: string;
  name: string;
  type: string;
  graduationRequired: string;
  enemies: string[];
  missionIds: string[];
  description: string;
}

export const worldService = {
  async listLocations(): Promise<Location[]> {
    return apiClient.get<Location[]>("/world/locations", { auth: false });
  },
  async travel(locationId: string): Promise<{ ok: boolean; locationId: string }> {
    return apiClient.post(`/world/travel/${locationId}`);
  },
};
