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
};

export const getDestinationBySlug = createServerFn({ method: "GET" })
  .inputValidator((i: unknown) =>
    z.object({ slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/) }).parse(i),
  )
  .handler(async ({ data }): Promise<PublicDestination | null> => {
    const { data: row, error } = await supabaseAdmin
      .from("destinations")
      .select("slug, title_ru, title_ro, description_ru, description_ro, duration_ru, duration_ro, group_size_ru, group_size_ro, price_from, program_ru, program_ro, cover_image")
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (row as PublicDestination | null) ?? null;
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