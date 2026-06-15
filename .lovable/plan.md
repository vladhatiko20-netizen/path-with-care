# План правок

## 1. `src/page-views/AboutPage.tsx`

**Hero без fallback:**
- Удалить `import annaHero from "@/assets/anna-hero.jpg"`.
- Заменить `const heroPhoto = page?.hero_photo_url || annaHero` на `const heroPhoto = page?.hero_photo_url || null`.
- Обернуть `<img>` в hero в условие `{heroPhoto && (...)}`. Если фото нет — `<div>` остаётся пустым (нейтральный фон уже задаёт сетка/card справа), без захардкоженной картинки и без мелькания.

**Удалить декоративные разделители ☦:**
- Удалить три блока `<div className="text-center text-2xl text-gold ..." aria-hidden>☦</div>` (строки 78, 97, 152). Полностью, ничем не заменять. Логотип в шапке (Header.tsx) не трогаем.

**Команда — скрывать без фото или без публикации:**
- В `team.map` рендерить карточку только если `m.photo_url && m.is_published`. Иначе `return null`.
- В `clergyList.map` рендерить только если `c.photo_url` (список уже отфильтрован по `is_published` на сервере).
- Условие показа всей секции «Команда» учитывает отфильтрованные списки: вычислить `visibleTeam` и `visibleClergy` заранее и оборачивать секцию в `{(visibleTeam.length > 0 || visibleClergy.length > 0) && (...)}`, чтобы не получить пустой заголовок.

## 2. `src/routes/_admin/admin.index.tsx`

Добавить две карточки в той же сетке `grid sm:grid-cols-2 gap-4`, тем же стилем:

- **О нас** → `/admin/about`, иконка `Info` (lucide-react), описание: «Hero, галерея и команда страницы “О нас”.»
- **Священники** → `/admin/clergy`, иконка `Users`, описание: «Профили священников, сопровождающих поездки.»

Добавить `Info, Users` в импорт из `lucide-react`.

## Область
Только `src/page-views/AboutPage.tsx` и `src/routes/_admin/admin.index.tsx`. Другие файлы не трогаем.
