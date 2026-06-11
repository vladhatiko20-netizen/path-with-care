import { createFileRoute, Link, ErrorComponent, useRouter } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Component, blogListQueryOptions } from "@/page-views/BlogPage";
import heroImg from "@/assets/hero-blog.jpg";
import { hreflangLinks } from "@/lib/hreflang";
import { buildPageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: buildPageMeta({
      lang: "ru",
      title: "Православный блог — Паломник",
      description: "Истории паломников, практические советы, рассказы о святых местах.",
      ogDescription: "Истории паломников и рассказы о святых местах.",
      ogImage: heroImg,
    }),
    links: hreflangLinks("/blog", "ru"),
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(blogListQueryOptions());
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
        <h1 className="font-serif text-3xl mb-4">Страница не найдена</h1>
        <Link to="/" className="text-accent font-serif italic hover:underline">← На главную</Link>
      </div>
    </PageShell>
  ),
  component: Component,
});
