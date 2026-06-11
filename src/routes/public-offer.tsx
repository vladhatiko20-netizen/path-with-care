import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/PublicOfferPage";
import { SITE_ORIGIN } from "@/lib/constants";

export const Route = createFileRoute("/public-offer")({
  head: () => ({
    meta: [
      { title: "Публичная оферта — Паломник" },
      { name: "description", content: "Публичная оферта сайта Паломник." },
      { property: "og:title", content: "Публичная оферта — Паломник" },
      { property: "og:description", content: "Условия публичной оферты на услуги паломнических поездок Паломник." },
    ],
    links: [{ rel: "canonical", href: `${SITE_ORIGIN}/public-offer` }],
  }),
  component: Component,
});
