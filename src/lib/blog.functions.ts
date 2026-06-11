import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type BlogPostSummary = {
  slug: string;
  published_at: string;
  cover_image: string | null;
  title_ru: string;
  title_ro: string;
  excerpt_ru: string | null;
  excerpt_ro: string | null;
};

export type BlogPostFull = BlogPostSummary & {
  body_ru: string | null;
  body_ro: string | null;
};

export const listBlogPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<BlogPostSummary[]> => {
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select(
        "slug, published_at, cover_image, title_ru, title_ro, excerpt_ru, excerpt_ro",
      )
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  },
);

export const getBlogPostBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ slug: z.string().min(1).max(255) }).parse(input),
  )
  .handler(async ({ data }): Promise<BlogPostFull | null> => {
    const { data: row, error } = await supabaseAdmin
      .from("blog_posts")
      .select(
        "slug, published_at, cover_image, title_ru, title_ro, excerpt_ru, excerpt_ro, body_ru, body_ro",
      )
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return null;

    const { default: sanitizeHtml } = await import("sanitize-html");
    const sanitizeOptions: Parameters<typeof sanitizeHtml>[1] = {
      allowedTags: [
        "h1", "h2", "h3", "h4", "h5", "h6",
        "p", "br", "hr",
        "strong", "b", "em", "i", "u", "s", "strike", "sub", "sup",
        "ul", "ol", "li",
        "blockquote", "pre", "code",
        "a", "img",
        "span", "div",
      ],
      allowedAttributes: {
        a: ["href", "name", "target", "rel"],
        img: ["src", "alt", "title", "width", "height", "loading"],
        "*": ["class", "style"],
      },
      allowedSchemes: ["http", "https", "mailto", "tel"],
      transformTags: {
        a: (tagName, attribs) => ({
          tagName,
          attribs: {
            ...attribs,
            ...(attribs.target === "_blank"
              ? { rel: "noopener noreferrer" }
              : {}),
          },
        }),
      },
    };
    const clean = (html: string | null) =>
      html ? sanitizeHtml(html, sanitizeOptions) : html;
    return { ...row, body_ru: clean(row.body_ru), body_ro: clean(row.body_ro) };
  });