import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const leadSchema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().max(30).regex(/^[+\d\s()\-]*$/).optional().or(z.literal("")),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  source: z.string().trim().min(1).max(80).regex(/^[a-z0-9_:\-]+$/),
});

export const createLead = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => leadSchema.parse(i))
  .handler(async ({ data }) => {
    const payload = {
      name: data.name,
      phone: data.phone && data.phone.trim().length >= 5 ? data.phone : null,
      email: data.email ? data.email : null,
      message: data.message ? data.message : null,
      source: data.source,
    };
    const { error } = await supabaseAdmin.from("leads").insert(payload);
    if (error) throw new Error(error.message);
    return { ok: true };
  });