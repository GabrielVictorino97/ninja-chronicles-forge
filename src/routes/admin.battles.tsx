import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { adminBattleService } from "@/services/admin";
import { DataTable, PageHeader, StatusPill } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import type { AdminBattle } from "@/types/admin";

export const Route = createFileRoute("/admin/battles")({ component: BattlesPage });

function BattlesPage() {
  const { data = [] } = useQuery({
    queryKey: ["admin-battles"],
    queryFn: () => adminBattleService.list(),
  });
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [view, setView] = useState<AdminBattle | null>(null);

  const filtered = useMemo(
    () =>
      data.filter(
        (b) =>
          (type === "all" || b.type === type) &&
          (b.player1.toLowerCase().includes(search.toLowerCase()) ||
            b.player2.toLowerCase().includes(search.toLowerCase())),
      ),
    [data, search, type],
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Logs de Batalha" description="Histórico de combates do servidor." />
      <div className="flex flex-col md:flex-row gap-2">
        <Input
          placeholder="Buscar jogador..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:max-w-sm"
        />
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="md:w-44">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="PvP">PvP</SelectItem>
            <SelectItem value="PvE">PvE</SelectItem>
            <SelectItem value="Boss">Boss</SelectItem>
            <SelectItem value="Arena">Arena</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DataTable<AdminBattle>
        rows={filtered}
        columns={[
          { key: "id", label: "ID" },
          { key: "player1", label: "Jogador 1" },
          { key: "player2", label: "Oponente" },
          { key: "type", label: "Tipo" },
          { key: "winner", label: "Vencedor" },
          { key: "duration", label: "Duração" },
          { key: "date", label: "Data", render: (b) => b.date.slice(0, 10) },
          {
            key: "status",
            label: "Status",
            render: (b) => (
              <StatusPill tone={b.status === "completed" ? "success" : "warn"}>
                {b.status}
              </StatusPill>
            ),
          },
          {
            key: "actions",
            label: "",
            className: "text-right",
            render: (b) => (
              <Button size="icon" variant="ghost" onClick={() => setView(b)}>
                <Eye className="h-4 w-4" />
              </Button>
            ),
          },
        ]}
      />

      <Dialog open={!!view} onOpenChange={(v) => !v && setView(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Batalha {view?.id}</DialogTitle>
          </DialogHeader>
          {view && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground">{view.player1}</span> vs{" "}
                  <span className="text-muted-foreground">{view.player2}</span>
                </div>
                <div className="text-right">
                  Vencedor: <strong>{view.winner}</strong>
                </div>
              </div>
              <div>
                <h4 className="text-xs uppercase text-muted-foreground mb-2">Turnos</h4>
                <ul className="space-y-1 max-h-64 overflow-y-auto">
                  {view.turns.map((t) => (
                    <li key={t.n} className="flex justify-between border-b border-border/40 py-1">
                      <span className="font-mono text-xs">#{t.n}</span>
                      <span>
                        {t.actor} usou <strong>{t.action}</strong>
                      </span>
                      <span className="text-rose-400">-{t.damage}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs uppercase text-muted-foreground mb-1">Recompensas</h4>
                <div className="flex gap-2 flex-wrap">
                  {view.rewards.map((r) => (
                    <StatusPill key={r} tone="info">
                      {r}
                    </StatusPill>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
