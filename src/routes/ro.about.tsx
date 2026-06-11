import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/AboutPage";
import { hreflangLinks } from "@/lib/hreflang";
import annaHero from "@/assets/anna-hero.jpg";

export const Route = createFileRoute("/ro/about")({
  // TODO: RO meta — currently using RU strings as fallback
  head: () => ({
    meta: [
      { title: "О нас — Паломник" },
      { name: "description", content: "Анна Плотник — путешественница и паломница. Подразделение SRL Eldorado Tur." },
      { name: "author", content: "Паломник" },
      { property: "og:title", content: "О нас — Паломник" },
      { property: "og:description", content: "Анна Плотник — путешественница и паломница." },
      { property: "og:image", content: annaHero },
    ],
    links: hreflangLinks("/about", "ro"),
  }),
  component: Component,
});