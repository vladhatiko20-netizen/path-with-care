# План: публичная страница /destinations/bari

## Уже выполнено в ходе планирования

- Создана таблица `leads` (имя, телефон, email, сообщение, источник, created_at) с RLS: INSERT идёт только через серверную функцию с `supabaseAdmin`, SELECT/UPDATE/DELETE доступны только админам через `has_role`.
- Сгенерированы изображения:
  - `src/assets/bari-crypt.jpg` — крипта с мраморной гробницей, паломники со свечами, без латинских статуй.
  - `src/assets/bari-interior.jpg` — православная икона свт. Николая, лампады, без католической атрибутики.

## Что осталось сделать (build-mode)

### 1. Server functions

**`src/lib/leads.functions.ts`** — `createLead({ name, phone, email, message, source })`. Zod-валидация (имя 1–100, телефон 5–30 + regex, email опционально, message ≤ 2000, source slug). Вставка через `supabaseAdmin`.

**`src/lib/destinations.functions.ts`** — `getDestinationBySlug({ slug })`. Через `supabaseAdmin`, фильтр `is_published = true`, проекция только публичных полей.

### 2. Страница `src/routes/destinations.bari.tsx`

Маршрут `/destinations/bari` (flat-routing). `loader` грузит параллельно:
- `getDestinationBySlug({ slug: 'bari' })`
- `listPilgrimages()` (уже есть)

`notFoundComponent` + `errorComponent` обязательны.

**Структура (двуязычная через `useLang().t()`):**

1. **Breadcrumbs** — Главная → Направления → Бари / Acasă → Destinații → Bari.
2. **Hero** — `dest-bari.jpg` (LCP, без `loading="lazy"`, с width/height), заголовок из `title_ru/title_ro`.
3. **Info-bar** — берётся из загруженной записи `destinations`: `duration_ru/duration_ro`, `group_size_ru/group_size_ro`, `price_from` (форматируется как «от €N»). «Со священником» — статичный текст (единственное исключение).
4. **«Что это за поездка»** — короткий вводный абзац (статичные строки RU/RO).
5. **Святыни** — три карточки с новыми изображениями (`bari-crypt.jpg`, `bari-interior.jpg`, + переиспользование `dest-bari.jpg`) и подписями RU/RO.
6. **Программа по дням** — Accordion (shadcn), статичные дни RU/RO.
7. **Что включено / не включено** — две колонки, статичные списки RU/RO.
8. **Ближайшие даты** — фильтр `listPilgrimages()` по slug-совпадению либо `destination_*.includes('Бари'/'Bari')`. Если дат нет — мягкое сообщение.
9. **FAQ** — Accordion, 5–7 пар Q/A на двух языках.
10. **Форма заявки** — поля имя, телефон, email, сообщение. На submit — `useServerFn(createLead)({ source: 'bari' })`. Клиентская Zod-валидация перед отправкой, toast/итог-блок после успеха, очистка формы.
11. **Контакты** — телефон + email (как на `/contacts`).

**Стили:** только токены (`bg-background`, `text-foreground`, `border-gold`, `text-accent`, `paper-texture`, `font-serif`). Mobile-first, body-текст ≥17px (`text-[17px]`/`text-lg`).

### 3. SEO

В `head()`:
- `title` / `description` / `og:title` / `og:description` — уникальные.
- `og:image` / `twitter:image` — `dest-bari.jpg`.
- `canonical` на этом leaf-роуте → `https://path-with-care.lovable.app/destinations/bari`.
- JSON-LD `TouristTrip` со schema.org (название, описание, изображение, провайдер «Паломник», offers с `price_from` EUR).
- `BreadcrumbList` JSON-LD.

### 4. Правка `src/routes/destinations.tsx`

Карточка с `slug === 'bari'` — заменить `<Link to="/contacts">` на `<Link to="/destinations/bari">`. Остальные карточки не трогать.

## Файлы

**Создаются:**
- `src/lib/leads.functions.ts`
- `src/lib/destinations.functions.ts`
- `src/routes/destinations.bari.tsx`

**Редактируются:**
- `src/routes/destinations.tsx` — одна ссылка.

`routeTree.gen.ts` обновляется автоматически.

## Out of scope

- Платежи онлайн.
- Список заявок в админке (отдельный промпт).
- Email-уведомления о новых заявках.
- Изменение остальных карточек на `/destinations`.
