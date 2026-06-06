import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminImportDestination, adminExportDestination, adminListDestinations } from "@/lib/admin.functions";

export const Route = createFileRoute("/_admin/admin/destinations/import")({
  component: Page,
});

const EMPTY_TEMPLATE = {
  destination: {
    slug: "",
    title_ru: "",
    title_ro: "",
    short_title_ru: null,
    short_title_ro: null,
    description_ru: null,
    description_ro: null,
    duration_ru: null,
    duration_ro: null,
    price_from: null,
    group_size_ru: null,
    group_size_ro: null,
    accompaniment_ru: null,
    accompaniment_ro: null,
    hero_quote_ru: null,
    hero_quote_ro: null,
    hero_quote_author_ru: null,
    hero_quote_author_ro: null,
    intro_ru: null,
    intro_ro: null,
    notice_ru: null,
    notice_ro: null,
    seo_title_ru: null,
    seo_title_ro: null,
    seo_description_ru: null,
    seo_description_ro: null,
    program_ru: null,
    program_ro: null,
  },
  shrines: [
    {
      title_ru: "",
      title_ro: "",
      short_ru: null,
      short_ro: null,
      full_ru: null,
      full_ro: null,
    },
  ],
  program_days: [
    {
      day_label_ru: null,
      day_label_ro: null,
      title_ru: "",
      title_ro: "",
      description_ru: null,
      description_ro: null,
    },
  ],
  inclusions: {
    included: [{ text_ru: "", text_ro: "" }],
    not_included: [{ text_ru: "", text_ro: "" }],
  },
  faq: [
    {
      question_ru: "",
      question_ro: "",
      answer_ru: null,
      answer_ro: null,
    },
  ],
};

type ImportResult = {
  ok: true;
  id: string;
  slug: string;
  title_ru: string;
  counts: {
    shrines: number;
    program_days: number;
    included: number;
    not_included: number;
    faq: number;
  };
};

