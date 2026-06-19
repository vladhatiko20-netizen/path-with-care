import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/CatalogPage";
import { hreflangLinks } from "@/lib/hreflang";
import { buildPageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: buildPageMeta({
      lang: "ru",
      title: "Иконы и святыни – Паломник",
      description: "Каталог икон, ладана и духовной литературы. Анна привозит из паломнических поездок.",
      ogDescription: "Каталог икон и святынь со святых мест.",
    }),
    links: hreflangLinks("/catalog", "ru"),
  }),
  component: Component,
});
