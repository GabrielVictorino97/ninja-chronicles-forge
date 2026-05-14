import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, User, ScrollText, Swords, Sparkles, Backpack,
  Store, Users, Trophy, Map as MapIcon, Bell, LogOut, Menu, X,
  Coins, Flame, Droplets, Zap, Star, Crosshair,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/gameStore";
import { onSessionExpired } from "@/lib/api";
import { captureUnhandledErrors } from "@/lib/logger";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatBar } from "@/components/game/StatBar";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/character", label: "Personagem", icon: User },
  { to: "/missions", label: "Missões", icon: ScrollText },
  { to: "/hunt", label: "Caçada", icon: Crosshair },
  { to: "/battle", label: "Batalha", icon: Swords },
  { to: "/jutsus", label: "Jutsus", icon: Sparkles },
  { to: "/elements", label: "Elementos", icon: Flame },
  { to: "/inventory", label: "Inventário", icon: Backpack },
  { to: "/shop", label: "Loja", icon: Store },
  { to: "/clan", label: "Clã", icon: Users },
  { to: "/ranking", label: "Ranking", icon: Trophy },
  { to: "/map", label: "Mapa", icon: MapIcon },
] as const;

const MOBILE_NAV = NAV.slice(0, 5);

export function AppLayout() {
  const navigate = useNavigate();
  const { isAuthenticated, character, hasCharacter, logout, hydrate } = useGameStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  // Captura erros não tratados e envia para o Seq.
  useEffect(() => { captureUnhandledErrors(); }, []);

  // Quando o refresh token falha, redireciona para login.
  useEffect(() => {
    onSessionExpired(() => {
      useGameStore.getState().logout();
      navigate({ to: "/login" });
    });
  }, [navigate]);

  // Reidrata sessão a partir do JWT salvo; redireciona para login se não autenticado.
  // Só roda no cliente — localStorage não existe durante SSR.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isAuthenticated) {
      hydrate().catch((e) => {
        toast.error(e instanceof Error ? e.message : "Falha ao conectar ao servidor");
        navigate({ to: "/login" });
      }).then(() => {
        if (!useGameStore.getState().isAuthenticated) {
          navigate({ to: "/login" });
        }
      });
    }
  }, [isAuthenticated, hydrate, navigate]);

  useEffect(() => {
    if (isAuthenticated && !hasCharacter && path !== "/create-character") {
      navigate({ to: "/create-character" });
    }
  }, [isAuthenticated, hasCharacter, path, navigate]);

  if (!character) return null;

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-sidebar-border bg-sidebar/80 backdrop-blur lg:flex lg:flex-col">
        <SidebarContent path={path} />
      </aside>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-sidebar">
            <div className="flex items-center justify-between border-b border-sidebar-border p-3">
              <Brand />
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>
            <SidebarContent path={path} onNavigate={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onOpenSidebar={() => setSidebarOpen(true)} onLogout={() => { logout(); navigate({ to: "/login" }); }} />
        <main className="flex-1 px-4 pb-24 pt-4 md:px-6 lg:px-8 lg:pb-8">
          <div key={path} className="animate-in fade-in duration-200">
            <Outlet />
          </div>
        </main>
        <BottomNav path={path} />
      </div>
    </div>
  );
}

function Brand() {
  return (
    <Link to="/dashboard" className="flex items-center gap-2 px-2 py-1">
      <div className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-base font-black text-primary-foreground shadow-glow-primary">
        卍
      </div>
      <div className="leading-tight">
        <div className="text-sm font-bold">Naruto Players</div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Fan Game</div>
      </div>
    </Link>
  );
}

