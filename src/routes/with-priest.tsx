import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/WithPriestPage";
import heroImg from "@/assets/hero-priest.jpg";
import { hreflangLinks } from "@/lib/hreflang";
import { buildPageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/with-priest")({
  head: () => ({
    meta: buildPageMeta({
      lang: "ru",
      title: "Диалог со священником — Паломник",
      description: "Беседы со священниками, сопровождающими наши паломнические группы. Часто задаваемые вопросы и форма для личного вопроса.",
      ogDescription: "Беседы со священниками, сопровождающими паломников.",
      ogImage: heroImg,
    }),
    links: hreflangLinks("/with-priest", "ru"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "Как готовиться к паломничеству?", acceptedAnswer: { "@type": "Answer", text: "Готовиться лучше всего исповедью и причастием перед поездкой, чтением утренних и вечерних молитв, чтением о святынях, к которым едете." } },
            { "@type": "Question", name: "Нужно ли поститься перед поездкой?", acceptedAnswer: { "@type": "Answer", text: "Если поездка попадает на пост — соблюдаем общий пост Церкви. В обычные дни — по благословению духовника." } },
            { "@type": "Question", name: "Что взять с собой в Иерусалим?", acceptedAnswer: { "@type": "Answer", text: "Удобную скромную одежду, удобную обувь, святую воду, крестильные крестики и иконки для освящения." } },
            { "@type": "Question", name: "Как правильно прикладываться к мощам?", acceptedAnswer: { "@type": "Answer", text: "Перекреститесь дважды, поклонитесь, поцелуйте край раки или мощи, перекреститесь третий раз." } },
            { "@type": "Question", name: "Можно ли участвовать невоцерковлённому человеку?", acceptedAnswer: { "@type": "Answer", text: "Да. Многие приходят в Церковь именно через паломничество. Священник в группе всегда готов поговорить и помочь." } },
            { "@type": "Question", name: "Что нужно знать о церковной этике?", acceptedAnswer: { "@type": "Answer", text: "В храме — тишина, скромная одежда, не фотографируйте людей и службу без разрешения. Свечи ставят с молитвой." } },
          ],
        }),
      },
    ],
  }),
  component: Component,
});
