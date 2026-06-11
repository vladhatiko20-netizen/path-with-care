import { createFileRoute, ErrorComponent, useRouter } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Component, pilgrimagesQueryOptions } from "@/page-views/CalendarPage";
import { SITE_ORIGIN } from "@/lib/constants";
import { hreflangLinks } from "@/lib/hreflang";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Календарь поездок 2026 — Паломник" },
      { name: "description", content: "Полный календарь паломнических поездок на 2026 год по месяцам и направлениям." },
      { name: "author", content: "Паломник" },
      { name: "twitter:title", content: "Паломник — паломнические поездки из Кишинёва" },
      { name: "twitter:description", content: "Паломнические поездки к святыням православного мира из Кишинёва. И вместе ко Христу." },
      { property: "og:title", content: "Календарь поездок 2026 — Паломник" },
      { property: "og:description", content: "Полный календарь паломнических поездок на 2026 год." },
      { property: "og:image", content: `${SITE_ORIGIN}/assets/hero-calendar.jpg` },
    ],
    links: hreflangLinks("/calendar", "ru"),
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(pilgrimagesQueryOptions());
  },
  errorComponent: ({ error }) => {
    const router = useRouter();
    return (
      <PageShell>
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <ErrorComponent error={error} />
          <button onClick={() => router.invalidate()} className="mt-6 inline-flex items-center px-6 py-3 bg-accent text-primary-foreground text-sm font-serif rounded-sm">
            Повторить
          </button>
        </div>
      </PageShell>
    );
  },
  component: Component,
});
