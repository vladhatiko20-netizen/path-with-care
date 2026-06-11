import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/PrivacyPage";
import { hreflangLinks } from "@/lib/hreflang";
import { buildPageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/ro/privacy")({
  head: () => ({
    meta: buildPageMeta({
      lang: "ro",
      title: "Politica de confidențialitate – Pelerin",
      description: "Cum prelucrăm și protejăm datele cu caracter personal.",
    }),
    links: hreflangLinks("/privacy", "ro"),
  }),
  component: Component,
});
