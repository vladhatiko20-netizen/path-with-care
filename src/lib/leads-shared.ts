export const SOURCE_LABELS: Record<string, string> = {
  bari: "Бари",
  index: "Главная",
  home: "Главная",
  "with-priest": "Со священником",
  contacts: "Контакты",
  about: "О нас",
  calendar: "Календарь",
  blog: "Блог",
};

export function sourceLabel(s: string | null | undefined): string {
  if (!s) return "—";
  return SOURCE_LABELS[s] ?? s;
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

export function isMoldovaPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("373");
}

export function viberLink(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `viber://chat?number=%2B${digits}`;
}

export function telLink(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}