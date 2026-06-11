import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/WithPriestPage";
import { hreflangLinks } from "@/lib/hreflang";
import heroImg from "@/assets/hero-priest.jpg";

export const Route = createFileRoute("/ro/with-priest")({
  // TODO: RO meta — currently using RU strings as fallback
  head: () => ({
    meta: [
      { title: "Диалог со священником — Паломник" },
      { name: "description", content: "Беседы со священниками, сопровождающими наши паломнические группы." },
      { name: "author", content: "Паломник" },
      { property: "og:title", content: "Диалог со священником — Паломник" },
      { property: "og:description", content: "Беседы со священниками, сопровождающими паломников." },
      { property: "og:image", content: heroImg },
    ],
    links: hreflangLinks("/with-priest", "ro"),
  }),
  component: Component,
});