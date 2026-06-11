import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/AboutPage";
import annaHero from "@/assets/anna-hero.jpg";
import { hreflangLinks } from "@/lib/hreflang";
import { buildPageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: buildPageMeta({
      lang: "ru",
      title: "О нас — Паломник",
      description: "Анна Плотник — путешественница и паломница. Подразделение SRL Eldorado Tur.",
      ogDescription: "Анна Плотник — путешественница и паломница.",
      ogImage: annaHero,
    }),
    links: hreflangLinks("/about", "ru"),
  }),
  component: Component,
});
