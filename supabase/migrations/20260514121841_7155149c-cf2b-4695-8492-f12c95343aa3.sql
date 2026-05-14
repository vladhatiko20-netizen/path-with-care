
-- BLOG POSTS
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  published_at DATE NOT NULL DEFAULT CURRENT_DATE,
  cover_image TEXT,
  title_ru TEXT NOT NULL,
  title_ro TEXT NOT NULL,
  excerpt_ru TEXT,
  excerpt_ro TEXT,
  body_ru TEXT,
  body_ro TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published blog posts are viewable by everyone"
  ON public.blog_posts FOR SELECT
  USING (is_published = true);

CREATE INDEX idx_blog_posts_published ON public.blog_posts(published_at DESC) WHERE is_published = true;

-- PILGRIMAGES
CREATE TABLE public.pilgrimages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  destination_ru TEXT NOT NULL,
  destination_ro TEXT NOT NULL,
  title_ru TEXT NOT NULL,
  title_ro TEXT NOT NULL,
  description_ru TEXT,
  description_ro TEXT,
  cover_image TEXT,
  price_eur NUMERIC(10,2),
  with_priest BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pilgrimages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published pilgrimages are viewable by everyone"
  ON public.pilgrimages FOR SELECT
  USING (is_published = true);

CREATE INDEX idx_pilgrimages_start_date ON public.pilgrimages(start_date) WHERE is_published = true;

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_blog_posts_updated
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_pilgrimages_updated
  BEFORE UPDATE ON public.pilgrimages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
