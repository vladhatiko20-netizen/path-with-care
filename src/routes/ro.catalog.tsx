import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/CatalogPage";
import { hreflangLinks } from "@/lib/hreflang";
import { buildPageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/ro/catalog")({
  head: () => ({
    meta: buildPageMeta({
      lang: "ro",
      title: "Icoane și sfinte odoare – Pelerin",
      description: "Catalog de icoane, tămâie și cărți duhovnicești. Anna le aduce din pelerinaje.",
      ogDescription: "Catalog de icoane și sfinte odoare de la locuri sfinte.",
    }),
    links: hreflangLinks("/catalog", "ro"),
  }),
  component: Component,
});
