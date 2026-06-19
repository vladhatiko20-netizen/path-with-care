import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { adminExportAllCatalogItems, adminImportCatalogItemsBulk } from "@/lib/admin.functions";

export const Route = createFileRoute("/_admin/admin/catalog/import")({
  component: Page,
});

type BulkResult = {
  ok: true;
  mode: "skip" | "upsert" | "only_new";
  summary: { created: number; updated: number; skipped: number; errors: number };
  created: Array<{ slug: string; id: string }>;
  updated: Array<{ slug: string; id: string }>;
  skipped: Array<{ slug: string; reason: string }>;
  errors: Array<{ slug: string; error: string }>;
};

function Page() {
  const exportAll = useServerFn(adminExportAllCatalogItems);
  const bulkImport = useServerFn(adminImportCatalogItemsBulk);
  const router = useRouter();
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"skip" | "upsert" | "only_new">("upsert");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BulkResult | null>(null);
  const [expBusy, setExpBusy] = useState(false);
  const [expError, setExpError] = useState<string | null>(null);

  async function runExport() {
    setExpError(null);
    setExpBusy(true);
    try {
      const res = await exportAll();
      const json = JSON.stringify(res, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const date = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `catalog-items-${date}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: unknown) {
      setExpError(e instanceof Error ? e.message : "Ошибка экспорта");
    } finally {
      setExpBusy(false);
    }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const txt = await file.text();
    setText(txt);
    setError(null);
    setResult(null);
    e.target.value = "";
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      setError(`Невалидный JSON: ${err instanceof Error ? err.message : String(err)}`);
      return;
    }
    let payload: { mode: typeof mode; items: unknown[] };
    if (Array.isArray(parsed)) {
      payload = { mode, items: parsed };
    } else if (parsed && typeof parsed === "object" && Array.isArray((parsed as { catalog_items?: unknown[] }).catalog_items)) {
      payload = { mode, items: (parsed as { catalog_items: unknown[] }).catalog_items };
    } else if (parsed && typeof parsed === "object" && Array.isArray((parsed as { items?: unknown[] }).items)) {
      payload = { mode, items: (parsed as { items: unknown[] }).items };
    } else {
      setError('JSON должен быть массивом позиций или объектом с полем "catalog_items".');
      return;
    }
    if (mode === "upsert") {
      const ok = window.confirm(
        'Режим «Обновить»: тексты и категория совпадающих по slug позиций будут перезаписаны. Картинка и статус публикации сохраняются (если не переданы явно в JSON). Продолжить?',
      );
      if (!ok) return;
    }
    setBusy(true);
    try {
      const res = (await bulkImport({ data: payload as never })) as BulkResult;
      setResult(res);
      router.invalidate();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка импорта");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-8 max-w-5xl">
      <Link to="/admin/catalog" className="text-sm text-accent hover:underline">← К списку</Link>
      <h1 className="font-serif text-3xl mt-3 mb-2">Импорт каталога из JSON</h1>
      <p className="text-sm text-muted-foreground mb-6 max-w-3xl">
        Ключ совпадения – <code>slug</code>. Поле фото (<code>image_url</code>) при отсутствии в JSON в режиме «Обновить» не затирается.
      </p>

      <div className="mb-6 p-4 border border-border rounded-sm bg-muted/30">
        <h2 className="font-serif text-lg mb-2">Экспорт всех позиций</h2>
        <button
          type="button"
          onClick={runExport}
          disabled={expBusy}
          className="px-4 py-2 border border-border rounded-sm font-serif text-sm disabled:opacity-50"
        >
          {expBusy ? "Экспорт…" : "Скачать JSON"}
        </button>
        {expError && <p className="mt-3 text-sm text-destructive">{expError}</p>}
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium mb-1">Режим обработки совпадений по slug</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as typeof mode)}
            className="px-3 py-2 border border-border rounded-sm bg-background text-sm w-full max-w-md"
          >
            <option value="upsert">Обновить существующие (upsert по slug)</option>
            <option value="skip">Пропустить существующие</option>
            <option value="only_new">Только новые (отклонить весь батч при конфликте)</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <label className="px-4 py-2 border border-border rounded-sm font-serif text-sm cursor-pointer">
            Загрузить .json
            <input type="file" accept="application/json,.json" onChange={onFile} className="hidden" />
          </label>
          <button
            type="button"
            onClick={() => { setText(""); setError(null); setResult(null); }}
            className="px-4 py-2 border border-border rounded-sm font-serif text-sm"
          >
            Очистить
          </button>
        </div>

        <textarea
          className="w-full h-[400px] px-3 py-2 border border-border rounded-sm bg-background text-xs font-mono"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='[{"slug":"ikona-...","title_ru":"...","title_ro":"...","category":"icons"}]'
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
              Готово (режим: <strong>{result.mode}</strong>). Создано: {result.summary.created},
              обновлено: {result.summary.updated}, пропущено: {result.summary.skipped},
              ошибок: {result.summary.errors}.
            </p>
            {result.errors.length > 0 && (
              <ul className="text-xs text-destructive list-disc pl-5">
                {result.errors.map((e, i) => (
                  <li key={i}><code>{e.slug}</code>: {e.error}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={busy || !text.trim()} className="px-5 py-2 bg-accent text-primary-foreground rounded-sm font-serif disabled:opacity-50">
            {busy ? "Импортируем…" : "Импортировать"}
          </button>
          <Link to="/admin/catalog" className="px-5 py-2 border border-border rounded-sm font-serif">
            Отмена
          </Link>
        </div>
      </form>
    </div>
  );
}