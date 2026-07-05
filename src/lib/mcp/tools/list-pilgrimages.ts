import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { listPilgrimages } from "@/lib/pilgrimages.functions";

export default defineTool({
  name: "list_pilgrimages",
  title: "List pilgrimages",
  description:
    "List all published pilgrimage trips with dates, destinations, prices, and status. Each trip has bilingual (RU/RO) titles and descriptions.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    const rows = await listPilgrimages();
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { pilgrimages: rows },
    };
  },
});

// keep z import used for future validation extension
void z;