import { create } from "zustand";

interface AdminState {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  adminName: string;
  adminRole: string;
}

export const useAdminStore = create<AdminState>((set) => ({
  searchQuery: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  adminName: "Admin Hokage",
  adminRole: "SuperAdmin",
}));
