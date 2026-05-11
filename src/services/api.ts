// Legacy shim — kept so admin/mock services that haven't been migrated yet
// still compile. Prefer importing { api, apiClient } from "@/lib/api".
export const fakeDelay = (ms = 0) =>
  ms > 0 ? new Promise((r) => setTimeout(r, ms)) : Promise.resolve();

export async function mockRequest<T>(data: T, ms = 0): Promise<T> {
  if (ms > 0) await fakeDelay(ms);
  return data;
}

export { api, apiClient, ApiError, tokenStorage } from "@/lib/api";
