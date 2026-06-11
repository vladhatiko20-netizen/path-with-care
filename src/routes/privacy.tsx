import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/PrivacyPage";
import { hreflangLinks } from "@/lib/hreflang";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Политика конфиденциальности — Паломник" },
      { name: "description", content: "Политика конфиденциальности сайта Паломник." },
      { property: "og:title", content: "Политика конфиденциальности — Паломник" },
      { property: "og:description", content: "Политика конфиденциальности сайта Паломник: как мы обрабатываем персональные данные." },
    ],
    links: hreflangLinks("/privacy", "ru"),
  }),
  component: Component,
});
