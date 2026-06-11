import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/PublicOfferPage";
import { hreflangLinks } from "@/lib/hreflang";

export const Route = createFileRoute("/ro/public-offer")({
  head: () => ({
    meta: [
      { title: "Oferta publică – Pelerin" },
      { name: "description", content: "Condițiile de prestare a serviciilor de pelerinaj. Oferta publică." },
      { property: "og:title", content: "Oferta publică – Pelerin" },
      { property: "og:description", content: "Condițiile de prestare a serviciilor de pelerinaj." },
    ],
    links: hreflangLinks("/public-offer", "ro"),
  }),
  component: Component,
});
