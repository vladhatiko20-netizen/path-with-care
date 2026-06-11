import { createFileRoute } from "@tanstack/react-router";
import {
  Component,
  destinationsListQueryOptions,
  upcomingPilgrimagesQueryOptions,
} from "@/page-views/IndexPage";
import { SITE_ORIGIN } from "@/lib/constants";
import { hreflangLinks } from "@/lib/hreflang";

export const Route = createFileRoute("/ro/")({
  // TODO: RO meta — currently using RU strings as fallback
  head: () => ({
    meta: [
      { title: "Pelerin — Pelerinaje ortodoxe din Chișinău" },
      { name: "description", content: "Pelerin — pelerinaje la sfintele locuri ale lumii ortodoxe din Chișinău: Ierusalim, Bari, Corfu, Athos, Georgia, România, Moldova. Și împreună spre Hristos." },
      { property: "og:title", content: "Pelerin — pelerinaje din Chișinău" },
      { property: "og:description", content: "Și împreună spre Hristos. Călătorii la sfintele locuri cu însoțire duhovnicească." },
      { property: "og:image", content: `${SITE_ORIGIN}/assets/hero-monastery.jpg` },
    ],
    links: hreflangLinks("/", "ro"),
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(destinationsListQueryOptions);
    context.queryClient.ensureQueryData(upcomingPilgrimagesQueryOptions);
  },
  component: Component,
});