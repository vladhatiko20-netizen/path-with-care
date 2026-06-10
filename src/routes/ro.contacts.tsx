import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/routes/contacts";
import { buildHreflang } from "@/lib/locale";
import heroImg from "@/assets/hero-contacts.jpg";

export const Route = createFileRoute("/ro/contacts")({
  head: () => ({
    meta: [
      { title: "Contacte — Pelerin" },
      { name: "description", content: "Adresa biroului din Chișinău, telefoane, e-mail, program de lucru și formular de contact." },
      { property: "og:title", content: "Contacte — Pelerin" },
      { property: "og:description", content: "Contactați-ne: bd. Dacia 20, of. 81, Chișinău." },
      { property: "og:image", content: heroImg },
    ],
    links: buildHreflang("/contacts", "ro"),
  }),
  component: Page,
});