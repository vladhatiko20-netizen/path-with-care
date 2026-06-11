import { createFileRoute, Link, notFound, ErrorComponent, useRouter } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Component, postQueryOptions } from "@/page-views/BlogPostPage";
import { resolveBlogImage } from "@/lib/blog-images";
import { SITE_ORIGIN } from "@/lib/constants";
import { hreflangLinks } from "@/lib/hreflang";

export const Route = createFileRoute("/blog_/$slug")({
  loader: async ({ params, context }) => {
    const post = await context.queryClient.ensureQueryData(postQueryOptions(params.slug));
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) return { meta: [{ title: "Статья не найдена — Паломник" }] };
    const cover = resolveBlogImage(post.cover_image);
    return {
      meta: [
        { title: `${post.title_ru} — Паломник` },
        { name: "description", content: post.excerpt_ru ?? post.title_ru },
        { name: "author", content: "Паломник" },
        { property: "og:title", content: post.title_ru },
        { property: "og:description", content: post.excerpt_ru ?? post.title_ru },
        { property: "og:image", content: cover },
        { name: "twitter:title", content: post.title_ru },
        { name: "twitter:description", content: post.excerpt_ru ?? post.title_ru },
        { name: "twitter:image", content: cover },
      ],
      links: hreflangLinks(`/blog/${post.slug}`, "ru"),
    };
  },
  errorComponent: ({ error }) => {
    const router = useRouter();
    return (
      <PageShell>
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <ErrorComponent error={error} />
          <button onClick={() => router.invalidate()} className="mt-6 inline-flex items-center px-6 py-3 bg-accent text-primary-foreground text-sm font-serif rounded-sm">
            Повторить
          </button>
        </div>
      </PageShell>
    );
  },
  notFoundComponent: () => (
    <PageShell>
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="font-serif text-3xl mb-4">Статья не найдена</h1>
        <Link to="/blog" className="text-accent font-serif italic hover:underline">← Все статьи</Link>
      </div>
    </PageShell>
  ),
  component: BlogPostRoute,
});

function BlogPostRoute() {
  const { slug } = Route.useParams();
  return <Component slug={slug} />;
}
