import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Блог — Путь к Святыням" },
      { name: "description", content: "Истории паломников, практические советы, рассказы о святых местах и их хранителях." },
      { property: "og:title", content: "Блог — Путь к Святыням" },
      { property: "og:description", content: "Истории паломников, практические советы, рассказы о святых местах и их хранителях." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useLang();
  return (
    <PageShell>
      <section className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <p className="overline mb-5">{t("Раздел", "Secțiune")}</p>
        <h1 className="font-serif text-5xl md:text-6xl font-light text-foreground mb-8 leading-tight">
          {t("Блог", "Blog")}
        </h1>
        <p className="prose-warm text-lg md:text-xl font-serif italic text-foreground/85 leading-[1.85]">
          {t(
            "Истории паломников, практические советы, рассказы о святых местах и их хранителях.",
            "Povești de pelerini, sfaturi practice, povestiri despre locuri sfinte și sfinții lor."
          )}
        </p>
        <p className="mt-10 text-sm text-muted-foreground italic font-serif">
          {t(
            "Эта страница готовится — наполнение появится в ближайшее время.",
            "Această pagină este în pregătire — conținutul va apărea în curând."
          )}
        </p>
      </section>
    </PageShell>
  );
}
