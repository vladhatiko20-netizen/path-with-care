# Plan v2 (с правками)

Скоуп: `src/page-views/AboutPage.tsx`, `src/page-views/DestinationSlugPage.tsx`, `src/styles.css`, новый `src/components/site/LightboxCaption.tsx`. Мобайл (`<768px`) — байт-в-байт как сейчас.

## Правки относительно v1

1. **Брейкпоинт live, не заморожен.** Хук `useIsDesktop` использует `matchMedia('(min-width: 768px)')` с подпиской `addEventListener('change', …)` + слушатель `orientationchange`. При пересечении 768px (ресайз/поворот) `<Lightbox>` перерендеривается с другим набором плагинов и `render.slideFooter`. SSR-safe: до маунта возвращает `false`.
2. **Общий компонент** `src/components/site/LightboxCaption.tsx` — оба потребителя (About, Destinations) импортируют один хук. Изменения в `DestinationSlugPage.tsx` строго ограничены пропсами `<Lightbox>` — остальная галерея направления не трогается.
3. **Резерв высоты под подпись — 240px** (`max-height: calc(100vh - 240px)` на `.yarl__slide_image`). С запасом под 4–5 строк длинных подписей (Св. Екатерина и т.п.) + миниатюры + тулбар. Точную цифру вы подкрутите на проде.

## Реализация

### `LightboxCaption.tsx` (новый)

Экспортирует:
- `useLightboxCaptionProps()` → возвращает `{ className, render?, captions? }` для спреда на `<Lightbox>`. На десктопе: `render.slideFooter` рендерит `<DesktopSlideFooter>` с подписью под фото. На мобайле: возвращает текущие `captions={{ descriptionTextAlign: "center", showToggle: false }}` (overlay-плагин как сейчас).
- `useLightboxPlugins(all, Captions)` → на десктопе исключает плагин `Captions`, на мобайле возвращает полный список. Так overlay-подпись на десктопе вообще не рисуется и не конфликтует с нашим footer.

`DesktopSlideFooter` (внутри файла):
- При маунте `closest('.yarl__slide')` → `querySelector('img.yarl__slide_image')` (с rAF-ретраем пока картинка не появится).
- `ResizeObserver` на `<img>` + слушатели `resize`/`orientationchange` → пишет фактическую ширину в CSS-переменную `--lb-img-w` на корне footer-узла.
- Подпись (`<p>`) использует `max-width: var(--lb-img-w, min(90vw, 1100px))` — fallback на первый кадр до измерения.
- Тег `<p>` — `text-align: center; word-wrap: break-word; margin: 0`, цвет/шрифт как сейчас (наследуется от YARL).

### `styles.css`

Заменить текущий блок `@media (min-width: 768px) { .lb-caption-below … }` на:

```css
@media (min-width: 768px) {
  /* Освобождаем место под подпись и миниатюры */
  .lb-caption-below.lb-desktop .yarl__slide_image {
    max-height: calc(100vh - 240px) !important;
  }
  /* На десктопе overlay из Captions не рендерим вообще (плагин убран),
     но на всякий случай скрываем, если YARL что-то отрисует */
  .lb-caption-below.lb-desktop .yarl__slide_description { display: none !important; }

  /* Наш footer-блок, позиционируется в нижнем чёрном поле */
  .lb-desktop-caption {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 96px; /* над миниатюрами */
    display: flex;
    justify-content: center;
    padding: 0 16px;
    pointer-events: none;
    z-index: 1;
  }
  .lb-desktop-caption p {
    max-width: var(--lb-img-w, min(90vw, 1100px));
    margin: 0;
    color: #fff;
    font-size: 14px;
    line-height: 1.5;
    text-align: center;
    word-wrap: break-word;
    pointer-events: auto;
    background: transparent;
  }
}
```

Мобайл-правил нет → текущее поведение сохраняется один в один.

### `AboutPage.tsx` и `DestinationSlugPage.tsx`

Только пропсы `<Lightbox>`:

```tsx
const captionProps = useLightboxCaptionProps();
const plugins = useLightboxPlugins([Thumbnails, Captions, Zoom], Captions);
…
<Lightbox
  …existing props…
  plugins={plugins}
  {...captionProps}
/>
```

Удаляются явные `captions={…}` и `className="lb-caption-below"` (теперь они в `captionProps`). Остальные пропсы (`zoom`, `slides`, `open`, `index`, `close`) — без изменений.

## Безопасность

Перед патчем уже снят SQL-снэпшот `destinations` (для отката, если что). После Publish — ждать 1–3 минуты до прогрева, потом ваши проверки:

1. Десктоп, длинная подпись (Св. Екатерина на /about) — текст в ширине фото, без перекрытия.
2. Десктоп, портрет (Аня на /about) vs ландшафт (Бари) — ширина подписи разная, у каждой = ширине своего фото.
3. Десктоп, 2–3 разных направления — компонент общий, поведение идентичное.
4. Мобайл, обе галереи + поворот — поведение как было; пересечение 768px пере-инициализирует Lightbox с актуальным набором.

Готов выполнять — переключите в build mode.
