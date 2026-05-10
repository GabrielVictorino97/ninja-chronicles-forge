import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";
import { adminVillageService } from "@/services/admin";
import { StatusPill } from "@/components/admin/DataTable";
import type { AdminVillage } from "@/types/admin";

export const Route = createFileRoute("/admin/villages")({ component: VillagesPage });

function VillagesPage() {
  return (
    <CrudPage<AdminVillage>
      title="Vilas"
      description="Vilas Ocultas e seus bônus."
      queryKey="admin-villages"
      service={adminVillageService}
      searchKeys={["name", "country"]}
      makeEmpty={() => ({
        id: `v-${Date.now()}`, name: "Nova Vila", fullName: "", country: "",
        description: "", symbol: "🍃", accentColor: "primary",
        active: true, bonus: "", themeColor: "#3b82f6",
      })}
      columns={[
        { key: "symbol", label: "" },
        { key: "name", label: "Nome" },
        { key: "country", label: "País" },
        { key: "bonus", label: "Bônus" },
        { key: "themeColor", label: "Cor", render: (v) => <span className="inline-block h-4 w-8 rounded" style={{ background: v.themeColor }} /> },
        { key: "active", label: "Status", render: (v) => <StatusPill tone={v.active ? "success" : "muted"}>{v.active ? "Ativo" : "Inativo"}</StatusPill> },
      ]}
      fields={[
        { name: "name", label: "Nome", type: "text" },
        { name: "fullName", label: "Nome completo", type: "text" },
        { name: "country", label: "País", type: "text" },
        { name: "symbol", label: "Símbolo (emoji)", type: "text" },
        { name: "themeColor", label: "Cor temática (hex)", type: "text" },
        { name: "bonus", label: "Bônus da vila", type: "text" },
        { name: "description", label: "Descrição", type: "textarea" },
        { name: "active", label: "Ativo", type: "switch" },
      ]}
    />
  );
}