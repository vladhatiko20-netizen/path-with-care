import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminListPriestFaq, adminDeletePriestFaq } from "@/lib/admin.functions";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/priest-faq/")({
  component: Page,
});

function Page() {
  const list = useServerFn(adminListPriestFaq);
  const del = useServerFn(adminDeletePriestFaq);
  const router = useRouter();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-priest-faq"],
    queryFn: () => list(),
  });

  async function handleDelete(id: string, q: string) {
    if (!confirm(`Удалить вопрос «${q.slice(0, 60)}»?`)) return;
    await del({ data: { id } });
    await refetch();
    router.invalidate();
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl">Вопросы священнику</h1>
        <Link to="/admin/priest-faq/new" className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-primary-foreground rounded-sm font-serif text-sm">
          <Plus className="w-4 h-4" /> Новый Q&amp;A
        </Link>
      </div>

      {isLoading ? <p className="text-muted-foreground">Загрузка…</p> : (
        <>
        <div className="hidden sm:block border border-border rounded-sm bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-left">
              <tr>
                <th className="px-4 py-3 font-serif">Вопрос (RU)</th>
                <th className="px-4 py-3 font-serif w-24">Порядок</th>
                <th className="px-4 py-3 font-serif w-32">Статус</th>
                <th className="px-4 py-3 w-28"></th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Пока нет записей.</td></tr>
              )}
              {(data ?? []).map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="px-4 py-3">{c.question_ru}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.sort_order}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-sm text-xs ${c.is_published ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}`}>
                      {c.is_published ? "Опубликовано" : "Черновик"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <Link to="/admin/priest-faq/$id" params={{ id: c.id }} className="p-1.5 hover:bg-secondary rounded-sm" title="Редактировать">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(c.id, c.question_ru)} className="p-1.5 hover:bg-destructive/10 text-destructive rounded-sm" title="Удалить">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden space-y-3">
          {(data ?? []).length === 0 && (
            <p className="text-center text-muted-foreground py-8">Пока нет записей.</p>
          )}
          {(data ?? []).map((c) => (
            <div key={c.id} className="border border-border rounded-sm bg-card p-4">
              <div className="font-serif text-base">{c.question_ru}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-0.5 rounded-sm text-xs ${c.is_published ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}`}>
                  {c.is_published ? "Опубликовано" : "Черновик"}
                </span>
                <span className="text-xs text-muted-foreground">№ {c.sort_order}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <Link to="/admin/priest-faq/$id" params={{ id: c.id }} className="inline-flex items-center gap-1.5 px-3 py-2 border border-border rounded-sm text-sm font-serif">
                  <Pencil className="w-4 h-4" /> Редактировать
                </Link>
                <button onClick={() => handleDelete(c.id, c.question_ru)} className="inline-flex items-center gap-1.5 px-3 py-2 border border-destructive/40 text-destructive rounded-sm text-sm font-serif">
                  <Trash2 className="w-4 h-4" /> Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
        </>
      )}
    </div>
  );
}