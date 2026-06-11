import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/OrthodoxCalendarPage";
import { hreflangLinks } from "@/lib/hreflang";

export const Route = createFileRoute("/ro/orthodox-calendar")({
  // TODO: RO meta — currently using RU strings as fallback
  head: () => ({
    meta: [
      { title: "Православный календарь — Паломник" },
      { name: "description", content: "Православный календарь: память святых, посты, праздники и связь с паломническими поездками." },
      { name: "author", content: "Паломник" },
      { property: "og:title", content: "Православный календарь — Паломник" },
      { property: "og:description", content: "Православный календарь: память святых, посты, праздники и связь с паломническими поездками." },
    ],
    links: hreflangLinks("/orthodox-calendar", "ro"),
  }),
  component: Component,
});