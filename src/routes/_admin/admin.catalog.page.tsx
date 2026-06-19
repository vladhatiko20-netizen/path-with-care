import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminGetCatalogPage } from "@/lib/admin.functions";
import { CatalogPageForm, type CatalogPageFormInitial } from "@/components/admin/CatalogPageForm";

export const Route = createFileRoute("/_admin/admin/catalog/page")({
  component: Page,
});

function Page() {
  const get = useServerFn(adminGetCatalogPage);
  const { data, isLoading } = useQuery({
    queryKey: ["admin-catalog-page"],
    queryFn: () => get(),
  });

  const initial: CatalogPageFormInitial = {
    hero_image_url: data?.hero_image_url ?? null,
    hero_overline_ru: data?.hero_overline_ru ?? null,
    hero_overline_ro: data?.hero_overline_ro ?? null,
    hero_title_ru: data?.hero_title_ru ?? null,
    hero_title_ro: data?.hero_title_ro ?? null,
    intro_ru: data?.intro_ru ?? null,
    intro_ro: data?.intro_ro ?? null,
    empty_state_ru: data?.empty_state_ru ?? null,
    empty_state_ro: data?.empty_state_ro ?? null,
    form_title_ru: data?.form_title_ru ?? null,
    form_title_ro: data?.form_title_ro ?? null,
    form_subtitle_ru: data?.form_subtitle_ru ?? null,
    form_subtitle_ro: data?.form_subtitle_ro ?? null,
    form_success_title_ru: data?.form_success_title_ru ?? null,
    form_success_title_ro: data?.form_success_title_ro ?? null,
    form_success_text_ru: data?.form_success_text_ru ?? null,
    form_success_text_ro: data?.form_success_text_ro ?? null,
    card_caption_ru: data?.card_caption_ru ?? null,
    card_caption_ro: data?.card_caption_ro ?? null,
    categories: Array.isArray(data?.categories)
      ? (data!.categories as Array<{ key: string; label_ru: string; label_ro: string; sort: number }>)
      : [],
  };

  return (
    <div className="p-8 max-w-5xl">
      <Link to="/admin/catalog" className="text-sm text-accent hover:underline">← К списку позиций</Link>
      <h1 className="font-serif text-3xl mt-3 mb-6">Контент страницы каталога</h1>
      {isLoading ? (
        <p className="text-muted-foreground">Загрузка…</p>
      ) : (
        <CatalogPageForm key={data?.updated_at ?? "empty"} initial={initial} />
      )}
    </div>
  );
}