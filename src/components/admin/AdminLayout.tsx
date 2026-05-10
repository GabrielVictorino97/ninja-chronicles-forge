import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, UserCircle, MapPin, Dna, Sparkles,
  Scroll, Package, CalendarRange, Swords, Trophy, FileClock,
  Settings, Search, Bell, Menu, LogOut, Shield,
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAdminStore } from "@/store/adminStore";
import { cn } from "@/lib/utils";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/users", label: "Usuários", icon: Users },
  { to: "/admin/characters", label: "Personagens", icon: UserCircle },
  { to: "/admin/villages", label: "Vilas", icon: MapPin },
  { to: "/admin/bloodline-clans", label: "Clãs de Sangue", icon: Dna },
  { to: "/admin/jutsus", label: "Jutsus", icon: Sparkles },
  { to: "/admin/missions", label: "Missões", icon: Scroll },
  { to: "/admin/items", label: "Itens", icon: Package },
  { to: "/admin/events", label: "Eventos", icon: CalendarRange },
  { to: "/admin/battles", label: "Batalhas", icon: Swords },
  { to: "/admin/rankings", label: "Rankings", icon: Trophy },
  { to: "/admin/audit-logs", label: "Audit Logs", icon: FileClock },
  { to: "/admin/settings", label: "Configurações", icon: Settings },
] as const;

export function AdminLayout() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { searchQuery, setSearchQuery, adminName, adminRole } = useAdminStore();

  return (
    <div className="min-h-screen flex w-full bg-background text-foreground">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-border bg-card/80 backdrop-blur transition-transform md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-16 flex items-center gap-2 px-5 border-b border-border">
          <Shield className="h-6 w-6 text-primary" />
          <div>
            <div className="text-sm font-bold tracking-wide">NP ADMIN</div>
            <div className="text-[10px] text-muted-foreground -mt-0.5">Painel administrativo</div>
          </div>
        </div>
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || (to !== "/admin/dashboard" && pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary/15 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card/60 backdrop-blur sticky top-0 z-30 flex items-center gap-3 px-4 md:px-6">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((v) => !v)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar usuários, personagens, jutsus..."
              className="pl-9 bg-background/50"
            />
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-md hover:bg-muted/50 px-2 py-1">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-xs font-bold">
                  {adminName.slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-medium leading-tight">{adminName}</div>
                  <div className="text-[10px] text-muted-foreground leading-tight">{adminRole}</div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Preferências</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/login" className="flex items-center gap-2 text-destructive">
                  <LogOut className="h-4 w-4" /> Sair
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setOpen(false)} />
      )}
    </div>
  );
}