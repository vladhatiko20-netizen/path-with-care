import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";

export function Component() {
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
