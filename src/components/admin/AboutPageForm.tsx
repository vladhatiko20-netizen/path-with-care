import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { adminUpsertAboutPage } from "@/lib/about.functions";
import { ImageUpload } from "./ImageUpload";

type Form = {
  hero_photo_url: string | null;
  hero_title_ru: string | null;
  hero_title_ro: string | null;
  hero_subtitle_ru: string | null;
  hero_subtitle_ro: string | null;
  intro_text_ru: string | null;
  intro_text_ro: string | null;
  video_url: string | null;
};

export function AboutPageForm({ initial }: { initial: Form }) {
  const save = useServerFn(adminUpsertAboutPage);
  const [form, setForm] = useState<Form>(initial);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"ru" | "ro">("ru");

  function set<K extends keyof Form>(k: K, v: Form[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await save({
        data: {
          hero_photo_url: form.hero_photo_url || null,
          hero_title_ru: form.hero_title_ru || null,
          hero_title_ro: form.hero_title_ro || null,
          hero_subtitle_ru: form.hero_subtitle_ru || null,
          hero_subtitle_ro: form.hero_subtitle_ro || null,
          intro_text_ru: form.intro_text_ru || null,
          intro_text_ro: form.intro_text_ro || null,
          video_url: form.video_url || null,
        },
      });
      toast.success("Сохранено");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ошибка сохранения");
    } finally {
      setBusy(false);
    }
  }

  const cls = "w-full px-3 py-2 border border-border rounded-sm bg-background text-sm";

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-3xl">
      <ImageUpload
        value={form.hero_photo_url}
        onChange={(url) => set("hero_photo_url", url)}
        folder="about"
        label="Фото-обложка (hero)"
      />

      <div>
        <label className="block text-sm font-serif mb-1">Ссылка на видео (YouTube/Vimeo)</label>
        <input
          className={cls}
          value={form.video_url ?? ""}
          onChange={(e) => set("video_url", e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          maxLength={1000}
        />
        <p className="text-xs text-muted-foreground mt-1">Если пусто, блок видео не показывается.</p>
      </div>

      <div className="flex gap-2 border-b border-border">
        {(["ru", "ro"] as const).map((l) => (
          <button type="button" key={l} onClick={() => setTab(l)}
            className={`px-4 py-2 font-serif text-sm border-b-2 -mb-px ${tab === l ? "border-accent text-accent" : "border-transparent text-muted-foreground"}`}>
            {l === "ru" ? "Русский" : "Română"}
          </button>
        ))}
      </div>

      {tab === "ru" ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-serif mb-1">Заголовок (RU)</label>
            <input className={cls} value={form.hero_title_ru ?? ""} onChange={(e) => set("hero_title_ru", e.target.value)} maxLength={500} />
          </div>
          <div>
            <label className="block text-sm font-serif mb-1">Подзаголовок (RU)</label>
            <textarea className={cls} rows={2} value={form.hero_subtitle_ru ?? ""} onChange={(e) => set("hero_subtitle_ru", e.target.value)} maxLength={2000} />
          </div>
          <div>
            <label className="block text-sm font-serif mb-1">Вступительный текст (RU)</label>
            <textarea className={cls} rows={10} value={form.intro_text_ru ?? ""} onChange={(e) => set("intro_text_ru", e.target.value)} maxLength={20000} />
            <p className="text-xs text-muted-foreground mt-1">Абзацы разделяйте пустой строкой.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-serif mb-1">Titlu (RO)</label>
            <input className={cls} value={form.hero_title_ro ?? ""} onChange={(e) => set("hero_title_ro", e.target.value)} maxLength={500} />
          </div>
          <div>
            <label className="block text-sm font-serif mb-1">Subtitlu (RO)</label>
            <textarea className={cls} rows={2} value={form.hero_subtitle_ro ?? ""} onChange={(e) => set("hero_subtitle_ro", e.target.value)} maxLength={2000} />
          </div>
          <div>
            <label className="block text-sm font-serif mb-1">Text introductiv (RO)</label>
            <textarea className={cls} rows={10} value={form.intro_text_ro ?? ""} onChange={(e) => set("intro_text_ro", e.target.value)} maxLength={20000} />
            <p className="text-xs text-muted-foreground mt-1">Paragrafele se separă cu o linie goală.</p>
          </div>
        </div>
      )}

      <div>
        <button type="submit" disabled={busy} className="px-5 py-2 bg-accent text-primary-foreground rounded-sm font-serif disabled:opacity-50">
          {busy ? "Сохраняем…" : "Сохранить"}
        </button>
      </div>
    </form>
  );
}