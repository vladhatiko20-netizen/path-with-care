import { createFileRoute, Link } from "@tanstack/react-router";
import { CatalogItemForm } from "@/components/admin/CatalogItemForm";

export const Route = createFileRoute("/_admin/admin/catalog/new")({
  component: Page,
});

function Page() {
  return (
    <div className="p-8 max-w-5xl">
      <Link to="/admin/catalog" className="text-sm text-accent hover:underline">← К списку</Link>
      <h1 className="font-serif text-3xl mt-3 mb-6">Новая позиция</h1>
      <CatalogItemForm
        initial={{
          slug: "",
          title_ru: "",
          title_ro: "",
          description_ru: null,
          description_ro: null,
          category: "other",
          image_url: null,
          sort_order: 0,
          is_published: false,
        }}
      />
    </div>
  );
}