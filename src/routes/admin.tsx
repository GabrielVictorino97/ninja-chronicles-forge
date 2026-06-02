import { createFileRoute, redirect } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useGameStore } from "@/store/gameStore";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const state = useGameStore.getState();
    if (!state.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: AdminLayout,
});