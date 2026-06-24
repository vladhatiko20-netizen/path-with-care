# Plan – Pilgrimage leads + status + Viber + SEO Event (approved)

## DB (одной миграцией)
- `leads`: добавить `people_count integer` (nullable, CHECK 1..100) и `pilgrimage_id uuid` (nullable, FK pilgrimages ON DELETE SET NULL) + индекс.
- `pilgrimages`: добавить `status text` (nullable, CHECK in ('recruiting','full','completed')).
- RLS не трогаем – существующие политики совместимы.

## Лимит people_count (одно значение 1..100 везде)
- SQL CHECK: 1..100
- zod: `.int().min(1).max(100)`
- HTML input: `min=1 max=100`

## Файлы
- `src/lib/leads.functions.ts` – zod + insert получают `people_count`, `pilgrimage_id`.
- `src/lib/admin.functions.ts` – `pilgSchema.status`; `adminListLeads` select новых колонок; `adminGetLead` подтягивает связанную поездку.
- `src/lib/pilgrimages.functions.ts` – `status` в типе и select.
- `src/components/admin/PilgrimageForm.tsx` – `<select>` «Статус (необязательно)».
- `src/routes/_admin/admin.pilgrimages.$id.tsx` + `new.tsx` – пробрасывают `status`.
- `src/routes/_admin/admin.leads.$id.tsx` – «Поездка: … / даты» и «Человек: N».
- `src/routes/_admin/admin.leads.index.tsx` – «Человек: N» в карточке.
- `src/page-views/DestinationSlugPage.tsx`:
  - Поле «Сколько человек / Câte persoane» обязательное (между email и message), голосовой ввод не тронут.
  - При клике «Хочу поехать» пробрасывается `pilgrimage_id`; нижняя форма без даты → `pilgrimage_id = null` (никакого select-а в нижней форме).
  - Бейдж статуса на карточке поездки, только если `status != null`.
  - JSON-LD `Event` на каждую поездку (кроме `completed`), `full → availability SoldOut`, `eventStatus EventScheduled`.
  - Плавающая Viber-кнопка Ани (`+37368778676`), статичный текст «Здравствуйте! Интересует паломничество в {направление}{, даты X – Y}», без people_count. Скрытие при видимой форме через IntersectionObserver.
