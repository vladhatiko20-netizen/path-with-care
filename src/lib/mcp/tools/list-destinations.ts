import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "list_destinations",
  title: "List destinations",
  description:
    "List all published pilgrimage destinations (countries/regions) with bilingual (RU/RO) titles, short descriptions, duration, and starting price.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("destinations")
      .select("slug, title_ru, title_ro, description_ru, description_ro, card_text_ru, card_text_ro, duration_ru, duration_ro, price_from")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    const rows = data ?? [];
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { destinations: rows },
    };
  },
});