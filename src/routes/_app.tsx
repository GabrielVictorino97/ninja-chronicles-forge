import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { useGameStore } from "@/store/gameStore";

export const Route = createFileRoute("/_app")({
  beforeLoad: async () => {
    const state = useGameStore.getState();
    if (!state.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
    if (!state.hasCharacter) {
      throw redirect({ to: "/create-character" });
    }
  },
  component: AppLayout,
});
