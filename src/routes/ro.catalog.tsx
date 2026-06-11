import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/CatalogPage";
import { hreflangLinks } from "@/lib/hreflang";
import heroImg from "@/assets/catalog-hero.jpg";
import { buildPageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/ro/catalog")({
  head: () => ({
    meta: buildPageMeta({
      lang: "ro",
      title: "Icoane și sfinte odoare – Pelerin",
      description: "Catalog de icoane și obiecte bisericești cu precomandă și ridicare de la birou. Fără magazin online.",
      ogDescription: "Catalog de icoane și sfinte odoare cu precomandă.",
      ogImage: heroImg,
    }),
    links: hreflangLinks("/catalog", "ro"),
  }),
  component: Component,
});
