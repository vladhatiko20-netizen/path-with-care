import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminGetClergy } from "@/lib/admin.functions";
import { ClergyForm } from "@/components/admin/ClergyForm";

export const Route = createFileRoute("/_admin/admin/clergy/$id")({
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  const get = useServerFn(adminGetClergy);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-clergy-row", id],
    queryFn: () => get({ data: { id } }),
  });

  if (isLoading) return <div className="p-8 text-muted-foreground">Загрузка…</div>;
  if (error) return <div className="p-8 text-destructive">{(error as Error).message}</div>;
  if (!data) { throw notFound(); }

  return (
    <div className="p-8">
      <Link to="/admin/clergy" className="text-sm text-accent hover:underline">← К списку</Link>
      <h1 className="font-serif text-3xl mt-3 mb-6">Редактирование</h1>
      <ClergyForm initial={{
        id: data.id,
        name_ru: data.name_ru,
        name_ro: data.name_ro,
        title_ru: data.title_ru,
        title_ro: data.title_ro,
        bio_ru: data.bio_ru,
        bio_ro: data.bio_ro,
        photo_url: data.photo_url,
        sort_order: data.sort_order,
        is_published: data.is_published,
      }} />
    </div>
  );
}