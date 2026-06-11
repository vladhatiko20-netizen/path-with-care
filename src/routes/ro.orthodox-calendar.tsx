import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/OrthodoxCalendarPage";
import { hreflangLinks } from "@/lib/hreflang";
import { buildPageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/ro/orthodox-calendar")({
  head: () => ({
    meta: buildPageMeta({
      lang: "ro",
      title: "Calendar ortodox – Pelerin",
      description: "Sărbători ortodoxe, zile ale sfinților și posturile de peste an.",
      ogDescription: "Sărbători ortodoxe și zile ale sfinților.",
    }),
    links: hreflangLinks("/orthodox-calendar", "ro"),
  }),
  component: Component,
});
