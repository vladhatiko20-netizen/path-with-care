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

export const Route = createFileRoute("/ro/")({
  head: () => ({
    meta: buildPageMeta({
      lang: "ro",
      title: "Pelerin – Și împreună spre Hristos",
      description: "Pelerinaje ortodoxe la sfintele locuri ale lumii: Ierusalim, Bari, Corfu, Athos, Georgia, România, Ucraina, Moldova. Subdiviziune Eldorado Tur.",
      ogDescription: "Pelerinaje ortodoxe la sfintele locuri ale lumii. Prieteni, să pornim împreună spre sfinte locuri.",
      ogImage: `${SITE_ORIGIN}/assets/hero-monastery.jpg`,
    }),
    links: hreflangLinks("/", "ro"),
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(destinationsListQueryOptions);
    context.queryClient.ensureQueryData(upcomingPilgrimagesQueryOptions);
    context.queryClient.ensureQueryData(clergyQueryOptions);
  },
  component: Component,
});