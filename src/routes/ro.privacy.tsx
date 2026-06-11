import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/PrivacyPage";
import { hreflangLinks } from "@/lib/hreflang";

export const Route = createFileRoute("/ro/privacy")({
  head: () => ({
    meta: [
      { title: "Politica de confidențialitate – Pelerin" },
      { name: "description", content: "Cum prelucrăm și protejăm datele cu caracter personal." },
      { property: "og:title", content: "Politica de confidențialitate – Pelerin" },
      { property: "og:description", content: "Cum prelucrăm și protejăm datele cu caracter personal." },
    ],
    links: hreflangLinks("/privacy", "ro"),
  }),
  component: Component,
});
