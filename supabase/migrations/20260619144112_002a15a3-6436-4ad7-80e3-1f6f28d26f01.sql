
-- ============================================================
-- catalog_items: позиции каталога
-- ============================================================
CREATE TABLE public.catalog_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$' AND length(slug) BETWEEN 1 AND 100),
  title_ru text NOT NULL,
  title_ro text NOT NULL,
  description_ru text,
  description_ro text,
  category text NOT NULL DEFAULT 'other',
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.catalog_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.catalog_items TO authenticated;
GRANT ALL ON public.catalog_items TO service_role;

ALTER TABLE public.catalog_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published catalog items"
  ON public.catalog_items FOR SELECT TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Admins can read all catalog items"
  ON public.catalog_items FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert catalog items"
  ON public.catalog_items FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update catalog items"
  ON public.catalog_items FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete catalog items"
  ON public.catalog_items FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX catalog_items_published_sort_idx
  ON public.catalog_items (is_published, sort_order);
CREATE INDEX catalog_items_category_idx
  ON public.catalog_items (category);

CREATE TRIGGER catalog_items_set_updated_at
  BEFORE UPDATE ON public.catalog_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- catalog_page: singleton — управляемые тексты страницы
-- ============================================================
CREATE TABLE public.catalog_page (
  id text PRIMARY KEY DEFAULT 'singleton' CHECK (id = 'singleton'),
  hero_image_url text,
  hero_overline_ru text,
  hero_overline_ro text,
  hero_title_ru text,
  hero_title_ro text,
  intro_ru text,
  intro_ro text,
  empty_state_ru text,
  empty_state_ro text,
  form_title_ru text,
  form_title_ro text,
  form_subtitle_ru text,
  form_subtitle_ro text,
  form_success_title_ru text,
  form_success_title_ro text,
  form_success_text_ru text,
  form_success_text_ro text,
  card_caption_ru text,
  card_caption_ro text,
  categories jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.catalog_page TO anon;
GRANT SELECT, INSERT, UPDATE ON public.catalog_page TO authenticated;
GRANT ALL ON public.catalog_page TO service_role;

ALTER TABLE public.catalog_page ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read catalog page"
  ON public.catalog_page FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert catalog page"
  ON public.catalog_page FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update catalog page"
  ON public.catalog_page FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER catalog_page_set_updated_at
  BEFORE UPDATE ON public.catalog_page
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Seed: catalog_page singleton
-- (никаких длинных тире U+2014 — только дефисы и среднее тире)
-- ============================================================
INSERT INTO public.catalog_page (
  id,
  hero_overline_ru, hero_overline_ro,
  hero_title_ru, hero_title_ro,
  intro_ru, intro_ro,
  empty_state_ru, empty_state_ro,
  form_title_ru, form_title_ro,
  form_subtitle_ru, form_subtitle_ro,
  form_success_title_ru, form_success_title_ro,
  form_success_text_ru, form_success_text_ro,
  card_caption_ru, card_caption_ro,
  categories
) VALUES (
  'singleton',
  'Святыни со святых мест', 'Sfințenii de la locuri sfinte',
  'Иконы и святыни', 'Icoane și obiecte sfinte',
  'Многие православные святыни и духовная литература трудно найти в Молдове, особенно – со святых мест. Если вы хотели бы получить определённую икону, книгу или другую святыню, оставьте заявку. Анна привезёт её из ближайшей паломнической поездки.',
  'Multe icoane și cărți duhovnicești sunt greu de găsit în Moldova, mai ales – direct de la locurile sfinte. Dacă doriți o icoană sau o carte anume, lăsați o cerere. Anna o va aduce din următorul pelerinaj.',
  'Не нашли что искали? Напишите – может быть, привезём из ближайшей поездки.',
  'Nu ați găsit ce căutați? Scrieți-ne – poate aducem din următorul pelerinaj.',
  'Заявка на святыню', 'Cerere pentru o sfințenie',
  'Опишите, что именно хотели бы получить. Анна свяжется с вами и расскажет, из какой поездки сможет привезти.',
  'Descrieți ce anume doriți. Anna vă va contacta și vă va spune din ce pelerinaj poate aduce.',
  'Заявка принята', 'Cererea a fost primită',
  'Анна свяжется с вами в ближайшее время.', 'Anna vă va contacta în cel mai scurt timp.',
  'привезём из поездки', 'aducem din pelerinaj',
  '[
    {"key":"icons","label_ru":"Иконы","label_ro":"Icoane","sort":1},
    {"key":"incense","label_ru":"Ладан и свечи","label_ro":"Tămâie și lumânări","sort":2},
    {"key":"books","label_ru":"Книги","label_ro":"Cărți","sort":3},
    {"key":"other","label_ru":"Прочее","label_ro":"Diverse","sort":4}
  ]'::jsonb
);

-- ============================================================
-- Seed: 12 текущих позиций каталога (без фотографий, скрыты)
-- ============================================================
INSERT INTO public.catalog_items (slug, title_ru, title_ro, category, sort_order, is_published) VALUES
  ('ikona-nikolay-bari',          'Икона Святителя Николая (Бари)',          'Icoana Sf. Nicolae (Bari)',           'icons',   10, false),
  ('ikona-spiridon-korfu',        'Икона Святителя Спиридона (Корфу)',        'Icoana Sf. Spiridon (Corfu)',         'icons',   20, false),
  ('ikona-ierusalimskaya',        'Икона Иерусалимской Божией Матери',        'Icoana Maicii Domnului din Ierusalim','icons',   30, false),
  ('ladan-afonskiy',              'Афонский ладан',                          'Tămâie de Athos',                     'incense', 40, false),
  ('svechi-ierusalimskie',        'Свечи восковые иерусалимские',            'Lumânări de ceară din Ierusalim',     'incense', 50, false),
  ('chetki-afonskie',             'Чётки афонские',                          'Mătănii de Athos',                    'incense', 60, false),
  ('kniga-starets-siluan',        '«Старец Силуан Афонский»',                '„Stareţul Siluan Athonitul”',         'books',   70, false),
  ('kniga-otkrovennye-rasskazy',  '«Откровенные рассказы странника»',        '„Pelerinul rus”',                     'books',   80, false),
  ('kniga-nevidimaya-bran',       '«Невидимая брань» – преп. Никодим',       '„Războiul nevăzut” – Sf. Nicodim',    'books',   90, false),
  ('krestik-bari',                'Крестик нательный (Бари)',                'Cruciuliță de gât (Bari)',            'other',  100, false),
  ('ikonka-podveska-ierusalim',   'Иконка-подвеска Иерусалимская',           'Iconiță-pandantiv Ierusalim',         'other',  110, false),
  ('poyasok-zhivyy-v-pomoshi',    'Поясок «Живый в помощи»',                 'Brâuleț „Cel ce locuiește”',          'other',  120, false);
