Все правки — только в `src/routes/destinations.bari.tsx`. Мобильный вид не меняется.

## 1. Иерархия заголовков (desktop)

- «Принять участие в паломничестве» (стр. 636): `md:text-4xl` → `md:text-5xl`. Остаётся главным.
- «Вариант 1: Оставить заявку» (стр. 643, `hidden md:block`): `md:text-4xl` → `md:text-2xl`, добавить `text-muted-foreground`, `mb-8` → `mb-6`.
- «Вариант 2: Связаться напрямую» (стр. 696–697, desktop-ветка `ContactsBlock`): то же — `md:text-2xl text-muted-foreground mb-6`.

Мобильный `<h2 class="md:hidden ...">` (стр. 642) и мобильная ветка `ContactsBlock` не трогаются.

## 2. Gold-разделитель между FAQ и блоком «Принять участие»

В `<section id="lead">` (стр. 634) к существующим классам `bg-secondary py-12 md:py-16 scroll-mt-24` добавить `border-t border-gold/30`. Тонкая золотая линия сверху, без изменения фона и spacing.

## 3. Семантика Viber-ссылки + ручная проверка

Текущая логика (desktop): строка — `<div role="link" onClick=tel:...>`, внутри `<a href="viber://...">` с `e.stopPropagation()`. Логически направления разные, но семантика хромает (правый клик / скринридеры).

Переписать внешний контейнер строки контакта на нативный `<a href="tel:${p.tel}">` с теми же визуальными классами (`flex items-center w-full py-3 pl-4 pr-4 bg-card rounded-sm border border-border/40 border-l-2 border-l-gold hover:bg-gold/5 transition-colors text-[18px]`). Вложенный Viber-`<a>` остаётся, `onClick={(e) => e.stopPropagation()}` сохраняется — браузеры корректно обрабатывают вложенные `<a>` в плане кликов, но валидатор HTML ругается. Чтобы и валидно, и просто:

- Внешний `<a href="tel:...">` без вложенных интерактивов внутри.
- Viber выносится как **соседний** элемент сразу после `</a>`, обёрнутый в общий flex-контейнер. То есть структура:
  ```
  <div className="flex items-center bg-card rounded-sm border ... border-l-gold">
    <a href="tel:..." className="flex items-center flex-1 py-3 pl-4 pr-2 hover:bg-gold/5">
      [icon] [name] · [number]
    </a>
    <a href="viber://..." className="ml-auto mr-3 inline-flex items-center px-2.5 py-1 rounded-sm">
      [Viber pill]
    </a>
  </div>
  ```
- Никаких `role="link"`, `tabIndex`, `onClick`, `onKeyDown`, `stopPropagation` — всё нативное.
- Hover применяется только к телефонной части, чтобы Viber не «загорался» при ховере по номеру.

Email-ссылка (стр. 727–735) уже корректный `<a>`, оставляем как есть, только убедиться что классы соответствуют новой обёрточной структуре (там нет Viber, можно оставить одинарный `<a>`).

После правки прошу проверить руками на телефоне: тап по имени/номеру → набор номера; тап по пилюле Viber → открытие Viber.

## Что НЕ трогаем

Мобильная вёрстка, форма, серверная логика, остальные секции страницы, `useLang`, маршрутизация.
