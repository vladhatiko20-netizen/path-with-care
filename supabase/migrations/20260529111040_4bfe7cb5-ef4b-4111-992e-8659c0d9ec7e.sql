
-- 1. Extend destinations with new optional content + SEO fields
ALTER TABLE public.destinations
  ADD COLUMN hero_quote_ru text,
  ADD COLUMN hero_quote_ro text,
  ADD COLUMN hero_quote_author_ru text,
  ADD COLUMN hero_quote_author_ro text,
  ADD COLUMN intro_ru text,
  ADD COLUMN intro_ro text,
  ADD COLUMN notice_ru text,
  ADD COLUMN notice_ro text,
  ADD COLUMN seo_title_ru text,
  ADD COLUMN seo_title_ro text,
  ADD COLUMN seo_description_ru text,
  ADD COLUMN seo_description_ro text,
  ADD COLUMN og_image text;

-- 2. Shrines
CREATE TABLE public.destination_shrines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_slug text NOT NULL,
  image_url text,
  title_ru text NOT NULL,
  title_ro text NOT NULL,
  short_ru text,
  short_ro text,
  full_ru text,
  full_ro text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX destination_shrines_slug_idx ON public.destination_shrines (destination_slug, sort_order);

GRANT SELECT ON public.destination_shrines TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.destination_shrines TO authenticated;
GRANT ALL ON public.destination_shrines TO service_role;

ALTER TABLE public.destination_shrines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Shrines are viewable by everyone"
  ON public.destination_shrines FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert shrines"
  ON public.destination_shrines FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update shrines"
  ON public.destination_shrines FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete shrines"
  ON public.destination_shrines FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER destination_shrines_set_updated_at
  BEFORE UPDATE ON public.destination_shrines
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. Program days
CREATE TABLE public.destination_program_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_slug text NOT NULL,
  day_label_ru text,
  day_label_ro text,
  title_ru text NOT NULL,
  title_ro text NOT NULL,
  description_ru text,
  description_ro text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX destination_program_days_slug_idx ON public.destination_program_days (destination_slug, sort_order);

GRANT SELECT ON public.destination_program_days TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.destination_program_days TO authenticated;
GRANT ALL ON public.destination_program_days TO service_role;

ALTER TABLE public.destination_program_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Program days are viewable by everyone"
  ON public.destination_program_days FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert program days"
  ON public.destination_program_days FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update program days"
  ON public.destination_program_days FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete program days"
  ON public.destination_program_days FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER destination_program_days_set_updated_at
  BEFORE UPDATE ON public.destination_program_days
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. Inclusions (included / excluded)
CREATE TABLE public.destination_inclusions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_slug text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('included', 'excluded')),
  text_ru text NOT NULL,
  text_ro text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX destination_inclusions_slug_idx ON public.destination_inclusions (destination_slug, kind, sort_order);

GRANT SELECT ON public.destination_inclusions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.destination_inclusions TO authenticated;
GRANT ALL ON public.destination_inclusions TO service_role;

ALTER TABLE public.destination_inclusions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inclusions are viewable by everyone"
  ON public.destination_inclusions FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert inclusions"
  ON public.destination_inclusions FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update inclusions"
  ON public.destination_inclusions FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete inclusions"
  ON public.destination_inclusions FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER destination_inclusions_set_updated_at
  BEFORE UPDATE ON public.destination_inclusions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. FAQ
CREATE TABLE public.destination_faq (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_slug text NOT NULL,
  question_ru text NOT NULL,
  question_ro text NOT NULL,
  answer_ru text,
  answer_ro text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX destination_faq_slug_idx ON public.destination_faq (destination_slug, sort_order);

GRANT SELECT ON public.destination_faq TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.destination_faq TO authenticated;
GRANT ALL ON public.destination_faq TO service_role;

ALTER TABLE public.destination_faq ENABLE ROW LEVEL SECURITY;

CREATE POLICY "FAQ is viewable by everyone"
  ON public.destination_faq FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert faq"
  ON public.destination_faq FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update faq"
  ON public.destination_faq FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete faq"
  ON public.destination_faq FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER destination_faq_set_updated_at
  BEFORE UPDATE ON public.destination_faq
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
