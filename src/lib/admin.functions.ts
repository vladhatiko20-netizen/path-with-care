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
  seo_title_ru: z.string().max(255).nullable().optional(),
  seo_title_ro: z.string().max(255).nullable().optional(),
  seo_description_ru: z.string().max(500).nullable().optional(),
  seo_description_ro: z.string().max(500).nullable().optional(),
  is_published: z.boolean(),
});

const pilgSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  start_date: z.string().min(1),
  end_date: z.string().min(1),
  destination_ru: z.string().min(1).max(500),
  destination_ro: z.string().min(1).max(500),
  destination_slug: z.string().max(255).nullable().optional(),
  title_ru: z.string().min(1).max(500),
  title_ro: z.string().min(1).max(500),
  description_ru: z.string().max(5000).nullable().optional(),
  description_ro: z.string().max(5000).nullable().optional(),
  cover_image: z.string().max(500).nullable().optional(),
  price_eur: z.number().min(0).max(1000000).nullable().optional(),
  with_priest: z.boolean(),
  is_published: z.boolean(),
  status: z.enum(["recruiting", "full", "completed"]).nullable().optional(),
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
      .select("id, slug, title_ru, title_ro, destination_ru, destination_ro, destination_slug, start_date, end_date, price_eur, with_priest, is_published")
      .order("start_date", { ascending: true });
    if (error) throw new Error(error.message);
    const rows = data ?? [];
    const slugs = Array.from(
      new Set(rows.map((r) => r.destination_slug).filter((s): s is string => !!s)),
    );
    const publishedMap = new Map<string, boolean>();
    if (slugs.length > 0) {
      const { data: dests, error: destErr } = await context.supabase
        .from("destinations")
        .select("slug, is_published")
        .in("slug", slugs);
      if (destErr) throw new Error(destErr.message);
      for (const d of dests ?? []) publishedMap.set(d.slug, !!d.is_published);
    }
    return rows.map((r) => ({
      ...r,
      destination_published: r.destination_slug
        ? publishedMap.get(r.destination_slug) === true
        : false,
    }));
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

export const adminSetDestinationPublished = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({ id: z.string().uuid(), is_published: z.boolean() }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("destinations")
      .update({ is_published: data.is_published })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminSetPilgrimagePublished = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({ id: z.string().uuid(), is_published: z.boolean() }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("pilgrimages")
      .update({ is_published: data.is_published })
      .eq("id", data.id);
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
  source: z.string().trim().max(80).regex(/^[a-z0-9_:\-]+$/).optional(),
  category: z.enum(["all", "pilgrimage", "priest", "catalog", "other"]).optional().default("all"),
  period: z.enum(["all", "week", "month"]).optional().default("all"),
});

function applyCategoryFilter<T extends { like: any; eq: any; or: any }>(q: T, category: "all" | "pilgrimage" | "priest" | "catalog" | "other"): T {
  if (category === "pilgrimage") return q.like("source", "destination:%");
  if (category === "priest") return q.eq("source", "with-priest");
  if (category === "catalog") return q.or("source.eq.catalog,source.like.catalog:%");
  if (category === "other") {
    // NULL-safe: NOT LIKE / <> on NULL → NULL → row excluded. Include explicit IS NULL branch.
    return q.or("source.is.null,and(source.not.like.destination:%,source.neq.with-priest,source.neq.catalog,source.not.like.catalog:%)");
  }
  return q;
}

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
    q = applyCategoryFilter(q, data.category);
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
    async function countFor(category: "all" | "pilgrimage" | "priest" | "catalog" | "other"): Promise<number> {
      let q = context.supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("is_read", false);
      q = applyCategoryFilter(q as any, category);
      const { count, error } = await q;
      if (error) throw new Error(error.message);
      return count ?? 0;
    }
    const [total, pilgrimage, priest, catalog, other] = await Promise.all([
      countFor("all"),
      countFor("pilgrimage"),
      countFor("priest"),
      countFor("catalog"),
      countFor("other"),
    ]);
    return { count: total, total, pilgrimage, priest, catalog, other };
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

const importGalleryCaptionSchema = z.object({
  sort_order: z.number().int().min(1).max(1000),
  // image_url is reference-only (helps human self-check); ignored on write.
  image_url: z.string().max(2000).nullable().optional(),
  alt_ru: z.string().max(500).nullable().optional(),
  alt_ro: z.string().max(500).nullable().optional(),
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
  gallery: z.array(importGalleryCaptionSchema).max(200).optional().default([]),
});

function formatZodError(err: z.ZodError): string {
  return err.issues
    .map((i) => `Поле "${i.path.join(".") || "(корень)"}": ${i.message}`)
    .join("; ");
}

