import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/routes/orthodox-calendar";
import { buildHreflang } from "@/lib/locale";

export const Route = createFileRoute("/ro/orthodox-calendar")({
  head: () => ({
    meta: [
      { title: "Calendarul ortodox — Pelerin" },
      { name: "description", content: "Calendarul ortodox: pomenirea sfinților, posturi, sărbători și legătura cu pelerinajele." },
      { property: "og:title", content: "Calendarul ortodox — Pelerin" },
      { property: "og:description", content: "Calendarul ortodox: sfinți, posturi, sărbători." },
    ],
    links: buildHreflang("/orthodox-calendar", "ro"),
  }),
  component: Page,
});