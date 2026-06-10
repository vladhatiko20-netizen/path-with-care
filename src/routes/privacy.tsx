import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Политика конфиденциальности — Паломник" },
      { name: "description", content: "Политика конфиденциальности сайта Паломник." },
      { property: "og:title", content: "Политика конфиденциальности — Паломник" },
      { property: "og:description", content: "Политика конфиденциальности сайта Паломник: как мы обрабатываем персональные данные." },
    ],
    links: [{ rel: "canonical", href: "https://path-with-care.lovable.app/privacy" }],
  }),
  component: Page,
});

function Page() {
  const { t } = useLang();
  return (
    <PageShell>
      <section className="max-w-3xl mx-auto px-6 py-12 md:py-12">
        <p className="overline mb-5">{t("Документ", "Document")}</p>
        <h1 className="font-serif text-5xl md:text-6xl font-light text-foreground mb-8 leading-tight">
          {t("Политика конфиденциальности", "Politica de confidențialitate")}
        </h1>
        <p className="text-lg font-serif italic text-muted-foreground">
          {t(
            "Политика конфиденциальности в разработке.",
            "Politica de confidențialitate este în pregătire."
          )}
        </p>
      </section>
    </PageShell>
  );
}
