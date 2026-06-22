import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/PrivacyPage";
import { hreflangLinks } from "@/lib/hreflang";
import { buildPageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: buildPageMeta({
      lang: "ru",
      title: "Политика конфиденциальности – Паломник",
      description: "Политика конфиденциальности сайта Паломник.",
      ogDescription: "Политика конфиденциальности сайта Паломник: как мы обрабатываем персональные данные.",
    }),
    links: hreflangLinks("/privacy", "ru"),
  }),
  component: Component,
});
