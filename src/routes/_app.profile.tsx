import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SectionTitle } from "@/components/game/SectionTitle";
import { useGameStore } from "@/store/gameStore";
import { User, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const AVATARS = ["🦊", "🐉", "🐺", "🦅", "🐍", "🐢", "🦂", "🐅", "🦉", "🐝", "🦇", "🐲"];

export const Route = createFileRoute("/_app/profile")({
  component: ProfilePage,
  head: () => ({ meta: [{ title: "Perfil — Naruto Players Fan Game" }] }),
});

function ProfilePage() {
  const navigate = useNavigate();
  const user = useGameStore((s) => s.user);
  const character = useGameStore((s) => s.character);
  const patch = useGameStore((s) => s.patchCharacter);
  const logout = useGameStore((s) => s.logout);
  const [sound, setSound] = useState(true);
  const [notif, setNotif] = useState(true);

  if (!user || !character) return null;

  return (
    <div className="space-y-5">
      <SectionTitle title="Perfil" icon={<User className="size-6 text-primary" />}
        description="Conta, personagem e preferências." />

      <Card className="shadow-card">
        <CardHeader><CardTitle>Dados da conta</CardTitle></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Nome</Label><Input defaultValue={user.name} /></div>
          <div className="space-y-1.5"><Label>E-mail</Label><Input defaultValue={user.email} /></div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader><CardTitle>Avatar do personagem</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-12">
            {AVATARS.map((a) => (
              <button key={a} onClick={() => { patch({ avatar: a }); toast.success("Avatar atualizado"); }}
                className={`grid aspect-square place-items-center rounded-lg border bg-muted text-2xl transition ${
                  character.avatar === a ? "border-primary bg-primary/15 shadow-glow-primary" : "hover:border-primary/50"}`}>
                {a}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader><CardTitle>Preferências</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded border bg-muted/30 px-3 py-2">
            <span className="text-sm">Som de batalha</span>
            <Switch checked={sound} onCheckedChange={setSound} />
          </div>
          <div className="flex items-center justify-between rounded border bg-muted/30 px-3 py-2">
            <span className="text-sm">Notificações</span>
            <Switch checked={notif} onCheckedChange={setNotif} />
          </div>
        </CardContent>
      </Card>

      <Button variant="destructive" onClick={() => { logout(); navigate({ to: "/login" }); }}>
        <LogOut className="size-4" /> Sair da conta
      </Button>
    </div>
  );
}
