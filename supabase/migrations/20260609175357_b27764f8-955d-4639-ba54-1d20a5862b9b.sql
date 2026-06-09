ALTER TABLE public.destinations
  ADD COLUMN card_text_ru text,
  ADD COLUMN card_text_ro text,
  ADD COLUMN sort_order integer NOT NULL DEFAULT 0;

-- Backfill sort_order by current created_at rank (1-based)
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) AS rn
  FROM public.destinations
)
UPDATE public.destinations d
SET sort_order = r.rn
FROM ranked r
WHERE d.id = r.id;

CREATE INDEX IF NOT EXISTS destinations_sort_order_idx ON public.destinations (sort_order);