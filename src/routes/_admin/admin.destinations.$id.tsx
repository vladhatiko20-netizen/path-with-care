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
        hero_quote_ru: data.hero_quote_ru,
        hero_quote_ro: data.hero_quote_ro,
        hero_quote_author_ru: data.hero_quote_author_ru,
        hero_quote_author_ro: data.hero_quote_author_ro,
        intro_ru: data.intro_ru,
        intro_ro: data.intro_ro,
        notice_ru: data.notice_ru,
        notice_ro: data.notice_ro,
        seo_title_ru: data.seo_title_ru,
        seo_title_ro: data.seo_title_ro,
        seo_description_ru: data.seo_description_ru,
        seo_description_ro: data.seo_description_ro,
        og_image: data.og_image,
        accompaniment_ru: data.accompaniment_ru,
        accompaniment_ro: data.accompaniment_ro,
        short_title_ru: data.short_title_ru,
        short_title_ro: data.short_title_ro,
        is_published: data.is_published,
      }} />
    </div>
  );
}