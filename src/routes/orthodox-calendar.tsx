import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/OrthodoxCalendarPage";
import { hreflangLinks } from "@/lib/hreflang";
import { buildPageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/orthodox-calendar")({
  head: () => ({
    meta: buildPageMeta({
      lang: "ru",
      title: "Православный календарь – Паломник",
      description: "Православный календарь: память святых, посты, праздники и связь с паломническими поездками.",
    }),
    links: hreflangLinks("/orthodox-calendar", "ru"),
  }),
  component: Component,
});
