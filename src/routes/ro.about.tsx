import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/AboutPage";
import { hreflangLinks } from "@/lib/hreflang";
import annaHero from "@/assets/anna-hero.jpg";

export const Route = createFileRoute("/ro/about")({
  head: () => ({
    meta: [
      { title: "Despre noi – Pelerin" },
      { name: "description", content: "Cine suntem și cum organizăm pelerinaje ortodoxe la sfintele locuri. Subdiviziune de pelerinaj a Eldorado Tur, Chișinău." },
      { name: "author", content: "Pelerin" },
      { property: "og:title", content: "Despre noi – Pelerin" },
      { property: "og:description", content: "Cine suntem și cum organizăm pelerinaje ortodoxe la sfintele locuri." },
      { property: "og:image", content: annaHero },
    ],
    links: hreflangLinks("/about", "ro"),
  }),
  component: Component,
});