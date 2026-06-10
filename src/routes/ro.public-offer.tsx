import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/routes/public-offer";
import { buildHreflang } from "@/lib/locale";

export const Route = createFileRoute("/ro/public-offer")({
  head: () => ({
    meta: [
      { title: "Oferta publică — Pelerin" },
      { name: "description", content: "Oferta publică pentru serviciile turistice ale Pelerin / SRL Eldorado Tur." },
      { property: "og:title", content: "Oferta publică — Pelerin" },
      { property: "og:description", content: "Condițiile contractuale pentru serviciile turistice." },
    ],
    links: buildHreflang("/public-offer", "ro"),
  }),
  component: Page,
});