// Mocked API layer. Simulates HTTP latency. Replace these implementations
// with real calls to the future C# .NET backend (e.g. fetch("/api/...")).
// Latency is intentionally tiny so the prototype feels instant. The real
// C# .NET backend will replace these helpers with fetch() calls.
export const fakeDelay = (ms = 0) =>
  ms > 0 ? new Promise((r) => setTimeout(r, ms)) : Promise.resolve();

export async function mockRequest<T>(data: T, ms = 0): Promise<T> {
  if (ms > 0) await fakeDelay(ms);
  return data;
}
