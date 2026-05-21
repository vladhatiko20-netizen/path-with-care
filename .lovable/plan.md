## План: Раздел «Направления» в админке

Полностью повторяет архитектуру раздела «Паломничества», подключён к таблице `destinations`.

### 1. Серверные функции — `src/lib/admin.functions.ts`
Добавить Zod-схему `destinationSchema` и 5 серверных функций (по образцу `adminListPilgrimages` и пр.), с защитой `requireSupabaseAuth`:
- `adminListDestinations` — список (id, slug, title_ru, title_ro, is_published, price_from), сортировка по `title_ru`.
- `adminGetDestination({ id })`.
- `adminSaveDestination(payload)` — insert/update в `destinations`.
- `adminDeleteDestination({ id })`.

Поля схемы: `slug` (lowercase, regex `^[a-z0-9-]+$`), `title_ru/ro` (required), `description_ru/ro`, `cover_image`, `duration_ru/ro`, `price_from` (number, nullable), `group_size_ru/ro`, `program_ru/ro` (до 50000 симв.), `is_published`.

### 2. Сайдбар — `src/routes/_admin.tsx`
В массив `nav` добавить пункт `{ to: "/admin/destinations", label: "Направления", icon: MapPin }` сразу после «Паломничества». Импорт `MapPin` из `lucide-react`.

### 3. Маршруты
Создать три новых файла (TanStack Router подхватит автоматически):

- **`src/routes/_admin/admin.destinations.index.tsx`** — таблица: колонки «Название (RU)», «Slug», «Цена от», «Статус», действия «Редактировать»/«Удалить»; кнопка «+ Новое направление» → `/admin/destinations/new`.
- **`src/routes/_admin/admin.destinations.new.tsx`** — пустая форма с дефолтами.
- **`src/routes/_admin/admin.destinations.$id.tsx`** — загрузка через `adminGetDestination` и редактирование.

### 4. Форма — `src/components/admin/DestinationForm.tsx`
Три визуальные секции (заголовки `<h2 className="font-serif text-xl">`):

**Основное:** title_ru*, title_ro*, slug*, `ImageUpload folder="destinations"` для cover_image, чекбокс «Опубликовать».

**Параметры поездки:** duration_ru, duration_ro, price_from (number, €), group_size_ru, group_size_ro, description_ru (textarea), description_ro (textarea).

**Программа по дням:** program_ru (textarea, rows=10), program_ro (textarea, rows=10).

Внизу — «Сохранить» (accent) и «Отмена» (border) → возврат на `/admin/destinations`. Стили — те же классы, что в `PilgrimageForm` (`font-serif`, `border-border`, `bg-accent`).

### 5. Что НЕ делаем
- Никаких публичных страниц (`/destinations` остаётся как есть).
- Не трогаем существующие админ-разделы, миграции БД, RLS.
- FK `pilgrimages.destination_id` — позже, отдельной задачей.

### Проверка
Открыть `/admin` → «Направления» → создать запись «Бари» (slug `bari`, цена 850, опубликовать) → убедиться, что она появилась в списке и сохраняется при повторном редактировании.
