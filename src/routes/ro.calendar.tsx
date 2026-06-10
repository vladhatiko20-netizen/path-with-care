import { createFileRoute } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";
import { Page } from "@/routes/calendar";
import { buildHreflang } from "@/lib/locale";
import { listPilgrimages } from "@/lib/pilgrimages.functions";

const pilgrimagesQueryOptions = () =>
  queryOptions({ queryKey: ["pilgrimages-public"], queryFn: () => listPilgrimages() });

export const Route = createFileRoute("/ro/calendar")({
  head: () => ({
    meta: [
      { title: "Calendarul pelerinajelor 2026 — Pelerin" },
      { name: "description", content: "Calendarul complet al pelerinajelor pentru 2026 pe luni și destinații." },
      { property: "og:title", content: "Calendarul pelerinajelor 2026 — Pelerin" },
      { property: "og:description", content: "Calendarul complet al pelerinajelor pentru 2026." },
      { property: "og:image", content: "https://path-with-care.lovable.app/assets/hero-calendar.jpg" },
    ],
    links: buildHreflang("/calendar", "ro"),
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(pilgrimagesQueryOptions());
  },
  component: Page,
});