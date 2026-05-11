import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/with-priest")({
  head: () => ({
    meta: [
      { title: "Со священником — Путь к Святыням" },
      { name: "description", content: "Беседы со священниками: подготовка к паломничеству, исповедь, духовные вопросы. Можно задать вопрос лично." },
      { property: "og:title", content: "Со священником — Путь к Святыням" },
      { property: "og:description", content: "Беседы со священниками: подготовка к паломничеству, исповедь, духовные вопросы. Можно задать вопрос лично." },
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
          {t("Со священником", "Cu preotul")}
        </h1>
        <p className="prose-warm text-lg md:text-xl font-serif italic text-foreground/85 leading-[1.85]">
          {t(
            "Беседы со священниками: подготовка к паломничеству, исповедь, духовные вопросы. Можно задать вопрос лично.",
            "Conversații cu preoții: pregătirea pentru pelerinaj, spovedanie, întrebări duhovnicești."
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
