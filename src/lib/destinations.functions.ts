import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type PublicDestination = {
  slug: string;
  title_ru: string;
  title_ro: string;
  description_ru: string | null;
  description_ro: string | null;
  duration_ru: string | null;
  duration_ro: string | null;
  group_size_ru: string | null;
  group_size_ro: string | null;
  price_from: number | null;
  program_ru: string | null;
  program_ro: string | null;
  cover_image: string | null;
  hero_quote_ru: string | null;
  hero_quote_ro: string | null;
  hero_quote_author_ru: string | null;
  hero_quote_author_ro: string | null;
  intro_ru: string | null;
  intro_ro: string | null;
  notice_ru: string | null;
  notice_ro: string | null;
  seo_title_ru: string | null;
  seo_title_ro: string | null;
  seo_description_ru: string | null;
  seo_description_ro: string | null;
  og_image: string | null;
  accompaniment_ru: string | null;
  accompaniment_ro: string | null;
  short_title_ru: string | null;
  short_title_ro: string | null;
};

export const getDestinationBySlug = createServerFn({ method: "GET" })
  .inputValidator((i: unknown) =>
    z.object({ slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/) }).parse(i),
  )
  .handler(async ({ data }): Promise<PublicDestination | null> => {
    const { data: row, error } = await supabaseAdmin
      .from("destinations")
      .select("slug, title_ru, title_ro, description_ru, description_ro, duration_ru, duration_ro, group_size_ru, group_size_ro, price_from, program_ru, program_ro, cover_image, hero_quote_ru, hero_quote_ro, hero_quote_author_ru, hero_quote_author_ro, intro_ru, intro_ro, notice_ru, notice_ro, seo_title_ru, seo_title_ro, seo_description_ru, seo_description_ro, og_image, accompaniment_ru, accompaniment_ro, short_title_ru, short_title_ro")
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (row as PublicDestination | null) ?? null;
  });

export type PublicDestinationListItem = {
  slug: string;
  title_ru: string;
  title_ro: string;
  description_ru: string | null;
  description_ro: string | null;
  intro_ru: string | null;
  intro_ro: string | null;
  duration_ru: string | null;
  duration_ro: string | null;
  price_from: number | null;
  cover_image: string | null;
  notice_ru: string | null;
  notice_ro: string | null;
};

export const listPublicDestinations = createServerFn({ method: "GET" })
  .handler(async (): Promise<PublicDestinationListItem[]> => {
    const { data, error } = await supabaseAdmin
      .from("destinations")
      .select("slug, title_ru, title_ro, description_ru, description_ro, intro_ru, intro_ro, duration_ru, duration_ro, price_from, cover_image, notice_ru, notice_ro")
      .eq("is_published", true)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return (data as PublicDestinationListItem[] | null) ?? [];
  });

export type PublicGalleryImage = {
  id: string;
  image_url: string;
  alt_ru: string | null;
  alt_ro: string | null;
  author: string | null;
  license: string | null;
  source_url: string | null;
  sort_order: number;
};

export const listGalleryByDestinationSlug = createServerFn({ method: "GET" })
  .inputValidator((i: unknown) =>
    z.object({ slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/) }).parse(i),
  )
  .handler(async ({ data }): Promise<PublicGalleryImage[]> => {
    const { data: rows, error } = await supabaseAdmin
      .from("destination_gallery_images")
      .select("id, image_url, alt_ru, alt_ro, author, license, source_url, sort_order")
      .eq("destination_slug", data.slug)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return (rows as PublicGalleryImage[] | null) ?? [];
  });

const slugInput = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
});

export type PublicShrine = {
  id: string;
  image_url: string | null;
  title_ru: string;
  title_ro: string;
  short_ru: string | null;
  short_ro: string | null;
  full_ru: string | null;
  full_ro: string | null;
  sort_order: number;
};

export const listShrinesByDestinationSlug = createServerFn({ method: "GET" })
  .inputValidator((i: unknown) => slugInput.parse(i))
  .handler(async ({ data }): Promise<PublicShrine[]> => {
    const { data: rows, error } = await supabaseAdmin
      .from("destination_shrines")
      .select("id, image_url, title_ru, title_ro, short_ru, short_ro, full_ru, full_ro, sort_order")
      .eq("destination_slug", data.slug)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return (rows as PublicShrine[] | null) ?? [];
  });

export type PublicProgramDay = {
  id: string;
  day_label_ru: string | null;
  day_label_ro: string | null;
  title_ru: string;
  title_ro: string;
  description_ru: string | null;
  description_ro: string | null;
  sort_order: number;
};

export const listProgramByDestinationSlug = createServerFn({ method: "GET" })
  .inputValidator((i: unknown) => slugInput.parse(i))
  .handler(async ({ data }): Promise<PublicProgramDay[]> => {
    const { data: rows, error } = await supabaseAdmin
      .from("destination_program_days")
      .select("id, day_label_ru, day_label_ro, title_ru, title_ro, description_ru, description_ro, sort_order")
      .eq("destination_slug", data.slug)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return (rows as PublicProgramDay[] | null) ?? [];
  });

export type PublicInclusion = {
  id: string;
  kind: "included" | "excluded";
  text_ru: string;
  text_ro: string;
  sort_order: number;
};

export const listInclusionsByDestinationSlug = createServerFn({ method: "GET" })
  .inputValidator((i: unknown) => slugInput.parse(i))
  .handler(async ({ data }): Promise<PublicInclusion[]> => {
    const { data: rows, error } = await supabaseAdmin
      .from("destination_inclusions")
      .select("id, kind, text_ru, text_ro, sort_order")
      .eq("destination_slug", data.slug)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return (rows as PublicInclusion[] | null) ?? [];
  });

export type PublicFaq = {
  id: string;
  question_ru: string;
  question_ro: string;
  answer_ru: string | null;
  answer_ro: string | null;
  sort_order: number;
};

export const listFaqByDestinationSlug = createServerFn({ method: "GET" })
  .inputValidator((i: unknown) => slugInput.parse(i))
  .handler(async ({ data }): Promise<PublicFaq[]> => {
    const { data: rows, error } = await supabaseAdmin
      .from("destination_faq")
      .select("id, question_ru, question_ro, answer_ru, answer_ro, sort_order")
      .eq("destination_slug", data.slug)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return (rows as PublicFaq[] | null) ?? [];
  });