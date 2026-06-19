import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type PilgrimageSummary = {
  id: string;
  slug: string;
  start_date: string;
  end_date: string;
  destination_ru: string;
  destination_ro: string;
  destination_slug: string | null;
  title_ru: string;
  title_ro: string;
  description_ru: string | null;
  description_ro: string | null;
  cover_image: string | null;
  price_eur: number | null;
  with_priest: boolean;
};

export const listPilgrimages = createServerFn({ method: "GET" }).handler(
  async (): Promise<PilgrimageSummary[]> => {
    const { data: publishedDests, error: destErr } = await supabaseAdmin
      .from("destinations")
      .select("slug")
      .eq("is_published", true);
    if (destErr) throw new Error(destErr.message);
    const publishedSlugs = (publishedDests ?? []).map((d) => d.slug);
    if (publishedSlugs.length === 0) return [];
    const { data, error } = await supabaseAdmin
      .from("pilgrimages")
      .select("id, slug, start_date, end_date, destination_ru, destination_ro, destination_slug, title_ru, title_ro, description_ru, description_ro, cover_image, price_eur, with_priest")
      .eq("is_published", true)
      .in("destination_slug", publishedSlugs)
      .order("start_date", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as PilgrimageSummary[];
  },
);
