import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminListPilgrimages, adminDeletePilgrimage } from "@/lib/admin.functions";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/pilgrimages/")({
  component: Page,
});

function Page() {
  const list = useServerFn(adminListPilgrimages);
  const del = useServerFn(adminDeletePilgrimage);
  const router = useRouter();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-pilgrimages"],
    queryFn: () => list(),
  });

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Удалить поездку "${title}"?`)) return;
    await del({ data: { id } });
    await refetch();
    router.invalidate();
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl">Календарь паломничеств</h1>
        <Link to="/admin/pilgrimages/new" className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-primary-foreground rounded-sm font-serif text-sm">
          <Plus className="w-4 h-4" /> Новая поездка
        </Link>
      </div>

      {isLoading ? <p className="text-muted-foreground">Загрузка…</p> : (
        <div className="border border-border rounded-sm bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-left">
              <tr>
                <th className="px-4 py-3 font-serif">Даты</th>
                <th className="px-4 py-3 font-serif">Направление</th>
                <th className="px-4 py-3 font-serif">Цена</th>
                <th className="px-4 py-3 font-serif">Со священником</th>
                <th className="px-4 py-3 font-serif">Статус</th>
                <th className="px-4 py-3 w-32"></th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Пока нет поездок.</td></tr>
              )}
              {(data ?? []).map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3 whitespace-nowrap">{p.start_date} → {p.end_date}</td>
                  <td className="px-4 py-3">{p.destination_ru}</td>
                  <td className="px-4 py-3">{p.price_eur ? `€${p.price_eur}` : "—"}</td>
                  <td className="px-4 py-3">{p.with_priest ? "Да" : "Нет"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-sm text-xs ${p.is_published ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}`}>
                      {p.is_published ? "Опубликовано" : "Черновик"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <Link to="/admin/pilgrimages/$id" params={{ id: p.id }} className="p-1.5 hover:bg-secondary rounded-sm">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(p.id, p.title_ru)} className="p-1.5 hover:bg-destructive/10 text-destructive rounded-sm">
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
