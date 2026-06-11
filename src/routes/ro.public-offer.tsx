import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/PublicOfferPage";
import { hreflangLinks } from "@/lib/hreflang";
import { buildPageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/ro/public-offer")({
  head: () => ({
    meta: buildPageMeta({
      lang: "ro",
      title: "Oferta publică – Pelerin",
      description: "Condițiile de prestare a serviciilor de pelerinaj. Oferta publică.",
    }),
    links: hreflangLinks("/public-offer", "ro"),
  }),
  component: Component,
});
