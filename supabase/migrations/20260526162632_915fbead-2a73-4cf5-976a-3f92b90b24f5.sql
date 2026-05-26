GRANT INSERT ON public.leads TO anon;
GRANT INSERT ON public.leads TO authenticated;

CREATE POLICY "Anyone can submit a lead"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (
  name IS NOT NULL AND name <> '' AND
  phone IS NOT NULL AND phone <> ''
);