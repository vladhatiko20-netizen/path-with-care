import { createFileRoute } from "@tanstack/react-router";
import { Component, clergyQueryOptions, priestFaqQueryOptions } from "@/page-views/WithPriestPage";
import heroImg from "@/assets/hero-priest.jpg";
import { hreflangLinks } from "@/lib/hreflang";
import { buildPageMeta } from "@/lib/page-meta";
import { listPublishedPriestFaq } from "@/lib/priest-faq.functions";

export const Route = createFileRoute("/with-priest")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(clergyQueryOptions),
      context.queryClient.ensureQueryData(priestFaqQueryOptions),
    ]);
    return { faq: await listPublishedPriestFaq() };
  },
  head: ({ loaderData }) => ({
    meta: buildPageMeta({
      lang: "ru",
      title: "Диалог со священником — Паломник",
      description: "Беседы со священниками, сопровождающими наши паломнические группы. Часто задаваемые вопросы и форма для личного вопроса.",
      ogDescription: "Беседы со священниками, сопровождающими паломников.",
      ogImage: heroImg,
    }),
    links: hreflangLinks("/with-priest", "ru"),
    scripts: (loaderData?.faq?.length ?? 0) === 0 ? [] : [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: (loaderData?.faq ?? []).map((f) => ({
            "@type": "Question",
            name: f.question_ru,
            acceptedAnswer: { "@type": "Answer", text: f.answer_ru },
          })),
        }),
      },
    ],
  }),
  component: Component,
});
