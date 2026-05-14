import aboutPilgrimage from "@/assets/about-pilgrimage.jpg";
import destAthos from "@/assets/dest-athos.jpg";
import destJerusalem from "@/assets/dest-jerusalem.jpg";
import destGeorgia from "@/assets/dest-georgia.jpg";
import catNikolay from "@/assets/cat-nikolay.jpg";
import menuCalendar from "@/assets/menu-calendar.jpg";
import heroBlog from "@/assets/hero-blog.jpg";

const map: Record<string, string> = {
  "about-pilgrimage": aboutPilgrimage,
  "dest-athos": destAthos,
  "dest-jerusalem": destJerusalem,
  "dest-georgia": destGeorgia,
  "cat-nikolay": catNikolay,
  "menu-calendar": menuCalendar,
  "hero-blog": heroBlog,
};

export function resolveBlogImage(key: string | null | undefined): string {
  if (!key) return aboutPilgrimage;
  if (key.startsWith("http") || key.startsWith("/")) return key;
  return map[key] ?? aboutPilgrimage;
}