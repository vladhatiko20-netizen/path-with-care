import { createFileRoute } from "@tanstack/react-router";
import {
  Component,
  destinationsListQueryOptions,
  upcomingPilgrimagesQueryOptions,
} from "@/page-views/IndexPage";
import { SITE_ORIGIN } from "@/lib/constants";
import { hreflangLinks } from "@/lib/hreflang";

export const Route = createFileRoute("/ro/")({
  head: () => ({
    meta: [
      { title: "Pelerin – Și împreună spre Hristos" },
      { name: "description", content: "Pelerinaje ortodoxe la sfintele locuri ale lumii: Ierusalim, Bari, Corfu, Athos, Georgia, România, Ucraina, Moldova. Subdiviziune Eldorado Tur." },
      { name: "author", content: "Pelerin" },
      { property: "og:title", content: "Pelerin – Și împreună spre Hristos" },
      { property: "og:description", content: "Pelerinaje ortodoxe la sfintele locuri ale lumii. Prieteni, să pornim împreună spre sfinte locuri." },
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