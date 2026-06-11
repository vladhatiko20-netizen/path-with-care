import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/WithPriestPage";
import { hreflangLinks } from "@/lib/hreflang";
import heroImg from "@/assets/hero-priest.jpg";

export const Route = createFileRoute("/ro/with-priest")({
  head: () => ({
    meta: [
      { title: "Dialog cu preotul – Pelerin" },
      { name: "description", content: "Întrebări și răspunsuri despre pelerinaj, credință și pregătirea pentru drum. Convorbiri cu preotul." },
      { name: "author", content: "Pelerin" },
      { property: "og:title", content: "Dialog cu preotul – Pelerin" },
      { property: "og:description", content: "Întrebări și răspunsuri despre pelerinaj și credință." },
      { property: "og:image", content: heroImg },
    ],
    links: hreflangLinks("/with-priest", "ro"),
  }),
  component: Component,
});
