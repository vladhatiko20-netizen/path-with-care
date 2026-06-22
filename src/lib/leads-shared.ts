export const SOURCE_LABELS: Record<string, string> = {
  bari: "Бари",
  index: "Главная",
  home: "Главная",
  "with-priest": "Диалог со священником",
  contacts: "Форма контактов",
  catalog: "Каталог",
  about: "О нас",
  calendar: "Календарь",
  blog: "Блог",
};

export type LeadCategory = "pilgrimage" | "priest" | "catalog" | "other";

export const DESTINATION_NAMES_RU: Record<string, string> = {
  jerusalem: "Иерусалим",
  bari: "Бари",
  georgia: "Грузия",
  romania: "Румыния",
  corfu: "Корфу",
  athos: "Афон",
  ukraine: "Украина",
  moldova: "Молдова",
};

export function leadCategory(source: string | null | undefined): LeadCategory {
  if (!source) return "other";
  if (source.startsWith("destination:")) return "pilgrimage";
  if (source === "with-priest") return "priest";
  if (source === "catalog" || source.startsWith("catalog:")) return "catalog";
  return "other";
}

export const CATEGORY_LABELS: Record<LeadCategory, string> = {
  pilgrimage: "Паломничество",
  priest: "Вопрос священнику",
  catalog: "Каталог",
  other: "Прочее",
};

export function destinationNameRu(slug: string): string {
  return DESTINATION_NAMES_RU[slug] ?? slug;
}

export function sourceLabel(s: string | null | undefined): string {
  if (!s) return "–";
  if (SOURCE_LABELS[s]) return SOURCE_LABELS[s];
  if (s.startsWith("destination:")) {
    return `Паломничество: ${destinationNameRu(s.slice("destination:".length))}`;
  }
  if (s.startsWith("catalog:")) {
    return `Каталог: ${s.slice("catalog:".length)}`;
  }
  return s;
}

export function formatLeadDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();
  const hm = d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  if (sameDay) return `сегодня, ${hm}`;
  if (isYesterday) return `вчера, ${hm}`;
  if (d.getFullYear() === now.getFullYear()) {
    return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long" }) + `, ${hm}`;
  }
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

export function isMoldovaPhone(phone: string | null | undefined): boolean {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("373");
}

export function viberLink(phone: string | null | undefined): string {
  if (!phone) return "#";
  const digits = phone.replace(/\D/g, "");
  return `viber://chat?number=%2B${digits}`;
}

export function telLink(phone: string | null | undefined): string {
  if (!phone) return "#";
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}