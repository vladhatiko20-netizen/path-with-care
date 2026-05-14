import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminGetBlogPost } from "@/lib/admin.functions";
import { BlogPostForm } from "@/components/admin/BlogPostForm";

export const Route = createFileRoute("/_admin/admin/blog/$id")({
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  const get = useServerFn(adminGetBlogPost);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-blog-post", id],
    queryFn: () => get({ data: { id } }),
  });

  if (isLoading) return <div className="p-8 text-muted-foreground">Загрузка…</div>;
  if (error) return <div className="p-8 text-destructive">{(error as Error).message}</div>;
  if (!data) { throw notFound(); }

  return (
    <div className="p-8">
      <Link to="/admin/blog" className="text-sm text-accent hover:underline">← К списку</Link>
      <h1 className="font-serif text-3xl mt-3 mb-6">Редактирование статьи</h1>
      <BlogPostForm initial={{
        id: data.id,
        slug: data.slug,
        published_at: data.published_at,
        cover_image: data.cover_image,
        title_ru: data.title_ru,
        title_ro: data.title_ro,
        excerpt_ru: data.excerpt_ru,
        excerpt_ro: data.excerpt_ro,
        body_ru: data.body_ru,
        body_ro: data.body_ro,
        is_published: data.is_published,
      }} />
    </div>
  );
}
