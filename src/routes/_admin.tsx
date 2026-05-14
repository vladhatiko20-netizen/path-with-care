import { createFileRoute, Outlet, useNavigate, Link, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/use-auth";
import { LogOut, FileText, Calendar, LayoutDashboard } from "lucide-react";

export const Route = createFileRoute("/_admin")({
  head: () => ({ meta: [{ title: "Админ-панель — Паломник" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const { session, isAdmin, loading, signOut, user } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (loading) return;
    if (!session) navigate({ to: "/login" });
  }, [loading, session, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Загрузка…</div>;
  }
  if (!session) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-md text-center">
          <h1 className="font-serif text-3xl mb-4">Доступ запрещён</h1>
          <p className="text-muted-foreground mb-6">Аккаунт <strong>{user?.email}</strong> не имеет роли администратора.</p>
          <button onClick={async () => { await signOut(); navigate({ to: "/login" }); }}
            className="px-4 py-2 bg-accent text-primary-foreground rounded-sm">Выйти</button>
        </div>
      </div>
    );
  }

  const nav = [
    { to: "/admin", label: "Обзор", icon: LayoutDashboard },
    { to: "/admin/blog", label: "Блог", icon: FileText },
    { to: "/admin/pilgrimages", label: "Паломничества", icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-60 border-r border-border bg-card flex flex-col shrink-0">
        <div className="p-5 border-b border-border">
          <Link to="/" className="font-serif text-lg text-foreground">Паломник</Link>
          <p className="text-xs text-muted-foreground mt-1">Админ-панель</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((item) => {
            const active = item.to === "/admin" ? path === "/admin" : path.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to}
                className={`flex items-center gap-2 px-3 py-2 rounded-sm text-sm font-serif transition-colors ${active ? "bg-accent text-primary-foreground" : "text-foreground hover:bg-secondary"}`}>
                <Icon className="w-4 h-4" /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border text-xs text-muted-foreground">
          <p className="px-2 mb-2 truncate">{user?.email}</p>
          <button onClick={async () => { await signOut(); navigate({ to: "/login" }); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-sm hover:bg-secondary">
            <LogOut className="w-4 h-4" /> Выйти
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
