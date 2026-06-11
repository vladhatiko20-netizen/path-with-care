import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Component, destinationsListQueryOptions } from "@/page-views/DestinationsIndexPage";
import { SITE_ORIGIN } from "@/lib/constants";
import { hreflangLinks } from "@/lib/hreflang";

export const Route = createFileRoute("/ro/destinations/")({
  head: () => ({
    meta: [
      { title: "Direcții de pelerinaj – Pelerin" },
      { name: "description", content: "Opt direcții de pelerinaj ortodox: Ierusalim, Bari, Corfu, Athos, Georgia, România, Ucraina, Moldova. Program, sfinte locuri, date." },
      { name: "author", content: "Pelerin" },
      { property: "og:title", content: "Direcții de pelerinaj – Pelerin" },
      { property: "og:description", content: "Opt direcții de pelerinaj ortodox la sfintele locuri ale lumii." },
      { property: "og:image", content: `${SITE_ORIGIN}/assets/hero-destinations.jpg` },
    ],
    links: hreflangLinks("/destinations", "ro"),
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(destinationsListQueryOptions),
  errorComponent: ({ error }) => (
    <PageShell>
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-foreground/70">Nu s-a putut încărca lista destinațiilor: {error.message}</p>
      </div>
    </PageShell>
  ),
  component: Component,
});