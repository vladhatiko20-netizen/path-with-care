# Замена email-адреса на palomnik.moldova@gmail.com

## Что меняем

Везде, где встречается `pilgrimage@eldoradotur.md` — и в `href="mailto:..."`, и в видимом тексте, и в JSON-LD структурированных данных для SEO — заменяем на `palomnik.moldova@gmail.com`.

## Файлы и правки

1. **`src/components/site/Footer.tsx`** — блок контактов в подвале (mailto-ссылка + видимый текст).
2. **`src/routes/about.tsx`** — кнопка-ссылка "написать нам" в основном блоке и упоминание в нижнем контактном блоке (3 вхождения).
3. **`src/routes/contacts.tsx`** — JSON-LD schema.org (`email: "..."`, важно для SEO и Google) и видимая ссылка в блоке "Email".
4. **`src/routes/destinations.bari.tsx`** — JSON-LD schema.org для направления Бари и две CTA-ссылки внизу страницы (mailto + видимый текст, 4 вхождения).

Итого: 12 текстовых вхождений в 5 файлах.

## Что НЕ трогаем

- Ссылки на сайт материнской компании `https://eldoradotur.md` в `Header.tsx` и `about.tsx` — это не email, а URL партнёрской организации (SRL Eldorado Tur), упомянутой в подвале. Если нужно убрать и их — скажите отдельно.
- Текст "Подразделение SRL Eldorado Tur" в `Footer.tsx` — это юридическая привязка, не email.

## Проверка после правки

Прогнать `grep` по `eldoradotur` и убедиться, что осталось только три ссылки на сайт (Header × 2, about × 1).
