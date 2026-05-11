import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/with-priest")({
  head: () => ({
    meta: [
      { title: "Диалог со священником — Паломник" },
      { name: "description", content: "Беседы со священниками: подготовка к паломничеству, исповедь, духовные вопросы." },
      { property: "og:title", content: "Диалог со священником — Паломник" },
      { property: "og:description", content: "Беседы со священниками: подготовка к паломничеству, исповедь, духовные вопросы." },
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
          {t("Диалог со священником", "Dialog cu preotul")}
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
