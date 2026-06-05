import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminListDestinations, adminDeleteDestination } from "@/lib/admin.functions";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/destinations/")({
  component: Page,
});

function Page() {
  const list = useServerFn(adminListDestinations);
  const del = useServerFn(adminDeleteDestination);
  const router = useRouter();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-destinations"],
    queryFn: () => list(),
  });

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Удалить направление "${title}"?`)) return;
    await del({ data: { id } });
    await refetch();
    router.invalidate();
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl">Направления</h1>
        <div className="flex gap-2">
          <Link to="/admin/destinations/import" className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-sm font-serif text-sm">
            <Upload className="w-4 h-4" /> Импорт из JSON
          </Link>
          <Link to="/admin/destinations/new" className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-primary-foreground rounded-sm font-serif text-sm">
            <Plus className="w-4 h-4" /> Новое направление
          </Link>
        </div>
      </div>

      {isLoading ? <p className="text-muted-foreground">Загрузка…</p> : (
        <div className="border border-border rounded-sm bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-left">
              <tr>
                <th className="px-4 py-3 font-serif">Название (RU)</th>
                <th className="px-4 py-3 font-serif">Slug</th>
                <th className="px-4 py-3 font-serif">Цена от</th>
                <th className="px-4 py-3 font-serif">Статус</th>
                <th className="px-4 py-3 w-32"></th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Пока нет направлений.</td></tr>
              )}
              {(data ?? []).map((d) => (
                <tr key={d.id} className="border-t border-border">
                  <td className="px-4 py-3">{d.title_ru}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.slug}</td>
                  <td className="px-4 py-3">{d.price_from ? `€${d.price_from}` : "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-sm text-xs ${d.is_published ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}`}>
                      {d.is_published ? "Опубликовано" : "Черновик"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <Link to="/admin/destinations/$id" params={{ id: d.id }} className="p-1.5 hover:bg-secondary rounded-sm">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(d.id, d.title_ru)} className="p-1.5 hover:bg-destructive/10 text-destructive rounded-sm">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}