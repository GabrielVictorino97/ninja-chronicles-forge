import { mockUser } from "@/mocks/character";
import type { User } from "@/types";
import { mockRequest } from "./api";

export const authService = {
  async login(email: string, _password: string): Promise<User> {
    // Backend C# will validate credentials and return a JWT.
    return mockRequest({ ...mockUser, email });
  },
  async register(name: string, email: string, _password: string): Promise<User> {
    return mockRequest({ ...mockUser, name, email });
  },
  async logout(): Promise<void> {
    return mockRequest(undefined as void);
  },
};
