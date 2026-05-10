import { mockLocations } from "@/mocks/locations";
import { mockRequest } from "./api";

export const worldService = {
  async listLocations() { return mockRequest(mockLocations); },
  async travel(locationId: string) { return mockRequest({ ok: true, locationId }); },
};
