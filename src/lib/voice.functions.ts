import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";

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

// --- Capability self-check ------------------------------------------------

let _capabilityCache: { value: { available: boolean }; expires: number } | undefined;

export const getVoiceCapability = createServerFn({ method: "GET" }).handler(async () => {
  const now = Date.now();
  if (_capabilityCache && _capabilityCache.expires > now) return _capabilityCache.value;
  const hasKey = !!process.env.LOVABLE_API_KEY;
  const available = voiceFeaturesEnabled() && hasKey;
  const value = { available };
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
  requestedLang: "ru" | "ro" | null,
): Promise<{ text: string; lang: "ru" | "ro" | null }> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("voice_unavailable");

  const upstream = new FormData();
  upstream.append("model", "openai/gpt-4o-mini-transcribe");
  upstream.append("file", audio, filename);
  if (requestedLang) {
    upstream.append("language", requestedLang);
  }
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

    const langEntry = fd.get("lang");
    const requestedLang = typeof langEntry === "string" && (langEntry === "ru" || langEntry === "ro") ? langEntry : null;

    const { text, lang } = await callProviderTranscribe(blob, filename, requestedLang);

    return { text, lang };
  });