// Apply caption updates (alt_ru / alt_ro) to existing gallery rows, matched
// by sort_order. Never creates rows, never touches image_url / author /
// license / source_url / sort_order. Missing sort_order values are reported
// as warnings, not errors.
async function applyGalleryCaptions(
  supabase: any,
  slug: string,
  gallery: Array<z.infer<typeof importGalleryCaptionSchema>>,
): Promise<string[]> {
  if (!gallery || gallery.length === 0) return [];
  const { data: rows, error } = await supabase
    .from("destination_gallery_images")
    .select("id, sort_order")
    .eq("destination_slug", slug);
  if (error) throw new Error(`Чтение галереи: ${error.message}`);
  const byOrder = new Map<number, string>();
  for (const r of (rows ?? []) as Array<{ id: string; sort_order: number }>) {
    byOrder.set(r.sort_order, r.id);
  }
  const warnings: string[] = [];
  for (const item of gallery) {
    const id = byOrder.get(item.sort_order);
    if (!id) {
      warnings.push(`Галерея: фото №${item.sort_order} не найдено – подпись пропущена.`);
      continue;
    }
    const patch: { alt_ru?: string | null; alt_ro?: string | null } = {};
    if (item.alt_ru !== undefined) patch.alt_ru = item.alt_ru;
    if (item.alt_ro !== undefined) patch.alt_ro = item.alt_ro;
    if (Object.keys(patch).length === 0) continue;
    const { error: updErr } = await supabase
      .from("destination_gallery_images").update(patch).eq("id", id);
    if (updErr) throw new Error(`Обновление подписи фото №${item.sort_order}: ${updErr.message}`);
  }
  return warnings;
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

    let sortOrder = data.destination.sort_order;
    if (sortOrder === undefined) {
      const { data: maxRow } = await context.supabase
        .from("destinations").select("sort_order")
        .order("sort_order", { ascending: false }).limit(1).maybeSingle();
      sortOrder = ((maxRow?.sort_order as number | undefined) ?? 0) + 1;
    }
    const destPayload = { ...data.destination, sort_order: sortOrder, is_published: false };
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

    let galleryWarnings: string[] = [];
    try {
      galleryWarnings = await applyGalleryCaptions(context.supabase, slug, data.gallery);
    } catch (e) {
      await rollback(e instanceof Error ? e.message : String(e));
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
      warnings: galleryWarnings,
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
    gallery: gallery.map((g: any) => ({
      sort_order: g.sort_order,
      image_url: g.image_url,
      alt_ru: g.alt_ru ?? null,
      alt_ro: g.alt_ro ?? null,
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
      .from("destinations").select("id")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
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
  let sortOrder = item.destination.sort_order;
  if (sortOrder === undefined) {
    const { data: maxRow } = await supabase
      .from("destinations").select("sort_order")
      .order("sort_order", { ascending: false }).limit(1).maybeSingle();
    sortOrder = ((maxRow?.sort_order as number | undefined) ?? 0) + 1;
  }
  const destPayload = { ...item.destination, sort_order: sortOrder, is_published: false };
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
  let galleryWarnings: string[] = [];
  try {
    galleryWarnings = await applyGalleryCaptions(supabase, slug, item.gallery);
  } catch (e) {
    await rollback(e instanceof Error ? e.message : String(e));
  }
  return { id: destId, slug, title_ru: item.destination.title_ru, warnings: galleryWarnings };
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

  let galleryWarnings: string[] = [];
  try {
    galleryWarnings = await applyGalleryCaptions(supabase, slug, item.gallery);
  } catch (e) {
    await restore(e instanceof Error ? e.message : String(e));
  }
  return { id: existingId, slug, title_ru: item.destination.title_ru, warnings: galleryWarnings };
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
          `Режим "только новые": найдены существующие slug – ${conflicts.join(", ")}. Батч отклонён, ничего не записано.`,
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

// ===== Clergy =====

const clergySchema = z.object({
  id: z.string().uuid().optional(),
  name_ru: z.string().min(1).max(255),
  name_ro: z.string().min(1).max(255),
  title_ru: z.string().max(500).nullable().optional(),
  title_ro: z.string().max(500).nullable().optional(),
  bio_ru: z.string().max(5000).nullable().optional(),
  bio_ro: z.string().max(5000).nullable().optional(),
  photo_url: z.string().max(1000).nullable().optional(),
  sort_order: z.number().int().min(0).max(100000),
  is_published: z.boolean(),
});

export const adminListClergy = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("clergy")
      .select("id, name_ru, name_ro, title_ru, title_ro, photo_url, sort_order, is_published")
      .order("sort_order", { ascending: true })
      .order("name_ru", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminGetClergy = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("clergy").select("*").eq("id", data.id).maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminSaveClergy = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => clergySchema.parse(i))
  .handler(async ({ data, context }) => {
    const { id, ...payload } = data;
    if (id) {
      const { data: row, error } = await context.supabase
        .from("clergy").update(payload).eq("id", id).select().single();
      if (error) throw new Error(error.message);
      return row;
    }
    const { data: row, error } = await context.supabase
      .from("clergy").insert(payload).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminDeleteClergy = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("clergy").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ===== Priest FAQ =====

const priestFaqSchema = z.object({
  id: z.string().uuid().optional(),
  question_ru: z.string().min(1).max(2000),
  question_ro: z.string().max(2000).optional().default(""),
  answer_ru: z.string().min(1).max(10000),
  answer_ro: z.string().max(10000).optional().default(""),
  author_name_ru: z.string().max(255).nullable().optional(),
  author_name_ro: z.string().max(255).nullable().optional(),
  author_title_ru: z.string().max(500).nullable().optional(),
  author_title_ro: z.string().max(500).nullable().optional(),
  sort_order: z.number().int().min(0).max(100000),
  is_published: z.boolean(),
});

export const adminListPriestFaq = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("priest_faq")
      .select("id, question_ru, question_ro, sort_order, is_published")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminGetPriestFaq = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("priest_faq").select("*").eq("id", data.id).maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminSavePriestFaq = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => priestFaqSchema.parse(i))
  .handler(async ({ data, context }) => {
    const { id, ...payload } = data;
    if (id) {
      const { data: row, error } = await context.supabase
        .from("priest_faq").update(payload).eq("id", id).select().single();
      if (error) throw new Error(error.message);
      return row;
    }
    const { data: row, error } = await context.supabase
      .from("priest_faq").insert(payload).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminDeletePriestFaq = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("priest_faq").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ===== Priest FAQ: JSON import / export =====

const EM_DASH = "\u2014";

const priestFaqImportItemSchema = z
  .object({
    question_ru: z.string().trim().min(1, "question_ru обязательно").max(2000),
    question_ro: z.string().trim().min(1, "question_ro обязательно").max(2000),
    answer_ru: z.string().trim().min(1, "answer_ru обязательно").max(10000),
    answer_ro: z.string().trim().min(1, "answer_ro обязательно").max(10000),
    author_name_ru: z.string().max(255).nullable().optional(),
    author_name_ro: z.string().max(255).nullable().optional(),
    author_title_ru: z.string().max(500).nullable().optional(),
    author_title_ro: z.string().max(500).nullable().optional(),
    sort_order: z.number().int().min(0).max(100000).nullable().optional(),
    is_published: z.boolean().optional(),
  })
  .superRefine((v, ctx) => {
    for (const k of ["question_ru", "question_ro", "answer_ru", "answer_ro"] as const) {
      const val = v[k];
      if (typeof val === "string" && val.includes(EM_DASH)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [k],
          message: `Поле ${k} содержит длинное тире. Замените на обычное тире, запятую или двоеточие.`,
        });
      }
    }
  });

type PriestFaqImportItem = z.infer<typeof priestFaqImportItemSchema>;

const PRIEST_FAQ_IMPORT_KEYS = [
  "question_ru", "question_ro", "answer_ru", "answer_ro",
  "author_name_ru", "author_name_ro", "author_title_ru", "author_title_ro",
  "sort_order", "is_published",
] as const;

function stripImportItem(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") return raw;
  const r = raw as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const k of PRIEST_FAQ_IMPORT_KEYS) if (k in r) out[k] = r[k];
  return out;
}

function toExportRow(row: Record<string, unknown>): {
  question_ru: string;
  question_ro: string;
  answer_ru: string;
  answer_ro: string;
  author_name_ru: string | null;
  author_name_ro: string | null;
  author_title_ru: string | null;
  author_title_ro: string | null;
  sort_order: number;
  is_published: boolean;
} {
  return {
    question_ru: String(row.question_ru ?? ""),
    question_ro: String(row.question_ro ?? ""),
    answer_ru: String(row.answer_ru ?? ""),
    answer_ro: String(row.answer_ro ?? ""),
    author_name_ru: (row.author_name_ru as string | null) ?? null,
    author_name_ro: (row.author_name_ro as string | null) ?? null,
    author_title_ru: (row.author_title_ru as string | null) ?? null,
    author_title_ro: (row.author_title_ro as string | null) ?? null,
    sort_order: Number(row.sort_order ?? 0),
    is_published: Boolean(row.is_published),
  };
}

type SupabaseLike = { from: (t: string) => any };

async function findPriestFaqMatches(
  supabase: SupabaseLike,
  questionRu: string,
): Promise<Array<{ id: string; question_ru: string }>> {
  const trimmed = questionRu.trim();
  const { data, error } = await supabase
    .from("priest_faq").select("id, question_ru").eq("question_ru", trimmed);
  if (error) throw new Error(error.message);
  return (data ?? []) as Array<{ id: string; question_ru: string }>;
}

async function nextPriestFaqSortOrder(supabase: SupabaseLike): Promise<number> {
  const { data, error } = await supabase
    .from("priest_faq").select("sort_order").order("sort_order", { ascending: false }).limit(1);
  if (error) throw new Error(error.message);
  const max = data && data[0] ? Number((data[0] as { sort_order: number }).sort_order) || 0 : 0;
  return max + 10;
}

function buildInsertPayload(item: PriestFaqImportItem, sortOrder: number) {
  return {
    question_ru: item.question_ru.trim(),
    question_ro: item.question_ro.trim(),
    answer_ru: item.answer_ru.trim(),
    answer_ro: item.answer_ro.trim(),
    author_name_ru: item.author_name_ru ?? null,
    author_name_ro: item.author_name_ro ?? null,
    author_title_ru: item.author_title_ru ?? null,
    author_title_ro: item.author_title_ro ?? null,
    sort_order: typeof item.sort_order === "number" ? item.sort_order : sortOrder,
    is_published: item.is_published ?? false,
  };
}

function buildUpdatePayload(item: PriestFaqImportItem) {
  const p: Record<string, unknown> = {
    question_ru: item.question_ru.trim(),
    question_ro: item.question_ro.trim(),
    answer_ru: item.answer_ru.trim(),
    answer_ro: item.answer_ro.trim(),
    author_name_ru: item.author_name_ru ?? null,
    author_name_ro: item.author_name_ro ?? null,
    author_title_ru: item.author_title_ru ?? null,
    author_title_ro: item.author_title_ro ?? null,
  };
  if (typeof item.sort_order === "number") p.sort_order = item.sort_order;
  if (typeof item.is_published === "boolean") p.is_published = item.is_published;
  return p;
}

export const adminExportPriestFaq = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("priest_faq").select("*").eq("id", data.id).maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Запись не найдена");
    return { payload: toExportRow(row as Record<string, unknown>) };
  });

export const adminExportAllPriestFaq = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("priest_faq").select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return { priest_faq: (data ?? []).map((r) => toExportRow(r as Record<string, unknown>)) };
  });

export const adminImportPriestFaq = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => priestFaqImportItemSchema.parse(stripImportItem(i)))
  .handler(async ({ data, context }) => {
    const matches = await findPriestFaqMatches(context.supabase, data.question_ru);
    if (matches.length > 1) {
      throw new Error(
        `Найдено ${matches.length} записей с таким же question_ru. Разрешите вручную и повторите импорт.`,
      );
    }
    if (matches.length === 1) {
      const id = matches[0].id;
      const { data: row, error } = await context.supabase
        .from("priest_faq").update(buildUpdatePayload(data) as never).eq("id", id).select().single();
      if (error) throw new Error(error.message);
      return { ok: true as const, action: "updated" as const, id: row.id, question_ru: row.question_ru };
    }
    const sortOrder = await nextPriestFaqSortOrder(context.supabase);
    const { data: row, error } = await context.supabase
      .from("priest_faq").insert(buildInsertPayload(data, sortOrder)).select().single();
    if (error) throw new Error(error.message);
    return { ok: true as const, action: "created" as const, id: row.id, question_ru: row.question_ru };
  });

