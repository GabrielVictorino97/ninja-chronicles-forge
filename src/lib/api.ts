// HTTP client for the Ninja Chronicles backend (.NET 8 + FastEndpoints).
// - Reads VITE_API_BASE_URL (default https://localhost:7259/api)
// - Injects JWT access token, persists tokens in localStorage
// - Auto-refreshes on 401 using /auth/refresh and replays the request once
// - Throws ApiError with backend FluentValidation-style errors

const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "https://localhost:7259/api";

const ACCESS_KEY = "ncf.accessToken";
const REFRESH_KEY = "ncf.refreshToken";

export interface ApiErrorBody {
  errors?: Record<string, string[]>;
  detail?: string;
  title?: string;
  status?: number;
}

export class ApiError extends Error {
  status: number;
  body: ApiErrorBody | string | null;
  constructor(status: number, message: string, body: ApiErrorBody | string | null) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export const tokenStorage = {
  get access() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_KEY);
  },
  get refresh() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_KEY);
  },
  set(access: string, refresh: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

function pickErrorMessage(body: ApiErrorBody | string | null, status: number): string {
  if (typeof body === "string" && body) return body;
  if (body && typeof body === "object") {
    if (body.errors) {
      const first = Object.values(body.errors)[0];
      if (first?.length) return first[0];
    }
    if (body.detail) return body.detail;
    if (body.title) return body.title;
  }
  return `Erro ${status}`;
}

async function parseBody(res: Response): Promise<ApiErrorBody | string | null> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

let refreshing: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  if (refreshing) return refreshing;
  const access = tokenStorage.access;
  const refresh = tokenStorage.refresh;
  if (!access || !refresh) return false;
  refreshing = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: access, refreshToken: refresh }),
      });
      if (!res.ok) return false;
      const data = (await res.json()) as { accessToken: string; refreshToken: string };
      tokenStorage.set(data.accessToken, data.refreshToken);
      return true;
    } catch {
      return false;
    } finally {
      refreshing = null;
    }
  })();
  return refreshing;
}

export interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  auth?: boolean; // default true
  signal?: AbortSignal;
  // Don't try to refresh on 401 (used by /auth/* itself)
  skipRefresh?: boolean;
}

export async function api<T = unknown>(path: string, opts: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true, signal, skipRefresh } = opts;
  const url = path.startsWith("http") ? path : `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = tokenStorage.access;
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const init: RequestInit = {
    method,
    headers,
    signal,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };

  let res = await fetch(url, init);

  if (res.status === 401 && auth && !skipRefresh) {
    const ok = await tryRefresh();
    if (ok) {
      const retryHeaders = { ...headers };
      const newToken = tokenStorage.access;
      if (newToken) retryHeaders["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(url, { ...init, headers: retryHeaders });
    } else {
      tokenStorage.clear();
    }
  }

  if (!res.ok) {
    const errBody = await parseBody(res);
    throw new ApiError(res.status, pickErrorMessage(errBody, res.status), errBody);
  }

  if (res.status === 204) return undefined as T;
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) return undefined as T;
  return (await res.json()) as T;
}

export const apiClient = {
  get: <T>(path: string, opts?: Omit<ApiOptions, "method" | "body">) =>
    api<T>(path, { ...opts, method: "GET" }),
  post: <T>(path: string, body?: unknown, opts?: Omit<ApiOptions, "method" | "body">) =>
    api<T>(path, { ...opts, method: "POST", body }),
  put: <T>(path: string, body?: unknown, opts?: Omit<ApiOptions, "method" | "body">) =>
    api<T>(path, { ...opts, method: "PUT", body }),
  delete: <T>(path: string, opts?: Omit<ApiOptions, "method" | "body">) =>
    api<T>(path, { ...opts, method: "DELETE" }),
};

export const API_BASE_URL = BASE_URL;