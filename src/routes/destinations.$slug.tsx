import { createFileRoute, Link, useRouter, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Component, loadDestination, buildDestinationJsonLd } from "@/page-views/DestinationSlugPage";
import { SITE_ORIGIN } from "@/lib/constants";
import { hreflangLinks } from "@/lib/hreflang";

export const Route = createFileRoute("/destinations/$slug")({
  loader: async ({ params }) => {
    const data = await loadDestination(params.slug);
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData, params }) => {
    const d = loaderData?.destination;
    if (!d) return {};
    const title = d.seo_title_ru || d.title_ru;
    const desc = d.seo_description_ru || d.description_ru || "";
    const url = `${SITE_ORIGIN}/destinations/${params.slug}`;
    const img = d.og_image || d.cover_image || undefined;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        ...(img ? [{ property: "og:image", content: img }] : []),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        ...(img ? [{ name: "twitter:image", content: img }] : []),
      ],
      links: hreflangLinks(`/destinations/${params.slug}`, "ru"),
      scripts: buildDestinationJsonLd(loaderData, url, "ru"),
    };
  },
  notFoundComponent: () => (
    <PageShell>
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="font-serif text-3xl mb-4">Страница не найдена</h1>
        <Link to="/destinations" className="text-accent hover:underline font-serif">К направлениям</Link>
      </div>
    </PageShell>
  ),
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <PageShell>
        <div className="max-w-3xl mx-auto px-6 py-20 text-center font-serif">
          <h1 className="text-3xl mb-3">Не удалось загрузить страницу</h1>
          <p className="text-foreground/70 mb-6">{error.message}</p>
          <button onClick={() => { reset(); router.invalidate(); }} className="px-5 py-2 bg-accent text-primary-foreground rounded-sm">
            Попробовать снова
          </button>
        </div>
      </PageShell>
    );
  },
  component: DestinationRoute,
});

function DestinationRoute() {
  const data = Route.useLoaderData();
  const { slug } = Route.useParams();
  return <Component data={data} slug={slug} />;
}
