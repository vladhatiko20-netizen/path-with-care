import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/CatalogPage";
import { hreflangLinks } from "@/lib/hreflang";
import heroImg from "@/assets/catalog-hero.jpg";

export const Route = createFileRoute("/ro/catalog")({
  head: () => ({
    meta: [
      { title: "Icoane și sfinte odoare – Pelerin" },
      { name: "description", content: "Catalog de icoane și obiecte bisericești cu precomandă și ridicare de la birou. Fără magazin online." },
      { name: "author", content: "Pelerin" },
      { property: "og:title", content: "Icoane și sfinte odoare – Pelerin" },
      { property: "og:description", content: "Catalog de icoane și sfinte odoare cu precomandă." },
      { property: "og:image", content: heroImg },
    ],
    links: hreflangLinks("/catalog", "ro"),
  }),
  component: Component,
});
