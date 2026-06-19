## Реализация (вариант A)

Файл: `src/page-views/IndexPage.tsx`.

1. **Импорты**:
   - Удалить `import catalogHeroImg from "@/assets/catalog-hero.jpg";`
   - Добавить `import { getCatalogPageData } from "@/lib/catalog.functions";`

2. **Query options** (рядом с другими `queryOptions` в файле):
   ```ts
   export const catalogPageQueryOptions = queryOptions({
     queryKey: ["catalog-page"],
     queryFn: () => getCatalogPageData(),
   });
   ```

3. **Внутри `Component()`** добавить:
   ```ts
   const { data: catalogPageData } = useQuery(catalogPageQueryOptions);
   const catalogHeroUrl = catalogPageData?.page?.hero_image_url ?? null;
   ```

4. **JSX блока «ICONS & RELICS»** (строки ~385–425):
   - Мобильный `<div className="aspect-[16/7] ...">` с `<img src={catalogHeroImg} />` обернуть в `{catalogHeroUrl && ( ... )}`, внутри `src={catalogHeroUrl}`.
   - Десктопный `<div className="hidden md:block">` с правой картинкой так же обернуть в `{catalogHeroUrl && ( ... )}`, внутри `src={catalogHeroUrl}`.
   - Если `catalogHeroUrl` пустой, оба блока не рендерятся — текстовая колонка остаётся как есть. Сетка `md:grid-cols-2` визуально станет одной колонкой, что приемлемо как фолбэк до загрузки фото из админки.

5. **Тексты промо-блока на главной не трогаются** — они остаются в коде как сейчас.

Никаких других файлов и логики не меняем. Подтверди — перейду в build mode и применю.
