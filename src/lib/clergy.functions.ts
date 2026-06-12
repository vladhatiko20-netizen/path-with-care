import { createServerFn } from "@tanstack/react-start";

export type PublicClergy = {
  id: string;
  name_ru: string;
  name_ro: string;
  title_ru: string | null;
  title_ro: string | null;
  bio_ru: string | null;
  bio_ro: string | null;
  photo_url: string | null;
  sort_order: number;
};

export const listPublishedClergy = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicClergy[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("clergy")
      .select("id,name_ru,name_ro,title_ru,title_ro,bio_ru,bio_ro,photo_url,sort_order,created_at")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((r) => ({
      id: r.id,
      name_ru: r.name_ru,
      name_ro: r.name_ro,
      title_ru: r.title_ru,
      title_ro: r.title_ro,
      bio_ru: r.bio_ru,
      bio_ro: r.bio_ro,
      photo_url: r.photo_url,
      sort_order: r.sort_order,
    }));
  },
);