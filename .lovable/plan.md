## Задача

Исправить две проблемы в пилюле статуса в `src/routes/_admin/admin.destinations.index.tsx`:

1. Фон пилюли не обновляется сразу после оптимистичного апдейта (приходится перезагружать страницу).
2. Анимация точки (`animate-pulse`) слишком медленная и слабая — почти незаметна.

## Причина бага с фоном

Сейчас базовые классы фона/текста/границы корректно завязаны на `d.is_published`, но к ним добавлены hover-классы `[@media(hover:hover)]:hover:bg-rose-100 …`, которые меняют пилюлю на «противоположный» цвет при наведении. На мобильных устройствах после тапа браузер удерживает `:hover` состояние до следующего тапа в другом месте — и хотя медиазапрос `(hover: hover)` должен это отсекать, ряд мобильных Chromium/WebView всё равно отдают `hover: hover` и состояние «залипает». Визуально это выглядит как «фон не обновился».

Решение — убрать hover-смену цвета фона/текста/границы полностью. Фон, текст и граница рисуются строго из `d.is_published`. Для desktop-аффорданса оставляем только лёгкий визуальный отклик: чуть темнее фон того же оттенка (`hover:bg-green-200` / `hover:bg-muted/70`) — без смены семантики цвета.

## Что меняем (только в `admin.destinations.index.tsx`)

### 1. Классы кнопки-пилюли

Убрать классы вида `[@media(hover:hover)]:hover:bg-rose-100 …` и `[@media(hover:hover)]:hover:bg-green-100 …`, заменив их на нейтральный hover того же оттенка:

```tsx
d.is_published
  ? "bg-green-100 text-green-800 border-green-200 [@media(hover:hover)]:hover:bg-green-200"
  : "bg-muted text-muted-foreground border-border [@media(hover:hover)]:hover:bg-muted/70"
```

Текст внутри (`Опубликовано` / `Скрыто`) и цвет точки уже строго из `d.is_published` — это не трогаем. `title` (тултип) с подсказкой «Нажмите, чтобы скрыть/опубликовать» остаётся как desktop-аффорданс.

### 2. Кастомная анимация точки

Заменить `animate-pulse` на собственные keyframes. Добавить один раз inline `<style>` внутри компонента (рядом с `return`) с правилом:

```css
@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.15; transform: scale(0.85); }
}
.pulse-dot { animation: pulse-dot 1s ease-in-out infinite; }
```

На span точки заменить `animate-pulse` на `pulse-dot`:

```tsx
<span
  aria-hidden="true"
  className={cn(
    "w-2.5 h-2.5 rounded-full pulse-dot",
    d.is_published ? "bg-green-500" : "bg-rose-500",
  )}
/>
```

## Что не трогаем

- Серверные функции, мутацию, query-логику, оптимистичный апдейт.
- Размер точки, размер пилюли, layout таблицы.
- Любые другие места файла.
