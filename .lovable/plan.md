# Создание таблицы `destinations`

Добавляем одну новую таблицу в существующую базу Lovable Cloud. Существующие таблицы не трогаем. UI/страницы не создаём.

## Структура таблицы

| Поле | Тип | Nullable | Default | Примечание |
|---|---|---|---|---|
| `id` | uuid | NO | `gen_random_uuid()` | PK |
| `slug` | text | NO | — | UNIQUE + индекс |
| `is_published` | boolean | NO | `false` | |
| `title_ru` | text | NO | — | название направления (RU) |
| `title_ro` | text | NO | — | название направления (RO) |
| `description_ru` | text | YES | NULL | короткое описание для карточек |
| `description_ro` | text | YES | NULL | короткое описание для карточек |
| `cover_image` | text | YES | NULL | URL главного изображения |
| `duration_ru` | text | YES | NULL | длительность (RU) |
| `duration_ro` | text | YES | NULL | длительность (RO) |
| `price_from` | numeric | YES | NULL | цена от (как `pilgrimages.price_eur`) |
| `group_size_ru` | text | YES | NULL | размер группы (RU) |
| `group_size_ro` | text | YES | NULL | размер группы (RO) |
| `program_ru` | text | YES | NULL | полная программа по дням (RU) |
| `program_ro` | text | YES | NULL | полная программа по дням (RO) |
| `created_at` | timestamptz | NO | `now()` | |
| `updated_at` | timestamptz | NO | `now()` | авто-обновление через триггер |

## Безопасность (RLS)

- RLS включён.
- **Публичное чтение** только опубликованных записей (`is_published = true`) — для всех (роль `public`).
- **Полный доступ** (SELECT/INSERT/UPDATE/DELETE) для аутентифицированных админов через `has_role(auth.uid(), 'admin')` — как в `blog_posts` и `pilgrimages`.

## Триггер `updated_at`

Используем существующую функцию `public.set_updated_at()` — новую не создаём.

## На будущее

`pilgrimages.destination_id` (FK → `destinations.id`) будет добавлен позже — в эту миграцию не входит.

## SQL миграции (для предварительного просмотра)

```sql
-- 1. Таблица
CREATE TABLE public.destinations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  is_published boolean NOT NULL DEFAULT false,
  title_ru text NOT NULL,
  title_ro text NOT NULL,
  description_ru text,
  description_ro text,
  cover_image text,
  duration_ru text,
  duration_ro text,
  price_from numeric,
  group_size_ru text,
  group_size_ro text,
  program_ru text,
  program_ro text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Индекс по slug (UNIQUE уже создаёт btree-индекс, поэтому отдельный не нужен)

-- 3. RLS
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published destinations are viewable by everyone"
  ON public.destinations FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Admins can view all destinations"
  ON public.destinations FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert destinations"
  ON public.destinations FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update destinations"
  ON public.destinations FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete destinations"
  ON public.destinations FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- 4. Триггер updated_at (используем существующую функцию public.set_updated_at)
CREATE TRIGGER destinations_set_updated_at
  BEFORE UPDATE ON public.destinations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
```

## Что не делаем

- Не создаём страницы, формы, серверные функции, маршруты.
- Не меняем `pilgrimages`, `blog_posts`, `user_roles`.
- Не трогаем `auth`, `storage`, `realtime` схемы.

После твоего подтверждения запускаю миграцию.
