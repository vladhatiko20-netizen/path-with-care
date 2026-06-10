import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/routes/privacy";
import { buildHreflang } from "@/lib/locale";

export const Route = createFileRoute("/ro/privacy")({
  head: () => ({
    meta: [
      { title: "Politica de confidențialitate — Pelerin" },
      { name: "description", content: "Politica de confidențialitate și prelucrarea datelor cu caracter personal." },
      { property: "og:title", content: "Politica de confidențialitate — Pelerin" },
      { property: "og:description", content: "Cum prelucrăm datele cu caracter personal." },
    ],
    links: buildHreflang("/privacy", "ro"),
  }),
  component: Page,
});