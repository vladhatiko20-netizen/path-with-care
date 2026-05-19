import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const BUCKET = "public-images";
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export function ImageUpload({
  value,
  onChange,
  folder = "uploads",
  label = "Обложка",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    if (!ALLOWED.includes(file.type)) {
      setError("Только JPG, PNG или WEBP");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Файл больше 5 МБ");
      return;
    }
    setBusy(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: "31536000",
        upsert: false,
        contentType: file.type,
      });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="block text-sm font-serif mb-1">{label}</label>
      <div className="flex items-start gap-4">
        {value ? (
          <img src={value} alt="" className="w-32 h-32 object-cover rounded-sm border border-border" />
        ) : (
          <div className="w-32 h-32 rounded-sm border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">
            нет фото
          </div>
        )}
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="px-4 py-2 bg-accent text-primary-foreground rounded-sm text-sm font-serif disabled:opacity-50"
          >
            {busy ? "Загрузка…" : value ? "Заменить файл" : "Загрузить файл"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="px-4 py-2 border border-border rounded-sm text-sm font-serif"
            >
              Удалить
            </button>
          )}
          <p className="text-xs text-muted-foreground">JPG, PNG, WEBP — до 5 МБ</p>
        </div>
      </div>
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
}
