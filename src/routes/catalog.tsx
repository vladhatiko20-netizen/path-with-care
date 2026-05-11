import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: [
      { title: "Иконы и святыни — Паломник" },
      { name: "description", content: "Каталог икон, ладана, духовной литературы. Анна привозит из паломнических поездок по предзаказу." },
      { property: "og:title", content: "Иконы и святыни — Паломник" },
      { property: "og:description", content: "Каталог икон, ладана, духовной литературы по предзаказу." },
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
          {t("Иконы и святыни", "Icoane și obiecte sfinte")}
        </h1>
        <p className="prose-warm text-lg md:text-xl font-serif italic text-foreground/85 leading-[1.85]">
          {t(
            "Каталог икон, ладана, духовной литературы. Анна привозит из паломнических поездок по предзаказу.",
            "Catalog de icoane, tămâie, literatură duhovnicească — pe care Anna le aduce la pre-comandă."
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
