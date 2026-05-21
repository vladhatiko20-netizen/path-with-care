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
        is_published: false,
      }} />
    </div>
  );
}