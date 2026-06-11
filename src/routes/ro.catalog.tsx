import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/CatalogPage";
import { hreflangLinks } from "@/lib/hreflang";
import heroImg from "@/assets/catalog-hero.jpg";

export const Route = createFileRoute("/ro/catalog")({
  // TODO: RO meta — currently using RU strings as fallback
  head: () => ({
    meta: [
      { title: "Иконы и святыни — Паломник" },
      { name: "description", content: "Каталог икон, ладана, духовной литературы. Анна привозит из паломнических поездок по предзаказу." },
      { name: "author", content: "Паломник" },
      { property: "og:title", content: "Иконы и святыни — Паломник" },
      { property: "og:description", content: "Каталог икон и святынь по предзаказу из паломнических поездок." },
      { property: "og:image", content: heroImg },
    ],
    links: hreflangLinks("/catalog", "ro"),
  }),
  component: Component,
});