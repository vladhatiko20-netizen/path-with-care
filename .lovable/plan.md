We will implement the three requested fixes precisely as described, targetting only `src/page-views/IndexPage.tsx` and `src/page-views/CalendarPage.tsx`.

### Fix 1 — Mobile layout on Calendar Page (`CalendarPage.tsx`)
- On the first column (star icon `✦`), we will reduce the right padding on mobile from `pr-1` to `pr-0.5` and explicitly add `pl-0` to ensure it is tight to the left edge. We will also reduce its width class from `w-5` to `w-4` on mobile.
- On the second column (date range), we will reduce the right padding on mobile from `pr-2` to `pr-1` and explicitly add `pl-0` to maximize space for the destination name on narrow screens.

### Fix 2 — Desktop typography on Homepage Upcoming Trips (`IndexPage.tsx`)
In the "Upcoming Trips" block, for screen widths `md:` and up:
- Table headers: We will change `text-[11px]` to `md:text-sm` for all columns (Date, Destination, Duration, Price, Escort).
- Row cells: We will increase the font size of row contents from `text-[14px]` / `text-[15px]` / `text-sm` to `md:text-base` for:
  - Date (`text-[15px] md:text-base`)
  - Destination (`text-[15px] md:text-base`)
  - Duration (`text-[14px] md:text-base`)
  - Price (`text-[15px] md:text-base`)
  - Escort/Accompaniment (`text-sm md:text-base`)

### Fix 3 — Desktop typography on Calendar Page (`CalendarPage.tsx`)
For screen widths `md:` and up:
- Row cells: We will increase the font size from `text-sm` equivalents to `md:text-base` for:
  - Date (`text-[15px] md:text-base`)
  - Duration (`text-[14px] md:text-base`)
  - Price (`text-[15px] md:text-base`)
- Destination name: We will make it larger and bold (`text-[15px] md:text-base md:font-semibold`).
- The "Подать заявку" button text size remains untouched (`text-xs md:text-sm`).

---

### Technical Details
All changes will be applied using targeted Tailwind classes (`md:text-sm`, `md:text-base`, `md:font-semibold`) ensuring desktop screens display the larger font size (approx. 1.5x increase) while mobile screens remain exactly as they are.
