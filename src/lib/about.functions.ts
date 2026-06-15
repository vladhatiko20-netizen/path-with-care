import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type AboutPage = {
  id: string;
  hero_photo_url: string | null;
  hero_title_ru: string | null;
  hero_title_ro: string | null;
  hero_subtitle_ru: string | null;
  hero_subtitle_ro: string | null;
  intro_text_ru: string | null;
  intro_text_ro: string | null;
  video_url: string | null;
};

export type AboutGalleryItem = {
  id: string;
  image_url: string;
  caption_ru: string | null;
  caption_ro: string | null;
  sort_order: number;
};

export type AboutTeamItem = {
  id: string;
  name_ru: string;
  name_ro: string;
  role_ru: string | null;
  role_ro: string | null;
  photo_url: string | null;
  sort_order: number;
};

// ===== Public =====

export const getAboutPageData = createServerFn({ method: "GET" }).handler(
  async (): Promise<{
    page: AboutPage | null;
    gallery: AboutGalleryItem[];
    team: AboutTeamItem[];
  }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [pageRes, galleryRes, teamRes] = await Promise.all([
      supabaseAdmin
        .from("about_page")
        .select("id,hero_photo_url,hero_title_ru,hero_title_ro,hero_subtitle_ru,hero_subtitle_ro,intro_text_ru,intro_text_ro,video_url")
        .maybeSingle(),
      supabaseAdmin
        .from("about_gallery")
        .select("id,image_url,caption_ru,caption_ro,sort_order")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabaseAdmin
        .from("about_team")
        .select("id,name_ru,name_ro,role_ru,role_ro,photo_url,sort_order,created_at,is_published")
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
    ]);
    if (pageRes.error) throw pageRes.error;
    if (galleryRes.error) throw galleryRes.error;
    if (teamRes.error) throw teamRes.error;
    return {
      page: (pageRes.data as AboutPage | null) ?? null,
      gallery: (galleryRes.data ?? []) as AboutGalleryItem[],
      team: ((teamRes.data ?? []) as AboutTeamItem[]).map((r) => ({
        id: r.id,
        name_ru: r.name_ru,
        name_ro: r.name_ro,
        role_ru: r.role_ru,
        role_ro: r.role_ro,
        photo_url: r.photo_url,
        sort_order: r.sort_order,
      })),
    };
  },
);

// ===== Admin: about_page =====

const aboutPageSchema = z.object({
  hero_photo_url: z.string().max(1000).nullable().optional(),
  hero_title_ru: z.string().max(500).nullable().optional(),
  hero_title_ro: z.string().max(500).nullable().optional(),
  hero_subtitle_ru: z.string().max(2000).nullable().optional(),
  hero_subtitle_ro: z.string().max(2000).nullable().optional(),
  intro_text_ru: z.string().max(20000).nullable().optional(),
  intro_text_ro: z.string().max(20000).nullable().optional(),
  video_url: z.string().max(1000).nullable().optional(),
});

export const adminGetAboutPage = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("about_page")
      .select("*")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

export const adminUpsertAboutPage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => aboutPageSchema.parse(i))
  .handler(async ({ data, context }) => {
    const { data: existing, error: selErr } = await context.supabase
      .from("about_page")
      .select("id")
      .maybeSingle();
    if (selErr) throw new Error(selErr.message);
    if (existing?.id) {
      const { data: row, error } = await context.supabase
        .from("about_page")
        .update(data)
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return row;
    }
    const { data: row, error } = await context.supabase
      .from("about_page")
      .insert(data)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

// ===== Admin: about_gallery =====

const gallerySchema = z.object({
  id: z.string().uuid().optional(),
  image_url: z.string().min(1).max(1000),
  caption_ru: z.string().max(500).nullable().optional(),
  caption_ro: z.string().max(500).nullable().optional(),
  sort_order: z.number().int().min(0).max(100000).optional(),
});

export const adminListAboutGallery = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("about_gallery")
      .select("id,image_url,caption_ru,caption_ro,sort_order")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminSaveAboutGalleryItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => gallerySchema.parse(i))
  .handler(async ({ data, context }) => {
    const { id, ...payload } = data;
    if (id) {
      const { data: row, error } = await context.supabase
        .from("about_gallery").update(payload).eq("id", id).select().single();
      if (error) throw new Error(error.message);
      return row;
    }
    // new row: append at the end
    const { data: maxRow } = await context.supabase
      .from("about_gallery").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
    const nextOrder = (maxRow?.sort_order ?? 0) + 1;
    const { data: row, error } = await context.supabase
      .from("about_gallery")
      .insert({ ...payload, sort_order: payload.sort_order ?? nextOrder })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminDeleteAboutGalleryItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("about_gallery").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminReorderAboutGallery = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({
      items: z.array(z.object({ id: z.string().uuid(), sort_order: z.number().int().min(0).max(100000) })),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    for (const it of data.items) {
      const { error } = await context.supabase
        .from("about_gallery").update({ sort_order: it.sort_order }).eq("id", it.id);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

// ===== Admin: about_team =====

const teamSchema = z.object({
  id: z.string().uuid().optional(),
  name_ru: z.string().min(1).max(255),
  name_ro: z.string().min(1).max(255),
  role_ru: z.string().max(500).nullable().optional(),
  role_ro: z.string().max(500).nullable().optional(),
  photo_url: z.string().max(1000).nullable().optional(),
  sort_order: z.number().int().min(0).max(100000),
  is_published: z.boolean(),
});

export const adminListAboutTeam = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("about_team")
      .select("id,name_ru,name_ro,role_ru,role_ro,photo_url,sort_order,is_published")
      .order("sort_order", { ascending: true })
      .order("name_ru", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminSaveAboutTeam = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => teamSchema.parse(i))
  .handler(async ({ data, context }) => {
    const { id, ...payload } = data;
    if (id) {
      const { data: row, error } = await context.supabase
        .from("about_team").update(payload).eq("id", id).select().single();
      if (error) throw new Error(error.message);
      return row;
    }
    const { data: row, error } = await context.supabase
      .from("about_team").insert(payload).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminDeleteAboutTeam = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("about_team").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });