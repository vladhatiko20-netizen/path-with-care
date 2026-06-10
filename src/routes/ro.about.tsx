import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/routes/about";
import { buildHreflang } from "@/lib/locale";
import annaHero from "@/assets/anna-hero.jpg";

export const Route = createFileRoute("/ro/about")({
  head: () => ({
    meta: [
      { title: "Despre noi — Pelerin" },
      { name: "description", content: "Anna Plotnik — călătoare și pelerină. Subdiviziune a SRL Eldorado Tur." },
      { property: "og:title", content: "Despre noi — Pelerin" },
      { property: "og:description", content: "Anna Plotnik — călătoare și pelerină." },
      { property: "og:image", content: annaHero },
    ],
    links: buildHreflang("/about", "ro"),
  }),
  component: Page,
});