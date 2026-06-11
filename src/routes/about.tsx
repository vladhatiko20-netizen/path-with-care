import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/AboutPage";
import annaHero from "@/assets/anna-hero.jpg";
import { hreflangLinks } from "@/lib/hreflang";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "О нас — Паломник" },
      { name: "description", content: "Анна Плотник — путешественница и паломница. Подразделение SRL Eldorado Tur." },
      { name: "author", content: "Паломник" },
      { name: "twitter:title", content: "Паломник — паломнические поездки из Кишинёва" },
      { name: "twitter:description", content: "Паломнические поездки к святыням православного мира из Кишинёва. И вместе ко Христу." },
      { property: "og:title", content: "О нас — Паломник" },
      { property: "og:description", content: "Анна Плотник — путешественница и паломница." },
      { property: "og:image", content: annaHero },
    ],
    links: hreflangLinks("/about", "ru"),
  }),
  component: Component,
});
