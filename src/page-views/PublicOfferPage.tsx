import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";

export function Component() {
  const { t, lang } = useLang();
  return (
    <PageShell>
      <section lang={lang} className="max-w-3xl mx-auto px-6 py-12 md:py-12">
        <p className="overline mb-5">{t("Документ", "Document")}</p>
        <h1 className="font-serif text-4xl md:text-6xl font-light text-foreground mb-8 leading-tight break-words hyphens-auto">
          {t("Публичная оферта", "Ofertă publică")}
        </h1>
        <p className="text-lg font-serif italic text-muted-foreground">
          {t("Публичная оферта в разработке.", "Oferta publică este în pregătire.")}
        </p>
      </section>
    </PageShell>
  );
}
