# План: визуальные улучшения страницы /destinations/bari

Все правки только в `src/routes/destinations.bari.tsx`. Без логики, БД, роутинга. Иконки — `lucide-react` (уже используется в проекте). Цвета — только существующие токены (`text-accent`, `text-gold`, `text-foreground`, `text-muted-foreground`, `bg-secondary`, `bg-card`, `bg-accent/5`).

## 1. Breadcrumbs (строка 164)

Класс `text-[15px]` → `text-[15px] md:text-base` (15px моб., 16px десктоп). Остальное без изменений.

## 2. Info bar (строки 196–216)

Импорт: добавить `Clock, Users, Euro, Church` из `lucide-react`.

В каждом из 4 блоков:
- Обернуть в `flex flex-col items-center gap-1`.
- Перед label добавить иконку 22px цвета `text-gold`.
- Label: `overline` → `overline text-[11px]`.
- Значение: `text-[17px]` → `text-[18px] md:text-[20px]`.

## 3. «Что включено / не включено» (строки 278–311)

Импорт: `CheckCircle2, Minus`.

- Заголовки оставить.
- `ul` className: `space-y-2 text-[17px]` → `space-y-3 text-[16px] md:text-[17px]`.
- «Включено» (стр. 293): `<span className="text-gold">✦</span>` → `<CheckCircle2 className="w-5 h-5 text-olive shrink-0 mt-0.5" />` (olive — наш существующий зелёный токен).
- «Не включено» (стр. 306): `<span className="text-foreground/40">·</span>` → `<Minus className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />`.
- `li` className: `flex gap-2` → `flex gap-3 items-start`.

## 4. «Программа по дням» (строки 256–276)

Использую вариант с нумерованным кружком в accent (надёжнее, чем глиф креста).

- Перед `c.t` в `AccordionTrigger` рендерить:
  ```
  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent text-primary-foreground text-sm font-serif shrink-0 mr-3">{i+1}</span>
  ```
- `AccordionTrigger` className: `text-[17px] md:text-lg` → `text-[17px] md:text-[18px] text-left` + добавить wrapper `<div className="flex items-center">` вокруг кружка и текста.
- `AccordionContent` className: `text-[17px]` → `text-[16px] md:text-[17px]` + `pl-11` чтобы выровнять с текстом (под кружком).
- Стрелка accordion: трогать осторожно — компонент в `src/components/ui/accordion.tsx`. Не меняем глобально, добавляем `[&>svg]:w-5 [&>svg]:h-5 [&>svg]:text-accent` прямо на `AccordionTrigger`.

## 5. «О поездке» (строки 218–227)

- Section className: `max-w-3xl mx-auto px-6 py-12 md:py-16 font-serif`.
- Параграф (стр. 221): добавить `border-l-4 border-accent/60 pl-5 md:pl-6 py-2`, размер `text-[17px] md:text-[18px]`.
- Оставить заголовок выше параграфа без border.

## 6. «Ближайшие даты» (строки 313–352)

Импорт: `Calendar, Euro`.

- Карточка (стр. 329): `px-5 py-4` → `px-6 py-5`, gap-3 → gap-4.
- Название (стр. 332): `text-[17px]` → `text-[18px]`.
- Даты (стр. 333): `text-sm` → `text-[16px]`, перед текстом дат добавить `<Calendar className="w-4 h-4 text-gold inline mr-2 -mt-0.5" />`.
- Цена (стр. 339): `text-[17px]` → `text-[18px] font-medium`, перед суммой `<Euro className="w-4 h-4 inline -mt-0.5" />` (заменяя символ `€`).
- Кнопка (стр. 340–346): добавить классы `w-full sm:w-auto` для full-width на мобильном, размер `text-[15px]` → `text-[16px]`.
- Блок справа: `flex items-center gap-4` → `flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full sm:w-auto`.

## 7. FAQ (строки 354–410)

Импорт: `HelpCircle` (надёжнее православного креста — нет глифа в lucide).

- `AccordionItem` className: добавить `py-1` для большего вертикального padding.
- `AccordionTrigger` (стр. 403): `text-[17px] md:text-lg` → `text-[17px] md:text-[18px] text-left`, добавить иконку перед `c.q`:
  ```
  <HelpCircle className="w-5 h-5 text-accent shrink-0 mr-3" />
  ```
  через обёртку `<span className="flex items-start gap-0">`.
- `AccordionContent` (стр. 404): `text-[17px]` → `text-[16px] md:text-[17px]`.

## 8. Форма «Оставить заявку» (строки 466–490)

Импорт: `User, Phone, Mail, MessageSquare, Send`.

Перевести inputs в обёртки с иконкой-префиксом:
```
<div className="relative">
  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
  <input ... className="w-full pl-11 pr-4 py-3 ... text-[16px]" />
</div>
```

- Имя → `User`
- Телефон → `Phone`
- Email → `Mail`
- Сообщение (textarea) → `MessageSquare` (icon в `top-3 left-3`, без `-translate-y-1/2`), `pl-11`.
- Все размеры шрифта: `text-[17px]` → `text-[16px]` (уже 17, но 16 безопаснее для iOS — фактически оставить 17 тоже подходит, ставим `text-base` = 16px).
- Кнопка submit (стр. 483): `text-[15px]` → `text-[17px]`, добавить `w-full sm:w-auto`, иконку `<Send className="w-4 h-4 inline ml-2" />` после текста.

## 9. «Связаться напрямую» (строки 415–423)

Импорт: `Phone, Mail`.

- `p` элементы (стр. 418–422): `text-[17px]` → `text-[16px] md:text-[17px]`, добавить `mb-3` (увеличить spacing).
- Перед каждой ссылкой добавить иконку 18px цвета `text-accent`:
  - Анна, Наталья → `<Phone className="w-[18px] h-[18px] inline mr-2 -mt-0.5" />`
  - Email → `<Mail className="w-[18px] h-[18px] inline mr-2 -mt-0.5" />`
- Wrapper выравнивания: оставить `text-center`, иконки inline.

## Сводный список импортов lucide-react (один блок наверху файла)

```ts
import {
  Clock, Users, Euro, Church,
  CheckCircle2, Minus,
  Calendar, HelpCircle,
  User, Phone, Mail, MessageSquare, Send,
} from "lucide-react";
```

## Что НЕ трогаем

- Логику `selectDate`, `LeadForm`, prefill.
- Серверные функции, БД, миграции, роутинг.
- `accordion.tsx` и другие shared-компоненты.
- Hero, секцию «Главные святыни», метатеги, JSON-LD.
- Десктоп/мобайл — все правки универсальные, не зависят от breakpoint'ов сверх указанных размеров.
