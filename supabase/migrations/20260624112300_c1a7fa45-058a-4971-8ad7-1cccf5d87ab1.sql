CREATE POLICY "voice questions admin insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'voice-questions' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "voice questions admin update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'voice-questions' AND has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (bucket_id = 'voice-questions' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "voice questions admin delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'voice-questions' AND has_role(auth.uid(), 'admin'::app_role));