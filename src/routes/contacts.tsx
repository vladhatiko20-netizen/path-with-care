import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/ContactsPage";
import { SITE_ORIGIN } from "@/lib/constants";
import heroImg from "@/assets/hero-contacts.jpg";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title: "Контакты — Паломник" },
      { name: "description", content: "Адрес офиса в Кишинёве, телефоны, электронная почта, часы работы и форма обратной связи." },
      { name: "author", content: "Паломник" },
      { name: "twitter:title", content: "Паломник — паломнические поездки из Кишинёва" },
      { name: "twitter:description", content: "Паломнические поездки к святыням православного мира из Кишинёва. И вместе ко Христу." },
      { property: "og:title", content: "Контакты — Паломник" },
      { property: "og:description", content: "Свяжитесь с нами: бд. Дачия 20, оф. 81, Кишинёв." },
      { property: "og:image", content: heroImg },
    ],
    links: [{ rel: "canonical", href: `${SITE_ORIGIN}/contacts` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Паломник",
          image: SITE_ORIGIN,
          telephone: ["+37368778676", "+37368787599"],
          email: "palomnik.moldova@gmail.com",
          address: {
            "@type": "PostalAddress",
            streetAddress: "бд. Дачия 20, оф. 81",
            addressLocality: "Кишинёв",
            postalCode: "MD2060",
            addressCountry: "MD",
          },
          openingHoursSpecification: [
            { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "09:00", closes: "18:00" },
            { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "10:00", closes: "15:00" },
          ],
          url: `${SITE_ORIGIN}/contacts`,
        }),
      },
    ],
  }),
  component: Component,
});
