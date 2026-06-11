import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/OrthodoxCalendarPage";
import { hreflangLinks } from "@/lib/hreflang";

export const Route = createFileRoute("/ro/orthodox-calendar")({
  head: () => ({
    meta: [
      { title: "Calendar ortodox – Pelerin" },
      { name: "description", content: "Sărbători ortodoxe, zile ale sfinților și posturile de peste an." },
      { name: "author", content: "Pelerin" },
      { property: "og:title", content: "Calendar ortodox – Pelerin" },
      { property: "og:description", content: "Sărbători ortodoxe și zile ale sfinților." },
    ],
    links: hreflangLinks("/orthodox-calendar", "ro"),
  }),
  component: Component,
});
