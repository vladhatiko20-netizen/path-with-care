import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Component, destinationsListQueryOptions } from "@/page-views/DestinationsIndexPage";
import { SITE_ORIGIN } from "@/lib/constants";
import { hreflangLinks } from "@/lib/hreflang";
import { buildPageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/destinations/")({
  head: () => ({
    meta: buildPageMeta({
      lang: "ru",
      title: "Направления — Паломник",
      description: "Восемь направлений к православным святыням мира из Кишинёва — Иерусалим, Бари, Корфу, Афон, Грузия, Румыния, Украина, Молдова.",
      ogDescription: "Восемь направлений к православным святыням мира из Кишинёва.",
      ogImage: `${SITE_ORIGIN}/assets/hero-destinations.jpg`,
    }),
    links: hreflangLinks("/destinations", "ru"),
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(destinationsListQueryOptions),
  errorComponent: ({ error }) => (
    <PageShell>
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-foreground/70">Не удалось загрузить список направлений: {error.message}</p>
      </div>
    </PageShell>
  ),
  component: Component,
});
