import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "get_destination",
  title: "Get destination details",
  description:
    "Get full details for one pilgrimage destination by its slug, including intro text, program days, shrines, FAQ, and inclusions. Use list_destinations first to find valid slugs.",
  inputSchema: {
    slug: z.string().min(1).max(100).describe("Destination slug (e.g. 'israel', 'greece')."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: dest, error } = await supabaseAdmin
      .from("destinations")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!dest) return { content: [{ type: "text", text: `Destination '${slug}' not found.` }], isError: true };

    const [{ data: program }, { data: shrines }, { data: faq }, { data: inclusions }] = await Promise.all([
      supabaseAdmin.from("destination_program_days").select("*").eq("destination_slug", slug).order("day_number"),
      supabaseAdmin.from("destination_shrines").select("*").eq("destination_slug", slug).order("sort_order"),
      supabaseAdmin.from("destination_faq").select("*").eq("destination_slug", slug).order("sort_order"),
      supabaseAdmin.from("destination_inclusions").select("*").eq("destination_slug", slug).order("sort_order"),
    ]);

    const result = {
      destination: dest,
      program: program ?? [],
      shrines: shrines ?? [],
      faq: faq ?? [],
      inclusions: inclusions ?? [],
    };
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: result,
    };
  },
});