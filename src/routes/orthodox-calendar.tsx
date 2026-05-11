import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/orthodox-calendar")({
  head: () => ({
    meta: [
      { title: "Православный календарь — Паломник" },
      { name: "description", content: "Православный календарь: память святых, посты, праздники и связь с паломническими поездками." },
      { property: "og:title", content: "Православный календарь — Паломник" },
      { property: "og:description", content: "Православный календарь: память святых, посты, праздники и связь с паломническими поездками." },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useLang();
  return (
    <PageShell>
      <section className="max-w-4xl mx-auto px-6 py-12 md:py-12">
        <h1 className="font-serif text-5xl md:text-6xl font-light text-foreground mb-8 leading-tight">
          {t("Православный календарь", "Calendar ortodox")}
        </h1>
        <p className="prose-warm text-lg md:text-xl font-serif italic text-foreground/85 leading-[1.85]">
          {t(
            "Православный календарь: память святых, посты, праздники и связь с паломническими поездками.",
            "Calendar ortodox: sfinții zilei, posturi, sărbători și legătura cu pelerinajele."
          )}
        </p>
      </section>
    </PageShell>
  );
}
