ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS is_read boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS read_at timestamptz NULL;

CREATE INDEX IF NOT EXISTS idx_leads_is_read ON public.leads (is_read);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at DESC);