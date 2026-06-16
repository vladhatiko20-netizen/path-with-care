CREATE TABLE public.priest_faq (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_ru text NOT NULL,
  question_ro text NOT NULL DEFAULT '',
  answer_ru   text NOT NULL,
  answer_ro   text NOT NULL DEFAULT '',
  author_name_ru  text,
  author_name_ro  text,
  author_title_ru text,
  author_title_ro text,
  sort_order  integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.priest_faq TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.priest_faq TO authenticated;
GRANT ALL ON public.priest_faq TO service_role;

ALTER TABLE public.priest_faq ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published priest_faq"
  ON public.priest_faq FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can read all priest_faq"
  ON public.priest_faq FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can insert priest_faq"
  ON public.priest_faq FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update priest_faq"
  ON public.priest_faq FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete priest_faq"
  ON public.priest_faq FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER priest_faq_set_updated_at
  BEFORE UPDATE ON public.priest_faq
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();