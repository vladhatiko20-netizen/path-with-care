import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminGetCatalogItem } from "@/lib/admin.functions";
import { CatalogItemForm } from "@/components/admin/CatalogItemForm";

export const Route = createFileRoute("/_admin/admin/catalog/$id")({
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  const get = useServerFn(adminGetCatalogItem);
  const { data, isLoading } = useQuery({
    queryKey: ["admin-catalog-item", id],
    queryFn: () => get({ data: { id } }),
  });

  return (
    <div className="p-8 max-w-5xl">
      <Link to="/admin/catalog" className="text-sm text-accent hover:underline">← К списку</Link>
      <h1 className="font-serif text-3xl mt-3 mb-6">Редактировать позицию</h1>
      {isLoading ? (
        <p className="text-muted-foreground">Загрузка…</p>
      ) : !data ? (
        <p className="text-muted-foreground">Не найдено.</p>
      ) : (
        <CatalogItemForm
          initial={{
            id: data.id,
            slug: data.slug,
            title_ru: data.title_ru,
            title_ro: data.title_ro,
            description_ru: data.description_ru,
            description_ro: data.description_ro,
            category: data.category,
            image_url: data.image_url,
            sort_order: data.sort_order,
            is_published: data.is_published,
          }}
        />
      )}
    </div>
  );
}