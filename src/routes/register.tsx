import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/authService";
import { useGameStore } from "@/store/gameStore";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";
import { AuthShell } from "./login";

const schema = z
  .object({
    name: z.string().min(3, "Nome muito curto"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { message: "Senhas não coincidem", path: ["confirm"] });
type FormData = z.infer<typeof schema>;

export const Route = createFileRoute("/register")({
  beforeLoad: async () => {
    const state = useGameStore.getState();
    if (state.isAuthenticated && state.hasCharacter) {
      throw redirect({ to: "/dashboard" });
    }
    if (state.isAuthenticated && !state.hasCharacter) {
      throw redirect({ to: "/create-character" });
    }
  },
  component: RegisterPage,
  head: () => ({ meta: [{ title: "Criar conta — Naruto Players Fan Game" }] }),
});

function RegisterPage() {
  const navigate = useNavigate();
  const login = useGameStore((s) => s.login);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(v: FormData) {
    try {
      const res = await authService.register(v.name, v.email, v.password);
      login(res.user);
      toast.success("Conta criada! Crie seu personagem agora.");
      navigate({ to: "/create-character" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha no cadastro");
    }
  }

  return (
    <AuthShell title="Criar conta" subtitle="Forje seu destino ninja">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirmar</Label>
            <Input id="confirm" type="password" {...register("confirm")} />
            {errors.confirm && <p className="text-xs text-destructive">{errors.confirm.message}</p>}
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <UserPlus className="size-4" />
          )}
          Criar conta
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
