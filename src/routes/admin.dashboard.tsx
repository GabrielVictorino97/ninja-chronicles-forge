import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { adminDashboardService } from "@/services/admin";
import { StatCard } from "@/components/admin/StatCard";
import { BarChart, ChartCard, DonutChart, LineChart } from "@/components/admin/MiniChart";
import { PageHeader } from "@/components/admin/DataTable";
import {
  Users,
  UserCheck,
  UserCircle,
  Swords,
  Scroll,
  Dna,
  CalendarRange,
  AlertTriangle,
  Ban,
  CreditCard,
} from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { data } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => adminDashboardService.get(),
  });

  if (!data) return <div className="text-muted-foreground">Carregando indicadores...</div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Visão geral do servidor de jogo." />
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        <StatCard
          label="Usuários"
          value={data.totalUsers.toLocaleString()}
          icon={Users}
          accent="primary"
          trend="+12% no mês"
        />
        <StatCard
          label="Ativos agora"
          value={data.activeUsers.toLocaleString()}
          icon={UserCheck}
          accent="success"
        />
        <StatCard
          label="Personagens"
          value={data.charactersCreated.toLocaleString()}
          icon={UserCircle}
          accent="info"
        />
        <StatCard label="Batalhas hoje" value={data.battlesToday} icon={Swords} accent="warning" />
        <StatCard label="Missões hoje" value={data.missionsToday} icon={Scroll} accent="primary" />
        <StatCard label="Clãs ativos" value={data.activeClans} icon={Dna} accent="info" />
        <StatCard
          label="Eventos ativos"
          value={data.activeEvents}
          icon={CalendarRange}
          accent="success"
        />
        <StatCard
          label="Denúncias"
          value={data.pendingReports}
          icon={AlertTriangle}
          accent="warning"
        />
        <StatCard label="Banidos" value={data.bannedUsers} icon={Ban} accent="destructive" />
        <StatCard label="Transações" value={data.transactions} icon={CreditCard} accent="info" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <ChartCard title="Novos usuários por dia">
          <LineChart data={data.newUsersByDay} />
        </ChartCard>
        <ChartCard title="Batalhas por dia">
          <BarChart data={data.battlesByDay} />
        </ChartCard>
        <ChartCard title="Missões concluídas por rank">
          <BarChart data={data.missionsByRank.map((m) => ({ rank: m.rank, value: m.value }))} />
        </ChartCard>
        <ChartCard title="Distribuição de vilas">
          <DonutChart data={data.villagesDistribution} />
        </ChartCard>
        <ChartCard title="Distribuição de clãs de sangue">
          <DonutChart data={data.clansDistribution} />
        </ChartCard>
      </div>
    </div>
  );
}
