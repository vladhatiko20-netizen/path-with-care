import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

// Закрытый показ: пока в секретах воркера задан SITE_PASSWORD, весь сайт
// требует HTTP Basic Auth (логин SITE_USER, по умолчанию "palomnik"),
// отдаёт роботам запрет индексации и robots.txt с Disallow.
// Снять замок: `wrangler secret delete SITE_PASSWORD --name palomnik`.
type GateEnv = { SITE_PASSWORD?: string; SITE_USER?: string };

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => ((m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry)),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function isAuthorized(request: Request, user: string, password: string): boolean {
  const header = request.headers.get("authorization") ?? "";
  if (!header.startsWith("Basic ")) return false;
  let decoded: string;
  try {
    decoded = atob(header.slice(6));
  } catch {
    return false;
  }
  const sep = decoded.indexOf(":");
  if (sep < 0) return false;
  return timingSafeEqual(decoded.slice(0, sep), user) && timingSafeEqual(decoded.slice(sep + 1), password);
}

function gateResponse(): Response {
  return new Response(
    "<!doctype html><meta charset=utf-8><title>Паломник</title>" +
      "<p style=\"font-family:serif;margin:3em;color:#3d2817\">Сайт готовится к открытию. Для просмотра нужен пароль.</p>",
    {
      status: 401,
      headers: {
        "www-authenticate": 'Basic realm="Palomnik preview", charset="UTF-8"',
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
        "x-robots-tag": "noindex, nofollow, noarchive",
      },
    },
  );
}

function withNoIndex(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("x-robots-tag", "noindex, nofollow, noarchive");
  headers.set("cache-control", "private, no-store");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const gate = (env ?? {}) as GateEnv;
    const password = (gate.SITE_PASSWORD ?? process.env.SITE_PASSWORD)?.trim();
    if (password) {
      const url = new URL(request.url);
      if (url.pathname === "/robots.txt") {
        return new Response("User-agent: *\nDisallow: /\n", {
          headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex, nofollow", "cache-control": "no-store" },
        });
      }
      if (!isAuthorized(request, (gate.SITE_USER ?? process.env.SITE_USER)?.trim() || "palomnik", password)) {
        return gateResponse();
      }
    }
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response);
      return password ? withNoIndex(normalized) : normalized;
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};
