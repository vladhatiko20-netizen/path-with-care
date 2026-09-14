import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

// robots.txt отдаётся маршрутом, а не статикой: пока включён закрытый показ
// (секрет SITE_PASSWORD, см. src/server.ts), роботам запрещается всё.
export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        const gated = Boolean(process.env.SITE_PASSWORD?.trim());
        const body = gated
          ? "User-agent: *\nDisallow: /\n"
          : "User-agent: *\nAllow: /\n\nSitemap: https://palomnik.md/sitemap.xml\n";
        return new Response(body, {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": gated ? "no-store" : "public, max-age=3600",
          },
        });
      },
    },
  },
});
