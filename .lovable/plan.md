## Что изменится

### 1. `src/routes/_admin.tsx` — бейдж в сайдбаре возле «Заявки»

Заменить текущий маленький бейдж (строки 101–108) на крупный пульсирующий круг со счётчиком — такой же, как на дашборде в карточке «Заявки».

- Условие показа: `item.badge && item.badge > 0` (как сейчас)
- Бейдж: `<span>` с классами `ml-auto inline-flex items-center justify-center min-w-8 h-8 px-2 rounded-full text-white text-sm font-semibold` и inline-стилем `animation: 'colorShift 2s ease-in-out infinite'`
- Внутри — число: `item.badge > 99 ? "99+" : item.badge`
- `aria-label` сохраняется
- `@keyframes colorShift { 0%,100% { background-color:#ef4444 } 50% { background-color:#10b981 } }` добавляется один раз через `<style>` в верхней части `SidebarContent` (а не в каждом пункте меню), чтобы избежать дубликатов

### 2. `src/routes/_admin/admin.leads.index.tsx` — индикатор возле заголовка «Заявки»

Рядом с `<h1>Заявки</h1>` (строка 75) добавить такой же пульсирующий круг — но **без счётчика внутри** (пустой), так как на странице самих заявок цифра дублирует контекст.

- `<span>` с классами `inline-block w-8 h-8 rounded-full align-middle ml-3`
- Inline-стиль `animation: 'colorShift 2s ease-in-out infinite'`
- `aria-hidden="true"` (декоративный)
- Показывается всегда, независимо от `unreadCount`
- `<style>` с теми же `@keyframes colorShift` локально в файле

## Что НЕ меняется

- Карточка «Заявки» на дашборде (`admin.index.tsx`) — уже сделана в прошлой итерации
- Бейджи табов категорий внутри страницы заявок
- Индикаторы непрочитанности на карточках в списке заявок
- Кнопка Viber на детальной странице заявки
- Все остальные пункты сайдбара
