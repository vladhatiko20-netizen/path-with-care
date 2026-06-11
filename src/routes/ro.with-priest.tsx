import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/WithPriestPage";
import { hreflangLinks } from "@/lib/hreflang";
import heroImg from "@/assets/hero-priest.jpg";
import { buildPageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/ro/with-priest")({
  head: () => ({
    meta: buildPageMeta({
      lang: "ro",
      title: "Dialog cu preotul – Pelerin",
      description: "Întrebări și răspunsuri despre pelerinaj, credință și pregătirea pentru drum. Convorbiri cu preotul.",
      ogDescription: "Întrebări și răspunsuri despre pelerinaj și credință.",
      ogImage: heroImg,
    }),
    links: hreflangLinks("/with-priest", "ro"),
  }),
  component: Component,
});
