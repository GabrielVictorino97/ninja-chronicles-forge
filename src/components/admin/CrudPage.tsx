import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DataTable, PageHeader, type Column } from "@/components/admin/DataTable";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export type FieldDef =
  | { name: string; label: string; type: "text" | "number" | "textarea" }
  | { name: string; label: string; type: "switch" }
  | { name: string; label: string; type: "select"; options: { value: string; label: string }[] };

interface Service<T> {
  list: () => Promise<T[]>;
  create: (item: T) => Promise<T>;
  update: (id: string, patch: Partial<T>) => Promise<T>;
  remove: (id: string) => Promise<{ id: string }>;
}

export function CrudPage<T extends { id: string }>({
  title, description, queryKey, service, columns, fields, makeEmpty, searchKeys,
}: {
  title: string;
  description?: string;
  queryKey: string;
  service: Service<T>;
  columns: Column<T>[];
  fields: FieldDef[];
  makeEmpty: () => T;
  searchKeys: (keyof T)[];
}) {
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: [queryKey], queryFn: () => service.list() });
  const [search, setSearch] = useState("");
  const [edit, setEdit] = useState<T | null>(null);
  const [del, setDel] = useState<T | null>(null);

  const refresh = () => qc.invalidateQueries({ queryKey: [queryKey] });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return data;
    return data.filter((row) =>
      searchKeys.some((k) => String(row[k] ?? "").toLowerCase().includes(q)),
    );
  }, [data, search, searchKeys]);

  const onSave = async () => {
    if (!edit) return;
    const exists = data.some((r) => r.id === edit.id);
    if (exists) await service.update(edit.id, edit);
    else await service.create(edit);
    toast.success("Salvo com sucesso");
    setEdit(null); refresh();
  };

  const onDelete = async () => {
    if (!del) return;
    await service.remove(del.id);
    toast.success("Excluído");
    setDel(null); refresh();
  };

  const allCols: Column<T>[] = [
    ...columns,
    {
      key: "__actions", label: "Ações", className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Button size="icon" variant="ghost" onClick={() => setEdit({ ...row })}><Pencil className="h-4 w-4" /></Button>
          <Button size="icon" variant="ghost" onClick={() => setDel(row)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        actions={
          <Button onClick={() => setEdit(makeEmpty())}><Plus className="h-4 w-4 mr-1" /> Novo</Button>
        }
      />
      <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="md:max-w-sm" />
      <DataTable<T> rows={filtered} columns={allCols} />

      <Dialog open={!!edit} onOpenChange={(v) => !v && setEdit(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{title} — {data.some((r) => r.id === edit?.id) ? "Editar" : "Criar"}</DialogTitle></DialogHeader>
          {edit && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {fields.map((f) => {
                const value = (edit as Record<string, unknown>)[f.name];
                const update = (v: unknown) => setEdit({ ...edit, [f.name]: v } as T);
                if (f.type === "textarea") {
                  return (
                    <div key={f.name} className="md:col-span-2">
                      <label className="text-xs text-muted-foreground">{f.label}</label>
                      <Textarea value={String(value ?? "")} onChange={(e) => update(e.target.value)} />
                    </div>
                  );
                }
                if (f.type === "switch") {
                  return (
                    <div key={f.name} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                      <span className="text-sm">{f.label}</span>
                      <Switch checked={!!value} onCheckedChange={(v) => update(v)} />
                    </div>
                  );
                }
                if (f.type === "select") {
                  return (
                    <div key={f.name}>
                      <label className="text-xs text-muted-foreground">{f.label}</label>
                      <Select value={String(value ?? "")} onValueChange={(v) => update(v)}>
                        <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                        <SelectContent>
                          {f.options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                }
                return (
                  <div key={f.name}>
                    <label className="text-xs text-muted-foreground">{f.label}</label>
                    <Input
                      type={f.type}
                      value={String(value ?? "")}
                      onChange={(e) => update(f.type === "number" ? Number(e.target.value) : e.target.value)}
                    />
                  </div>
                );
              })}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEdit(null)}>Cancelar</Button>
            <Button onClick={onSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!del}
        onOpenChange={(v) => !v && setDel(null)}
        title="Excluir registro?"
        description="Esta ação não poderá ser desfeita."
        destructive
        confirmLabel="Excluir"
        onConfirm={onDelete}
      />
    </div>
  );
}