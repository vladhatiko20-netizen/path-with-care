# План — 3 SEO-фикса

Сначала короткая оценка предложений, потом сам план.

## Оценка ваших предложений

**Fix 1 (JSON-LD TouristTrip + FAQPage)** — хорошо и стандартно. Один нюанс: тип `TouristTrip` существует, но Google официально rich-результаты по нему не показывает; пользы от него меньше, чем от `Product` + `Offer` (для цены) или `TouristAttraction`. Предлагаю **дать оба JSON-LD блока: TouristTrip (для семантики поездки) + Product с offers (для цены, это Google понимает напрямую)**. FAQPage — однозначно полезно, Google его поддерживает. Язык schema — `ru` (основной контент сайта).

**Fix 2 (canonical везде)** — правильно. Важный нюанс из проектных правил: canonical нельзя класть в `__root.tsx` (TanStack конкатенирует `links` без дедупликации — будут дубли). Поэтому добавляем только на листовые роуты. На `destinations/$slug` canonical уже есть. На страницах с языковым переключателем (ru/ro в одном URL) canonical всё равно один — это ок, hreflang отдельно сейчас не делаем.

**Fix 3 (динамический sitemap)** — правильно. Sitemap уже сделан server-route'ом, дополним его `listPublicDestinations()` и `listBlogPosts()`. Добавлю `lastmod` для блога (`published_at`), для направлений `lastmod` пропустим (в таблице нет `updated_at` в публичной функции — не будем плодить лишних запросов).

Итого: ваши три фикса в полном объёме применимы, единственная содержательная правка — добавить Product+offers рядом с TouristTrip, потому что именно его Google рендерит с ценой в выдаче.

---

## Что меняем

### 1. `src/routes/destinations.$slug.tsx`
В `head()` добавить `scripts: [...]` с двумя JSON-LD:

- **TouristTrip**: `name = title_ru`, `description = description_ru/seo_description_ru`, `image = cover_image`, `touristType`, `itinerary` → массив `{ "@type": "ListItem", position, name: day.title_ru, description: day.description_ru }` из `program`, `provider` → Organization (Паломник / SRL Eldorado Tur), `offers` → `{ "@type": "Offer", price: price_from, priceCurrency: "EUR", availability: "InStock", url }` если `price_from` задана.
- **Product** (опционально, но полезно для цены): name/description/image + offers (то же Offer). Это то, что Google реально показывает.
- **FAQPage**: `mainEntity` → массив `{ "@type": "Question", name: question_ru, acceptedAnswer: { "@type": "Answer", text: answer_ru } }` из `faq` (только если массив непуст).

Всё строим из уже загруженных в loader данных, новых запросов нет.

### 2. Canonical на публичных роутах
Добавить `links: [{ rel: "canonical", href: "https://path-with-care.lovable.app<path>" }]` в `head()` следующих файлов:

- `src/routes/index.tsx` → `/`
- `src/routes/about.tsx` → `/about`
- `src/routes/destinations.index.tsx` → `/destinations`
- `src/routes/catalog.tsx` → `/catalog`
- `src/routes/calendar.tsx` → `/calendar`
- `src/routes/with-priest.tsx` → `/with-priest`
- `src/routes/blog.tsx` → `/blog`
- `src/routes/blog_.$slug.tsx` → `/blog/<slug>`
- `src/routes/contacts.tsx` → `/contacts`
- `src/routes/public-offer.tsx` → `/public-offer`
- `src/routes/privacy.tsx` → `/privacy`
- `src/routes/orthodox-calendar.tsx` → `/orthodox-calendar`

На `__root.tsx` canonical **не** добавляем (важно — иначе будут дубли). На `destinations.$slug.tsx` уже есть, не трогаем. Админка/логин/sitemap/robots — пропускаем.

### 3. `src/routes/sitemap[.]xml.ts`
- Импортировать `listPublicDestinations` и `listBlogPosts`.
- В GET-обработчике выполнить оба запроса параллельно (`Promise.all`).
- К текущим 10 статическим записям добавить:
  - `/destinations/<slug>` для каждой опубликованной (priority `0.8`, changefreq `monthly`).
  - `/blog/<slug>` для каждого опубликованного поста (priority `0.6`, changefreq `monthly`, `lastmod` = `published_at`).
- Структура и кеширование (`max-age=3600`) сохраняются.

## Что НЕ трогаем
- Никаких изменений UI, стилей, бизнес-логики.
- `__root.tsx` не трогаем (canonical туда нельзя).
- Hreflang, миграции БД, админка — вне scope.
- `destinations.$slug.tsx` canonical уже корректный — оставляем.

Подтвердите план — и я переключусь в build mode и применю.