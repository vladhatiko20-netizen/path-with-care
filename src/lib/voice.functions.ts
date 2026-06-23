import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";

// ============================================================
//  SINGLE PROVIDER INTEGRATION POINT FOR SPEECH-TO-TEXT
// ------------------------------------------------------------
//  All calls to the speech-to-text provider (currently Lovable
//  AI Gateway) live INSIDE this file – nowhere else in the app.
//  When the project migrates off Lovable to self-hosting, replace
//  ONLY the body of `callProviderTranscribe` below. Do not call
//  any provider directly from components, other server functions,
//  or route handlers.
// ============================================================

const MAX_AUDIO_BYTES = 5 * 1024 * 1024; // 5 MB
const MIN_AUDIO_BYTES = 1024; // < 1 KB = empty / silent
const RATE_LIMIT_PER_HOUR = 30;
const ALLOWED_MIME = new Set([
  "audio/webm",
  "audio/mp4",
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
]);

function mimeToExt(mime: string): string {
  const base = mime.split(";")[0].trim().toLowerCase();
  if (base === "audio/webm") return "webm";
  if (base === "audio/mp4") return "mp4";
  if (base === "audio/mpeg" || base === "audio/mp3") return "mp3";
  if (base === "audio/wav" || base === "audio/x-wav") return "wav";
  return "webm";
}

function voiceFeaturesEnabled(): boolean {
  return (process.env.VOICE_FEATURES_ENABLED ?? "").toLowerCase() === "true";
}

function voiceSaveAudioEnabled(): boolean {
  return (process.env.VOICE_SAVE_AUDIO_ENABLED ?? "true").toLowerCase() === "true";
}

// --- Capability self-check ------------------------------------------------

let _capabilityCache: { value: { available: boolean; saveAudio: boolean }; expires: number } | undefined;

export const getVoiceCapability = createServerFn({ method: "GET" }).handler(async () => {
  const now = Date.now();
  if (_capabilityCache && _capabilityCache.expires > now) return _capabilityCache.value;
  const hasKey = !!process.env.LOVABLE_API_KEY;
  const available = voiceFeaturesEnabled() && hasKey;
  const saveAudio = available && voiceSaveAudioEnabled();
  const value = { available, saveAudio };
  _capabilityCache = { value, expires: now + 60_000 };
  return value;
});

// --- Rate limit -----------------------------------------------------------

async function consumeRateLimit(): Promise<void> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  let ip = "unknown";
  try {
    ip = getRequestIP({ xForwardedFor: true }) ?? "unknown";
  } catch {
    ip = "unknown";
  }
  const windowStart = new Date();
  windowStart.setMinutes(0, 0, 0);
  const windowIso = windowStart.toISOString();

  const { data: existing } = await supabaseAdmin
    .from("voice_rate_limits")
    .select("id, count")
    .eq("ip", ip)
    .eq("window_start", windowIso)
    .maybeSingle();

  if (existing && existing.count >= RATE_LIMIT_PER_HOUR) {
    throw new Error("rate_limit");
  }

  if (existing) {
    await supabaseAdmin
      .from("voice_rate_limits")
      .update({ count: existing.count + 1, updated_at: new Date().toISOString() })
      .eq("id", existing.id);
  } else {
    await supabaseAdmin
      .from("voice_rate_limits")
      .insert({ ip, window_start: windowIso, count: 1 });
  }
}

// --- Provider call (THE swap point) --------------------------------------

async function callProviderTranscribe(
  audio: Blob,
  filename: string,
): Promise<{ text: string; lang: "ru" | "ro" | null }> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("voice_unavailable");

  const upstream = new FormData();
  upstream.append("model", "openai/gpt-4o-mini-transcribe");
  upstream.append("file", audio, filename);
  // Non-streaming JSON keeps things simple and returns usage for billing.

  const res = await fetch("https://ai.gateway.lovable.dev/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: upstream,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("[voice] provider transcription failed", res.status, body);
    if (res.status === 429) throw new Error("rate_limit");
    if (res.status === 402) throw new Error("voice_unavailable");
    throw new Error("provider_error");
  }

  const json = (await res.json().catch(() => null)) as { text?: string; language?: string } | null;
  const text = (json?.text ?? "").trim();
  if (!text) throw new Error("empty_transcript");

  const rawLang = (json?.language ?? "").toLowerCase();
  let lang: "ru" | "ro" | null = null;
  if (rawLang.startsWith("ru")) lang = "ru";
  else if (rawLang.startsWith("ro") || rawLang.startsWith("mo")) lang = "ro";
  // Fallback: cyrillic letters => ru
  if (!lang) lang = /[А-Яа-яЁё]/.test(text) ? "ru" : "ro";
  return { text, lang };
}

// --- Public server fn: transcribeAudio -----------------------------------

