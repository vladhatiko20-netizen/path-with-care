## Контекст / что уже есть

- В таблице `pilgrimages` колонка `is_published` **уже существует** (используется в `listPilgrimages` и в админке как статус «Опубликовано / Черновик»). Миграция **не нужна**.
- В `listPilgrimages` (`src/lib/pilgrimages.functions.ts`) уже стоит `.eq("is_published", true)` — фильтр по самой поездке есть, но фильтра по родительскому направлению нет.
- Эталонный паттерн toggle-пилюли живёт в `src/routes/_admin/admin.destinations.index.tsx` (+ `adminSetDestinationPublished` в `src/lib/admin.functions.ts`). Берём его 1-в-1.

## Задача 1 — скрыть даты поездок, если направление снято с публикации

Файл: `src/lib/pilgrimages.functions.ts`, функция `listPilgrimages` (она используется на `/calendar`, `/` и `/destinations/$slug` — все три публичные точки).

Сложность: Supabase JS не умеет фильтровать родителя через обычный `select(...)` без inner-join. Чистый способ — два запроса в одном handler'е:

1. `select slug from destinations where is_published = true` → массив опубликованных слугов.
2. Текущий `select` из `pilgrimages` + `.in("destination_slug", publishedSlugs)` (плюс уже существующий `.eq("is_published", true)`).

Поездки с `destination_slug = null` (без привязки к направлению) **исключаются** из публичных списков — это безопасный дефолт; если позже понадобится исключение, добавим `.or(...)`.

Админский `adminListPilgrimages` **не трогаем** — он живёт отдельно в `admin.functions.ts` и продолжает показывать всё.

## Задача 2 — inline-toggle публикации на `/admin/pilgrimages`

### 2a. Серверная функция (по образцу `adminSetDestinationPublished`)

В `src/lib/admin.functions.ts` добавить:

```ts
export const adminSetPilgrimagePublished = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({ id: z.string().uuid(), is_published: z.boolean() }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("pilgrimages")
      .update({ is_published: data.is_published })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
```

### 2b. Админский список

Файл: `src/routes/_admin/admin.pilgrimages.index.tsx`.

- Импортировать `useMutation`, `useQueryClient`, `useServerFn`, `toast`, `cn`, новую `adminSetPilgrimagePublished`.
- Добавить `<style>` с `@keyframes pulse-dot` (копия из destinations).
- В колонке «Статус» заменить статичный `<span>` на ту же `<button role="switch">` пилюлю, что в destinations: текст «Опубликовано / Скрыто», зелёный/серый, пульсирующая точка (зелёная / розовая), оптимистичный апдейт по queryKey `["admin-pilgrimages"]`, откат на ошибке + `toast.error`.

Колонки, удаление, кнопка «Новая поездка» — без изменений.

## Точечно не меняем

- Тексты, верстку других страниц, кнопки Viber, бейджи в сайдбаре и карточке «Заявки» — не трогаем.
- Миграцию БД не запускаем (колонка уже есть).

## Возможные подводные камни

- Если у каких-то существующих поездок `destination_slug` пуст или ссылается на удалённое/неопубликованное направление — они исчезнут из `/calendar`, главной и блока «ближайшие даты». Это и есть желаемое поведение, но я отмечаю это явно: визуально количество карточек на публичных страницах может уменьшиться сразу после внедрения.
- Двойной запрос в `listPilgrimages` дешёвый (`destinations` — небольшая таблица), индексы не нужны.
