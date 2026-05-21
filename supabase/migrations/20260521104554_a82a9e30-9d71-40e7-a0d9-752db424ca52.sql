CREATE TABLE public.destinations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  is_published boolean NOT NULL DEFAULT false,
  title_ru text NOT NULL,
  title_ro text NOT NULL,
  description_ru text,
  description_ro text,
  cover_image text,
  duration_ru text,
  duration_ro text,
  price_from numeric,
  group_size_ru text,
  group_size_ro text,
  program_ru text,
  program_ro text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published destinations are viewable by everyone"
  ON public.destinations FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Admins can view all destinations"
  ON public.destinations FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert destinations"
  ON public.destinations FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update destinations"
  ON public.destinations FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete destinations"
  ON public.destinations FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER destinations_set_updated_at
  BEFORE UPDATE ON public.destinations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();