const priestFaqBulkSchema = z.object({
  mode: z.enum(["skip", "upsert", "only_new"]).default("skip"),
  items: z.array(z.unknown()).min(1).max(200),
});

export const adminImportPriestFaqBulk = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => {
    let mode: "skip" | "upsert" | "only_new" = "skip";
    let items: unknown[] = [];
    if (Array.isArray(i)) {
      items = i;
    } else if (i && typeof i === "object") {
      const o = i as Record<string, unknown>;
      if (o.mode === "skip" || o.mode === "upsert" || o.mode === "only_new") mode = o.mode;
      if (Array.isArray(o.items)) items = o.items;
      else if (Array.isArray(o.priest_faq)) items = o.priest_faq;
    }
    return priestFaqBulkSchema.parse({ mode, items });
  })
  .handler(async ({ data, context }) => {
    const summary = { created: 0, updated: 0, skipped: 0, errors: 0 };
    const created: Array<{ question_ru: string; id: string }> = [];
    const updated: Array<{ question_ru: string; id: string }> = [];
    const skipped: Array<{ question_ru: string; reason: string }> = [];
    const errors: Array<{ question_ru: string; error: string }> = [];

    // only_new pre-check: if ANY item matches an existing row, reject whole batch.
    if (data.mode === "only_new") {
      for (let idx = 0; idx < data.items.length; idx++) {
        const parsed = priestFaqImportItemSchema.safeParse(stripImportItem(data.items[idx]));
        if (!parsed.success) continue;
        const matches = await findPriestFaqMatches(context.supabase, parsed.data.question_ru);
        if (matches.length > 0) {
          throw new Error(
            `Режим «Только новые»: запись «${parsed.data.question_ru.slice(0, 60)}…» уже существует. Батч отклонён.`,
          );
        }
      }
    }

    let nextOrder = await nextPriestFaqSortOrder(context.supabase);

    for (let idx = 0; idx < data.items.length; idx++) {
      const raw = data.items[idx];
      const parsed = priestFaqImportItemSchema.safeParse(stripImportItem(raw));
      if (!parsed.success) {
        const q = (raw && typeof raw === "object" && typeof (raw as Record<string, unknown>).question_ru === "string")
          ? ((raw as Record<string, unknown>).question_ru as string)
          : `#${idx + 1}`;
        summary.errors++;
        errors.push({
          question_ru: q,
          error: parsed.error.issues.map((e) => `${e.path.join(".") || "(root)"}: ${e.message}`).join("; "),
        });
        continue;
      }
      const item = parsed.data;
      try {
        const matches = await findPriestFaqMatches(context.supabase, item.question_ru);
        if (matches.length > 1) {
          summary.errors++;
          errors.push({
            question_ru: item.question_ru,
            error: `Найдено ${matches.length} записей с таким же question_ru. Разрешите вручную.`,
          });
          continue;
        }
        if (matches.length === 1) {
          if (data.mode === "skip") {
            summary.skipped++;
            skipped.push({ question_ru: item.question_ru, reason: "уже существует" });
            continue;
          }
          // upsert (only_new is handled above and never reaches here on conflict)
          const id = matches[0].id;
          const { data: row, error } = await context.supabase
            .from("priest_faq").update(buildUpdatePayload(item) as never).eq("id", id).select().single();
          if (error) throw new Error(error.message);
          summary.updated++;
          updated.push({ question_ru: row.question_ru, id: row.id });
        } else {
          const sortOrder = typeof item.sort_order === "number" ? item.sort_order : nextOrder++;
          const { data: row, error } = await context.supabase
            .from("priest_faq").insert(buildInsertPayload(item, sortOrder)).select().single();
          if (error) throw new Error(error.message);
          summary.created++;
          created.push({ question_ru: row.question_ru, id: row.id });
        }
      } catch (e: unknown) {
        summary.errors++;
        errors.push({
          question_ru: item.question_ru,
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }

    return { ok: true as const, mode: data.mode, summary, created, updated, skipped, errors };
  });

// ============================================================================
// Blog posts JSON import/export
// ----------------------------------------------------------------------------
// Differences from priest_faq importer:
//   - Match key is the real unique `slug`.
//   - Body is Tiptap HTML — exported and imported verbatim (no sanitize).
//   - Em-dashes (U+2014) are NOT rejected; they're informational warnings only.
//   - On upsert: keys ABSENT from incoming JSON preserve existing DB values;
//     keys PRESENT with null/"" are treated as explicit reset to null.
// ============================================================================

const BLOG_IMPORT_KEYS = [
  "slug", "published_at", "cover_image",
  "title_ru", "title_ro", "excerpt_ru", "excerpt_ro",
  "body_ru", "body_ro",
  "seo_title_ru", "seo_title_ro", "seo_description_ru", "seo_description_ro",
  "is_published",
] as const;

const BLOG_EM_DASH_FIELDS = [
  "title_ru", "title_ro", "excerpt_ru", "excerpt_ro", "body_ru", "body_ro",
] as const;

function stripBlogImportItem(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== "object") return {};
  const r = raw as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const k of BLOG_IMPORT_KEYS) if (k in r) out[k] = r[k];
  return out;
}

function countBlogEmDashes(row: Record<string, unknown>): {
  total: number;
  perField: Array<{ field: string; count: number }>;
} {
  const perField: Array<{ field: string; count: number }> = [];
  let total = 0;
  for (const f of BLOG_EM_DASH_FIELDS) {
    const v = row[f];
    if (typeof v !== "string" || v.length === 0) continue;
    let c = 0;
    for (let i = 0; i < v.length; i++) if (v.charCodeAt(i) === 0x2014) c++;
    if (c > 0) {
      perField.push({ field: f, count: c });
      total += c;
    }
  }
  return { total, perField };
}

function emDashWarningString(slug: string, row: Record<string, unknown>): string | null {
  const { total, perField } = countBlogEmDashes(row);
  if (total === 0) return null;
  const breakdown = perField.map((p) => `${p.field}(${p.count})`).join(", ");
  return `статья ${slug}: найдено ${total} длинных тире (U+2014) в полях: ${breakdown}`;
}

const blogImportItemSchema = z.object({
  slug: z.string().trim().min(1, "slug обязателен").max(255).regex(/^[a-z0-9-]+$/, "slug должен содержать только a-z, 0-9 и -"),
  published_at: z.string().trim().min(1).max(50).optional(),
  cover_image: z.union([z.string().max(2000), z.null()]).optional(),
  title_ru: z.string().trim().min(1, "title_ru обязателен").max(500),
  title_ro: z.string().trim().min(1, "title_ro обязателен").max(500),
  excerpt_ru: z.union([z.string().max(2000), z.null()]).optional(),
  excerpt_ro: z.union([z.string().max(2000), z.null()]).optional(),
  body_ru: z.union([z.string().max(500000), z.null()]).optional(),
  body_ro: z.union([z.string().max(500000), z.null()]).optional(),
  seo_title_ru: z.union([z.string().max(255), z.null()]).optional(),
  seo_title_ro: z.union([z.string().max(255), z.null()]).optional(),
  seo_description_ru: z.union([z.string().max(500), z.null()]).optional(),
  seo_description_ro: z.union([z.string().max(500), z.null()]).optional(),
  is_published: z.boolean().optional(),
});

type BlogImportItem = z.infer<typeof blogImportItemSchema>;

function toBlogExportRow(row: Record<string, unknown>) {
  return {
    slug: String(row.slug ?? ""),
    published_at: String(row.published_at ?? ""),
    cover_image: (row.cover_image as string | null) ?? null,
    title_ru: String(row.title_ru ?? ""),
    title_ro: String(row.title_ro ?? ""),
    excerpt_ru: (row.excerpt_ru as string | null) ?? null,
    excerpt_ro: (row.excerpt_ro as string | null) ?? null,
    body_ru: (row.body_ru as string | null) ?? null,
    body_ro: (row.body_ro as string | null) ?? null,
    seo_title_ru: (row.seo_title_ru as string | null) ?? null,
    seo_title_ro: (row.seo_title_ro as string | null) ?? null,
    seo_description_ru: (row.seo_description_ru as string | null) ?? null,
    seo_description_ro: (row.seo_description_ro as string | null) ?? null,
    is_published: Boolean(row.is_published),
  };
}

async function findBlogPostsBySlug(
  supabase: SupabaseLike,
  slug: string,
): Promise<Array<{ id: string; slug: string }>> {
  const { data, error } = await supabase
    .from("blog_posts").select("id, slug").eq("slug", slug.trim());
  if (error) throw new Error(error.message);
  return (data ?? []) as Array<{ id: string; slug: string }>;
}

// Build INSERT payload: required fields, defaults for the rest where appropriate.
// Absent optional keys → null (or DB default for is_published / published_at via omission).
function buildBlogInsertPayload(item: BlogImportItem, raw: Record<string, unknown>) {
  const p: Record<string, unknown> = {
    slug: item.slug.trim(),
    title_ru: item.title_ru.trim(),
    title_ro: item.title_ro.trim(),
  };
  // published_at: if present (even ""), use it; else let DB default to CURRENT_DATE.
  if ("published_at" in raw && typeof item.published_at === "string" && item.published_at.length > 0) {
    p.published_at = item.published_at;
  }
  // is_published: present → use; absent → omit (DB default false).
  if ("is_published" in raw && typeof item.is_published === "boolean") {
    p.is_published = item.is_published;
  }
  // For all other nullable fields: present (incl. null/"") → write; absent → omit (null in DB).
  const nullableKeys = [
    "cover_image", "excerpt_ru", "excerpt_ro", "body_ru", "body_ro",
    "seo_title_ru", "seo_title_ro", "seo_description_ru", "seo_description_ro",
  ] as const;
  for (const k of nullableKeys) {
    if (k in raw) {
      const v = (item as Record<string, unknown>)[k];
      p[k] = v === "" ? null : (v ?? null);
    }
  }
  return p;
}

// Build UPDATE payload: ONLY keys present in incoming raw object.
// Absent → preserved. Present with null/"" → explicit reset to null.
function buildBlogUpdatePayload(item: BlogImportItem, raw: Record<string, unknown>) {
  const p: Record<string, unknown> = {};
  // Required textual fields are always present (passed validation).
  if ("title_ru" in raw) p.title_ru = item.title_ru.trim();
  if ("title_ro" in raw) p.title_ro = item.title_ro.trim();
  if ("published_at" in raw && typeof item.published_at === "string" && item.published_at.length > 0) {
    p.published_at = item.published_at;
  }
  if ("is_published" in raw && typeof item.is_published === "boolean") {
    p.is_published = item.is_published;
  }
  const nullableKeys = [
    "cover_image", "excerpt_ru", "excerpt_ro", "body_ru", "body_ro",
    "seo_title_ru", "seo_title_ro", "seo_description_ru", "seo_description_ro",
  ] as const;
  for (const k of nullableKeys) {
    if (k in raw) {
      const v = (item as Record<string, unknown>)[k];
      p[k] = v === "" ? null : (v ?? null);
    }
  }
  return p;
}

export const adminExportBlogPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("blog_posts").select("*").eq("id", data.id).maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Статья не найдена");
    const payload = toBlogExportRow(row as Record<string, unknown>);
    const warning = emDashWarningString(payload.slug, payload as Record<string, unknown>);
    return { payload, warnings: warning ? [warning] : [] };
  });

