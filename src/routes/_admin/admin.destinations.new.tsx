import { createFileRoute, Link } from "@tanstack/react-router";
import { DestinationForm } from "@/components/admin/DestinationForm";

export const Route = createFileRoute("/_admin/admin/destinations/new")({
  component: Page,
});

function Page() {
  return (
    <div className="p-8">
      <Link to="/admin/destinations" className="text-sm text-accent hover:underline">← К списку</Link>
      <h1 className="font-serif text-3xl mt-3 mb-6">Новое направление</h1>
      <DestinationForm initial={{
        slug: "",
        title_ru: "", title_ro: "",
        description_ru: null, description_ro: null,
        cover_image: null,
        duration_ru: null, duration_ro: null,
        price_from: null,
        group_size_ru: null, group_size_ro: null,
        program_ru: null, program_ro: null,
        hero_quote_ru: null, hero_quote_ro: null,
        hero_quote_author_ru: null, hero_quote_author_ro: null,
        intro_ru: null, intro_ro: null,
        notice_ru: null, notice_ro: null,
        seo_title_ru: null, seo_title_ro: null,
        seo_description_ru: null, seo_description_ro: null,
        og_image: null,
        accompaniment_ru: null,
        accompaniment_ro: null,
        short_title_ru: null,
        short_title_ro: null,
        card_text_ru: null,
        card_text_ro: null,
        is_published: false,
      }} />
    </div>
  );
}