
CREATE TABLE public.clergy (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ru text NOT NULL,
  name_ro text NOT NULL,
  title_ru text,
  title_ro text,
  bio_ru text,
  bio_ro text,
  photo_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.clergy TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.clergy TO authenticated;
GRANT ALL ON public.clergy TO service_role;

ALTER TABLE public.clergy ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published clergy"
  ON public.clergy FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can view all clergy"
  ON public.clergy FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can insert clergy"
  ON public.clergy FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update clergy"
  ON public.clergy FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete clergy"
  ON public.clergy FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE INDEX clergy_published_sort_idx ON public.clergy (is_published, sort_order);

CREATE TRIGGER clergy_set_updated_at
  BEFORE UPDATE ON public.clergy
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
