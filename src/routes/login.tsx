import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";
import { PageShell } from "@/components/site/PageShell";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Вход – Паломник" }, { name: "robots", content: "noindex" }] }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().email("Неверный email").max(255),
  password: z.string().min(6, "Минимум 6 символов").max(128),
});

function LoginPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: "/admin" });
  }, [session, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Ошибка");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка входа");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <PageShell><div className="max-w-md mx-auto py-20 text-center text-muted-foreground">Загрузка…</div></PageShell>;
  }

  return (
    <PageShell>
      <div className="max-w-md mx-auto px-6 py-16">
        <h1 className="font-serif text-3xl mb-2 text-foreground">{mode === "login" ? "Вход в админку" : "Регистрация"}</h1>
        <p className="text-sm text-muted-foreground mb-8">
          {mode === "login" ? "Только для администратора сайта." : "Создайте аккаунт. Роль администратора назначается отдельно."}
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 font-serif">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={255}
              className="w-full px-3 py-2 border border-border rounded-sm bg-background" autoComplete="email" />
          </div>
          <div>
            <label className="block text-sm mb-1 font-serif">Пароль</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} maxLength={128}
              className="w-full px-3 py-2 border border-border rounded-sm bg-background" autoComplete={mode === "signup" ? "new-password" : "current-password"} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button type="submit" disabled={busy}
            className="w-full px-4 py-2 bg-accent text-primary-foreground font-serif rounded-sm disabled:opacity-50">
            {busy ? "…" : mode === "login" ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>

        <div className="mt-6 text-sm text-center">
          {mode === "login" ? (
            <button type="button" onClick={() => setMode("signup")} className="text-accent hover:underline font-serif italic">
              Нет аккаунта? Зарегистрироваться
            </button>
          ) : (
            <button type="button" onClick={() => setMode("login")} className="text-accent hover:underline font-serif italic">
              Уже есть аккаунт? Войти
            </button>
          )}
        </div>

        <div className="mt-10 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:underline">← На главную</Link>
        </div>
      </div>
    </PageShell>
  );
}
