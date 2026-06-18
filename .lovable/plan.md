## Цель

Добавить в строку списка `/admin/destinations` переключатель видимости (`is_published`), работающий в одно касание, с оптимистичным обновлением и откатом при ошибке. Никаких диалогов, никаких новых полей, ничего за пределами этого экрана.

## Текущее состояние (что переиспользуем)

- Список уже живёт на `useQuery(["admin-destinations"], adminListDestinations)` и показывает бейдж "Опубликовано" / "Черновик" из `d.is_published`. Меняем "Черновик" → "Скрыто" по тексту задачи.
- Все админ-мутации идут через `createServerFn().middleware([requireSupabaseAuth])` с авторизованным `context.supabase` — RLS-политики таблицы `destinations` применяются как обычно. Точная форма — как у `adminDeleteDestination` (строки 214–221 в `src/lib/admin.functions.ts`).
- Никакого отдельного "admin write path" нет — пишем тем же клиентом.

## Решение

### 1. Новая серверная функция `adminSetDestinationPublished`

Файл: `src/lib/admin.functions.ts` (рядом с `adminDeleteDestination`).

```ts
export const adminSetDestinationPublished = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({ id: z.string().uuid(), is_published: z.boolean() }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("destinations")
      .update({ is_published: data.is_published })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
```

Почему отдельная узкая функция, а не переиспользование `adminUpsertDestination`: upsert требует полный валидный payload направления (cover, og, slug, локали и т.д.) — переслать его с listing-строки нельзя без второго запроса. Узкий патч на один булев — самый дешёвый и безопасный путь, и совпадает по стилю с уже существующими `admin*` мутациями (`adminDeleteDestination`, и т.п.).

RLS: запись идёт через `context.supabase` (тот же путь, что у удаления/upsert), значит политики `destinations` для роли admin действуют — обходов нет.

### 2. UI: inline-переключатель в строке таблицы

Файл: `src/routes/_admin/admin.destinations.index.tsx`.

- Добавить `useMutation` поверх `adminSetDestinationPublished` с оптимистичным апдейтом кэша `["admin-destinations"]`:
  - `onMutate`: `cancelQueries` → snapshot прежних данных → `setQueryData` с перевёрнутым `is_published` для нужной строки → вернуть snapshot в контексте.
  - `onError`: восстановить snapshot, показать `toast.error("Не удалось изменить видимость")`.
  - `onSettled`: `invalidateQueries(["admin-destinations"])` для согласования с БД.
  - Tasten-friendly: блокируем повторный клик пока `isPending` для этой строки (отслеживаем по `variables.id`).
- Заменить статичный бейдж на кликабельный переключатель в ячейке "Статус". Один элемент совмещает индикатор и кнопку — одно касание, без отдельной "галочки":

  ```tsx
  <button
    type="button"
    role="switch"
    aria-checked={d.is_published}
    aria-label={d.is_published ? "Скрыть направление" : "Опубликовать направление"}
    onClick={() => toggle.mutate({ data: { id: d.id, is_published: !d.is_published } })}
    disabled={toggle.isPending && toggle.variables?.data.id === d.id}
    className={cn(
      "inline-flex items-center gap-2 px-3 py-2 rounded-sm text-xs min-h-[44px] transition-colors",
      d.is_published
        ? "bg-green-100 text-green-800 hover:bg-green-200"
        : "bg-muted text-muted-foreground hover:bg-secondary",
    )}
  >
    <span className={cn("w-2 h-2 rounded-full", d.is_published ? "bg-green-600" : "bg-muted-foreground/60")} />
    {d.is_published ? "Опубликовано" : "Скрыто"}
  </button>
  ```

  `min-h-[44px]` — touch-target по гайдлайнам мобильных интерфейсов. На мобильном таблица уже горизонтально-прокручиваема (`overflow-x-auto`), ничего по layout не меняем.

- Текст "Черновик" → "Скрыто" по требованию ТЗ.
- Никаких изменений в форме редактирования, публичных страницах, `listPublicDestinations`, `sort_order`, прочих полях.

### 3. Обратная связь

- `sonner` (`toast`) уже используется в проекте — успех тихий (оптимистично уже всё видно), ошибка — короткий toast + автоматический откат.
- Никаких confirm-диалогов.

## Альтернативы, которые я отверг

- **Shadcn `<Switch>`** — отдельная колонка с переключателем и отдельный бейдж статуса. Это два элемента под одно действие, занимает больше места и хуже на мобильном. Совмещённая «бейдж-кнопка» = одно касание, ясный статус, меньше визуального шума.
- **Расширение `adminUpsertDestination` единым полем-патчем** — пришлось бы делать payload опциональным и менять валидацию, риск регресса в форме редактирования. Узкая функция безопаснее.
- **Confirm-диалог** — явно запрещён ТЗ и замедляет рутинную операцию (8 направлений, частые переключения).
- **Локальный state вместо invalidate** — query уже есть, держать второй источник правды смысла нет; оптимистичный кэш + `invalidate` в `onSettled` — стандартный TanStack-паттерн и устойчив к гонкам.

## Затронутые файлы

- `src/lib/admin.functions.ts` — добавить `adminSetDestinationPublished` (≈10 строк).
- `src/routes/_admin/admin.destinations.index.tsx` — `useMutation` + замена бейджа на toggle, текст "Скрыто".

Больше ничего не трогаем.

## Проверка после реализации

1. Открыть `/admin/destinations` на desktop и mobile viewport → у каждой строки видна кликабельная пилюля статуса, высота ≥44px.
2. Тап по «Опубликовано» → мгновенно меняется на «Скрыто», запрос уходит, через короткий refetch состояние остаётся.
3. Эмулировать ошибку (отключить сеть в DevTools) → пилюля моментально откатывается, появляется toast.
4. Открыть публичный `/destinations` → скрытое направление пропало; вернуть `is_published=true` → снова появляется. Подтверждает, что `listPublicDestinations` не затронут.
