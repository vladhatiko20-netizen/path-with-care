import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Component, destinationsListQueryOptions } from "@/page-views/DestinationsIndexPage";
import { SITE_ORIGIN } from "@/lib/constants";
import { hreflangLinks } from "@/lib/hreflang";

export const Route = createFileRoute("/destinations/")({
  head: () => ({
    meta: [
      { title: "Направления — Паломник" },
      { name: "description", content: "Восемь направлений к православным святыням мира из Кишинёва — Иерусалим, Бари, Корфу, Афон, Грузия, Румыния, Украина, Молдова." },
      { name: "author", content: "Паломник" },
      { name: "twitter:title", content: "Паломник — паломнические поездки из Кишинёва" },
      { name: "twitter:description", content: "Паломнические поездки к святыням православного мира из Кишинёва. И вместе ко Христу." },
      { property: "og:title", content: "Направления — Паломник" },
      { property: "og:description", content: "Восемь направлений к православным святыням мира из Кишинёва." },
      { property: "og:image", content: `${SITE_ORIGIN}/assets/hero-destinations.jpg` },
    ],
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
