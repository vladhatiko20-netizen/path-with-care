import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/public-offer")({
  head: () => ({
    meta: [
      { title: "Публичная оферта — Паломник" },
      { name: "description", content: "Публичная оферта сайта Паломник." },
      { property: "og:title", content: "Публичная оферта — Паломник" },
      { property: "og:description", content: "Условия публичной оферты на услуги паломнических поездок Паломник." },
    ],
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
          {t("Публичная оферта", "Ofertă publică")}
        </h1>
        <p className="text-lg font-serif italic text-muted-foreground">
          {t("Публичная оферта в разработке.", "Oferta publică este în pregătire.")}
        </p>
      </section>
    </PageShell>
  );
}
