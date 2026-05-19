
-- Public images bucket for admin uploads (blog covers, pilgrimage covers)
INSERT INTO storage.buckets (id, name, public)
VALUES ('public-images', 'public-images', true)
ON CONFLICT (id) DO NOTHING;

-- Anyone can read
CREATE POLICY "Public images are readable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'public-images');

-- Only admins can write
CREATE POLICY "Admins can upload public images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'public-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update public images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'public-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete public images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'public-images' AND public.has_role(auth.uid(), 'admin'));
