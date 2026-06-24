ALTER TABLE public.leads
  ADD COLUMN people_count integer,
  ADD COLUMN pilgrimage_id uuid REFERENCES public.pilgrimages(id) ON DELETE SET NULL,
  ADD CONSTRAINT leads_people_count_chk CHECK (people_count IS NULL OR (people_count >= 1 AND people_count <= 100));

CREATE INDEX IF NOT EXISTS leads_pilgrimage_id_idx ON public.leads(pilgrimage_id);

ALTER TABLE public.pilgrimages
  ADD COLUMN status text,
  ADD CONSTRAINT pilgrimages_status_chk CHECK (status IS NULL OR status IN ('recruiting','full','completed'));