import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/ContactsPage";
import { SITE_ORIGIN } from "@/lib/constants";
import heroImg from "@/assets/hero-contacts.jpg";
import { hreflangLinks } from "@/lib/hreflang";
import { buildPageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: buildPageMeta({
      lang: "ru",
      title: "Контакты — Паломник",
      description: "Адрес офиса в Кишинёве, телефоны, электронная почта, часы работы и форма обратной связи.",
      ogDescription: "Свяжитесь с нами: бд. Дачия 20, оф. 81, Кишинёв.",
      ogImage: heroImg,
    }),
    links: hreflangLinks("/contacts", "ru"),
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
