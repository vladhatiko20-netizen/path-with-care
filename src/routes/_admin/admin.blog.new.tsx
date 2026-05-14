import { createFileRoute, Link } from "@tanstack/react-router";
import { BlogPostForm } from "@/components/admin/BlogPostForm";

export const Route = createFileRoute("/_admin/admin/blog/new")({
  component: Page,
});

function Page() {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <div className="p-8">
      <Link to="/admin/blog" className="text-sm text-accent hover:underline">← К списку</Link>
      <h1 className="font-serif text-3xl mt-3 mb-6">Новая статья</h1>
      <BlogPostForm initial={{
        slug: "", published_at: today, cover_image: null,
        title_ru: "", title_ro: "", excerpt_ru: null, excerpt_ro: null,
        body_ru: "", body_ro: "", is_published: false,
      }} />
    </div>
  );
}
