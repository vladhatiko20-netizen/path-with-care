## Две точечные правки

### 1. Починить RLS-политики таблицы `destinations`

**Причина:** в миграции вызов `has_role(auth.uid(), 'admin')` без приведения к `app_role` резолвится в чужую перегрузку функции, на которую у роли `authenticated` нет `EXECUTE`. В `blog_posts` и `pilgrimages` используется явный каст `'admin'::app_role` + квалифицированное имя `public.has_role` — нужно привести `destinations` к той же форме.

**Миграция (через `supabase--migration`):**

```sql
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
```

Политику `"Published destinations are viewable by everyone"` не трогаем — она в порядке.

### 2. Добавить карточку «Направления» на `/admin`

Файл `src/routes/_admin/admin.index.tsx`: добавить третью карточку — копия существующих, иконка `MapPin` (импорт из `lucide-react`), ссылка `/admin/destinations`, заголовок «Направления», подпись типа «Маршруты, программы и описания поездок.». Стили и классы — те же, что у двух соседних карточек.

### Проверка
1. Зайти в `/admin/destinations/new`, заполнить и сохранить «Бари» → запись создаётся, ошибки нет.
2. На `/admin` видны три карточки в одном стиле.