export const adminExportAllBlogPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("blog_posts").select("*")
      .order("published_at", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    const blog_posts = (data ?? []).map((r) => toBlogExportRow(r as Record<string, unknown>));
    const warnings: string[] = [];
    for (const p of blog_posts) {
      const w = emDashWarningString(p.slug, p as Record<string, unknown>);
      if (w) warnings.push(w);
    }
    return { blog_posts, warnings };
  });

export const adminImportBlogPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => {
    const raw = stripBlogImportItem(i);
    const parsed = blogImportItemSchema.parse(raw);
    return { item: parsed, raw };
  })
  .handler(async ({ data, context }) => {
    const { item, raw } = data;
    const matches = await findBlogPostsBySlug(context.supabase, item.slug);
    if (matches.length > 1) {
      throw new Error(
        `Найдено ${matches.length} записей с таким же slug. Разрешите вручную и повторите импорт.`,
      );
    }
    const warning = emDashWarningString(item.slug, raw);
    const warnings = warning ? [warning] : [];
    if (matches.length === 1) {
      const id = matches[0].id;
      const { data: row, error } = await context.supabase
        .from("blog_posts").update(buildBlogUpdatePayload(item, raw) as never).eq("id", id).select().single();
      if (error) throw new Error(error.message);
      return { ok: true as const, action: "updated" as const, id: row.id, slug: row.slug, warnings };
    }
    const { data: row, error } = await context.supabase
      .from("blog_posts").insert(buildBlogInsertPayload(item, raw) as never).select().single();
    if (error) throw new Error(error.message);
    return { ok: true as const, action: "created" as const, id: row.id, slug: row.slug, warnings };
  });

