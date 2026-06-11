import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/PublicOfferPage";
import { hreflangLinks } from "@/lib/hreflang";
import { buildPageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/public-offer")({
  head: () => ({
    meta: buildPageMeta({
      lang: "ru",
      title: "Публичная оферта — Паломник",
      description: "Публичная оферта сайта Паломник.",
      ogDescription: "Условия публичной оферты на услуги паломнических поездок Паломник.",
    }),
    links: hreflangLinks("/public-offer", "ru"),
  }),
  component: Component,
});
