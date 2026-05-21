import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminGetDestination } from "@/lib/admin.functions";
import { DestinationForm } from "@/components/admin/DestinationForm";

export const Route = createFileRoute("/_admin/admin/destinations/$id")({
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  const get = useServerFn(adminGetDestination);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-destination", id],
    queryFn: () => get({ data: { id } }),
  });

  if (isLoading) return <div className="p-8 text-muted-foreground">Загрузка…</div>;
  if (error) return <div className="p-8 text-destructive">{(error as Error).message}</div>;
  if (!data) { throw notFound(); }

  return (
    <div className="p-8">
      <Link to="/admin/destinations" className="text-sm text-accent hover:underline">← К списку</Link>
      <h1 className="font-serif text-3xl mt-3 mb-6">Редактирование направления</h1>
      <DestinationForm initial={{
        id: data.id,
        slug: data.slug,
        title_ru: data.title_ru,
        title_ro: data.title_ro,
        description_ru: data.description_ru,
        description_ro: data.description_ro,
        cover_image: data.cover_image,
        duration_ru: data.duration_ru,
        duration_ro: data.duration_ro,
        price_from: data.price_from ? Number(data.price_from) : null,
        group_size_ru: data.group_size_ru,
        group_size_ro: data.group_size_ro,
        program_ru: data.program_ru,
        program_ro: data.program_ro,
        is_published: data.is_published,
      }} />
    </div>
  );
}