import { createServerFn } from "@tanstack/react-start";

export type CatalogCategory = {
  key: string;
  label_ru: string;
  label_ro: string;
  sort: number;
};

export type CatalogPage = {
  hero_image_url: string | null;
  hero_overline_ru: string | null;
  hero_overline_ro: string | null;
  hero_title_ru: string | null;
  hero_title_ro: string | null;
  intro_ru: string | null;
  intro_ro: string | null;
  empty_state_ru: string | null;
  empty_state_ro: string | null;
  form_title_ru: string | null;
  form_title_ro: string | null;
  form_subtitle_ru: string | null;
  form_subtitle_ro: string | null;
  form_success_title_ru: string | null;
  form_success_title_ro: string | null;
  form_success_text_ru: string | null;
  form_success_text_ro: string | null;
  card_caption_ru: string | null;
  card_caption_ro: string | null;
  categories: CatalogCategory[];
};

export type CatalogItem = {
  id: string;
  slug: string;
  title_ru: string;
  title_ro: string;
  description_ru: string | null;
  description_ro: string | null;
  category: string;
  image_url: string | null;
  sort_order: number;
};

function sortCategories(arr: unknown): CatalogCategory[] {
  if (!Array.isArray(arr)) return [];
  const out: CatalogCategory[] = [];
  for (const it of arr) {
    if (!it || typeof it !== "object") continue;
    const o = it as Record<string, unknown>;
    const key = typeof o.key === "string" ? o.key : "";
    if (!key) continue;
    out.push({
      key,
      label_ru: typeof o.label_ru === "string" ? o.label_ru : key,
      label_ro: typeof o.label_ro === "string" ? o.label_ro : key,
      sort: typeof o.sort === "number" ? o.sort : 0,
    });
  }
  out.sort((a, b) => a.sort - b.sort);
  return out;
}

export const getCatalogPageData = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ page: CatalogPage | null; items: CatalogItem[] }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [pageRes, itemsRes] = await Promise.all([
      supabaseAdmin
        .from("catalog_page")
        .select(
          "hero_image_url,hero_overline_ru,hero_overline_ro,hero_title_ru,hero_title_ro,intro_ru,intro_ro,empty_state_ru,empty_state_ro,form_title_ru,form_title_ro,form_subtitle_ru,form_subtitle_ro,form_success_title_ru,form_success_title_ro,form_success_text_ru,form_success_text_ro,card_caption_ru,card_caption_ro,categories",
        )
        .eq("id", "singleton")
        .maybeSingle(),
      supabaseAdmin
        .from("catalog_items")
        .select("id,slug,title_ru,title_ro,description_ru,description_ro,category,image_url,sort_order")
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
    ]);
    if (pageRes.error) throw new Error(pageRes.error.message);
    if (itemsRes.error) throw new Error(itemsRes.error.message);
    const raw = pageRes.data as Record<string, unknown> | null;
    const page: CatalogPage | null = raw
      ? {
          hero_image_url: (raw.hero_image_url as string | null) ?? null,
          hero_overline_ru: (raw.hero_overline_ru as string | null) ?? null,
          hero_overline_ro: (raw.hero_overline_ro as string | null) ?? null,
          hero_title_ru: (raw.hero_title_ru as string | null) ?? null,
          hero_title_ro: (raw.hero_title_ro as string | null) ?? null,
          intro_ru: (raw.intro_ru as string | null) ?? null,
          intro_ro: (raw.intro_ro as string | null) ?? null,
          empty_state_ru: (raw.empty_state_ru as string | null) ?? null,
          empty_state_ro: (raw.empty_state_ro as string | null) ?? null,
          form_title_ru: (raw.form_title_ru as string | null) ?? null,
          form_title_ro: (raw.form_title_ro as string | null) ?? null,
          form_subtitle_ru: (raw.form_subtitle_ru as string | null) ?? null,
          form_subtitle_ro: (raw.form_subtitle_ro as string | null) ?? null,
          form_success_title_ru: (raw.form_success_title_ru as string | null) ?? null,
          form_success_title_ro: (raw.form_success_title_ro as string | null) ?? null,
          form_success_text_ru: (raw.form_success_text_ru as string | null) ?? null,
          form_success_text_ro: (raw.form_success_text_ro as string | null) ?? null,
          card_caption_ru: (raw.card_caption_ru as string | null) ?? null,
          card_caption_ro: (raw.card_caption_ro as string | null) ?? null,
          categories: sortCategories(raw.categories),
        }
      : null;
    return {
      page,
      items: (itemsRes.data ?? []) as CatalogItem[],
    };
  },
);