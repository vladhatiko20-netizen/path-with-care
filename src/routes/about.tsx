import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "О нас — Путь к Святыням" },
      { name: "description", content: "Анна Плотник, паломнические поездки как подразделение SRL Eldorado Tur. Наша миссия и команда." },
      { property: "og:title", content: "О нас — Путь к Святыням" },
      { property: "og:description", content: "Анна Плотник, паломнические поездки как подразделение SRL Eldorado Tur. Наша миссия и команда." },
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
          {t("О нас", "Despre noi")}
        </h1>
        <p className="prose-warm text-lg md:text-xl font-serif italic text-foreground/85 leading-[1.85]">
          {t(
            "Анна Плотник, паломнические поездки как подразделение SRL Eldorado Tur. Наша миссия и команда.",
            "Anna Plotnik, pelerinajele ca divizie a SRL Eldorado Tur. Misiunea și echipa noastră."
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
