// Православные праздники (фиксированные даты по новому стилю / гражданскому календарю,
// как принято в большинстве приходов Молдовы). Список не претендует на полноту —
// используется для показа ближайшего праздника на сайте.

export type Feast = {
  month: number; // 1-12
  day: number;   // 1-31
  ru: string;
  ro: string;
  major?: boolean;
};

export const feasts: Feast[] = [
  { month: 1, day: 7, ru: "Рождество Христово", ro: "Nașterea Domnului", major: true },
  { month: 1, day: 14, ru: "Обрезание Господне. Свт. Василия Великого", ro: "Tăierea împrejur. Sf. Vasile cel Mare" },
  { month: 1, day: 19, ru: "Крещение Господне (Богоявление)", ro: "Botezul Domnului (Boboteaza)", major: true },
  { month: 2, day: 15, ru: "Сретение Господне", ro: "Întâmpinarea Domnului", major: true },
  { month: 3, day: 9, ru: "Обретение главы Иоанна Предтечи", ro: "Aflarea capului Sf. Ioan Botezătorul" },
  { month: 4, day: 7, ru: "Благовещение Пресвятой Богородицы", ro: "Buna Vestire", major: true },
  { month: 5, day: 6, ru: "Вмч. Георгия Победоносца", ro: "Sf. Mare Mc. Gheorghe" },
  { month: 5, day: 12, ru: "Свт. Епифания Кипрского", ro: "Sf. Epifanie al Ciprului" },
  { month: 5, day: 21, ru: "Ап. и евангелиста Иоанна Богослова", ro: "Sf. Ap. și Evanghelist Ioan" },
  { month: 5, day: 24, ru: "Свв. равноап. Кирилла и Мефодия", ro: "Sf. Chiril și Metodie" },
  { month: 5, day: 22, ru: "Перенесение мощей свт. Николая в Бари", ro: "Aducerea moaștelor Sf. Nicolae la Bari" },
  { month: 6, day: 7, ru: "Третье обретение главы Иоанна Предтечи", ro: "A treia aflare a capului Sf. Ioan" },
  { month: 7, day: 7, ru: "Рождество Иоанна Предтечи", ro: "Nașterea Sf. Ioan Botezătorul" },
  { month: 7, day: 12, ru: "Святых первоверховных апп. Петра и Павла", ro: "Sf. Ap. Petru și Pavel", major: true },
  { month: 8, day: 2, ru: "Прор. Илии", ro: "Sf. Prooroc Ilie" },
  { month: 8, day: 19, ru: "Преображение Господне", ro: "Schimbarea la Față", major: true },
  { month: 8, day: 28, ru: "Успение Пресвятой Богородицы", ro: "Adormirea Maicii Domnului", major: true },
  { month: 9, day: 11, ru: "Усекновение главы Иоанна Предтечи", ro: "Tăierea capului Sf. Ioan" },
  { month: 9, day: 21, ru: "Рождество Пресвятой Богородицы", ro: "Nașterea Maicii Domnului", major: true },
  { month: 9, day: 27, ru: "Воздвижение Креста Господня", ro: "Înălțarea Sf. Cruci", major: true },
  { month: 10, day: 14, ru: "Покров Пресвятой Богородицы", ro: "Acoperământul Maicii Domnului", major: true },
  { month: 11, day: 21, ru: "Собор Архистратига Михаила", ro: "Soborul Sf. Arhanghel Mihail" },
  { month: 12, day: 4, ru: "Введение во храм Пресвятой Богородицы", ro: "Intrarea în Biserică a Maicii Domnului", major: true },
  { month: 12, day: 19, ru: "Свт. Николая Чудотворца", ro: "Sf. Nicolae" },
];

export function nextFeast(today: Date = new Date()): Feast {
  const sorted = [...feasts].sort((a, b) => a.month - b.month || a.day - b.day);
  const m = today.getMonth() + 1;
  const d = today.getDate();
  for (const f of sorted) {
    if (f.month > m || (f.month === m && f.day >= d)) return f;
  }
  return sorted[0];
}

export function todayFeast(today: Date = new Date()): Feast | undefined {
  const m = today.getMonth() + 1;
  const d = today.getDate();
  return feasts.find((f) => f.month === m && f.day === d);
}

const monthsRu = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
const monthsRo = ["ianuarie","februarie","martie","aprilie","mai","iunie","iulie","august","septembrie","octombrie","noiembrie","decembrie"];

export function formatFeastDate(f: Feast, lang: "ru" | "ro"): string {
  return `${f.day} ${(lang === "ru" ? monthsRu : monthsRo)[f.month - 1]}`;
}