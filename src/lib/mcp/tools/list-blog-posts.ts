import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "list_blog_posts",
  title: "List blog posts",
  description:
    "List all published blog posts with bilingual (RU/RO) titles, excerpts, and publish dates. Use get_blog_post to fetch the full body.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select("slug, published_at, title_ru, title_ro, excerpt_ru, excerpt_ro")
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const rows = data ?? [];
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { posts: rows },
    };
  },
});