const blogBulkSchema = z.object({
  mode: z.enum(["skip", "upsert", "only_new"]).default("skip"),
  items: z.array(z.unknown()).min(1, "Пустой список").max(50, "Максимум 50 статей за один батч"),
});

export const adminImportBlogPostsBulk = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => {
    let mode: "skip" | "upsert" | "only_new" = "skip";
    let items: unknown[] = [];
    if (Array.isArray(i)) {
      items = i;
    } else if (i && typeof i === "object") {
      const o = i as Record<string, unknown>;
      if (o.mode === "skip" || o.mode === "upsert" || o.mode === "only_new") mode = o.mode;
      if (Array.isArray(o.items)) items = o.items;
      else if (Array.isArray(o.blog_posts)) items = o.blog_posts;
      else if (Array.isArray(o.blog)) items = o.blog;
    }
    return blogBulkSchema.parse({ mode, items });
  })
  .handler(async ({ data, context }) => {
    const summary = { created: 0, updated: 0, skipped: 0, errors: 0 };
    const created: Array<{ slug: string; id: string }> = [];
    const updated: Array<{ slug: string; id: string }> = [];
    const skipped: Array<{ slug: string; reason: string }> = [];
    const errors: Array<{ slug: string; error: string }> = [];
    const warnings: string[] = [];

    // only_new pre-check
    if (data.mode === "only_new") {
      for (let idx = 0; idx < data.items.length; idx++) {
        const raw = stripBlogImportItem(data.items[idx]);
        const parsed = blogImportItemSchema.safeParse(raw);
        if (!parsed.success) continue;
        const matches = await findBlogPostsBySlug(context.supabase, parsed.data.slug);
        if (matches.length > 0) {
          throw new Error(
            `Режим «Только новые»: статья со slug «${parsed.data.slug}» уже существует. Батч отклонён.`,
          );
        }
      }
    }

    for (let idx = 0; idx < data.items.length; idx++) {
      const rawIn = data.items[idx];
      const raw = stripBlogImportItem(rawIn);
      const parsed = blogImportItemSchema.safeParse(raw);
      if (!parsed.success) {
        const slug = typeof raw.slug === "string" ? raw.slug : `#${idx + 1}`;
        summary.errors++;
        errors.push({
          slug,
          error: parsed.error.issues.map((e) => `${e.path.join(".") || "(root)"}: ${e.message}`).join("; "),
        });
        continue;
      }
      const item = parsed.data;
      const w = emDashWarningString(item.slug, raw);
      if (w) warnings.push(w);
      try {
        const matches = await findBlogPostsBySlug(context.supabase, item.slug);
        if (matches.length > 1) {
          summary.errors++;
          errors.push({
            slug: item.slug,
            error: `Найдено ${matches.length} записей с таким же slug. Разрешите вручную.`,
          });
          continue;
        }
        if (matches.length === 1) {
          if (data.mode === "skip") {
            summary.skipped++;
            skipped.push({ slug: item.slug, reason: "уже существует" });
            continue;
          }
          const id = matches[0].id;
          const { data: row, error } = await context.supabase
            .from("blog_posts").update(buildBlogUpdatePayload(item, raw) as never).eq("id", id).select().single();
          if (error) throw new Error(error.message);
          summary.updated++;
          updated.push({ slug: row.slug, id: row.id });
        } else {
          const { data: row, error } = await context.supabase
            .from("blog_posts").insert(buildBlogInsertPayload(item, raw) as never).select().single();
          if (error) throw new Error(error.message);
          summary.created++;
          created.push({ slug: row.slug, id: row.id });
        }
      } catch (e: unknown) {
        summary.errors++;
        errors.push({
          slug: item.slug,
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }

    return { ok: true as const, mode: data.mode, summary, created, updated, skipped, errors, warnings };
  });

// ============================================================================
// Catalog: items + page (singleton)
// ============================================================================

const catalogCategorySchema = z.object({
  key: z.string().trim().min(1).max(50).regex(/^[a-z0-9-]+$/),
  label_ru: z.string().trim().min(1).max(100),
  label_ro: z.string().trim().min(1).max(100),
  sort: z.number().int().min(0).max(10000),
});

const catalogItemSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().trim().min(1).max(100).regex(/^[a-z0-9-]+$/),
  title_ru: z.string().trim().min(1).max(300),
  title_ro: z.string().trim().min(1).max(300),
  description_ru: z.string().max(3000).nullable().optional(),
  description_ro: z.string().max(3000).nullable().optional(),
  category: z.string().trim().min(1).max(50).regex(/^[a-z0-9-]+$/),
  image_url: z.string().max(1000).nullable().optional(),
  sort_order: z.number().int().min(0).max(100000),
  is_published: z.boolean(),
});

const catalogPageSchema = z.object({
  hero_image_url: z.string().max(1000).nullable().optional(),
  hero_overline_ru: z.string().max(200).nullable().optional(),
  hero_overline_ro: z.string().max(200).nullable().optional(),
  hero_title_ru: z.string().max(300).nullable().optional(),
  hero_title_ro: z.string().max(300).nullable().optional(),
  intro_ru: z.string().max(5000).nullable().optional(),
  intro_ro: z.string().max(5000).nullable().optional(),
  empty_state_ru: z.string().max(1000).nullable().optional(),
  empty_state_ro: z.string().max(1000).nullable().optional(),
  form_title_ru: z.string().max(300).nullable().optional(),
  form_title_ro: z.string().max(300).nullable().optional(),
  form_subtitle_ru: z.string().max(1000).nullable().optional(),
  form_subtitle_ro: z.string().max(1000).nullable().optional(),
  form_success_title_ru: z.string().max(300).nullable().optional(),
  form_success_title_ro: z.string().max(300).nullable().optional(),
  form_success_text_ru: z.string().max(1000).nullable().optional(),
  form_success_text_ro: z.string().max(1000).nullable().optional(),
  card_caption_ru: z.string().max(100).nullable().optional(),
  card_caption_ro: z.string().max(100).nullable().optional(),
  categories: z.array(catalogCategorySchema).max(20),
});

export const adminListCatalogItems = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("catalog_items")
      .select("id,slug,title_ru,title_ro,category,image_url,sort_order,is_published")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminGetCatalogItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("catalog_items").select("*").eq("id", data.id).maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminSaveCatalogItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => catalogItemSchema.parse(i))
  .handler(async ({ data, context }) => {
    const { id, ...payload } = data;
    if (id) {
      const { data: row, error } = await context.supabase
        .from("catalog_items").update(payload).eq("id", id).select().single();
      if (error) throw new Error(error.message);
      return row;
    }
    const { data: row, error } = await context.supabase
      .from("catalog_items").insert(payload).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminDeleteCatalogItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("catalog_items").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminSetCatalogItemPublished = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({ id: z.string().uuid(), is_published: z.boolean() }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("catalog_items")
      .update({ is_published: data.is_published })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminGetCatalogPage = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("catalog_page").select("*").eq("id", "singleton").maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

export const adminUpsertCatalogPage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => catalogPageSchema.parse(i))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("catalog_page")
      .upsert({ id: "singleton", ...data }, { onConflict: "id" })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

// ----- Catalog JSON export/import -----

function toCatalogExportRow(row: Record<string, unknown>) {
  return {
    slug: String(row.slug ?? ""),
    title_ru: String(row.title_ru ?? ""),
    title_ro: String(row.title_ro ?? ""),
    description_ru: (row.description_ru as string | null) ?? null,
    description_ro: (row.description_ro as string | null) ?? null,
    category: String(row.category ?? "other"),
    image_url: (row.image_url as string | null) ?? null,
    sort_order: typeof row.sort_order === "number" ? row.sort_order : 0,
    is_published: Boolean(row.is_published),
  };
}

export const adminExportAllCatalogItems = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("catalog_items").select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return { catalog_items: (data ?? []).map((r) => toCatalogExportRow(r as Record<string, unknown>)) };
  });

