import { createFileRoute } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";
import { HomePage } from "@/routes/index";
import { buildHreflang } from "@/lib/locale";
import { listPublicDestinations } from "@/lib/destinations.functions";
import { listPilgrimages } from "@/lib/pilgrimages.functions";

const destinationsListQueryOptions = queryOptions({
  queryKey: ["destinations", "public-list"],
  queryFn: () => listPublicDestinations(),
});
const upcomingPilgrimagesQueryOptions = queryOptions({
  queryKey: ["pilgrimages", "upcoming"],
  queryFn: () => listPilgrimages(),
});

export const Route = createFileRoute("/ro/")({
  head: () => ({
    meta: [
      { title: "Pelerin — Pelerinaje ortodoxe din Chișinău" },
      {
        name: "description",
        content:
          "Pelerin — pelerinaje la locuri sfinte ale lumii ortodoxe din Chișinău: Ierusalim, Bari, Corfu, Athos, Georgia, România, Moldova. Și împreună la Hristos.",
      },
      { property: "og:title", content: "Pelerin — pelerinaje din Chișinău" },
      {
        property: "og:description",
        content: "Și împreună la Hristos. Pelerinaje la locuri sfinte cu însoțire duhovnicească.",
      },
      { property: "og:image", content: "https://path-with-care.lovable.app/assets/hero-monastery.jpg" },
    ],
    links: buildHreflang("/", "ro"),
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(destinationsListQueryOptions);
    context.queryClient.ensureQueryData(upcomingPilgrimagesQueryOptions);
  },
  component: HomePage,
});