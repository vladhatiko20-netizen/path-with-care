import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/ContactsPage";
import { SITE_ORIGIN } from "@/lib/constants";
import { hreflangLinks } from "@/lib/hreflang";
import heroImg from "@/assets/hero-contacts.jpg";

export const Route = createFileRoute("/ro/contacts")({
  // TODO: RO meta — currently using RU strings as fallback
  head: () => ({
    meta: [
      { title: "Контакты — Паломник" },
      { name: "description", content: "Адрес офиса в Кишинёве, телефоны, электронная почта, часы работы и форма обратной связи." },
      { name: "author", content: "Паломник" },
      { property: "og:title", content: "Контакты — Паломник" },
      { property: "og:description", content: "Свяжитесь с нами: бд. Дачия 20, оф. 81, Кишинёв." },
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