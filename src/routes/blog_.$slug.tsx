import { createFileRoute, Link, notFound, ErrorComponent, useRouter } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Component, postQueryOptions } from "@/page-views/BlogPostPage";
import { resolveBlogImage } from "@/lib/blog-images";
import { SITE_ORIGIN } from "@/lib/constants";
import { hreflangLinks } from "@/lib/hreflang";
import { buildPageMeta } from "@/lib/page-meta";

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
    const baseTitle = post.seo_title_ru || post.title_ru;
    const desc = post.seo_description_ru || post.excerpt_ru || post.title_ru;
    return {
      meta: buildPageMeta({
        lang: "ru",
        title: `${baseTitle} — Паломник`,
        description: desc,
        ogTitle: baseTitle,
        ogType: "article",
        ogImage: cover,
        ogUrl: `${SITE_ORIGIN}/blog/${post.slug}`,
      }),
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