function Page() {
  const importFn = useServerFn(adminImportDestination);
  const exportFn = useServerFn(adminExportDestination);
  const router = useRouter();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [exportId, setExportId] = useState<string>("");
  const [exportBusy, setExportBusy] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const listFn = useServerFn(adminListDestinations);
  const listQuery = useQuery({
    queryKey: ["admin", "destinations", "list"],
    queryFn: () => listFn(),
  });

  async function runExport(mode: "download" | "insert") {
    if (!exportId) {
      setExportError("Выберите направление.");
      return;
    }
    setExportError(null);
    setExportBusy(true);
    try {
      const res = await exportFn({ data: { id: exportId } });
      const json = JSON.stringify(res.payload, null, 2);
      if (mode === "download") {
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${res.slug}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        setText(json);
        setError(null);
        setResult(null);
      }
    } catch (e: unknown) {
      setExportError(e instanceof Error ? e.message : "Ошибка экспорта");
    } finally {
      setExportBusy(false);
    }
  }

  function loadTemplate() {
    setText(JSON.stringify(EMPTY_TEMPLATE, null, 2));
    setError(null);
    setResult(null);
  }

  function downloadTemplate() {
    const blob = new Blob([JSON.stringify(EMPTY_TEMPLATE, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "destination-template.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    let payload: unknown;
    try {
      payload = JSON.parse(text);
    } catch (e) {
      setError(`Невалидный JSON: ${e instanceof Error ? e.message : String(e)}`);
      return;
    }
    setBusy(true);
    try {
      const res = (await importFn({ data: payload as never })) as ImportResult;
      setResult(res);
      router.invalidate();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка импорта");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-8 max-w-5xl">
      <Link to="/admin/destinations" className="text-sm text-accent hover:underline">← К списку</Link>
      <h1 className="font-serif text-3xl mt-3 mb-2">Импорт направления из JSON</h1>
      <p className="text-sm text-muted-foreground mb-6 max-w-3xl">
        Вставьте JSON-документ и нажмите «Импортировать». Будет создано направление вместе со святынями, программой по дням, разделом «Включено / Не включено» и FAQ. Фотографии (главное, OG, святынь, галерея) загружаются отдельно через админ-форму после импорта. <strong>Направление создаётся со статусом «Черновик»</strong> — опубликуйте его вручную после проверки.
      </p>

      <div className="mb-6 p-4 border border-border rounded-sm bg-muted/30">
        <h2 className="font-serif text-lg mb-1">Экспортировать существующее направление</h2>
        <p className="text-xs text-muted-foreground mb-3 max-w-3xl">
          Структура экспорта идентична схеме импорта — можно сразу импортировать обратно. Все поля картинок в основном объекте равны <code>null</code>; реальные URL вынесены в отдельный блок <code>_images_manifest</code> (игнорируется при импорте; используется как резервная копия и для миграции).
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={exportId}
            onChange={(e) => setExportId(e.target.value)}
            className="px-3 py-2 border border-border rounded-sm bg-background text-sm min-w-[260px]"
            disabled={listQuery.isLoading}
          >
            <option value="">— выберите направление —</option>
            {(listQuery.data ?? []).map((d) => (
              <option key={d.id} value={d.id}>
                {d.title_ru} ({d.slug}){d.is_published ? "" : " · черновик"}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => runExport("download")}
            disabled={!exportId || exportBusy}
            className="px-4 py-2 border border-border rounded-sm font-serif text-sm disabled:opacity-50"
          >
            {exportBusy ? "Экспорт…" : "Скачать JSON"}
          </button>
          <button
            type="button"
            onClick={() => runExport("insert")}
            disabled={!exportId || exportBusy}
            className="px-4 py-2 border border-border rounded-sm font-serif text-sm disabled:opacity-50"
          >
            Вставить в поле ниже
          </button>
        </div>
        {exportError && (
          <p className="mt-3 text-sm text-destructive">{exportError}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <button type="button" onClick={loadTemplate} className="px-4 py-2 border border-border rounded-sm font-serif text-sm">
          Вставить пустой шаблон
        </button>
        <button type="button" onClick={downloadTemplate} className="px-4 py-2 border border-border rounded-sm font-serif text-sm">
          Скачать пустой шаблон (.json)
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <textarea
          className="w-full h-[500px] px-3 py-2 border border-border rounded-sm bg-background text-xs font-mono"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='{ "destination": { "slug": "...", "title_ru": "...", "title_ro": "..." }, ... }'
          spellCheck={false}
        />

        {error && (
          <div className="p-4 border border-destructive/40 bg-destructive/5 rounded-sm">
            <p className="text-sm text-destructive whitespace-pre-wrap">{error}</p>
          </div>
        )}

        {result && (
          <div className="p-4 border border-green-300 bg-green-50 rounded-sm space-y-2">
            <p className="text-sm text-green-900">
              Готово. Создано направление <strong>«{result.title_ru}»</strong> (slug: <code>{result.slug}</code>).
            </p>
            <p className="text-sm text-green-900">
              Святынь: {result.counts.shrines}, дней программы: {result.counts.program_days},
              включено: {result.counts.included}, не включено: {result.counts.not_included},
              FAQ: {result.counts.faq}.
            </p>
            <p className="text-sm text-green-900">
              <Link to="/admin/destinations/$id" params={{ id: result.id }} className="underline">
                Открыть направление →
              </Link>{" "}
              чтобы загрузить фотографии и опубликовать.
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={busy || !text.trim()} className="px-5 py-2 bg-accent text-primary-foreground rounded-sm font-serif disabled:opacity-50">
            {busy ? "Импортируем…" : "Импортировать"}
          </button>
          <Link to="/admin/destinations" className="px-5 py-2 border border-border rounded-sm font-serif">
            Отмена
          </Link>
        </div>
      </form>
    </div>
  );
}