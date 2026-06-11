import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Component, destinationsListQueryOptions } from "@/page-views/DestinationsIndexPage";
import { SITE_ORIGIN } from "@/lib/constants";
import { hreflangLinks } from "@/lib/hreflang";
import { buildPageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/ro/destinations/")({
  head: () => ({
    meta: buildPageMeta({
      lang: "ro",
      title: "Direcții de pelerinaj – Pelerin",
      description: "Opt direcții de pelerinaj ortodox: Ierusalim, Bari, Corfu, Athos, Georgia, România, Ucraina, Moldova. Program, sfinte locuri, date.",
      ogDescription: "Opt direcții de pelerinaj ortodox la sfintele locuri ale lumii.",
      ogImage: `${SITE_ORIGIN}/assets/hero-destinations.jpg`,
    }),
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