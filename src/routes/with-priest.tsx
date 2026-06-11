import { createFileRoute } from "@tanstack/react-router";
import { Component } from "@/page-views/WithPriestPage";
import { SITE_ORIGIN } from "@/lib/constants";
import heroImg from "@/assets/hero-priest.jpg";

export const Route = createFileRoute("/with-priest")({
  head: () => ({
    meta: [
      { title: "Диалог со священником — Паломник" },
      { name: "description", content: "Беседы со священниками, сопровождающими наши паломнические группы. Часто задаваемые вопросы и форма для личного вопроса." },
      { name: "author", content: "Паломник" },
      { name: "twitter:title", content: "Паломник — паломнические поездки из Кишинёва" },
      { name: "twitter:description", content: "Паломнические поездки к святыням православного мира из Кишинёва. И вместе ко Христу." },
      { property: "og:title", content: "Диалог со священником — Паломник" },
      { property: "og:description", content: "Беседы со священниками, сопровождающими паломников." },
      { property: "og:image", content: heroImg },
    ],
    links: [{ rel: "canonical", href: `${SITE_ORIGIN}/with-priest` }],
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
