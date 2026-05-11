import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title: "Контакты — Путь к Святыням" },
      { name: "description", content: "Адрес офиса в Кишинёве, телефоны, электронная почта, часы работы и форма обратной связи." },
      { property: "og:title", content: "Контакты — Путь к Святыням" },
      { property: "og:description", content: "Адрес офиса в Кишинёве, телефоны, электронная почта, часы работы и форма обратной связи." },
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
          {t("Контакты", "Contacte")}
        </h1>
        <p className="prose-warm text-lg md:text-xl font-serif italic text-foreground/85 leading-[1.85]">
          {t(
            "Адрес офиса в Кишинёве, телефоны, электронная почта, часы работы и форма обратной связи.",
            "Adresa biroului din Chișinău, telefoane, e-mail, orarul și formular de contact."
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
