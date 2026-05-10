import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { adminUserService } from "@/services/admin";
import { DataTable, PageHeader, StatusPill } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Ban, Check, Lock, ShieldCheck } from "lucide-react";
import type { AdminRole, AdminUser } from "@/types/admin";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({ component: UsersPage });

const ROLES: AdminRole[] = ["Player", "Moderator", "Admin", "SuperAdmin"];

function UsersPage() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["admin-users"], queryFn: () => adminUserService.list() });

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [view, setView] = useState<AdminUser | null>(null);
  const [confirm, setConfirm] = useState<{ user: AdminUser; type: "ban" | "unban" | "block" } | null>(null);

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-users"] });

  const filtered = useMemo(
    () => data.filter((u) =>
      (roleFilter === "all" || u.role === roleFilter) &&
      (statusFilter === "all" || u.status === statusFilter) &&
      (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())),
    ),
    [data, search, roleFilter, statusFilter],
  );

  const doAction = async () => {
    if (!confirm) return;
    if (confirm.type === "ban") await adminUserService.ban(confirm.user.id);
    if (confirm.type === "unban") await adminUserService.unban(confirm.user.id);
    if (confirm.type === "block") await adminUserService.block(confirm.user.id);
    toast.success(`Usuário ${confirm.user.name} atualizado`);
    setConfirm(null);
    refresh();
  };

  const setRole = async (u: AdminUser, role: AdminRole) => {
    await adminUserService.setRole(u.id, role);
    toast.success(`Role alterado para ${role}`);
    refresh();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Usuários" description="Gestão de contas, roles e permissões." />
      <div className="flex flex-col md:flex-row gap-2">
        <Input placeholder="Buscar por nome ou e-mail..." value={search} onChange={(e) => setSearch(e.target.value)} className="md:max-w-sm" />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="md:w-44"><SelectValue placeholder="Role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os roles</SelectItem>
            {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="md:w-44"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos status</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="banned">Banidos</SelectItem>
            <SelectItem value="blocked">Bloqueados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable<AdminUser>
        rows={filtered}
        columns={[
          { key: "name", label: "Nome" },
          { key: "email", label: "E-mail" },
          { key: "role", label: "Role", render: (u) => <StatusPill tone={u.role === "SuperAdmin" ? "danger" : u.role === "Admin" ? "warn" : u.role === "Moderator" ? "info" : "muted"}>{u.role}</StatusPill> },
          { key: "status", label: "Status", render: (u) => <StatusPill tone={u.status === "active" ? "success" : u.status === "banned" ? "danger" : "warn"}>{u.status}</StatusPill> },
          { key: "createdAt", label: "Criado", render: (u) => u.createdAt.slice(0, 10) },
          { key: "lastLogin", label: "Último login", render: (u) => u.lastLogin.slice(0, 10) },
          { key: "ip", label: "IP" },
          {
            key: "actions", label: "Ações", className: "text-right",
            render: (u) => (
              <div className="flex justify-end gap-1">
                <Button size="icon" variant="ghost" onClick={() => setView(u)}><Eye className="h-4 w-4" /></Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    {u.status !== "banned"
                      ? <DropdownMenuItem onClick={() => setConfirm({ user: u, type: "ban" })}><Ban className="h-4 w-4 mr-2" /> Banir</DropdownMenuItem>
                      : <DropdownMenuItem onClick={() => setConfirm({ user: u, type: "unban" })}><Check className="h-4 w-4 mr-2" /> Desbanir</DropdownMenuItem>}
                    <DropdownMenuItem onClick={() => setConfirm({ user: u, type: "block" })}><Lock className="h-4 w-4 mr-2" /> Bloquear conta</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs">Alterar role</DropdownMenuLabel>
                    {ROLES.map((r) => (
                      <DropdownMenuItem key={r} onClick={() => setRole(u, r)}>
                        <ShieldCheck className="h-4 w-4 mr-2" /> {r}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ),
          },
        ]}
      />

      <ConfirmDialog
        open={!!confirm}
        onOpenChange={(v) => !v && setConfirm(null)}
        title={confirm?.type === "ban" ? "Banir usuário?" : confirm?.type === "unban" ? "Desbanir usuário?" : "Bloquear conta?"}
        description={`Esta ação afetará ${confirm?.user.name}.`}
        confirmLabel="Confirmar"
        destructive={confirm?.type !== "unban"}
        onConfirm={doAction}
      />

      <Dialog open={!!view} onOpenChange={(v) => !v && setView(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{view?.name}</DialogTitle></DialogHeader>
          {view && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-muted-foreground">E-mail:</span> {view.email}</div>
                <div><span className="text-muted-foreground">Role:</span> {view.role}</div>
                <div><span className="text-muted-foreground">Status:</span> {view.status}</div>
                <div><span className="text-muted-foreground">IP:</span> {view.ip}</div>
              </div>
              <div>
                <h4 className="text-xs uppercase text-muted-foreground mt-3 mb-2">Histórico de login</h4>
                <ul className="space-y-1">
                  {view.loginHistory.map((h, i) => (
                    <li key={i} className="flex justify-between border-b border-border/50 py-1 text-xs">
                      <span>{h.date.slice(0, 16).replace("T", " ")}</span>
                      <span className="text-muted-foreground">{h.device}</span>
                      <span className="font-mono">{h.ip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}