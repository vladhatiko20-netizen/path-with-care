import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminGetPilgrimage } from "@/lib/admin.functions";
import { PilgrimageForm } from "@/components/admin/PilgrimageForm";

export const Route = createFileRoute("/_admin/admin/pilgrimages/$id")({
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  const get = useServerFn(adminGetPilgrimage);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-pilgrimage", id],
    queryFn: () => get({ data: { id } }),
  });

  if (isLoading) return <div className="p-8 text-muted-foreground">Загрузка…</div>;
  if (error) return <div className="p-8 text-destructive">{(error as Error).message}</div>;
  if (!data) { throw notFound(); }

  return (
    <div className="p-8">
      <Link to="/admin/pilgrimages" className="text-sm text-accent hover:underline">← К списку</Link>
      <h1 className="font-serif text-3xl mt-3 mb-6">Редактирование поездки</h1>
      <PilgrimageForm initial={{
        id: data.id,
        slug: data.slug,
        start_date: data.start_date,
        end_date: data.end_date,
        destination_ru: data.destination_ru,
        destination_ro: data.destination_ro,
        title_ru: data.title_ru,
        title_ro: data.title_ro,
        description_ru: data.description_ru,
        description_ro: data.description_ro,
        cover_image: data.cover_image,
        price_eur: data.price_eur ? Number(data.price_eur) : null,
        with_priest: data.with_priest,
        is_published: data.is_published,
      }} />
    </div>
  );
}
