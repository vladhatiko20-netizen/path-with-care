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
    return row;
  });