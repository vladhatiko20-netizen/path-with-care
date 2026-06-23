
-- 1. Add voice-related columns to existing leads table
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS transcribed_text text,
  ADD COLUMN IF NOT EXISTS audio_url text,
  ADD COLUMN IF NOT EXISTS source_lang text,
  ADD COLUMN IF NOT EXISTS destination_slug text;

ALTER TABLE public.leads
  DROP CONSTRAINT IF EXISTS leads_source_lang_check;
ALTER TABLE public.leads
  ADD CONSTRAINT leads_source_lang_check
  CHECK (source_lang IS NULL OR source_lang IN ('ru','ro'));

CREATE INDEX IF NOT EXISTS leads_destination_slug_idx
  ON public.leads (destination_slug)
  WHERE destination_slug IS NOT NULL;

-- 2. Rate limit table for voice transcription (anon, by IP)
CREATE TABLE IF NOT EXISTS public.voice_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip text NOT NULL,
  window_start timestamptz NOT NULL DEFAULT date_trunc('hour', now()),
  count integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (ip, window_start)
);

GRANT ALL ON public.voice_rate_limits TO service_role;
-- Anon/authenticated must never read or write this table directly; only the
-- service-role server function transcribeAudio touches it.

ALTER TABLE public.voice_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS voice_rate_limits_ip_window_idx
  ON public.voice_rate_limits (ip, window_start);

-- 3. Storage RLS for the private voice-questions bucket (bucket itself is
--    created via the storage tool, not via SQL on storage.buckets).
DROP POLICY IF EXISTS "voice questions admin read" ON storage.objects;
CREATE POLICY "voice questions admin read"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'voice-questions'
    AND public.has_role(auth.uid(), 'admin')
  );
