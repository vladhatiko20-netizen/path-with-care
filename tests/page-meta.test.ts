import { describe, test, expect } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildPageMeta } from "../src/lib/page-meta";

const HERE = dirname(fileURLToPath(import.meta.url));

// --- Behavioral test: the builder itself MUST mirror twitter to og. ---
describe("buildPageMeta", () => {
  test("twitter:title mirrors og:title (defaulting to title)", () => {
    const meta = buildPageMeta({ lang: "ru", title: "T", description: "D" });
    const og = meta.find((m) => m.property === "og:title")?.content;
    const tw = meta.find((m) => m.name === "twitter:title")?.content;
    expect(og).toBe("T");
    expect(tw).toBe(og);
  });

  test("twitter:description mirrors og:description", () => {
    const meta = buildPageMeta({ lang: "ro", title: "T", description: "D", ogDescription: "OD" });
    const og = meta.find((m) => m.property === "og:description")?.content;
    const tw = meta.find((m) => m.name === "twitter:description")?.content;
    expect(og).toBe("OD");
    expect(tw).toBe(og);
  });

  test("twitter:image mirrors og:image when image provided", () => {
    const meta = buildPageMeta({ lang: "ru", title: "T", description: "D", ogImage: "/x.jpg" });
    expect(meta.find((m) => m.property === "og:image")?.content).toBe("/x.jpg");
    expect(meta.find((m) => m.name === "twitter:image")?.content).toBe("/x.jpg");
  });

  test("ogTitle override propagates to twitter:title", () => {
    const meta = buildPageMeta({ lang: "ru", title: "Long Page Title", description: "D", ogTitle: "Short OG" });
    expect(meta.find((m) => m.property === "og:title")?.content).toBe("Short OG");
    expect(meta.find((m) => m.name === "twitter:title")?.content).toBe("Short OG");
  });

  test("ro lang sets author=Pelerin, ru sets Паломник", () => {
    expect(buildPageMeta({ lang: "ro", title: "T", description: "D" }).find((m) => m.name === "author")?.content).toBe("Pelerin");
    expect(buildPageMeta({ lang: "ru", title: "T", description: "D" }).find((m) => m.name === "author")?.content).toBe("Паломник");
  });
});

// --- Structural test: every public page route MUST go through buildPageMeta. ---
// This catches the exact drift we hit manually: a route adds hand-rolled
// twitter:* / og:* literals instead of using the shared builder.
const ROUTES_DIR = join(HERE, "..", "src", "routes");

// Files that legitimately have no head() of their own.
const EXCLUDED = new Set([
  "__root.tsx",          // sitewide defaults only; tested separately below
  "ro.tsx",              // RO layout, no head
  "_admin.tsx",          // admin layout (admin pages are noindex/internal)
  "login.tsx",           // auth screen, internal
  "sitemap[.]xml.ts",    // server route, no head
]);

function listPageRoutes(): string[] {
  const out: string[] = [];
  const walk = (dir: string, rel = "") => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const rp = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        // Skip _admin/ subtree — admin pages aren't public.
        if (entry.name === "_admin" || entry.name === "api") continue;
        walk(join(dir, entry.name), rp);
      } else if (entry.isFile() && /\.tsx?$/.test(entry.name) && !entry.name.endsWith(".test.ts") && !entry.name.endsWith(".test.tsx")) {
        if (EXCLUDED.has(entry.name) || EXCLUDED.has(rp)) continue;
        out.push(join(dir, entry.name));
      }
    }
  };
  walk(ROUTES_DIR);
  return out;
}

describe("route files invariants", () => {
  const files = listPageRoutes();

  test("found public page routes", () => {
    expect(files.length).toBeGreaterThan(10);
  });

  test.each(files.map((f) => [f]))("%s uses buildPageMeta()", (file) => {
    const src = readFileSync(file, "utf8");
    expect(src).toContain("buildPageMeta");
  });

  test.each(files.map((f) => [f]))("%s has NO hand-rolled twitter:title / twitter:description literals", (file) => {
    const src = readFileSync(file, "utf8");
    expect(src).not.toContain('"twitter:title"');
    expect(src).not.toContain('"twitter:description"');
    expect(src).not.toContain("'twitter:title'");
    expect(src).not.toContain("'twitter:description'");
  });
});

describe("__root.tsx", () => {
  const rootSrc = readFileSync(join(ROUTES_DIR, "__root.tsx"), "utf8");

  test("does NOT carry leaf-specific twitter tags (would leak across languages)", () => {
    expect(rootSrc).not.toContain('"twitter:title"');
    expect(rootSrc).not.toContain('"twitter:description"');
    expect(rootSrc).not.toContain('"twitter:image"');
  });

  test("does NOT carry leaf-specific og:title/description/image", () => {
    expect(rootSrc).not.toContain('"og:title"');
    expect(rootSrc).not.toContain('"og:description"');
    expect(rootSrc).not.toContain('"og:image"');
  });
});