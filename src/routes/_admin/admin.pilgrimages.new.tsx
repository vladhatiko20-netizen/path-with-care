import { createFileRoute, Link } from "@tanstack/react-router";
import { PilgrimageForm } from "@/components/admin/PilgrimageForm";

export const Route = createFileRoute("/_admin/admin/pilgrimages/new")({
  component: Page,
});

function Page() {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <div className="p-8">
      <Link to="/admin/pilgrimages" className="text-sm text-accent hover:underline">← К списку</Link>
      <h1 className="font-serif text-3xl mt-3 mb-6">Новая поездка</h1>
      <PilgrimageForm initial={{
        slug: "", start_date: today, end_date: today,
        destination_ru: "", destination_ro: "", title_ru: "", title_ro: "",
        description_ru: null, description_ro: null, cover_image: null,
        price_eur: null, with_priest: false, is_published: false,
      }} />
    </div>
  );
}
