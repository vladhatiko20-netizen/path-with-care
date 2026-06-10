import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/routes/catalog";
import { buildHreflang } from "@/lib/locale";
import heroImg from "@/assets/catalog-hero.jpg";

export const Route = createFileRoute("/ro/catalog")({
  head: () => ({
    meta: [
      { title: "Icoane și obiecte sfinte — Pelerin" },
      { name: "description", content: "Catalog de icoane, tămâie, literatură duhovnicească. Anna le aduce din pelerinaje la precomandă." },
      { property: "og:title", content: "Icoane și obiecte sfinte — Pelerin" },
      { property: "og:description", content: "Catalog de icoane și obiecte sfinte la precomandă din pelerinaje." },
      { property: "og:image", content: heroImg },
    ],
    links: buildHreflang("/catalog", "ro"),
  }),
  component: Page,
});