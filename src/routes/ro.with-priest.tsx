import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/routes/with-priest";
import { buildHreflang } from "@/lib/locale";

export const Route = createFileRoute("/ro/with-priest")({
  head: () => ({
    meta: [
      { title: "Cu preot — Pelerin" },
      { name: "description", content: "Pelerinaje cu însoțire duhovnicească: rugăciuni, slujbe, dialog cu preotul în drum spre locurile sfinte." },
      { property: "og:title", content: "Pelerinaje cu preot — Pelerin" },
      { property: "og:description", content: "Pelerinaje cu însoțire duhovnicească și dialog cu preotul." },
    ],
    links: buildHreflang("/with-priest", "ro"),
  }),
  component: Page,
});