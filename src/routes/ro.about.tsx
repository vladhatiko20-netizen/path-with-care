import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/AboutPage";
import { hreflangLinks } from "@/lib/hreflang";
import annaHero from "@/assets/anna-hero.jpg";
import { buildPageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/ro/about")({
  head: () => ({
    meta: buildPageMeta({
      lang: "ro",
      title: "Despre noi – Pelerin",
      description: "Cine suntem și cum organizăm pelerinaje ortodoxe la sfintele locuri. Subdiviziune de pelerinaj a Eldorado Tur, Chișinău.",
      ogDescription: "Cine suntem și cum organizăm pelerinaje ortodoxe la sfintele locuri.",
      ogImage: annaHero,
    }),
    links: hreflangLinks("/about", "ro"),
  }),
  component: Component,
});