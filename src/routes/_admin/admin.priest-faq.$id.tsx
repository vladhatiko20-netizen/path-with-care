import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminGetPriestFaq } from "@/lib/admin.functions";
import { PriestFaqForm } from "@/components/admin/PriestFaqForm";

export const Route = createFileRoute("/_admin/admin/priest-faq/$id")({
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  const get = useServerFn(adminGetPriestFaq);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-priest-faq-row", id],
    queryFn: () => get({ data: { id } }),
  });

  if (isLoading) return <div className="p-8 text-muted-foreground">Загрузка…</div>;
  if (error) return <div className="p-8 text-destructive">{(error as Error).message}</div>;
  if (!data) { throw notFound(); }

  return (
    <div className="p-8">
      <Link to="/admin/priest-faq" className="text-sm text-accent hover:underline">← К списку</Link>
      <h1 className="font-serif text-3xl mt-3 mb-6">Редактирование</h1>
      <PriestFaqForm initial={{
        id: data.id,
        question_ru: data.question_ru,
        question_ro: data.question_ro ?? "",
        answer_ru: data.answer_ru,
        answer_ro: data.answer_ro ?? "",
        author_name_ru: data.author_name_ru,
        author_name_ro: data.author_name_ro,
        author_title_ru: data.author_title_ru,
        author_title_ro: data.author_title_ro,
        sort_order: data.sort_order,
        is_published: data.is_published,
      }} />
    </div>
  );
}