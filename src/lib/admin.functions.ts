import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const blogSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  published_at: z.string().min(1),
  cover_image: z.string().max(500).nullable().optional(),
  title_ru: z.string().min(1).max(500),
  title_ro: z.string().min(1).max(500),
  excerpt_ru: z.string().max(1000).nullable().optional(),
  excerpt_ro: z.string().max(1000).nullable().optional(),
  body_ru: z.string().max(200000).nullable().optional(),
  body_ro: z.string().max(200000).nullable().optional(),
  is_published: z.boolean(),
});

const pilgSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  start_date: z.string().min(1),
  end_date: z.string().min(1),
  destination_ru: z.string().min(1).max(500),
  destination_ro: z.string().min(1).max(500),
  title_ru: z.string().min(1).max(500),
  title_ro: z.string().min(1).max(500),
  description_ru: z.string().max(5000).nullable().optional(),
  description_ro: z.string().max(5000).nullable().optional(),
  cover_image: z.string().max(500).nullable().optional(),
  price_eur: z.number().min(0).max(1000000).nullable().optional(),
  with_priest: z.boolean(),
  is_published: z.boolean(),
});

const destSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  title_ru: z.string().min(1).max(500),
  title_ro: z.string().min(1).max(500),
  description_ru: z.string().max(5000).nullable().optional(),
  description_ro: z.string().max(5000).nullable().optional(),
  cover_image: z.string().max(500).nullable().optional(),
  duration_ru: z.string().max(255).nullable().optional(),
  duration_ro: z.string().max(255).nullable().optional(),
  price_from: z.number().min(0).max(1000000).nullable().optional(),
  group_size_ru: z.string().max(255).nullable().optional(),
  group_size_ro: z.string().max(255).nullable().optional(),
  program_ru: z.string().max(50000).nullable().optional(),
  program_ro: z.string().max(50000).nullable().optional(),
  hero_quote_ru: z.string().max(2000).nullable().optional(),
  hero_quote_ro: z.string().max(2000).nullable().optional(),
  hero_quote_author_ru: z.string().max(255).nullable().optional(),
  hero_quote_author_ro: z.string().max(255).nullable().optional(),
  intro_ru: z.string().max(10000).nullable().optional(),
  intro_ro: z.string().max(10000).nullable().optional(),
  notice_ru: z.string().max(5000).nullable().optional(),
  notice_ro: z.string().max(5000).nullable().optional(),
  seo_title_ru: z.string().max(255).nullable().optional(),
  seo_title_ro: z.string().max(255).nullable().optional(),
  seo_description_ru: z.string().max(500).nullable().optional(),
  seo_description_ro: z.string().max(500).nullable().optional(),
  og_image: z.string().max(500).nullable().optional(),
  accompaniment_ru: z.string().max(255).nullable().optional(),
  accompaniment_ro: z.string().max(255).nullable().optional(),
  short_title_ru: z.string().max(120).nullable().optional(),
  short_title_ro: z.string().max(120).nullable().optional(),
  card_text_ru: z.string().max(120).nullable().optional(),
  card_text_ro: z.string().max(120).nullable().optional(),
  sort_order: z.number().int().min(0).max(100000).optional(),
  is_published: z.boolean(),
});

