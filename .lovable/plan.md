## Моё мнение

Полностью согласен с вашим анализом. Отдельный блок «Задать вопрос голосом» на странице направления действительно лишний:

- это де-факто третья форма на одной странице — визуальный шум и размывание основного целевого действия («Оставить заявку»);
- ценность сохранённого аудио в админке невелика: администратор всё равно читает транскрипцию, а прослушивание занимает время;
- голосовой ввод сам по себе как «фишка» сохраняется — он просто переезжает внутрь уже существующего поля «Сообщение» в заявке.

С точки зрения посетителя — меньше форм, понятнее путь. С точки зрения администратора — все заявки в одном формате, без аудиоплеера. С точки зрения владельца — экономия места в хранилище и проще модерация.

## Что меняем

### 1. Страница направления — убираем отдельный голосовой блок
- Удаляем секцию `<DestinationVoiceQuestion />` со страницы (`DestinationSlugPage.tsx`, строка 676) и сам файл `DestinationVoiceQuestion.tsx`.
- В существующей форме «Вариант 1: Оставить заявку» добавляем микрофон **внутри поля «Сообщение»** — кнопка в правом нижнем углу textarea (absolute-позиционирование, не ломает обводку поля). Транскрипция дописывается в `form.message`, текст остаётся редактируемым.
- Аудио на этой форме **не сохраняем** (`saveAudio={false}`). Лид по-прежнему создаётся через обычный `createLead` с `source: "destination:<slug>"` — поля `audio_url` / `transcribed_text` не заполняются.

### 2. Контакты (`ContactsPage.tsx`) — переносим микрофон внутрь поля
- Сейчас микрофон стоит слева от textarea (`flex items-start gap-3`). Переносим его внутрь поля (absolute в правом нижнем углу), как на странице направления. Логика без изменений.

### 3. Диалог со священником (`WithPriestPage.tsx`) — оставляем голос, но дорабатываем
- Микрофон тоже переезжает внутрь поля «Ваш вопрос» (правый нижний угол).
- Добавляем поле **«Телефон»** между email и вопросом (необязательное, та же валидация и стиль, что в форме контактов / заявки направления — `maxLength={30}`, regex `^[+\d\s()\-]*$`).
- Заменяем серый блок «Спасибо, ваш вопрос отправлен» на тот же зелёный success-блок с галочкой, который мы делали для формы заявки (та же визуальная схема: иконка `CheckCircle2`, фон `bg-accent/10` или эквивалент, рамка золотистая) — чтобы пользователь явно видел успех. `toast.success` остаётся.
- В `createLead` начинаем передавать `phone`.

### 4. Админка (`admin.leads.$id.tsx`) — упрощаем
- Убираем аудиоплеер и маркер «голосовой источник» из карточки лида.
- Транскрипция остаётся как обычный `message` (она и так туда пишется через `createVoiceLead` → но эта функция больше не вызывается с фронта, и `transcribed_text` для новых заявок будет пустым; старые записи продолжают отображаться через поле `message`, дубликата не будет).
- Серверная функция `getVoiceQuestionAudioUrl` удаляется как неиспользуемая.

### 5. Бэкенд — что удаляем, что оставляем
**Оставляем** (нужно для микрофона в формах):
- `transcribeAudio` — но всегда вызывается с `save_audio=false`. Загрузку в bucket из этой функции удаляем (мёртвый код).
- `getVoiceCapability`, `useVoiceCapability`, `VoiceInput.tsx`.
- Таблицу `voice_rate_limits` — нужна для троттлинга распознавания.
- Флаг `VOICE_FEATURES_ENABLED`.

**Удаляем**:
- `DestinationVoiceQuestion.tsx`, `createVoiceLead`, `getVoiceQuestionAudioUrl`.
- Bucket `voice-questions` (удалим миграцией: `delete from storage.objects where bucket_id='voice-questions'` затем `delete from storage.buckets`).
- Колонки `leads.audio_url`, `leads.transcribed_text`, `leads.source_lang`, `leads.destination_slug` — `DROP COLUMN` миграцией. Эти поля никем не читаются после изменений (источник направления и так в `source = "destination:<slug>"`).
- Флаг `VOICE_SAVE_AUDIO_ENABLED` и параметры `saveAudio` / `destinationSlug` из `VoiceInput`.

## Технические детали

Файлы, которые меняются:
- `src/page-views/DestinationSlugPage.tsx` — удалить импорт и рендер `DestinationVoiceQuestion`; в форме заявки обернуть textarea сообщения в `relative` контейнер и положить внутрь `<VoiceInput>` с `absolute bottom-2 right-2`.
- `src/page-views/ContactsPage.tsx` — то же позиционирование микрофона внутри textarea.
- `src/page-views/WithPriestPage.tsx` — добавить поле `phone` в state и форму, переместить микрофон внутрь textarea, заменить серый success-блок на зелёный.
- `src/routes/_admin/admin.leads.$id.tsx` — убрать секцию аудио и «voice origin» маркер.
- `src/lib/voice.functions.ts` — оставить только `transcribeAudio` (без save-audio ветки) и `getVoiceCapability`; удалить `createVoiceLead`, `getVoiceQuestionAudioUrl`.
- `src/components/voice/VoiceInput.tsx` — упростить: убрать `saveAudio`, `destinationSlug`, `effectiveSaveAudio`, `audioPath` из колбэка.
- Удалить файлы: `src/components/voice/DestinationVoiceQuestion.tsx`.
- `.env` — убрать `VOICE_SAVE_AUDIO_ENABLED`.

Миграция БД (одна):
- `DROP` колонок `audio_url`, `transcribed_text`, `source_lang`, `destination_slug` у `public.leads`.
- Очистка и удаление bucket `voice-questions` вместе с его storage-политиками.

Таблица `voice_rate_limits` сохраняется — продолжает защищать `transcribeAudio` от злоупотреблений.

## Что НЕ меняется
- Голосовой ввод в формах работает по-прежнему: запись → транскрипция → текст в поле, который можно редактировать перед отправкой.
- Все обычные текстовые поля и кнопки отправки работают как раньше.
- Тексты, переводы, дизайн остального сайта — без изменений.