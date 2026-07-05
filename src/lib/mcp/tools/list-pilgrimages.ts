import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "list_pilgrimages",
  title: "List pilgrimages",
  description:
    "List all published pilgrimage trips with dates, destinations, prices, and status. Each trip has bilingual (RU/RO) titles and descriptions.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: dests } = await supabaseAdmin
      .from("destinations")
      .select("slug")
      .eq("is_published", true);
    const slugs = (dests ?? []).map((d) => d.slug);
    if (slugs.length === 0) {
      return { content: [{ type: "text", text: "[]" }], structuredContent: { pilgrimages: [] } };
    }
    const { data, error } = await supabaseAdmin
      .from("pilgrimages")
      .select("slug, start_date, end_date, destination_ru, destination_ro, destination_slug, title_ru, title_ro, description_ru, description_ro, price_eur, with_priest, status")
      .eq("is_published", true)
      .in("destination_slug", slugs)
      .order("start_date", { ascending: true });
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    const rows = data ?? [];
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { pilgrimages: rows },
    };
  },
});