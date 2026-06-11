import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/PrivacyPage";
import { SITE_ORIGIN } from "@/lib/constants";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Политика конфиденциальности — Паломник" },
      { name: "description", content: "Политика конфиденциальности сайта Паломник." },
      { property: "og:title", content: "Политика конфиденциальности — Паломник" },
      { property: "og:description", content: "Политика конфиденциальности сайта Паломник: как мы обрабатываем персональные данные." },
    ],
    links: [{ rel: "canonical", href: `${SITE_ORIGIN}/privacy` }],
  }),
  component: Component,
});
