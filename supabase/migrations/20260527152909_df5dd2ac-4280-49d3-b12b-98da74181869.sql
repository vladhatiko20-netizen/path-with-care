
CREATE TABLE public.destination_gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_slug text NOT NULL,
  image_url text NOT NULL,
  alt_ru text,
  alt_ro text,
  author text,
  license text,
  source_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_destination_gallery_slug_order
  ON public.destination_gallery_images (destination_slug, sort_order);

GRANT SELECT ON public.destination_gallery_images TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.destination_gallery_images TO authenticated;
GRANT ALL ON public.destination_gallery_images TO service_role;

ALTER TABLE public.destination_gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gallery images are viewable by everyone"
  ON public.destination_gallery_images
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert gallery images"
  ON public.destination_gallery_images
  FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update gallery images"
  ON public.destination_gallery_images
  FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete gallery images"
  ON public.destination_gallery_images
  FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_destination_gallery_updated_at
  BEFORE UPDATE ON public.destination_gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
