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
