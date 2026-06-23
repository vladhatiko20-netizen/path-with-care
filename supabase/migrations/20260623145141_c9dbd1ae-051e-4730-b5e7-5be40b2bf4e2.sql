
ALTER TABLE public.leads
  DROP COLUMN IF EXISTS transcribed_text,
  DROP COLUMN IF EXISTS audio_url,
  DROP COLUMN IF EXISTS source_lang,
  DROP COLUMN IF EXISTS destination_slug;
