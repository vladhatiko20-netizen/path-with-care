import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/ContactsPage";
import { SITE_ORIGIN } from "@/lib/constants";
import { hreflangLinks } from "@/lib/hreflang";
import heroImg from "@/assets/hero-contacts.jpg";

export const Route = createFileRoute("/ro/contacts")({
  head: () => ({
    meta: [
      { title: "Contacte – Pelerin" },
      { name: "description", content: "Cum ne găsiți: adresă, telefoane și formular de contact. Birou în Chișinău, subdiviziune Eldorado Tur." },
      { name: "author", content: "Pelerin" },
      { property: "og:title", content: "Contacte – Pelerin" },
      { property: "og:description", content: "Cum ne găsiți: adresă, telefoane și formular de contact." },
      { property: "og:image", content: heroImg },
    ],
    links: hreflangLinks("/contacts", "ro"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Pelerin",
          image: SITE_ORIGIN,
          telephone: ["+37368778676", "+37368787599"],
          email: "palomnik.moldova@gmail.com",
          address: {
            "@type": "PostalAddress",
            streetAddress: "bd. Dacia 20, of. 81",
            addressLocality: "Chișinău",
            postalCode: "MD2060",
            addressCountry: "MD",
          },
          url: `${SITE_ORIGIN}/ro/contacts`,
        }),
      },
    ],
  }),
  component: Component,
});