export const adminListBlogPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("blog_posts")
      .select("id, slug, title_ru, title_ro, published_at, is_published")
      .order("published_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminGetBlogPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("blog_posts")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminSaveBlogPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => blogSchema.parse(i))
  .handler(async ({ data, context }) => {
    const { id, ...payload } = data;
    if (id) {
      const { data: row, error } = await context.supabase
        .from("blog_posts").update(payload).eq("id", id).select().single();
      if (error) throw new Error(error.message);
      return row;
    }
    const { data: row, error } = await context.supabase
      .from("blog_posts").insert(payload).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminDeleteBlogPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("blog_posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListPilgrimages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("pilgrimages")
      .select("id, slug, title_ru, title_ro, destination_ru, destination_ro, start_date, end_date, price_eur, with_priest, is_published")
      .order("start_date", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminGetPilgrimage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("pilgrimages").select("*").eq("id", data.id).maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminSavePilgrimage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => pilgSchema.parse(i))
  .handler(async ({ data, context }) => {
    const { id, ...payload } = data;
    if (id) {
      const { data: row, error } = await context.supabase
        .from("pilgrimages").update(payload).eq("id", id).select().single();
      if (error) throw new Error(error.message);
      return row;
    }
    const { data: row, error } = await context.supabase
      .from("pilgrimages").insert(payload).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminDeletePilgrimage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("pilgrimages").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListDestinations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("destinations")
      .select("id, slug, title_ru, title_ro, price_from, is_published")
      .order("title_ru", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminGetDestination = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("destinations").select("*").eq("id", data.id).maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminSaveDestination = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => destSchema.parse(i))
  .handler(async ({ data, context }) => {
    const { id, ...payload } = data;
    if (id) {
      const { data: row, error } = await context.supabase
        .from("destinations").update(payload).eq("id", id).select().single();
      if (error) throw new Error(error.message);
      return row;
    }
    const { data: row, error } = await context.supabase
      .from("destinations").insert(payload).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminDeleteDestination = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("destinations").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ===== Destination gallery =====

const gallerySchema = z.object({
  id: z.string().uuid().optional(),
  destination_slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  image_url: z.string().min(1).max(1000),
  alt_ru: z.string().max(500).nullable().optional(),
  alt_ro: z.string().max(500).nullable().optional(),
  author: z.string().max(200).nullable().optional(),
  license: z.string().max(200).nullable().optional(),
  source_url: z.string().max(1000).nullable().optional(),
  sort_order: z.number().int().min(0).max(10000).optional(),
});

export const adminListGallery = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({ destination_slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/) }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("destination_gallery_images")
      .select("*")
      .eq("destination_slug", data.destination_slug)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const adminSaveGalleryImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => gallerySchema.parse(i))
  .handler(async ({ data, context }) => {
    const { id, ...payload } = data;
    if (id) {
      const { data: row, error } = await context.supabase
        .from("destination_gallery_images").update(payload).eq("id", id).select().single();
      if (error) throw new Error(error.message);
      return row;
    }
    // For new rows, set sort_order to max + 1 if not provided
    let sort_order = payload.sort_order;
    if (sort_order === undefined) {
      const { data: maxRow } = await context.supabase
        .from("destination_gallery_images")
        .select("sort_order")
        .eq("destination_slug", payload.destination_slug)
        .order("sort_order", { ascending: false })
        .limit(1)
        .maybeSingle();
      sort_order = ((maxRow?.sort_order as number | undefined) ?? 0) + 1;
    }
    const { data: row, error } = await context.supabase
      .from("destination_gallery_images").insert({ ...payload, sort_order }).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminDeleteGalleryImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("destination_gallery_images").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminReorderGallery = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({
      items: z.array(z.object({
        id: z.string().uuid(),
        sort_order: z.number().int().min(0).max(10000),
      })).min(1).max(200),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    for (const it of data.items) {
      const { error } = await context.supabase
        .from("destination_gallery_images")
        .update({ sort_order: it.sort_order })
        .eq("id", it.id);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

// ===== Leads =====

const leadsListInput = z.object({
  search: z.string().trim().max(200).optional().default(""),
  status: z.enum(["all", "new", "read"]).optional().default("all"),
  source: z.string().trim().max(50).regex(/^[a-z0-9_\-]+$/).optional(),
  period: z.enum(["all", "week", "month"]).optional().default("all"),
});

export const adminListLeads = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => leadsListInput.parse(i ?? {}))
  .handler(async ({ data, context }) => {
    let q = context.supabase
      .from("leads")
      .select("id, name, phone, email, message, source, is_read, read_at, created_at")
      .order("created_at", { ascending: false })
      .limit(500);

    if (data.status === "new") q = q.eq("is_read", false);
    if (data.status === "read") q = q.eq("is_read", true);
    if (data.source) q = q.eq("source", data.source);
    if (data.period !== "all") {
      const days = data.period === "week" ? 7 : 30;
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      q = q.gte("created_at", since);
    }
    if (data.search) {
      const s = data.search.replace(/[%,]/g, " ").trim();
      if (s) {
        const like = `%${s}%`;
        q = q.or(
          `name.ilike.${like},phone.ilike.${like},email.ilike.${like},message.ilike.${like}`
        );
      }
    }

    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const adminGetLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("leads").select("*").eq("id", data.id).maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminMarkLeadRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({
    id: z.string().uuid(),
    is_read: z.boolean(),
  }).parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("leads")
      .update({ is_read: data.is_read, read_at: data.is_read ? new Date().toISOString() : null })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminMarkAllLeadsRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { error } = await context.supabase
      .from("leads")
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq("is_read", false);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("leads").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminCountUnreadLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { count, error } = await context.supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false);
    if (error) throw new Error(error.message);
    return { count: count ?? 0 };
  });

// ============================================================
// Destination child tables: shrines, program days, inclusions, faq
// ============================================================

const slugField = z.string().min(1).max(100).regex(/^[a-z0-9-]+$/);
const slugInput = z.object({ destination_slug: slugField });
const idInput = z.object({ id: z.string().uuid() });
const reorderInput = z.object({
  items: z.array(z.object({
    id: z.string().uuid(),
    sort_order: z.number().int().min(0).max(10000),
  })).min(1).max(500),
});

async function nextSortOrder(
  supabase: any,
  table: string,
  destination_slug: string,
): Promise<number> {
  const { data: maxRow } = await supabase
    .from(table)
    .select("sort_order")
    .eq("destination_slug", destination_slug)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  return ((maxRow?.sort_order as number | undefined) ?? 0) + 1;
}

// ----- Shrines -----

const shrineSchema = z.object({
  id: z.string().uuid().optional(),
  destination_slug: slugField,
  image_url: z.string().max(1000).nullable().optional(),
  title_ru: z.string().min(1).max(500),
  title_ro: z.string().min(1).max(500),
  short_ru: z.string().max(2000).nullable().optional(),
  short_ro: z.string().max(2000).nullable().optional(),
  full_ru: z.string().max(20000).nullable().optional(),
  full_ro: z.string().max(20000).nullable().optional(),
  sort_order: z.number().int().min(0).max(10000).optional(),
});

export const adminListShrines = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => slugInput.parse(i))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("destination_shrines").select("*")
      .eq("destination_slug", data.destination_slug)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const adminSaveShrine = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => shrineSchema.parse(i))
  .handler(async ({ data, context }) => {
    const { id, ...payload } = data;
    if (id) {
      const { data: row, error } = await context.supabase
        .from("destination_shrines").update(payload).eq("id", id).select().single();
      if (error) throw new Error(error.message);
      return row;
    }
    const sort_order = payload.sort_order ??
      await nextSortOrder(context.supabase, "destination_shrines", payload.destination_slug);
    const { data: row, error } = await context.supabase
      .from("destination_shrines").insert({ ...payload, sort_order }).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminDeleteShrine = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => idInput.parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("destination_shrines").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminReorderShrines = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => reorderInput.parse(i))
  .handler(async ({ data, context }) => {
    for (const it of data.items) {
      const { error } = await context.supabase
        .from("destination_shrines").update({ sort_order: it.sort_order }).eq("id", it.id);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

// ----- Program days -----

const programDaySchema = z.object({
  id: z.string().uuid().optional(),
  destination_slug: slugField,
  day_label_ru: z.string().max(100).nullable().optional(),
  day_label_ro: z.string().max(100).nullable().optional(),
  title_ru: z.string().min(1).max(500),
  title_ro: z.string().min(1).max(500),
  description_ru: z.string().max(20000).nullable().optional(),
  description_ro: z.string().max(20000).nullable().optional(),
  sort_order: z.number().int().min(0).max(10000).optional(),
});

export const adminListProgramDays = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => slugInput.parse(i))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("destination_program_days").select("*")
      .eq("destination_slug", data.destination_slug)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const adminSaveProgramDay = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => programDaySchema.parse(i))
  .handler(async ({ data, context }) => {
    const { id, ...payload } = data;
    if (id) {
      const { data: row, error } = await context.supabase
        .from("destination_program_days").update(payload).eq("id", id).select().single();
      if (error) throw new Error(error.message);
      return row;
    }
    const sort_order = payload.sort_order ??
      await nextSortOrder(context.supabase, "destination_program_days", payload.destination_slug);
    const { data: row, error } = await context.supabase
      .from("destination_program_days").insert({ ...payload, sort_order }).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminDeleteProgramDay = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => idInput.parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("destination_program_days").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminReorderProgramDays = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => reorderInput.parse(i))
  .handler(async ({ data, context }) => {
    for (const it of data.items) {
      const { error } = await context.supabase
        .from("destination_program_days").update({ sort_order: it.sort_order }).eq("id", it.id);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

// ----- Inclusions / Exclusions -----

const inclusionSchema = z.object({
  id: z.string().uuid().optional(),
  destination_slug: slugField,
  kind: z.enum(["included", "excluded"]),
  text_ru: z.string().min(1).max(1000),
  text_ro: z.string().min(1).max(1000),
  sort_order: z.number().int().min(0).max(10000).optional(),
});

export const adminListInclusions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => slugInput.parse(i))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("destination_inclusions").select("*")
      .eq("destination_slug", data.destination_slug)
      .order("kind", { ascending: true })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const adminSaveInclusion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => inclusionSchema.parse(i))
  .handler(async ({ data, context }) => {
    const { id, ...payload } = data;
    if (id) {
      const { data: row, error } = await context.supabase
        .from("destination_inclusions").update(payload).eq("id", id).select().single();
      if (error) throw new Error(error.message);
      return row;
    }
    const sort_order = payload.sort_order ??
      await nextSortOrder(context.supabase, "destination_inclusions", payload.destination_slug);
    const { data: row, error } = await context.supabase
      .from("destination_inclusions").insert({ ...payload, sort_order }).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminDeleteInclusion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => idInput.parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("destination_inclusions").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminReorderInclusions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => reorderInput.parse(i))
  .handler(async ({ data, context }) => {
    for (const it of data.items) {
      const { error } = await context.supabase
        .from("destination_inclusions").update({ sort_order: it.sort_order }).eq("id", it.id);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

// ----- FAQ -----

const faqSchema = z.object({
  id: z.string().uuid().optional(),
  destination_slug: slugField,
  question_ru: z.string().min(1).max(1000),
  question_ro: z.string().min(1).max(1000),
  answer_ru: z.string().max(10000).nullable().optional(),
  answer_ro: z.string().max(10000).nullable().optional(),
  sort_order: z.number().int().min(0).max(10000).optional(),
});

export const adminListFaq = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => slugInput.parse(i))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("destination_faq").select("*")
      .eq("destination_slug", data.destination_slug)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const adminSaveFaq = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => faqSchema.parse(i))
  .handler(async ({ data, context }) => {
    const { id, ...payload } = data;
    if (id) {
      const { data: row, error } = await context.supabase
        .from("destination_faq").update(payload).eq("id", id).select().single();
      if (error) throw new Error(error.message);
      return row;
    }
    const sort_order = payload.sort_order ??
      await nextSortOrder(context.supabase, "destination_faq", payload.destination_slug);
    const { data: row, error } = await context.supabase
      .from("destination_faq").insert({ ...payload, sort_order }).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminDeleteFaq = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => idInput.parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("destination_faq").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminReorderFaq = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => reorderInput.parse(i))
  .handler(async ({ data, context }) => {
    for (const it of data.items) {
      const { error } = await context.supabase
        .from("destination_faq").update({ sort_order: it.sort_order }).eq("id", it.id);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

// ============================================================
// Bulk import destination from JSON.
// Mirrors the manual DestinationForm: same tables, same fields, same limits.
// is_published is always forced to false on import.
// Image fields (cover_image, og_image, shrine image_url, gallery) stay null/empty.
// On any failure after the first insert, ALL rows created during this import
// are deleted across all 5 child tables + destinations (rollback).
// ============================================================

const importDestSchema = z.object({
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/, { message: "slug: only lowercase letters, digits and '-' allowed" }),
  title_ru: z.string().min(1).max(500),
  title_ro: z.string().min(1).max(500),
  short_title_ru: z.string().max(120).nullable().optional(),
  short_title_ro: z.string().max(120).nullable().optional(),
  card_text_ru: z.string().max(120).nullable().optional(),
  card_text_ro: z.string().max(120).nullable().optional(),
  sort_order: z.number().int().min(0).max(100000).optional(),
  description_ru: z.string().max(5000).nullable().optional(),
  description_ro: z.string().max(5000).nullable().optional(),
  duration_ru: z.string().max(255).nullable().optional(),
  duration_ro: z.string().max(255).nullable().optional(),
  price_from: z.number().min(0).max(1000000).nullable().optional(),
  group_size_ru: z.string().max(255).nullable().optional(),
  group_size_ro: z.string().max(255).nullable().optional(),
  accompaniment_ru: z.string().max(255).nullable().optional(),
  accompaniment_ro: z.string().max(255).nullable().optional(),
  hero_quote_ru: z.string().max(2000).nullable().optional(),
  hero_quote_ro: z.string().max(2000).nullable().optional(),
  hero_quote_author_ru: z.string().max(255).nullable().optional(),
  hero_quote_author_ro: z.string().max(255).nullable().optional(),
  intro_ru: z.string().max(10000).nullable().optional(),
  intro_ro: z.string().max(10000).nullable().optional(),
  notice_ru: z.string().max(5000).nullable().optional(),
  notice_ro: z.string().max(5000).nullable().optional(),
  seo_title_ru: z.string().max(255).nullable().optional(),
  seo_title_ro: z.string().max(255).nullable().optional(),
  seo_description_ru: z.string().max(500).nullable().optional(),
  seo_description_ro: z.string().max(500).nullable().optional(),
  // Legacy fields present on the live table and in the form's Initial type,
  // kept here so an imported direction is structurally identical to a manual one.
  program_ru: z.string().max(50000).nullable().optional(),
  program_ro: z.string().max(50000).nullable().optional(),
});

const importShrineSchema = z.object({
  title_ru: z.string().min(1).max(500),
  title_ro: z.string().min(1).max(500),
  short_ru: z.string().max(2000).nullable().optional(),
  short_ro: z.string().max(2000).nullable().optional(),
  full_ru: z.string().max(20000).nullable().optional(),
  full_ro: z.string().max(20000).nullable().optional(),
});

const importProgramDaySchema = z.object({
  day_label_ru: z.string().max(100).nullable().optional(),
  day_label_ro: z.string().max(100).nullable().optional(),
  title_ru: z.string().min(1).max(500),
  title_ro: z.string().min(1).max(500),
  description_ru: z.string().max(20000).nullable().optional(),
  description_ro: z.string().max(20000).nullable().optional(),
});

const importInclusionItemSchema = z.object({
  text_ru: z.string().min(1).max(1000),
  text_ro: z.string().min(1).max(1000),
});

const importFaqSchema = z.object({
  question_ru: z.string().min(1).max(1000),
  question_ro: z.string().min(1).max(1000),
  answer_ru: z.string().max(10000).nullable().optional(),
  answer_ro: z.string().max(10000).nullable().optional(),
});

const importPayloadSchema = z.object({
  destination: importDestSchema,
  shrines: z.array(importShrineSchema).max(100).optional().default([]),
  program_days: z.array(importProgramDaySchema).max(60).optional().default([]),
  inclusions: z.object({
    included: z.array(importInclusionItemSchema).max(100).optional().default([]),
    not_included: z.array(importInclusionItemSchema).max(100).optional().default([]),
  }).optional().default({ included: [], not_included: [] }),
  faq: z.array(importFaqSchema).max(100).optional().default([]),
});

function formatZodError(err: z.ZodError): string {
  return err.issues
    .map((i) => `Поле "${i.path.join(".") || "(корень)"}": ${i.message}`)
    .join("; ");
}

export const adminImportDestination = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => {
    const parsed = importPayloadSchema.safeParse(i);
    if (!parsed.success) {
      throw new Error(`Ошибка валидации JSON: ${formatZodError(parsed.error)}`);
    }
    return parsed.data;
  })
  .handler(async ({ data, context }) => {
    const slug = data.destination.slug;

    const { data: existing, error: existingErr } = await context.supabase
      .from("destinations").select("id").eq("slug", slug).maybeSingle();
    if (existingErr) throw new Error(`Проверка slug: ${existingErr.message}`);
    if (existing) throw new Error(`Направление со slug "${slug}" уже существует. Удалите его или используйте другой slug.`);

    const destPayload = { ...data.destination, is_published: false };
    const { data: destRow, error: destErr } = await context.supabase
      .from("destinations").insert(destPayload).select("id, slug").single();
    if (destErr) throw new Error(`Ошибка создания направления: ${destErr.message}`);
    if (!destRow) throw new Error("Ошибка создания направления: пустой ответ от базы.");
    const destId = destRow.id;

    async function rollback(reason: string): Promise<never> {
      try {
        await context.supabase.from("destination_shrines").delete().eq("destination_slug", slug);
        await context.supabase.from("destination_program_days").delete().eq("destination_slug", slug);
        await context.supabase.from("destination_inclusions").delete().eq("destination_slug", slug);
        await context.supabase.from("destination_faq").delete().eq("destination_slug", slug);
        await context.supabase.from("destination_gallery_images").delete().eq("destination_slug", slug);
        await context.supabase.from("destinations").delete().eq("id", destId);
      } catch (e) {
        throw new Error(`${reason}. Откат также завершился ошибкой: ${e instanceof Error ? e.message : String(e)}`);
      }
      throw new Error(`${reason}. Все созданные записи удалены (откат выполнен).`);
    }

    if (data.shrines.length > 0) {
      const rows = data.shrines.map((s, idx) => ({
        destination_slug: slug,
        title_ru: s.title_ru,
        title_ro: s.title_ro,
        short_ru: s.short_ru ?? null,
        short_ro: s.short_ro ?? null,
        full_ru: s.full_ru ?? null,
        full_ro: s.full_ro ?? null,
        image_url: null,
        sort_order: idx + 1,
      }));
      const { error } = await context.supabase.from("destination_shrines").insert(rows);
      if (error) await rollback(`Ошибка при добавлении святынь: ${error.message}`);
    }

    if (data.program_days.length > 0) {
      const rows = data.program_days.map((p, idx) => ({
        destination_slug: slug,
        day_label_ru: p.day_label_ru ?? null,
        day_label_ro: p.day_label_ro ?? null,
        title_ru: p.title_ru,
        title_ro: p.title_ro,
        description_ru: p.description_ru ?? null,
        description_ro: p.description_ro ?? null,
        sort_order: idx + 1,
      }));
      const { error } = await context.supabase.from("destination_program_days").insert(rows);
      if (error) await rollback(`Ошибка при добавлении программы по дням: ${error.message}`);
    }

    const incRows: Array<{
      destination_slug: string; kind: "included" | "excluded";
      text_ru: string; text_ro: string; sort_order: number;
    }> = [];
    data.inclusions.included.forEach((it, idx) => {
      incRows.push({ destination_slug: slug, kind: "included", text_ru: it.text_ru, text_ro: it.text_ro, sort_order: idx + 1 });
    });
    data.inclusions.not_included.forEach((it, idx) => {
      incRows.push({ destination_slug: slug, kind: "excluded", text_ru: it.text_ru, text_ro: it.text_ro, sort_order: idx + 1 });
    });
    if (incRows.length > 0) {
      const { error } = await context.supabase.from("destination_inclusions").insert(incRows);
      if (error) await rollback(`Ошибка при добавлении "включено / не включено": ${error.message}`);
    }

    if (data.faq.length > 0) {
      const rows = data.faq.map((f, idx) => ({
        destination_slug: slug,
        question_ru: f.question_ru,
        question_ro: f.question_ro,
        answer_ru: f.answer_ru ?? null,
        answer_ro: f.answer_ro ?? null,
        sort_order: idx + 1,
      }));
      const { error } = await context.supabase.from("destination_faq").insert(rows);
      if (error) await rollback(`Ошибка при добавлении FAQ: ${error.message}`);
    }

    return {
      ok: true,
      id: destId,
      slug,
      title_ru: data.destination.title_ru,
      counts: {
        shrines: data.shrines.length,
        program_days: data.program_days.length,
        included: data.inclusions.included.length,
        not_included: data.inclusions.not_included.length,
        faq: data.faq.length,
      },
    };
  });

// ============================================================
// Export destination to JSON, mirroring the import schema 1:1.
// All image fields in the main payload are null so re-import is a clean
// round-trip. Real storage URLs live under top-level `_images_manifest`
// (ignored by the import validator since z.object strips unknown keys).
// ============================================================

export const adminExportDestination = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { payload, title_ru, slug } = await buildDestinationExportPayload(context.supabase, data.id);
    return { ok: true as const, slug, title_ru, payload };
  });

async function buildDestinationExportPayload(supabase: any, id: string) {
  const { data: dest, error: destErr } = await supabase
    .from("destinations").select("*").eq("id", id).maybeSingle();
  if (destErr) throw new Error(`Чтение направления: ${destErr.message}`);
  if (!dest) throw new Error("Направление не найдено.");
  const slug = dest.slug as string;

  const [shrinesRes, daysRes, incRes, faqRes, galleryRes] = await Promise.all([
    supabase.from("destination_shrines").select("*")
      .eq("destination_slug", slug)
      .order("sort_order", { ascending: true }).order("created_at", { ascending: true }),
    supabase.from("destination_program_days").select("*")
      .eq("destination_slug", slug)
      .order("sort_order", { ascending: true }).order("created_at", { ascending: true }),
    supabase.from("destination_inclusions").select("*")
      .eq("destination_slug", slug)
      .order("sort_order", { ascending: true }).order("created_at", { ascending: true }),
    supabase.from("destination_faq").select("*")
      .eq("destination_slug", slug)
      .order("sort_order", { ascending: true }).order("created_at", { ascending: true }),
    supabase.from("destination_gallery_images").select("*")
      .eq("destination_slug", slug)
      .order("sort_order", { ascending: true }).order("created_at", { ascending: true }),
  ]);
  for (const r of [shrinesRes, daysRes, incRes, faqRes, galleryRes]) {
    if (r.error) throw new Error(`Чтение связанных таблиц: ${r.error.message}`);
  }
  const shrines = shrinesRes.data ?? [];
  const days = daysRes.data ?? [];
  const inclusions = incRes.data ?? [];
  const faq = faqRes.data ?? [];
  const gallery = galleryRes.data ?? [];

  const payload = {
    destination: {
      slug,
      title_ru: dest.title_ru,
      title_ro: dest.title_ro,
      short_title_ru: dest.short_title_ru ?? null,
      short_title_ro: dest.short_title_ro ?? null,
      card_text_ru: dest.card_text_ru ?? null,
      card_text_ro: dest.card_text_ro ?? null,
      sort_order: dest.sort_order ?? 0,
      description_ru: dest.description_ru ?? null,
      description_ro: dest.description_ro ?? null,
      duration_ru: dest.duration_ru ?? null,
      duration_ro: dest.duration_ro ?? null,
      price_from: dest.price_from ?? null,
      group_size_ru: dest.group_size_ru ?? null,
      group_size_ro: dest.group_size_ro ?? null,
      accompaniment_ru: dest.accompaniment_ru ?? null,
      accompaniment_ro: dest.accompaniment_ro ?? null,
      hero_quote_ru: dest.hero_quote_ru ?? null,
      hero_quote_ro: dest.hero_quote_ro ?? null,
      hero_quote_author_ru: dest.hero_quote_author_ru ?? null,
      hero_quote_author_ro: dest.hero_quote_author_ro ?? null,
      intro_ru: dest.intro_ru ?? null,
      intro_ro: dest.intro_ro ?? null,
      notice_ru: dest.notice_ru ?? null,
      notice_ro: dest.notice_ro ?? null,
      seo_title_ru: dest.seo_title_ru ?? null,
      seo_title_ro: dest.seo_title_ro ?? null,
      seo_description_ru: dest.seo_description_ru ?? null,
      seo_description_ro: dest.seo_description_ro ?? null,
      program_ru: dest.program_ru ?? null,
      program_ro: dest.program_ro ?? null,
    },
    shrines: shrines.map((s: any) => ({
      title_ru: s.title_ru,
      title_ro: s.title_ro,
      short_ru: s.short_ru ?? null,
      short_ro: s.short_ro ?? null,
      full_ru: s.full_ru ?? null,
      full_ro: s.full_ro ?? null,
    })),
    program_days: days.map((p: any) => ({
      day_label_ru: p.day_label_ru ?? null,
      day_label_ro: p.day_label_ro ?? null,
      title_ru: p.title_ru,
      title_ro: p.title_ro,
      description_ru: p.description_ru ?? null,
      description_ro: p.description_ro ?? null,
    })),
    inclusions: {
      included: inclusions
        .filter((it: any) => it.kind === "included")
        .map((it: any) => ({ text_ru: it.text_ru, text_ro: it.text_ro })),
      not_included: inclusions
        .filter((it: any) => it.kind === "excluded")
        .map((it: any) => ({ text_ru: it.text_ru, text_ro: it.text_ro })),
    },
    faq: faq.map((f: any) => ({
      question_ru: f.question_ru,
      question_ro: f.question_ro,
      answer_ru: f.answer_ru ?? null,
      answer_ro: f.answer_ro ?? null,
    })),
    _images_manifest: {
      note: "Справочный блок: реальные URL картинок из текущего хранилища. Игнорируется при импорте. Используется как резервная копия и для миграции на собственный Supabase.",
      cover_image: dest.cover_image ?? null,
      og_image: dest.og_image ?? null,
      shrines: shrines.map((s: any) => ({
        title_ru: s.title_ru,
        title_ro: s.title_ro,
        image_url: s.image_url ?? null,
      })),
      gallery: gallery.map((g: any) => ({
        image_url: g.image_url,
        alt_ru: g.alt_ru ?? null,
        alt_ro: g.alt_ro ?? null,
        author: g.author ?? null,
        license: g.license ?? null,
        source_url: g.source_url ?? null,
        sort_order: g.sort_order ?? 0,
      })),
    },
  };

  return { payload, title_ru: dest.title_ru as string, slug };
}

// ============================================================
// Bulk export: all destinations into one JSON array.
// ============================================================

export const adminExportAllDestinations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: rows, error } = await context.supabase
      .from("destinations").select("id").order("title_ru", { ascending: true });
    if (error) throw new Error(`Список направлений: ${error.message}`);
    const ids = (rows ?? []).map((r: any) => r.id as string);
    const destinations: any[] = [];
    for (const id of ids) {
      const { payload } = await buildDestinationExportPayload(context.supabase, id);
      destinations.push(payload);
    }
    return {
      ok: true as const,
      exported_at: new Date().toISOString(),
      count: destinations.length,
      destinations,
    };
  });

// ============================================================
// Bulk import: array of destinations with mode-based slug handling.
// ============================================================

type ImportItem = z.infer<typeof importPayloadSchema>;

async function insertSingleDestination(supabase: any, item: ImportItem) {
  const slug = item.destination.slug;
  const destPayload = { ...item.destination, is_published: false };
  const { data: destRow, error: destErr } = await supabase
    .from("destinations").insert(destPayload).select("id, slug").single();
  if (destErr) throw new Error(`Ошибка создания направления: ${destErr.message}`);
  if (!destRow) throw new Error("Ошибка создания направления: пустой ответ от базы.");
  const destId = destRow.id as string;

  async function rollback(reason: string): Promise<never> {
    try {
      await supabase.from("destination_shrines").delete().eq("destination_slug", slug);
      await supabase.from("destination_program_days").delete().eq("destination_slug", slug);
      await supabase.from("destination_inclusions").delete().eq("destination_slug", slug);
      await supabase.from("destination_faq").delete().eq("destination_slug", slug);
      await supabase.from("destination_gallery_images").delete().eq("destination_slug", slug);
      await supabase.from("destinations").delete().eq("id", destId);
    } catch (e) {
      throw new Error(`${reason}. Откат также завершился ошибкой: ${e instanceof Error ? e.message : String(e)}`);
    }
    throw new Error(`${reason}. Все созданные записи удалены (откат выполнен).`);
  }

  await writeChildTables(supabase, slug, item, rollback);
  return { id: destId, slug, title_ru: item.destination.title_ru };
}

async function writeChildTables(
  supabase: any,
  slug: string,
  item: ImportItem,
  onError: (reason: string) => Promise<never>,
) {
  if (item.shrines.length > 0) {
    const rows = item.shrines.map((s, idx) => ({
      destination_slug: slug,
      title_ru: s.title_ru,
      title_ro: s.title_ro,
      short_ru: s.short_ru ?? null,
      short_ro: s.short_ro ?? null,
      full_ru: s.full_ru ?? null,
      full_ro: s.full_ro ?? null,
      image_url: null,
      sort_order: idx + 1,
    }));
    const { error } = await supabase.from("destination_shrines").insert(rows);
    if (error) await onError(`Ошибка при добавлении святынь: ${error.message}`);
  }
  if (item.program_days.length > 0) {
    const rows = item.program_days.map((p, idx) => ({
      destination_slug: slug,
      day_label_ru: p.day_label_ru ?? null,
      day_label_ro: p.day_label_ro ?? null,
      title_ru: p.title_ru,
      title_ro: p.title_ro,
      description_ru: p.description_ru ?? null,
      description_ro: p.description_ro ?? null,
      sort_order: idx + 1,
    }));
    const { error } = await supabase.from("destination_program_days").insert(rows);
    if (error) await onError(`Ошибка при добавлении программы по дням: ${error.message}`);
  }
  const incRows: Array<{
    destination_slug: string; kind: "included" | "excluded";
    text_ru: string; text_ro: string; sort_order: number;
  }> = [];
  item.inclusions.included.forEach((it, idx) => {
    incRows.push({ destination_slug: slug, kind: "included", text_ru: it.text_ru, text_ro: it.text_ro, sort_order: idx + 1 });
  });
  item.inclusions.not_included.forEach((it, idx) => {
    incRows.push({ destination_slug: slug, kind: "excluded", text_ru: it.text_ru, text_ro: it.text_ro, sort_order: idx + 1 });
  });
  if (incRows.length > 0) {
    const { error } = await supabase.from("destination_inclusions").insert(incRows);
    if (error) await onError(`Ошибка при добавлении "включено / не включено": ${error.message}`);
  }
  if (item.faq.length > 0) {
    const rows = item.faq.map((f, idx) => ({
      destination_slug: slug,
      question_ru: f.question_ru,
      question_ro: f.question_ro,
      answer_ru: f.answer_ru ?? null,
      answer_ro: f.answer_ro ?? null,
      sort_order: idx + 1,
    }));
    const { error } = await supabase.from("destination_faq").insert(rows);
    if (error) await onError(`Ошибка при добавлении FAQ: ${error.message}`);
  }
}

async function upsertSingleDestination(
  supabase: any,
  item: ImportItem,
  existingId: string,
) {
  const slug = item.destination.slug;
  // Update destination fields EXCEPT cover_image, og_image, is_published —
  // these are preserved (images stay, publish flag stays).
  const { slug: _s, ...rest } = item.destination;
  const updatePayload = { ...rest };
  const { error: updErr } = await supabase
    .from("destinations").update(updatePayload).eq("id", existingId);
  if (updErr) throw new Error(`Ошибка обновления направления: ${updErr.message}`);

  // Snapshot children before destructive rewrite (for restore on failure
  // and for preserving shrine image_url by title_ru match).
  const [shrinesSnap, daysSnap, incSnap, faqSnap] = await Promise.all([
    supabase.from("destination_shrines").select("*").eq("destination_slug", slug),
    supabase.from("destination_program_days").select("*").eq("destination_slug", slug),
    supabase.from("destination_inclusions").select("*").eq("destination_slug", slug),
    supabase.from("destination_faq").select("*").eq("destination_slug", slug),
  ]);
  for (const r of [shrinesSnap, daysSnap, incSnap, faqSnap]) {
    if (r.error) throw new Error(`Снимок дочерних таблиц: ${r.error.message}`);
  }
  const oldShrines: any[] = shrinesSnap.data ?? [];
  const oldDays: any[] = daysSnap.data ?? [];
  const oldInc: any[] = incSnap.data ?? [];
  const oldFaq: any[] = faqSnap.data ?? [];

  // Map old shrine title_ru -> image_url to carry over photos.
  const shrineImageByTitle = new Map<string, string | null>();
  for (const s of oldShrines) {
    if (s.title_ru && s.image_url) shrineImageByTitle.set(s.title_ru, s.image_url);
  }

  // Delete children (gallery is NOT touched — uploaded photos preserved).
  const delResults = await Promise.all([
    supabase.from("destination_shrines").delete().eq("destination_slug", slug),
    supabase.from("destination_program_days").delete().eq("destination_slug", slug),
    supabase.from("destination_inclusions").delete().eq("destination_slug", slug),
    supabase.from("destination_faq").delete().eq("destination_slug", slug),
  ]);
  for (const r of delResults) {
    if (r.error) throw new Error(`Очистка дочерних таблиц: ${r.error.message}`);
  }

  async function restore(reason: string): Promise<never> {
    // Best-effort restore: re-insert snapshots (stripping ids/timestamps).
    const strip = (rows: any[]) => rows.map(({ id: _id, created_at: _c, updated_at: _u, ...rest }) => rest);
    try {
      await supabase.from("destination_shrines").delete().eq("destination_slug", slug);
      await supabase.from("destination_program_days").delete().eq("destination_slug", slug);
      await supabase.from("destination_inclusions").delete().eq("destination_slug", slug);
      await supabase.from("destination_faq").delete().eq("destination_slug", slug);
      if (oldShrines.length) await supabase.from("destination_shrines").insert(strip(oldShrines));
      if (oldDays.length) await supabase.from("destination_program_days").insert(strip(oldDays));
      if (oldInc.length) await supabase.from("destination_inclusions").insert(strip(oldInc));
      if (oldFaq.length) await supabase.from("destination_faq").insert(strip(oldFaq));
    } catch (e) {
      throw new Error(`${reason}. Восстановление дочерних таблиц также завершилось ошибкой: ${e instanceof Error ? e.message : String(e)}`);
    }
    throw new Error(`${reason}. Дочерние таблицы восстановлены из снимка.`);
  }

  // Insert new children. Patch shrine rows to carry over image_url by title_ru.
  if (item.shrines.length > 0) {
    const rows = item.shrines.map((s, idx) => ({
      destination_slug: slug,
      title_ru: s.title_ru,
      title_ro: s.title_ro,
      short_ru: s.short_ru ?? null,
      short_ro: s.short_ro ?? null,
      full_ru: s.full_ru ?? null,
      full_ro: s.full_ro ?? null,
      image_url: shrineImageByTitle.get(s.title_ru) ?? null,
      sort_order: idx + 1,
    }));
    const { error } = await supabase.from("destination_shrines").insert(rows);
    if (error) await restore(`Ошибка при добавлении святынь: ${error.message}`);
  }
  if (item.program_days.length > 0) {
    const rows = item.program_days.map((p, idx) => ({
      destination_slug: slug,
      day_label_ru: p.day_label_ru ?? null,
      day_label_ro: p.day_label_ro ?? null,
      title_ru: p.title_ru,
      title_ro: p.title_ro,
      description_ru: p.description_ru ?? null,
      description_ro: p.description_ro ?? null,
      sort_order: idx + 1,
    }));
    const { error } = await supabase.from("destination_program_days").insert(rows);
    if (error) await restore(`Ошибка при добавлении программы по дням: ${error.message}`);
  }
  const incRows: Array<{
    destination_slug: string; kind: "included" | "excluded";
    text_ru: string; text_ro: string; sort_order: number;
  }> = [];
  item.inclusions.included.forEach((it, idx) => {
    incRows.push({ destination_slug: slug, kind: "included", text_ru: it.text_ru, text_ro: it.text_ro, sort_order: idx + 1 });
  });
  item.inclusions.not_included.forEach((it, idx) => {
    incRows.push({ destination_slug: slug, kind: "excluded", text_ru: it.text_ru, text_ro: it.text_ro, sort_order: idx + 1 });
  });
  if (incRows.length > 0) {
    const { error } = await supabase.from("destination_inclusions").insert(incRows);
    if (error) await restore(`Ошибка при добавлении "включено / не включено": ${error.message}`);
  }
  if (item.faq.length > 0) {
    const rows = item.faq.map((f, idx) => ({
      destination_slug: slug,
      question_ru: f.question_ru,
      question_ro: f.question_ro,
      answer_ru: f.answer_ru ?? null,
      answer_ro: f.answer_ro ?? null,
      sort_order: idx + 1,
    }));
    const { error } = await supabase.from("destination_faq").insert(rows);
    if (error) await restore(`Ошибка при добавлении FAQ: ${error.message}`);
  }

  return { id: existingId, slug, title_ru: item.destination.title_ru };
}

const bulkImportInputSchema = z.object({
  mode: z.enum(["skip", "upsert", "only_new"]).default("upsert"),
  destinations: z.array(importPayloadSchema).min(1).max(100),
});

export const adminImportDestinationsBulk = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => {
    // Allow bare array → wrap as { mode: "upsert", destinations: array }.
    const normalized = Array.isArray(i) ? { mode: "upsert", destinations: i } : i;
    const parsed = bulkImportInputSchema.safeParse(normalized);
    if (!parsed.success) {
      throw new Error(`Ошибка валидации JSON: ${formatZodError(parsed.error)}`);
    }
    return parsed.data;
  })
  .handler(async ({ data, context }) => {
    const slugs = data.destinations.map((d) => d.destination.slug);
    const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
    if (dupes.length > 0) {
      throw new Error(`В батче повторяются slug: ${Array.from(new Set(dupes)).join(", ")}.`);
    }

    const { data: existingRows, error: exErr } = await context.supabase
      .from("destinations").select("id, slug").in("slug", slugs);
    if (exErr) throw new Error(`Проверка существующих slug: ${exErr.message}`);
    const existingMap = new Map<string, string>();
    for (const r of existingRows ?? []) existingMap.set(r.slug as string, r.id as string);

    const created: Array<{ slug: string; title_ru: string; id: string }> = [];
    const updated: Array<{ slug: string; title_ru: string; id: string }> = [];
    const skipped: Array<{ slug: string; reason: string }> = [];
    const errors: Array<{ slug: string; error: string }> = [];

    if (data.mode === "only_new") {
      const conflicts = slugs.filter((s) => existingMap.has(s));
      if (conflicts.length > 0) {
        throw new Error(
          `Режим "только новые": найдены существующие slug — ${conflicts.join(", ")}. Батч отклонён, ничего не записано.`,
        );
      }
    }

    for (const item of data.destinations) {
      const slug = item.destination.slug;
      const existingId = existingMap.get(slug);
      try {
        if (existingId) {
          if (data.mode === "skip") {
            skipped.push({ slug, reason: "already_exists" });
            continue;
          }
          // upsert (only_new already filtered above)
          const res = await upsertSingleDestination(context.supabase, item, existingId);
          updated.push(res);
        } else {
          const res = await insertSingleDestination(context.supabase, item);
          created.push(res);
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (data.mode === "only_new") {
          throw new Error(`Slug "${slug}": ${msg}`);
        }
        errors.push({ slug, error: msg });
      }
    }

    return {
      ok: true as const,
      mode: data.mode,
      summary: {
        created: created.length,
        updated: updated.length,
        skipped: skipped.length,
        errors: errors.length,
      },
      created,
      updated,
      skipped,
      errors,
    };
  });