export const transcribeAudio = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    if (!(input instanceof FormData)) {
      throw new Error("Expected multipart/form-data");
    }
    return input;
  })
  .handler(async ({ data }) => {
    if (!voiceFeaturesEnabled() || !process.env.LOVABLE_API_KEY) {
      throw new Error("voice_unavailable");
    }

    const fd = data;
    const audioEntry = fd.get("audio");
    const saveAudioFlag = String(fd.get("save_audio") ?? "") === "true";
    const destinationSlug = (fd.get("destination_slug") as string | null) || null;

    if (!audioEntry || typeof audioEntry === "string") {
      throw new Error("missing_audio");
    }
    const blob = audioEntry as Blob;
    if (blob.size < MIN_AUDIO_BYTES) throw new Error("empty_audio");
    if (blob.size > MAX_AUDIO_BYTES) throw new Error("audio_too_large");
    const mime = (blob.type || "").toLowerCase().split(";")[0];
    if (mime && !ALLOWED_MIME.has(mime)) throw new Error("unsupported_audio_format");

    await consumeRateLimit();

    const ext = mimeToExt(mime || "audio/webm");
    const filename = `recording.${ext}`;

    const { text, lang } = await callProviderTranscribe(blob, filename);

    let audioPath: string | null = null;
    if (saveAudioFlag && voiceSaveAudioEnabled()) {
      try {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const now = new Date();
        const yyyy = now.getUTCFullYear();
        const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
        const uuid = crypto.randomUUID();
        const slugPart = destinationSlug ? `${destinationSlug}/` : "";
        const path = `${yyyy}/${mm}/${slugPart}${uuid}.${ext}`;
        const buf = new Uint8Array(await blob.arrayBuffer());
        const { error: upErr } = await supabaseAdmin.storage
          .from("voice-questions")
          .upload(path, buf, {
            contentType: mime || "audio/webm",
            upsert: false,
          });
        if (upErr) {
          console.error("[voice] audio upload failed", upErr.message);
        } else {
          audioPath = path;
        }
      } catch (err) {
        console.error("[voice] audio upload threw", err);
      }
    }

    return { text, lang, audioPath };
  });

// --- Public server fn: createVoiceLead (destination voice question) ------

const voiceLeadSchema = z.object({
  transcribed_text: z.string().trim().min(1).max(2000),
  destination_slug: z.string().trim().min(1).max(100).regex(/^[a-z0-9-]+$/),
  audio_path: z.string().trim().max(500).nullable().optional(),
  source_lang: z.enum(["ru", "ro"]).nullable().optional(),
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().max(30).regex(/^[+\d\s()\-]*$/).optional().or(z.literal("")),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
});

export const createVoiceLead = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => voiceLeadSchema.parse(i))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const phone = data.phone && data.phone.trim().length >= 5 ? data.phone : null;
    const email = data.email ? data.email : null;
    if (!phone && !email) {
      throw new Error("contact_required");
    }
    const payload = {
      name: data.name,
      phone,
      email,
      message: data.transcribed_text,
      transcribed_text: data.transcribed_text,
      source_lang: data.source_lang ?? null,
      destination_slug: data.destination_slug,
      audio_url: data.audio_path ?? null,
      source: `destination:${data.destination_slug}`,
    };
    const { error } = await supabaseAdmin.from("leads").insert(payload);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// --- Public server fn: getVoiceQuestionAudioUrl (admin only) -------------

export const getVoiceQuestionAudioUrl = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) =>
    z.object({ lead_id: z.string().uuid() }).parse(i),
  )
  .handler(async ({ data }) => {
    const { requireSupabaseAuth } = await import("@/integrations/supabase/auth-middleware");
    // Cannot reuse middleware retroactively – instead, do an explicit auth check via headers.
    void requireSupabaseAuth; // referenced for tooling clarity; actual check below
    const { getRequestHeader } = await import("@tanstack/react-start/server");
    const authHeader = getRequestHeader("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Unauthorized");
    }
    const token = authHeader.slice("Bearer ".length);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: claimsData, error: claimsErr } = await supabaseAdmin.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims?.sub) throw new Error("Unauthorized");
    const userId = claimsData.claims.sub;

    const { data: isAdmin, error: roleErr } = await supabaseAdmin.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (roleErr || !isAdmin) throw new Error("Forbidden");

    const { data: lead, error: leadErr } = await supabaseAdmin
      .from("leads")
      .select("audio_url")
      .eq("id", data.lead_id)
      .maybeSingle();
    if (leadErr) throw new Error(leadErr.message);
    if (!lead?.audio_url) return { url: null as string | null };

    const { data: signed, error: signErr } = await supabaseAdmin.storage
      .from("voice-questions")
      .createSignedUrl(lead.audio_url, 60 * 60);
    if (signErr) {
      console.error("[voice] signed url failed", signErr.message);
      return { url: null as string | null };
    }
    return { url: signed?.signedUrl ?? null };
  });