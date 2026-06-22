import { createFileRoute, ErrorComponent, useRouter } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Component, pilgrimagesQueryOptions } from "@/page-views/CalendarPage";
import { SITE_ORIGIN } from "@/lib/constants";
import { hreflangLinks } from "@/lib/hreflang";
import { buildPageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: buildPageMeta({
      lang: "ru",
      title: "Календарь поездок 2026 – Паломник",
      description: "Полный календарь паломнических поездок на 2026 год по месяцам и направлениям.",
      ogDescription: "Полный календарь паломнических поездок на 2026 год.",
      ogImage: `${SITE_ORIGIN}/assets/hero-calendar.jpg`,
    }),
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
