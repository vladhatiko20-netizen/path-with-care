## Контекст

Галерея направлений (`src/page-views/DestinationSlugPage.tsx`) — это **не отдельный компонент**, а inline-разметка, использующая библиотеку `yet-another-react-lightbox` (плагины Thumbnails, Captions, Zoom). Та же библиотека уже подключена в проекте.

Паттерн:
- **Mobile (`md:hidden`)** — горизонтальная прокрутка, плитки `w-[45vw] aspect-square`, snap-scroll, клик → лайтбокс.
- **Desktop (`hidden md:block`)** — сетка `grid-cols-4 gap-2`, квадратные превью, hover-зум, клик → лайтбокс.
- Один общий `<Lightbox>` со слайдами `{src, alt, description}`.

Поскольку это inline-разметка (≈40 строк), переиспользовать = либо вынести в новый общий компонент, либо скопировать тот же паттерн в AboutPage. Чтобы не трогать `DestinationSlugPage` и не плодить регрессий, делаю **вариант 2: тот же код в AboutPage**, с теми же классами и той же библиотекой — визуально и функционально идентично.

## Изменения в `src/page-views/AboutPage.tsx`

1. **Импорты** — добавить:
   ```ts
   import { useState } from "react";
   import Lightbox from "yet-another-react-lightbox";
   import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
   import "yet-another-react-lightbox/plugins/thumbnails.css";
   import Captions from "yet-another-react-lightbox/plugins/captions";
   import "yet-another-react-lightbox/plugins/captions.css";
   import Zoom from "yet-another-react-lightbox/plugins/zoom";
   ```

2. **State и слайды** в `Component()`:
   ```ts
   const [lightbox, setLightbox] = useState({ open: false, index: 0 });
   const galleryPhotos = gallery.map((g) => ({
     src: g.image_url,
     alt: (lang === "ru" ? g.caption_ru : g.caption_ro) ?? "",
     description: (lang === "ru" ? g.caption_ru : g.caption_ro) ?? "",
   }));
   const openLightbox = (i: number) => setLightbox({ open: true, index: i });
   ```

3. **Заменить блок GALLERY** (строки 110–139). Заголовок — `«Моя фотогалерея» / «Galeria mea foto»`, overline `«Из поездок»` убрать.
   - Mobile: горизонтальный strip с теми же классами, что в DestinationSlugPage (`flex gap-3 overflow-x-auto px-6 snap-x snap-mandatory`, плитки `w-[45vw] aspect-square`).
   - Desktop: `grid grid-cols-4 gap-2 max-w-[70%] mx-auto` с теми же hover-классами и `cursor-zoom-in`.
   - В конце секции — `<Lightbox open=... slides={galleryPhotos} plugins={[Thumbnails, Captions, Zoom]} />`.

4. **Mobile: уменьшить отступ между фото и заголовком.**
   В правой колонке hero (строка 67):
   - `py-10 md:py-8` → `pt-4 pb-10 md:pt-8 md:pb-8`
   - `mb-5` у H1 (строка 69) оставить как есть на десктопе, но через `mb-3 md:mb-5`.
   Это сокращает воздух между низом фото и заголовком только на мобайле, десктоп не меняется.

## Файлы

- `src/page-views/AboutPage.tsx` — единственный изменяемый файл.
- `DestinationSlugPage.tsx`, админ-менеджеры галереи, схема БД — не трогаем.

## Уточнение по вопросу

Готовый общий компонент `<DestinationGallery>` в проекте отсутствует — у направлений это inline JSX + библиотека `yet-another-react-lightbox`. Переиспользую ту же библиотеку и ту же разметку 1:1, без выноса в отдельный компонент (вынос потребовал бы рефакторить DestinationSlugPage, что выходит за рамки задачи). Если хотите — могу следующим шагом извлечь общий компонент `PhotoGallery` и подключить его в обоих местах.
