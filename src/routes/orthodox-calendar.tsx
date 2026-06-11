import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/OrthodoxCalendarPage";
import { SITE_ORIGIN } from "@/lib/constants";

export const Route = createFileRoute("/orthodox-calendar")({
  head: () => ({
    meta: [
      { title: "Православный календарь — Паломник" },
      { name: "description", content: "Православный календарь: память святых, посты, праздники и связь с паломническими поездками." },
      { name: "author", content: "Паломник" },
      { name: "twitter:title", content: "Паломник — паломнические поездки из Кишинёва" },
      { name: "twitter:description", content: "Паломнические поездки к святыням православного мира из Кишинёва. И вместе ко Христу." },
      { property: "og:title", content: "Православный календарь — Паломник" },
      { property: "og:description", content: "Православный календарь: память святых, посты, праздники и связь с паломническими поездками." },
    ],
    links: [{ rel: "canonical", href: `${SITE_ORIGIN}/orthodox-calendar` }],
  }),
  component: Component,
});
