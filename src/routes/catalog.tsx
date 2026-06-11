import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/CatalogPage";
import heroImg from "@/assets/catalog-hero.jpg";
import { hreflangLinks } from "@/lib/hreflang";
import { buildPageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: buildPageMeta({
      lang: "ru",
      title: "Иконы и святыни — Паломник",
      description: "Каталог икон, ладана, духовной литературы. Анна привозит из паломнических поездок по предзаказу.",
      ogDescription: "Каталог икон и святынь по предзаказу из паломнических поездок.",
      ogImage: heroImg,
    }),
    links: hreflangLinks("/catalog", "ru"),
  }),
  component: Component,
});
