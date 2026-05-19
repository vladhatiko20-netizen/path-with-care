
## Где будут храниться изображения

Сейчас в проекте уже два места:

1. **`src/assets/`** — статичные фото секций (Hero, «О нас», иконы, священник). Хранятся в коде, идут на CDN Lovable вместе с сайтом. Меняются через чат со мной.
2. **`cover_image` в базе** (таблицы `blog_posts`, `pilgrimages`) — сейчас это просто текстовое поле, куда вписывается ключ или внешний URL. Настоящего файлового хранилища пока нет.

Цель: оставить статичные секции как есть, а для блога и паломничеств подключить настоящую загрузку файлов кнопкой «Загрузить» в админке.

## Что добавим

### 1. Файловое хранилище (Storage Bucket)
Создам в Lovable Cloud публичный bucket `public-images` (миграцией). Файлы физически лежат в облачном S3-совместимом хранилище Lovable Cloud. В базе сохраняется только публичный URL вида `https://ozxfhnlpumemkkgzctir.supabase.co/storage/v1/object/public/public-images/blog/abc.jpg`.

RLS-политики:
- Чтение — всем (публичный bucket, чтобы картинки открывались на сайте).
- Загрузка/удаление — только админам (роль `admin` в `user_roles`).

### 2. Компонент загрузки `ImageUpload`
Новый компонент `src/components/admin/ImageUpload.tsx`:
- Кнопка «Загрузить файл» + превью текущего изображения.
- При выборе файла — загрузка прямо в bucket через `supabase.storage.from('public-images').upload(...)`.
- Возвращает публичный URL и пишет его в `cover_image`.
- Поддержка drag-and-drop, валидация типа (jpg/png/webp) и размера (до 5 МБ).
- Кнопка «Удалить» — очищает поле (старый файл остаётся в bucket; чистка не обязательна).

### 3. Интеграция в админские формы
- `BlogPostForm.tsx` — заменить текстовый input `cover_image` на `<ImageUpload>`.
- `PilgrimageForm.tsx` — то же самое.
- Также добавить `ImageUpload` в `RichEditor` для вставки картинок прямо в текст статьи (опционально, скажу — включать или нет).

### 4. Отображение на сайте
В `src/lib/blog-images.ts` функция `resolveBlogImage` уже умеет различать ключ-из-assets и полный URL (`if (key.startsWith("http"))`). Загруженные через Storage URL начинаются с `https://...` — будут открываться без изменений. То же для `pilgrimages.cover_image`.

## Что НЕ меняем
- Статичные секции главной (Hero, «О нас», «Иконы», «Священник», «Истории паломников») — остаются на `src/assets/`, обновляются через чат.
- Существующие записи в БД и логика рендера.
- Дизайн админки — только заменяем одно поле на компонент загрузки.

## Технические детали

```text
Миграция:
  - INSERT INTO storage.buckets ('public-images', public=true)
  - Policy: SELECT для всех (bucket_id = 'public-images')
  - Policy: INSERT/UPDATE/DELETE только для has_role(auth.uid(), 'admin')

Новые файлы:
  - src/components/admin/ImageUpload.tsx

Изменённые файлы:
  - src/components/admin/BlogPostForm.tsx (заменить input на ImageUpload)
  - src/components/admin/PilgrimageForm.tsx (то же)
```

## Что нужно подтвердить

1. Имя bucket'а `public-images` подходит, или предпочитаете другое (`media`, `uploads`)?
2. Включать ли загрузку картинок прямо в тело статьи блога (внутри `RichEditor`), или пока только обложки?
3. Лимит размера файла — 5 МБ ок, или нужно больше?
