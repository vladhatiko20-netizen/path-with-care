import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/CatalogPage";
import heroImg from "@/assets/catalog-hero.jpg";
import { hreflangLinks } from "@/lib/hreflang";

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: [
      { title: "Иконы и святыни — Паломник" },
      { name: "description", content: "Каталог икон, ладана, духовной литературы. Анна привозит из паломнических поездок по предзаказу." },
      { name: "author", content: "Паломник" },
      { name: "twitter:title", content: "Паломник — паломнические поездки из Кишинёва" },
      { name: "twitter:description", content: "Паломнические поездки к святыням православного мира из Кишинёва. И вместе ко Христу." },
      { property: "og:title", content: "Иконы и святыни — Паломник" },
      { property: "og:description", content: "Каталог икон и святынь по предзаказу из паломнических поездок." },
      { property: "og:image", content: heroImg },
    ],
    links: hreflangLinks("/catalog", "ru"),
  }),
  component: Component,
});
