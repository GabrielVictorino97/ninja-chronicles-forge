import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  adminRankingService,
  adminVillageService,
  adminBloodlineClanService,
} from "@/services/admin";
import { DataTable, PageHeader } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import type { RankingEntry } from "@/types/admin";

export const Route = createFileRoute("/admin/rankings")({ component: RankingsPage });

function RankingsPage() {
  const { data = [], refetch } = useQuery({
    queryKey: ["admin-rankings"],
    queryFn: () => adminRankingService.list(),
  });
  const { data: villages = [] } = useQuery({
    queryKey: ["admin-villages-list"],
    queryFn: () => adminVillageService.list(),
  });
  const { data: clans = [] } = useQuery({
    queryKey: ["admin-clans-list"],
    queryFn: () => adminBloodlineClanService.list(),
  });
  const villageByName = useMemo(() => new Map(villages.map((v) => [v.id, v.name])), [villages]);
  const clanByName = useMemo(() => new Map(clans.map((c) => [c.id, c.name])), [clans]);
  const [tab, setTab] = useState("players");
  const [season, setSeason] = useState("S1");
  const [village, setVillage] = useState("all");
  const [clan, setClan] = useState("all");

  const filtered = useMemo(
    () =>
      data.filter(
        (r) =>
          (village === "all" || r.village === villageByName.get(village)) &&
          (clan === "all" || r.clan === clanByName.get(clan)),
      ),
    [data, village, clan, villageByName, clanByName],
  );

  const exportCsv = () => {
    const header = "Posição,Nome,Vila,Clã,Level,Poder,Vitórias,Derrotas\n";
    const body = filtered
      .map(
        (r) =>
          `${r.position},${r.name},${r.village},${r.clan},${r.level},${r.power},${r.wins},${r.losses}`,
      )
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ranking-${tab}-${season}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exportado");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rankings"
        description="Visualize, filtre e exporte rankings."
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => {
                refetch();
                toast.success("Ranking atualizado");
              }}
            >
              <RotateCcw className="h-4 w-4 mr-1" /> Atualizar
            </Button>
            <Button onClick={exportCsv}>
              <Download className="h-4 w-4 mr-1" /> Exportar CSV
            </Button>
          </>
        }
      />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="players">Jogadores</TabsTrigger>
          <TabsTrigger value="clans">Clãs</TabsTrigger>
          <TabsTrigger value="arena">Arena</TabsTrigger>
          <TabsTrigger value="missions">Missões</TabsTrigger>
          <TabsTrigger value="boss">Boss damage</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex flex-col md:flex-row gap-2">
        <Select value={season} onValueChange={setSeason}>
          <SelectTrigger className="md:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="S1">Temporada 1</SelectItem>
            <SelectItem value="S2">Temporada 2</SelectItem>
            <SelectItem value="S3">Temporada 3</SelectItem>
          </SelectContent>
        </Select>
        <Select value={village} onValueChange={setVillage}>
          <SelectTrigger className="md:w-52">
            <SelectValue placeholder="Vila" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as vilas</SelectItem>
            {villages.map((v) => (
              <SelectItem key={v.id} value={v.id}>
                {v.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={clan} onValueChange={setClan}>
          <SelectTrigger className="md:w-52">
            <SelectValue placeholder="Clã" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os clãs</SelectItem>
            {clans.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable<RankingEntry & { id: string }>
        rows={filtered.map((r) => ({ ...r, id: String(r.position) }))}
        columns={[
          { key: "position", label: "#" },
          { key: "name", label: "Nome" },
          { key: "village", label: "Vila" },
          { key: "clan", label: "Clã" },
          { key: "level", label: "Lv" },
          { key: "power", label: "Poder", render: (r) => r.power.toLocaleString() },
          { key: "wins", label: "Vit." },
          { key: "losses", label: "Der." },
        ]}
      />
    </div>
  );
}
