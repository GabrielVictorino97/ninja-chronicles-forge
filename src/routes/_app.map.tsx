import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/game/SectionTitle";
import { mockLocations } from "@/mocks/locations";
import { worldService } from "@/services/worldService";
import { Map as MapIcon, Plane } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/map")({
  component: MapPage,
  head: () => ({ meta: [{ title: "Mapa — Naruto Players Fan Game" }] }),
});

function MapPage() {
  return (
    <div className="space-y-5">
      <SectionTitle title="Mapa" icon={<MapIcon className="size-6 text-primary" />}
        description="Viaje pelo mundo ninja." />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {mockLocations.map((l) => (
          <Card key={l.id} className="bg-scroll-paper shadow-card">
            <CardContent className="space-y-2 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold">{l.name}</h3>
                  <div className="text-[11px] uppercase text-muted-foreground">{l.type}</div>
                </div>
                <span className="rounded bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">{l.graduationRequired}+</span>
              </div>
              <p className="text-xs text-muted-foreground">{l.description}</p>
              <div className="text-[11px] text-muted-foreground"><span className="font-semibold text-foreground">Inimigos:</span> {l.enemies.join(", ")}</div>
              <div className="text-[11px] text-muted-foreground"><span className="font-semibold text-foreground">Missões:</span> {l.missionIds.length || "—"}</div>
              <Button size="sm" className="w-full" onClick={async () => { await worldService.travel(l.id); toast.success(`Viajando para ${l.name}...`); }}>
                <Plane className="size-3.5" /> Viajar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