const catalogImportItemSchema = z.object({
  slug: z.string().trim().min(1).max(100).regex(/^[a-z0-9-]+$/),
  title_ru: z.string().trim().min(1).max(300),
  title_ro: z.string().trim().min(1).max(300),
  description_ru: z.union([z.string().max(3000), z.null()]).optional(),
  description_ro: z.union([z.string().max(3000), z.null()]).optional(),
  category: z.string().trim().min(1).max(50).regex(/^[a-z0-9-]+$/).optional(),
  image_url: z.union([z.string().max(1000), z.null()]).optional(),
  sort_order: z.number().int().min(0).max(100000).optional(),
  is_published: z.boolean().optional(),
});

const catalogBulkSchema = z.object({
  mode: z.enum(["skip", "upsert", "only_new"]).default("skip"),
  items: z.array(z.unknown()).min(1).max(500),
});

export const adminImportCatalogItemsBulk = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => {
    let mode: "skip" | "upsert" | "only_new" = "skip";
    let items: unknown[] = [];
    if (Array.isArray(i)) items = i;
    else if (i && typeof i === "object") {
      const o = i as Record<string, unknown>;
      if (o.mode === "skip" || o.mode === "upsert" || o.mode === "only_new") mode = o.mode;
      if (Array.isArray(o.items)) items = o.items;
      else if (Array.isArray(o.catalog_items)) items = o.catalog_items;
    }
    return catalogBulkSchema.parse({ mode, items });
  })
  .handler(async ({ data, context }) => {
    const summary = { created: 0, updated: 0, skipped: 0, errors: 0 };
    const created: Array<{ slug: string; id: string }> = [];
    const updated: Array<{ slug: string; id: string }> = [];
    const skipped: Array<{ slug: string; reason: string }> = [];
    const errors: Array<{ slug: string; error: string }> = [];

    if (data.mode === "only_new") {
      for (const raw of data.items) {
        const parsed = catalogImportItemSchema.safeParse(raw);
        if (!parsed.success) continue;
        const { data: ex } = await context.supabase
          .from("catalog_items").select("id").eq("slug", parsed.data.slug).maybeSingle();
        if (ex) throw new Error(`Режим «Только новые»: позиция «${parsed.data.slug}» уже существует. Батч отклонён.`);
      }
    }

    for (let idx = 0; idx < data.items.length; idx++) {
      const raw = data.items[idx];
      const parsed = catalogImportItemSchema.safeParse(raw);
      if (!parsed.success) {
        const slug = (raw && typeof raw === "object" && typeof (raw as Record<string, unknown>).slug === "string")
          ? ((raw as Record<string, unknown>).slug as string)
          : `#${idx + 1}`;
        summary.errors++;
        errors.push({ slug, error: parsed.error.issues.map((e) => `${e.path.join(".") || "(root)"}: ${e.message}`).join("; ") });
        continue;
      }
      const item = parsed.data;
      try {
        const { data: ex } = await context.supabase
          .from("catalog_items").select("id").eq("slug", item.slug).maybeSingle();
        if (ex) {
          if (data.mode === "skip") {
            summary.skipped++;
            skipped.push({ slug: item.slug, reason: "уже существует" });
            continue;
          }
          const payload: Record<string, unknown> = {
            title_ru: item.title_ru,
            title_ro: item.title_ro,
          };
          if ("description_ru" in (raw as object)) payload.description_ru = item.description_ru ?? null;
          if ("description_ro" in (raw as object)) payload.description_ro = item.description_ro ?? null;
          if (item.category) payload.category = item.category;
          if ("image_url" in (raw as object)) payload.image_url = item.image_url ?? null;
          if (typeof item.sort_order === "number") payload.sort_order = item.sort_order;
          if (typeof item.is_published === "boolean") payload.is_published = item.is_published;
          const { data: row, error } = await context.supabase
            .from("catalog_items").update(payload as never).eq("id", ex.id).select().single();
          if (error) throw new Error(error.message);
          summary.updated++;
          updated.push({ slug: row.slug, id: row.id });
        } else {
          const insertPayload = {
            slug: item.slug,
            title_ru: item.title_ru,
            title_ro: item.title_ro,
            description_ru: item.description_ru ?? null,
            description_ro: item.description_ro ?? null,
            category: item.category ?? "other",
            image_url: item.image_url ?? null,
            sort_order: typeof item.sort_order === "number" ? item.sort_order : 0,
            is_published: typeof item.is_published === "boolean" ? item.is_published : false,
          };
          const { data: row, error } = await context.supabase
            .from("catalog_items").insert(insertPayload).select().single();
          if (error) throw new Error(error.message);
          summary.created++;
          created.push({ slug: row.slug, id: row.id });
        }
      } catch (e: unknown) {
        summary.errors++;
        errors.push({ slug: item.slug, error: e instanceof Error ? e.message : String(e) });
      }
    }

    return { ok: true as const, mode: data.mode, summary, created, updated, skipped, errors };
  });
