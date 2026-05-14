import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { adminCharacterService, adminVillageService, adminBloodlineClanService } from "@/services/admin";
import { DataTable, PageHeader, StatusPill } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Eye, Pencil, RotateCcw, Lock, Swords, Package } from "lucide-react";
import type { AdminCharacter } from "@/types/admin";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/characters")({ component: CharactersPage });

function CharactersPage() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["admin-characters"], queryFn: () => adminCharacterService.list() });
  const { data: villages = [] } = useQuery({ queryKey: ["admin-villages-list"], queryFn: () => adminVillageService.list() });
  const { data: clans = [] } = useQuery({ queryKey: ["admin-clans-list"], queryFn: () => adminBloodlineClanService.list() });
  const villageById = useMemo(() => new Map(villages.map(v => [v.id, v])), [villages]);
  const clanById = useMemo(() => new Map(clans.map(c => [c.id, c])), [clans]);
  const [search, setSearch] = useState("");
  const [village, setVillage] = useState("all");
  const [edit, setEdit] = useState<AdminCharacter | null>(null);
  const [confirm, setConfirm] = useState<{ c: AdminCharacter; type: "reset" | "block" } | null>(null);

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-characters"] });

  const filtered = useMemo(
    () => data.filter((c) =>
      (village === "all" || c.villageId === village) &&
      (c.name.toLowerCase().includes(search.toLowerCase()) || c.userName.toLowerCase().includes(search.toLowerCase())),
    ), [data, search, village]);

  const onSave = async () => {
    if (!edit) return;
    await adminCharacterService.update(edit.id, edit);
    toast.success("Personagem atualizado");
    setEdit(null); refresh();
  };

  const doConfirm = async () => {
    if (!confirm) return;
    if (confirm.type === "reset") await adminCharacterService.reset(confirm.c.id);
    if (confirm.type === "block") await adminCharacterService.block(confirm.c.id);
    toast.success("Operação concluída");
    setConfirm(null); refresh();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Personagens" description="Gerencie atributos, status e progresso." />
      <div className="flex flex-col md:flex-row gap-2">
        <Input placeholder="Buscar personagem ou usuário..." value={search} onChange={(e) => setSearch(e.target.value)} className="md:max-w-sm" />
        <Select value={village} onValueChange={setVillage}>
          <SelectTrigger className="md:w-52"><SelectValue placeholder="Vila" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as vilas</SelectItem>
            {villages.map((v) => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <DataTable<AdminCharacter>
        rows={filtered}
        columns={[
          { key: "name", label: "Nome" },
          { key: "userName", label: "Usuário" },
          { key: "villageId", label: "Vila", render: (c) => villageById.get(c.villageId)?.name ?? c.villageId },
          { key: "clanId", label: "Clã", render: (c) => clanById.get(c.clanId)?.name ?? c.clanId },
          { key: "level", label: "Lv" },
          { key: "graduation", label: "Graduação" },
          { key: "power", label: "Poder", render: (c) => c.power.toLocaleString() },
          { key: "ryous", label: "Ryous", render: (c) => c.ryous.toLocaleString() },
          { key: "status", label: "Status", render: (c) => <StatusPill tone={c.status === "active" ? "success" : "danger"}>{c.status}</StatusPill> },
          {
            key: "actions", label: "Ações", className: "text-right",
            render: (c) => (
              <div className="flex justify-end gap-1">
                <Button size="icon" variant="ghost" title="Ver"><Eye className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" title="Editar" onClick={() => setEdit(c)}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" title="Resetar" onClick={() => setConfirm({ c, type: "reset" })}><RotateCcw className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" title="Bloquear" onClick={() => setConfirm({ c, type: "block" })}><Lock className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" title="Batalhas"><Swords className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" title="Inventário"><Package className="h-4 w-4" /></Button>
              </div>
            ),
          },
        ]}
      />

      <Dialog open={!!edit} onOpenChange={(v) => !v && setEdit(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Editar atributos — {edit?.name}</DialogTitle></DialogHeader>
          {edit && (
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(edit.attributes) as (keyof typeof edit.attributes)[]).map((k) => (
                <div key={k}>
                  <label className="text-xs text-muted-foreground capitalize">{k}</label>
                  <Input
                    type="number"
                    value={edit.attributes[k]}
                    onChange={(e) => setEdit({ ...edit, attributes: { ...edit.attributes, [k]: Number(e.target.value) } })}
                  />
                </div>
              ))}
              <div>
                <label className="text-xs text-muted-foreground">Level</label>
                <Input type="number" value={edit.level} onChange={(e) => setEdit({ ...edit, level: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Ryous</label>
                <Input type="number" value={edit.ryous} onChange={(e) => setEdit({ ...edit, ryous: Number(e.target.value) })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEdit(null)}>Cancelar</Button>
            <Button onClick={onSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!confirm}
        onOpenChange={(v) => !v && setConfirm(null)}
        title={confirm?.type === "reset" ? "Resetar personagem?" : "Bloquear personagem?"}
        description="Esta ação será aplicada imediatamente."
        destructive
        onConfirm={doConfirm}
      />
    </div>
  );
}