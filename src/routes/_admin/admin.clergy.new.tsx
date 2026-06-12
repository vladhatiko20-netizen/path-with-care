import { createFileRoute, Link } from "@tanstack/react-router";
import { ClergyForm } from "@/components/admin/ClergyForm";

export const Route = createFileRoute("/_admin/admin/clergy/new")({
  component: Page,
});

function Page() {
  return (
    <div className="p-8">
      <Link to="/admin/clergy" className="text-sm text-accent hover:underline">← К списку</Link>
      <h1 className="font-serif text-3xl mt-3 mb-6">Новый священник</h1>
      <ClergyForm initial={{
        name_ru: "", name_ro: "",
        title_ru: null, title_ro: null,
        bio_ru: null, bio_ro: null,
        photo_url: null,
        sort_order: 0,
        is_published: false,
      }} />
    </div>
  );
}