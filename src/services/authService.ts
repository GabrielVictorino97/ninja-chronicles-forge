import type { AuthResponse, User } from "@/types";
import { apiClient, tokenStorage } from "@/lib/api";

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>(
      "/auth/login",
      { email, password },
      { auth: false, skipRefresh: true },
    );
    tokenStorage.set(res.accessToken, res.refreshToken);
    return res;
  },
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>(
      "/auth/register",
      { name, email, password },
      { auth: false, skipRefresh: true },
    );
    tokenStorage.set(res.accessToken, res.refreshToken);
    return res;
  },
  async me(): Promise<User> {
    return apiClient.get<User>("/me");
  },
  async logout(): Promise<void> {
    tokenStorage.clear();
  },
};
