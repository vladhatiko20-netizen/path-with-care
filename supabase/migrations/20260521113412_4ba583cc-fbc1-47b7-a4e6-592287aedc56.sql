DROP POLICY IF EXISTS "Admins can view all destinations"   ON public.destinations;
DROP POLICY IF EXISTS "Admins can insert destinations"     ON public.destinations;
DROP POLICY IF EXISTS "Admins can update destinations"     ON public.destinations;
DROP POLICY IF EXISTS "Admins can delete destinations"     ON public.destinations;

CREATE POLICY "Admins can view all destinations"
  ON public.destinations FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can insert destinations"
  ON public.destinations FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update destinations"
  ON public.destinations FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete destinations"
  ON public.destinations FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));