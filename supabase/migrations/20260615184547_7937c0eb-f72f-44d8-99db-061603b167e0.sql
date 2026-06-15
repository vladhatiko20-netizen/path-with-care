
-- about_page (singleton)
CREATE TABLE public.about_page (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton boolean NOT NULL DEFAULT true UNIQUE,
  hero_photo_url text,
  hero_title_ru text,
  hero_title_ro text,
  hero_subtitle_ru text,
  hero_subtitle_ro text,
  intro_text_ru text,
  intro_text_ro text,
  video_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.about_page TO anon, authenticated;
GRANT ALL ON public.about_page TO service_role;
ALTER TABLE public.about_page ENABLE ROW LEVEL SECURITY;
CREATE POLICY "about_page public read" ON public.about_page FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "about_page admin insert" ON public.about_page FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "about_page admin update" ON public.about_page FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "about_page admin delete" ON public.about_page FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER about_page_set_updated_at BEFORE UPDATE ON public.about_page FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- about_gallery
CREATE TABLE public.about_gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  caption_ru text,
  caption_ro text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.about_gallery TO anon, authenticated;
GRANT ALL ON public.about_gallery TO service_role;
ALTER TABLE public.about_gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "about_gallery public read" ON public.about_gallery FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "about_gallery admin insert" ON public.about_gallery FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "about_gallery admin update" ON public.about_gallery FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "about_gallery admin delete" ON public.about_gallery FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER about_gallery_set_updated_at BEFORE UPDATE ON public.about_gallery FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- about_team
CREATE TABLE public.about_team (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ru text NOT NULL,
  name_ro text NOT NULL,
  role_ru text,
  role_ro text,
  photo_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.about_team TO anon, authenticated;
GRANT ALL ON public.about_team TO service_role;
ALTER TABLE public.about_team ENABLE ROW LEVEL SECURITY;
CREATE POLICY "about_team public read published" ON public.about_team FOR SELECT TO anon, authenticated USING (is_published = true OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "about_team admin insert" ON public.about_team FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "about_team admin update" ON public.about_team FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "about_team admin delete" ON public.about_team FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER about_team_set_updated_at BEFORE UPDATE ON public.about_team FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed about_page (single row)
INSERT INTO public.about_page (
  hero_title_ru, hero_title_ro,
  hero_subtitle_ru, hero_subtitle_ro,
  intro_text_ru, intro_text_ro
) VALUES (
  'Анна Плотник – путешественница и паломница',
  'Anna Plotnik – călătoare și pelerină',
  'Здравствуйте. Меня зовут Анна. Здесь несколько слов о нашем общем деле.',
  'Bună ziua. Mă numesc Anna. Aici sunt câteva cuvinte despre lucrarea noastră comună.',
  E'Я Анна. Уже несколько лет я организую поездки к святым местам. Сама бываю в Иерусалиме, на Корфу, в Бари. Мне дорого это служение: помогать людям прийти к святыням, помолиться, вернуться домой с радостью и светом в душе.\n\nЭтот сайт – продолжение работы нашего агентства Eldorado Tur, но с фокусом на паломничество. Здесь поездки, которые я готовлю с особенным вниманием. Здесь люди, которые сопровождают группы: батюшки и опытные паломники.\n\nЕсли у вас есть вопросы, звоните или пишите. Я отвечу лично.',
  E'Sunt Anna. De câțiva ani organizez călătorii la locurile sfinte. Eu însămi merg la Ierusalim, pe Corfu, la Bari. Această slujire îmi este dragă: să ajut oamenii să ajungă la sanctuare, să se roage, să se întoarcă acasă cu bucurie și lumină în suflet.\n\nAcest site este continuarea activității agenției noastre Eldorado Tur, dar cu accent pe pelerinaj. Aici sunt călătoriile pe care le pregătesc cu o atenție deosebită. Aici sunt oamenii care însoțesc grupurile: preoți și pelerini cu experiență.\n\nDacă aveți întrebări, sunați sau scrieți. Vă voi răspunde personal.'
);

-- Seed about_team
INSERT INTO public.about_team (name_ru, name_ro, role_ru, role_ro, sort_order, is_published) VALUES
  ('Анна Плотник', 'Anna Plotnik', 'Организатор поездок', 'Organizator de călătorii', 1, true),
  ('Наталия', 'Natalia', 'Менеджер групп, координация поездок', 'Manager grupuri, coordonare călătorii', 2, true);
