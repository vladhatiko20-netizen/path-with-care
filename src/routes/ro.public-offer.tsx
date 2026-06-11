import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/PublicOfferPage";
import { hreflangLinks } from "@/lib/hreflang";

export const Route = createFileRoute("/ro/public-offer")({
  // TODO: RO meta — currently using RU strings as fallback
  head: () => ({
    meta: [
      { title: "Публичная оферта — Паломник" },
      { name: "description", content: "Публичная оферта сайта Паломник." },
      { property: "og:title", content: "Публичная оферта — Паломник" },
      { property: "og:description", content: "Условия публичной оферты на услуги паломнических поездок Паломник." },
    ],
    links: hreflangLinks("/public-offer", "ro"),
  }),
  component: Component,
});