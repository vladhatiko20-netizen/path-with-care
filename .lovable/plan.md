## Комментарий к сообщению Claude

Сообщение по сути верное — структура таблицы хорошая. Но несколько технических уточнений по нашему стеку:

1. **«Lovable Cloud database» — это и есть Supabase под капотом.** Никакого «нового проекта» создавать не нужно; работаем с уже подключённой БД через migration-инструмент. Существующих таблиц не трогаем.
2. **`has_role` уже существует** в БД (`SECURITY DEFINER`, `search_path=public`) и уже используется другими политиками (blog_posts, destinations, leads и т.д.). Дополнительный `GRANT EXECUTE ... TO anon, authenticated` не нужен — функция объявлена корректно и работает в политиках. Лишний grant на `anon` даже нежелателен (anon не пишет).
3. **Server-функции, не Edge Functions.** Админ читает/пишет через `createServerFn` + `requireSupabaseAuth` (как `adminListBlogPosts` и т.д. в `src/lib/admin.functions.ts`). Публичный список священников будет позже читаться публичной server-fn (без auth-middleware, RLS отдаст только `is_published=true`).
4. **Фото.** Уже есть `ImageUpload` + бакет `public-images` — переиспользуем 1-в-1, без новой инфраструктуры.
5. **Поля.** Структура подходит. Предлагаю одно небольшое расширение, чтобы потом не делать вторую миграцию: добавить `title_ru` / `title_ro` (сан/должность — «Иеромонах», «Părintele», «храм свв. Константина и Елены»), потому что на текущей странице это отдельная строка под именем. Если не хочешь — уберём, скажи.

## План (Шаг 1 — только данные + админка)

### 1. Миграция БД

Таблица `public.clergy`:

| поле | тип | примечание |
|---|---|---|
| `id` | uuid pk, default `gen_random_uuid()` | |
| `name_ru`, `name_ro` | text not null | |
| `title_ru`, `title_ro` | text | сан/место служения, опционально |
| `bio_ru`, `bio_ro` | text | 2–4 предложения |
| `photo_url` | text | nullable |
| `sort_order` | int not null default 0 | |
| `is_published` | bool not null default false | |
| `created_at`, `updated_at` | timestamptz, авто | + триггер `set_updated_at` |

GRANTs (по нашему стандарту):
- `GRANT SELECT ON public.clergy TO anon, authenticated;` — публичное чтение
- `GRANT INSERT, UPDATE, DELETE ON public.clergy TO authenticated;`
- `GRANT ALL ON public.clergy TO service_role;`

RLS политики:
- `SELECT` для `anon, authenticated`: `USING (is_published = true)`
- `SELECT` для `authenticated` (админ видит всё): `USING (has_role(auth.uid(), 'admin'::app_role))`
- `INSERT/UPDATE/DELETE` для `authenticated`: `USING/WITH CHECK (has_role(auth.uid(), 'admin'::app_role))`

Индекс: `(is_published, sort_order)`.

SQL покажу в момент вызова migration-инструмента — он спросит подтверждение перед выполнением, ничего не выполнится без твоего «да».

### 2. Server-функции (`src/lib/admin.functions.ts`)

Дописать (тем же шаблоном, что blog/destinations):
- `adminListClergy()` — все записи, отсортированы по `sort_order, name_ru`
- `adminGetClergy({ id })`
- `adminUpsertClergy({ ...fields })` — create или update
- `adminDeleteClergy({ id })`

Все с `.middleware([requireSupabaseAuth])` + проверкой `has_role(..., 'admin')`.

### 3. Админ-страницы

Маршруты (как у блога):
- `src/routes/_admin/admin.clergy.index.tsx` — список (таблица: фото-миниатюра, имя RU, статус, кнопки edit/delete, кнопка «Новый»)
- `src/routes/_admin/admin.clergy.new.tsx` — создание
- `src/routes/_admin/admin.clergy.$id.tsx` — редактирование

Форма `ClergyForm` (новый компонент `src/components/admin/ClergyForm.tsx`): имя RU/RO, сан/место RU/RO, био RU/RO (обычный textarea, не rich-editor — короткий текст), `ImageUpload` (folder=`clergy`), `sort_order` (number), `is_published` (checkbox), кнопки «Сохранить» / «Удалить».

В `src/routes/_admin.tsx` добавить в массив `nav` пункт `{ to: "/admin/clergy", label: "Священники", icon: Users }` (иконка lucide `Users`). И карточку на `/admin` дашборде.

### 4. Что НЕ делаем в этом шаге

- Никаких изменений на публичной странице `/with-priest`, `/ro/with-priest`, на главной — данные ещё хардкод, переключим в Шаге 2.
- Не трогаем существующие таблицы, политики, server-функции.
- Никаких Edge Functions, никаких изменений в `supabase/config.toml`.

### 5. Проверка

- `bunx tsc --noEmit` зелёный
- Логин под админом → `/admin/clergy` → создать запись с фото → опубликовать → запись видна в списке, фото загружается в `public-images/clergy/...`
- В БД: `select * from clergy` отдаёт запись; под anon-ключом видны только published.

## Шаг 2 (отдельным заходом, после approve Шага 1)

Заменить хардкод массива `priests` в `src/page-views/WithPriestPage.tsx` и блока на главной на чтение из БД через публичную server-fn `listPublishedClergy()` + loader. Это короткая, изолированная правка — сделаем когда скажешь.

## Что мне нужно от тебя, чтобы стартовать

1. Добавлять ли `title_ru`/`title_ro` (сан/место)? Я за «да», иначе на странице не из чего собрать вторую строку.
2. Нужны ли цитаты/контакт священника отдельными полями, или это часть `bio`? По умолчанию — часть `bio`.
3. Подтвердить: иконка `Users` в сайдбаре, пункт меню «Священники», порядок — между «Блог» и «Паломничества». Ок?

После твоего «да» я в build-режиме сделаю миграцию (покажет SQL и попросит подтверждение), затем server-fn, затем три admin-страницы и форму — одним заходом.
