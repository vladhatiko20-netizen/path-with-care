import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "О нас — Паломник" },
      { name: "description", content: "Анна Плотник — путешественница и паломница. Паломнические поездки как подразделение SRL Eldorado Tur." },
      { property: "og:title", content: "О нас — Паломник" },
      { property: "og:description", content: "Анна Плотник — путешественница и паломница." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useLang();
  return (
    <PageShell>
      <section className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <p className="overline mb-5">{t("О нас", "Despre")}</p>
        <h1 className="font-serif text-5xl md:text-6xl font-light text-foreground mb-8 leading-tight">
          {t("Анна Плотник — путешественница и паломница", "Anna Plotnik — călătoare și pelerină")}
        </h1>
        <div className="space-y-5 text-lg text-foreground/85 leading-[1.85]">
          <p className="font-serif italic text-xl">
            {t(
              "Я Анна. Уже несколько лет я организую поездки к святым местам. Сама бываю в Иерусалиме, на Корфу, в Бари. Мне дорого это служение — помогать людям прийти к святыням.",
              "Sunt Anna. De câțiva ani organizez călătorii la locurile sfinte. Eu însămi merg la Ierusalim, pe Corfu, la Bari. Această slujire îmi este dragă — să ajut oamenii să ajungă la sanctuare."
            )}
          </p>
          <p>
            {t(
              "Сайт «Паломник» — это подразделение туристического агентства SRL Eldorado Tur, которое мы посвятили исключительно паломническим поездкам. Здесь нет «горящих туров» и шумных предложений — только спокойные поездки к святыням православного мира.",
              "Site-ul „Pelerin” este o diviziune a agenției SRL Eldorado Tur, dedicată exclusiv pelerinajelor. Aici nu veți găsi oferte zgomotoase — doar călătorii liniștite la sanctuarele lumii ortodoxe."
            )}
          </p>
        </div>
        <p className="mt-10 text-sm text-muted-foreground italic font-serif">
          {t(
            "Полная биография и фотографии Анны появятся в ближайшее время.",
            "Biografia completă și fotografiile Annei vor apărea în curând."
          )}
        </p>
      </section>
    </PageShell>
  );
}
