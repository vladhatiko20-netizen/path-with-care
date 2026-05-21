## Причина бага

В TanStack Router файл `destinations.tsx` рядом с `destinations.bari.tsx` автоматически становится **layout-маршрутом** для всех `destinations.*` дочерних роутов. Это видно в `routeTree.gen.ts`:

```
'/destinations': typeof DestinationsRouteWithChildren   // ← with children!
'/destinations/bari': typeof DestinationsBariRoute
```

Поскольку `destinations.tsx` рендерит контент страницы списка, а не `<Outlet />`, при переходе на `/destinations/bari` дочерний маршрут матчится, но рендериться ему негде — на экране остаётся родитель (страница «Куда мы ездим»).

## Решение

Переименовать `src/routes/destinations.tsx` → `src/routes/destinations.index.tsx`.

Тогда оба файла станут siblings под общим (виртуальным) сегментом `/destinations`:
- `destinations.index.tsx` → `/destinations` (список)
- `destinations.bari.tsx` → `/destinations/bari` (страница Бари)

Никакого layout-родителя не возникает, `<Outlet />` не нужен, конфликт исчезает.

## Шаги

1. **Переименовать файл**: `src/routes/destinations.tsx` → `src/routes/destinations.index.tsx`. Содержимое не меняем (только сам файл переезжает).
2. `src/routeTree.gen.ts` перегенерируется автоматически Vite-плагином TanStack Router.
3. Проверка в браузере:
   - `/destinations` → список из 8 направлений (как сейчас).
   - Клик по карточке «Бари» → переход на `/destinations/bari` и отображение полной страницы Бари.
   - Прямой переход и перезагрузка `/destinations/bari` работают.

## Что НЕ трогаем

- `destinations.bari.tsx` — корректен, не меняем.
- `destinations.tsx` (после переименования в `destinations.index.tsx`) — содержимое и логика не меняются.
- Ссылку на карточке Бари в списке (уже ведёт на `/destinations/bari`).
- Никаких других маршрутов и компонентов.

## Альтернатива (отвергнута)

Можно было бы оставить `destinations.tsx` как layout и добавить в него `<Outlet />` + вынести список в `destinations.index.tsx`. Но это лишний промежуточный layout без реальной необходимости — у `/destinations/*` нет общего UI-обрамления, отличного от `PageShell`. Переименование проще и чище.
