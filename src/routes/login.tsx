import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/authService";
import { useGameStore } from "@/store/gameStore";
import { toast } from "sonner";
import { Loader2, LogIn } from "lucide-react";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(4, "Mínimo 4 caracteres"),
});
type FormData = z.infer<typeof schema>;

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Entrar — Naruto Players Fan Game" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const login = useGameStore((s) => s.login);
  const seed = useGameStore((s) => s.seedDemo);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "shinobi@vila.gg", password: "123456" },
  });

  async function onSubmit(values: FormData) {
    const user = await authService.login(values.email, values.password);
    login(user);
    toast.success("Bem-vindo de volta, shinobi!");
    navigate({ to: "/dashboard" });
  }

  return (
    <AuthShell title="Entrar" subtitle="Acesse sua conta de shinobi">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Senha</Label>
          <Input id="password" type="password" {...register("password")} />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
          Entrar
        </Button>
        <Button type="button" variant="ghost" className="w-full" onClick={() => { seed(); navigate({ to: "/dashboard" }); }}>
          Entrar como demo
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Não tem conta?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">Criar agora</Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="relative grid min-h-screen place-items-center px-4 py-10">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-50 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]">
        <div className="absolute -left-20 top-1/3 size-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -right-20 bottom-1/4 size-80 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-chakra/20 blur-3xl" />
      </div>
      <Card className="w-full max-w-md border-border/60 bg-card/80 backdrop-blur shadow-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-2xl font-black text-primary-foreground shadow-glow-primary">
            卍
          </div>
          <CardTitle className="text-2xl text-gradient-primary">{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
      <p className="mt-4 max-w-md text-center text-[10px] text-muted-foreground">
        Fan game não-comercial. Sem afiliação com a obra original.
      </p>
    </div>
  );
}
