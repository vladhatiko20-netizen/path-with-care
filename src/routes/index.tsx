import { createFileRoute } from "@tanstack/react-router";
import {
  Component,
  destinationsListQueryOptions,
  upcomingPilgrimagesQueryOptions,
} from "@/page-views/IndexPage";
import { SITE_ORIGIN } from "@/lib/constants";
import { hreflangLinks } from "@/lib/hreflang";
import { buildPageMeta } from "@/lib/page-meta";
import { clergyQueryOptions } from "@/page-views/WithPriestPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: buildPageMeta({
      lang: "ru",
      title: "Паломник – Православные паломнические поездки из Кишинёва",
      description: "Паломник – поездки к святыням православного мира из Кишинёва: Иерусалим, Бари, Корфу, Афон, Грузия, Румыния, Молдова. И вместе ко Христу.",
      ogTitle: "Паломник – паломнические поездки из Кишинёва",
      ogDescription: "И вместе ко Христу. Поездки к святым местам с духовным сопровождением.",
      ogImage: `${SITE_ORIGIN}/assets/hero-monastery.jpg`,
    }),
    links: hreflangLinks("/", "ru"),
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(destinationsListQueryOptions);
    context.queryClient.ensureQueryData(upcomingPilgrimagesQueryOptions);
    context.queryClient.ensureQueryData(clergyQueryOptions);
  },
  component: Component,
});
