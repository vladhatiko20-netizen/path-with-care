# Решение: категории заявок + усиленная заметность паломничества

## 1. Единый источник правды — `src/lib/leads-shared.ts`

```ts
export type LeadCategory = "pilgrimage" | "priest" | "other";

export const DESTINATION_NAMES_RU: Record<string, string> = {
  jerusalem: "Иерусалим",
  bari: "Бари",
  georgia: "Грузия",
  romania: "Румыния",
  corfu: "Корфу",
  athos: "Афон",
  ukraine: "Украина",
  moldova: "Молдова",
};

export function leadCategory(source: string | null | undefined): LeadCategory {
  if (!source) return "other";
  if (source.startsWith("destination:")) return "pilgrimage";
  if (source === "with-priest") return "priest";
  return "other";
}

export const CATEGORY_LABELS: Record<LeadCategory, string> = {
  pilgrimage: "Паломничество",
  priest: "Вопрос священнику",
  other: "Прочее",
};
```

`sourceLabel` для `destination:<slug>` → `Паломничество: ${DESTINATION_NAMES_RU[slug] ?? slug}`. Никакого хардкода slug'ов вне этого файла.

## 2. Серверный фильтр — `src/lib/admin.functions.ts`

- Расширить regex `source` в `leadsListInput` до `^[a-z0-9_:\-]+$` (иначе фильтр по `destination:bari` сейчас не пройдёт валидацию).
- Добавить `category: z.enum(["all","pilgrimage","priest","other"]).optional().default("all")`.
- Применять:
  - `pilgrimage` → `.like("source", "destination:%")`
  - `priest` → `.eq("source", "with-priest")`
  - `other` → **с явным учётом NULL**:
    ```ts
    q = q.or(
      "source.is.null," +
      "and(source.not.like.destination:%,source.neq.with-priest)"
    );
    ```
    В Postgres `NOT LIKE`/`<>` на NULL дают NULL → строка отбрасывается. PostgREST-логика `or(is.null, and(not.like…, neq…))` гарантирует, что `source IS NULL` тоже попадает в «Прочее» — совпадает с клиентским `leadCategory(null) === "other"`. Ни одна заявка не теряется.
- `adminCountUnreadLeads` → возвращает `{ total, pilgrimage, priest, other }`. Четыре `head:true count:'exact'` запроса с теми же условиями + `is_read=false`. Тот же `other`-фильтр с NULL-веткой.

## 3. Список — `src/routes/_admin/admin.leads.index.tsx`

- Вкладки «Паломничество | Вопрос священнику | Прочее», default = `pilgrimage`, у каждой — счётчик непрочитанных из `adminCountUnreadLeads`.
- Категория уходит в `queryKey` и в `adminListLeads`.
- Селектор источника остаётся, подписи через `sourceLabel`.

### Карточка паломничества (визуальная иерархия)

```text
┌────────────────────────────────────────────┐
│ ▌ ПАЛОМНИЧЕСТВО: ИЕРУСАЛИМ      [ЗАЯВКА]   │  крупно, terracotta
│   Анна Иванова          · сегодня, 14:32   │  имя меньше
│   +373 60 123 456                          │
│   anna@example.com                         │
│   «Здравствуйте, хотим поехать…»           │
├────────────────────────────────────────────┤
│  Позвонить · Viber · Email                 │
└────────────────────────────────────────────┘
```

Стили (только семантические токены):
- Контейнер: `border border-accent/40 border-l-4 border-l-accent bg-accent/[0.04]`.
- Бейдж «ЗАЯВКА» (верх-право): `text-[10px] tracking-[0.18em] uppercase font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-sm`.
- Главная строка (направление): `font-serif text-xl md:text-2xl text-accent font-medium`, выше имени.
- Имя: `text-sm text-foreground/80`.
- Индикатор непрочитанного: `bg-accent` для pilgrimage, `bg-gold` для остальных.

### Карточки `priest` / `other`

Текущая стилистика без изменений (gold-акцент, имя крупно). Один компонент `LeadCard` с веткой по `leadCategory`.

## 4. Детальная — `src/routes/_admin/admin.leads.$id.tsx`

Для `pilgrimage`:
- Бейдж сверху «ЗАЯВКА · Паломничество» (terracotta).
- H1 = «Паломничество: Иерусалим» (`text-accent`), имя клиента — подзаголовок ниже.
- Phone/email карточки: `border-l-accent`, hover `bg-accent/5` вместо gold.

Остальные категории — без изменений.

## 5. Сайдбар-бейдж

`adminCountUnreadLeads` теперь возвращает объект. В сайдбаре используем `total`; опционально маленькая терракотовая точка, если `pilgrimage > 0`. Если перегружено — оставляем только total, вкладки сами подсветят новое.

## Технические детали

- Цвет — существующий `--accent` (≈ #a04826, терракота проекта). Новых CSS-переменных нет.
- Палитра приглушённая: фон `accent/4-5%`, рамка `accent/40`, бейдж `accent/10`. Без кричащих заливок.
- `lucide-react` — уже подключён; для бейджа «ЗАЯВКА» иконка не нужна.
- Все маппинги в `leads-shared.ts`; компоненты импортируют, не дублируют.

## Файлы под правку

- `src/lib/leads-shared.ts`
- `src/lib/admin.functions.ts`
- `src/routes/_admin/admin.leads.index.tsx`
- `src/routes/_admin/admin.leads.$id.tsx`
- Сайдбар admin-layout (точка-привязки `adminCountUnreadLeads`) — найду в `src/routes/_admin.tsx`.

## Что НЕ меняем

- Таблицы/колонки БД, миграции.
- Публичные формы и страницы.
- Логику `is_read`, удаление, mark-all.
- Дизайн-токены и шрифты.

Жду подтверждения — реализую одним заходом.