function SidebarContent({ path, onNavigate }: { path: string; onNavigate?: () => void }) {
  return (
    <>
      <div className="hidden border-b border-sidebar-border p-3 lg:block">
        <Brand />
      </div>
      <ScrollArea className="flex-1 p-2">
        <nav className="space-y-1">
          {NAV.map((item) => {
            const active = path === item.to || path.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-sidebar-accent text-sidebar-primary shadow-inner"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
          <Link
            to="/profile"
            onClick={onNavigate}
            className={cn(
              "mt-4 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
              path === "/profile"
                ? "bg-sidebar-accent text-sidebar-primary"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent",
            )}
          >
            <User className="size-4" /> Perfil
          </Link>
        </nav>
      </ScrollArea>
    </>
  );
}

function Header({ onOpenSidebar, onLogout }: { onOpenSidebar: () => void; onLogout: () => void }) {
  const character = useGameStore((s) => s.character);
  const unread = 0;
  if (!character) return null;
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur">
      <div className="flex items-center gap-3 px-3 py-3 md:gap-4 md:px-5 md:py-3.5">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onOpenSidebar}>
          <Menu className="size-6" />
        </Button>
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary/30 to-accent/30 text-2xl ring-2 ring-primary/40 shadow-glow-primary md:size-14">
            {character.avatar}
          </div>
          <div className="min-w-0 leading-tight">
            <div className="truncate text-base font-bold md:text-lg">{character.name}</div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground md:text-sm">
              <span className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-bold text-primary md:text-sm">Lv {character.level}</span>
              <span className="hidden sm:inline">{character.graduation}</span>
            </div>
          </div>
        </div>

        <div className="hidden min-w-0 flex-1 grid-cols-2 items-center gap-x-4 gap-y-1.5 md:grid xl:grid-cols-4">
          <MiniBar icon={<Flame className="size-4 text-hp" />} label="HP" value={character.hp} max={character.hpMax} tone="hp" />
          <MiniBar icon={<Droplets className="size-4 text-chakra" />} label="Chakra" value={character.chakra} max={character.chakraMax} tone="chakra" />
          <MiniBar icon={<Zap className="size-4 text-energy" />} label="Energia" value={character.energy} max={character.energyMax} tone="energy" />
          <MiniBar icon={<Star className="size-4 text-xp" />} label="XP" value={character.xp} max={character.xpToNext} tone="xp" />
        </div>

        <div className="ml-auto flex items-center gap-1.5 md:gap-2">
          <div className="hidden items-center gap-1.5 rounded-md border border-ryous/30 bg-ryous/10 px-2.5 py-1.5 text-sm font-bold text-ryous sm:flex">
            <Coins className="size-4" />
            <span className="tabular-nums">{character.ryous.toLocaleString()}</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative size-10">
                <Bell className="size-5" />
                {unread > 0 && (
                  <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                    {unread}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel>Notificações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs text-muted-foreground">Nenhuma notificação.</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="size-10" onClick={onLogout} title="Sair">
            <LogOut className="size-5" />
          </Button>
        </div>
      </div>

      {/* Mobile stat bars under header */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-border/40 bg-background/50 px-3 py-2 md:hidden">
        <MiniBar icon={<Flame className="size-3.5 text-hp" />} label="HP" value={character.hp} max={character.hpMax} tone="hp" />
        <MiniBar icon={<Droplets className="size-3.5 text-chakra" />} label="Chakra" value={character.chakra} max={character.chakraMax} tone="chakra" />
        <MiniBar icon={<Zap className="size-3.5 text-energy" />} label="Energia" value={character.energy} max={character.energyMax} tone="energy" />
        <MiniBar icon={<Star className="size-3.5 text-xp" />} label="XP" value={character.xp} max={character.xpToNext} tone="xp" />
      </div>
      <div className="flex items-center justify-end border-t border-border/40 bg-background/50 px-3 py-1.5 sm:hidden">
        <div className="flex items-center gap-1.5 rounded-md border border-ryous/30 bg-ryous/10 px-2 py-1 text-xs font-bold text-ryous">
          <Coins className="size-3.5" />
          <span className="tabular-nums">{character.ryous.toLocaleString()}</span>
        </div>
      </div>
    </header>
  );
}

function MiniBar({ icon, label, value, max, tone }: { icon: React.ReactNode; label: string; value: number; max: number; tone: "hp" | "chakra" | "energy" | "xp" }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      {icon}
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center justify-between text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          <span>{label}</span>
          <span className="tabular-nums">{value}/{max}</span>
        </div>
        <StatBar value={value} max={max} tone={tone} showValue={false} />
      </div>
    </div>
  );
}

function BottomNav({ path }: { path: string }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 backdrop-blur lg:hidden">
      <ul className="grid grid-cols-5">
        {MOBILE_NAV.map((item) => {
          const active = path === item.to || path.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className={cn("size-5", active && "drop-shadow-[0_0_6px_var(--primary)]")} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
