import { createFileRoute, Link, notFound, ErrorComponent, useRouter } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Component, postQueryOptions } from "@/page-views/BlogPostPage";
import { resolveBlogImage } from "@/lib/blog-images";
import { SITE_ORIGIN } from "@/lib/constants";
import { hreflangLinks } from "@/lib/hreflang";
import { buildPageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/ro/blog_/$slug")({
  loader: async ({ params, context }) => {
    const post = await context.queryClient.ensureQueryData(postQueryOptions(params.slug));
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData, params }) => {
    const post = loaderData?.post;
    if (!post) return { meta: [{ title: "Articol negăsit – Pelerin" }] };
    const cover = resolveBlogImage(post.cover_image);
    const baseTitle = post.seo_title_ro || post.title_ro || post.title_ru;
    const desc =
      post.seo_description_ro ||
      post.excerpt_ro ||
      post.excerpt_ru ||
      baseTitle;
    return {
      meta: buildPageMeta({
        lang: "ro",
        title: `${baseTitle} – Pelerin`,
        description: desc,
        ogTitle: baseTitle,
        ogType: "article",
        ogImage: cover,
        ogUrl: `${SITE_ORIGIN}/ro/blog/${post.slug}`,
      }),
      links: hreflangLinks(`/blog/${params.slug}`, "ro"),
    };
  },
  errorComponent: ({ error }) => {
    const router = useRouter();
    return (
      <PageShell>
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <ErrorComponent error={error} />
          <button onClick={() => router.invalidate()} className="mt-6 inline-flex items-center px-6 py-3 bg-accent text-primary-foreground text-sm font-serif rounded-sm">
            Reîncearcă
          </button>
        </div>
      </PageShell>
    );
  },
  notFoundComponent: () => (
    <PageShell>
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="font-serif text-3xl mb-4">Articolul nu a fost găsit</h1>
        <Link to="/ro/blog" className="text-accent font-serif italic hover:underline">← Toate articolele</Link>
      </div>
    </PageShell>
  ),
  component: BlogPostRoute,
});

function BlogPostRoute() {
  const { slug } = Route.useParams();
  return <Component slug={slug} />;
}