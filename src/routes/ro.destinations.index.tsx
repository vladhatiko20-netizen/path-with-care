import { createFileRoute } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";
import { PageShell } from "@/components/site/PageShell";
import { Page } from "@/routes/destinations.index";
import { buildHreflang } from "@/lib/locale";
import { listPublicDestinations } from "@/lib/destinations.functions";

const destinationsListQueryOptions = queryOptions({
  queryKey: ["destinations", "public-list"],
  queryFn: () => listPublicDestinations(),
});

export const Route = createFileRoute("/ro/destinations/")({
  head: () => ({
    meta: [
      { title: "Destinații — Pelerin" },
      { name: "description", content: "Opt destinații la locuri sfinte ortodoxe din Chișinău — Ierusalim, Bari, Corfu, Athos, Georgia, România, Ucraina, Moldova." },
      { property: "og:title", content: "Destinații — Pelerin" },
      { property: "og:description", content: "Opt destinații la locuri sfinte ortodoxe din Chișinău." },
      { property: "og:image", content: "https://path-with-care.lovable.app/assets/hero-destinations.jpg" },
    ],
    links: buildHreflang("/destinations", "ro"),
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(destinationsListQueryOptions),
  errorComponent: ({ error }) => (
    <PageShell>
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-foreground/70">Lista destinațiilor nu a putut fi încărcată: {error.message}</p>
      </div>
    </PageShell>
  ),
  component: Page,
});