// Mocked API layer. Simulates HTTP latency. Replace these implementations
// with real calls to the future C# .NET backend (e.g. fetch("/api/...")).
export const fakeDelay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

export async function mockRequest<T>(data: T, ms = 350): Promise<T> {
  await fakeDelay(ms);
  return data;
}
