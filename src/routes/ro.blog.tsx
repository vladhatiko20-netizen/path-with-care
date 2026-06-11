import { createFileRoute, Link, ErrorComponent, useRouter } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Component, blogListQueryOptions } from "@/page-views/BlogPage";
import { hreflangLinks } from "@/lib/hreflang";
import heroImg from "@/assets/hero-blog.jpg";

export const Route = createFileRoute("/ro/blog")({
  // TODO: RO meta — currently using RU strings as fallback
  head: () => ({
    meta: [
      { title: "Православный блог — Паломник" },
      { name: "description", content: "Истории паломников, практические советы, рассказы о святых местах." },
      { name: "author", content: "Паломник" },
      { property: "og:title", content: "Православный блог — Паломник" },
      { property: "og:description", content: "Истории паломников и рассказы о святых местах." },
      { property: "og:image", content: heroImg },
    ],
    links: hreflangLinks("/blog", "ro"),
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
            Reîncearcă
          </button>
        </div>
      </PageShell>
    );
  },
  notFoundComponent: () => (
    <PageShell>
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="font-serif text-3xl mb-4">Pagina nu a fost găsită</h1>
        <Link to="/ro" className="text-accent font-serif italic hover:underline">← Acasă</Link>
      </div>
    </PageShell>
  ),
  component: Component,
});