import { createFileRoute } from "@tanstack/react-router";
import {
  Component,
  destinationsListQueryOptions,
  upcomingPilgrimagesQueryOptions,
} from "@/page-views/IndexPage";
import { SITE_ORIGIN } from "@/lib/constants";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Паломник — Православные паломнические поездки из Кишинёва" },
      { name: "description", content: "Паломник — поездки к святыням православного мира из Кишинёва: Иерусалим, Бари, Корфу, Афон, Грузия, Румыния, Молдова. И вместе ко Христу." },
      { property: "og:title", content: "Паломник — паломнические поездки из Кишинёва" },
      { property: "og:description", content: "И вместе ко Христу. Поездки к святым местам с духовным сопровождением." },
      { property: "og:image", content: `${SITE_ORIGIN}/assets/hero-monastery.jpg` },
    ],
    links: [{ rel: "canonical", href: `${SITE_ORIGIN}/` }],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(destinationsListQueryOptions);
    context.queryClient.ensureQueryData(upcomingPilgrimagesQueryOptions);
  },
  component: Component,
});
