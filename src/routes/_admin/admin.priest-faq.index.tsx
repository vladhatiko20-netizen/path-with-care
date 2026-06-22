import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  adminListPriestFaq,
  adminDeletePriestFaq,
  adminExportPriestFaq,
  adminExportAllPriestFaq,
  adminImportPriestFaq,
  adminImportPriestFaqBulk,
} from "@/lib/admin.functions";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/priest-faq/")({
  component: Page,
});

const EMPTY_TEMPLATE = {
  question_ru: "",
  question_ro: "",
  answer_ru: "",
  answer_ro: "",
  author_name_ru: null,
  author_name_ro: null,
  author_title_ru: null,
  author_title_ro: null,
  sort_order: null,
  is_published: false,
};

type SingleResult = { ok: true; action: "created" | "updated"; id: string; question_ru: string };
type BulkResult = {
  ok: true;
  mode: "skip" | "upsert" | "only_new";
  summary: { created: number; updated: number; skipped: number; errors: number };
  created: Array<{ question_ru: string; id: string }>;
  updated: Array<{ question_ru: string; id: string }>;
  skipped: Array<{ question_ru: string; reason: string }>;
  errors: Array<{ question_ru: string; error: string }>;
};

function Page() {
  const list = useServerFn(adminListPriestFaq);
  const del = useServerFn(adminDeletePriestFaq);
  const exportOne = useServerFn(adminExportPriestFaq);
  const exportAll = useServerFn(adminExportAllPriestFaq);
  const importOne = useServerFn(adminImportPriestFaq);
  const importBulk = useServerFn(adminImportPriestFaqBulk);
  const router = useRouter();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-priest-faq"],
    queryFn: () => list(),
  });

  // Single import/export state
  const [text, setText] = useState("");
  const [singleBusy, setSingleBusy] = useState(false);
  const [singleError, setSingleError] = useState<string | null>(null);
  const [singleResult, setSingleResult] = useState<SingleResult | null>(null);
  const [exportId, setExportId] = useState<string>("");
  const [exportBusy, setExportBusy] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportAllBusy, setExportAllBusy] = useState(false);
  const [exportAllError, setExportAllError] = useState<string | null>(null);

  // Bulk import state
  const [bulkText, setBulkText] = useState("");
  const [bulkMode, setBulkMode] = useState<"skip" | "upsert" | "only_new">("skip");
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [bulkResult, setBulkResult] = useState<BulkResult | null>(null);

  async function handleDelete(id: string, q: string) {
    if (!confirm(`Удалить вопрос «${q.slice(0, 60)}»?`)) return;
    await del({ data: { id } });
    await refetch();
    router.invalidate();
  }

  function downloadJson(filename: string, payload: unknown) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function runExportOne(mode: "download" | "insert") {
    if (!exportId) { setExportError("Выберите запись."); return; }
    setExportError(null); setExportBusy(true);
    try {
      const res = await exportOne({ data: { id: exportId } });
      const json = JSON.stringify(res.payload, null, 2);
      if (mode === "download") {
        const safe = (res.payload.question_ru || "qa").slice(0, 40).replace(/[^\w\sа-яА-Я-]/gi, "").trim().replace(/\s+/g, "-") || "qa";
        downloadJson(`priest-faq-${safe}.json`, res.payload);
      } else {
        setText(json); setSingleError(null); setSingleResult(null);
      }
    } catch (e: unknown) {
      setExportError(e instanceof Error ? e.message : "Ошибка экспорта");
    } finally { setExportBusy(false); }
  }

  async function runExportAll() {
    setExportAllError(null); setExportAllBusy(true);
    try {
      const res = await exportAll();
      const date = new Date().toISOString().slice(0, 10);
      downloadJson(`priest-faq-all-${date}.json`, res);
    } catch (e: unknown) {
      setExportAllError(e instanceof Error ? e.message : "Ошибка экспорта");
    } finally { setExportAllBusy(false); }
  }

  function loadTemplate() {
    setText(JSON.stringify(EMPTY_TEMPLATE, null, 2));
    setSingleError(null); setSingleResult(null);
  }
  function downloadTemplate() {
    downloadJson("priest-faq-template.json", EMPTY_TEMPLATE);
  }

  async function onSingleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSingleError(null); setSingleResult(null);
    let parsed: unknown;
    try { parsed = JSON.parse(text); }
    catch (err) { setSingleError(`Невалидный JSON: ${err instanceof Error ? err.message : String(err)}`); return; }
    setSingleBusy(true);
    try {
      const res = (await importOne({ data: parsed as never })) as SingleResult;
      setSingleResult(res);
      await refetch();
      router.invalidate();
    } catch (err: unknown) {
      setSingleError(err instanceof Error ? err.message : "Ошибка импорта");
    } finally { setSingleBusy(false); }
  }

  async function onBulkFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const txt = await file.text();
    setBulkText(txt); setBulkError(null); setBulkResult(null);
    e.target.value = "";
  }

  async function onBulkSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBulkError(null); setBulkResult(null);
    let parsed: unknown;
    try { parsed = JSON.parse(bulkText); }
    catch (err) { setBulkError(`Невалидный JSON: ${err instanceof Error ? err.message : String(err)}`); return; }
    if (bulkMode === "upsert") {
      const ok = window.confirm(
        "Режим «Обновить существующие»: записи, у которых question_ru совпадает с уже существующим (после trim), будут полностью перезаписаны (включая ответы, авторство, sort_order и публикацию, если они присутствуют в JSON). Продолжить?",
      );
      if (!ok) return;
    }
    setBulkBusy(true);
    try {
      const res = (await importBulk({ data: { mode: bulkMode, ...(Array.isArray(parsed) ? { items: parsed } : (parsed as object)) } as never })) as BulkResult;
      setBulkResult(res);
      await refetch();
      router.invalidate();
    } catch (err: unknown) {
      setBulkError(err instanceof Error ? err.message : "Ошибка импорта");
    } finally { setBulkBusy(false); }
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl">Вопросы священнику</h1>
        <Link to="/admin/priest-faq/new" className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-primary-foreground rounded-sm font-serif text-sm">
          <Plus className="w-4 h-4" /> Новый Q&amp;A
        </Link>
      </div>

      {isLoading ? <p className="text-muted-foreground">Загрузка…</p> : (
        <>
        <div className="hidden sm:block border border-border rounded-sm bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-left">
              <tr>
                <th className="px-4 py-3 font-serif">Вопрос (RU)</th>
                <th className="px-4 py-3 font-serif w-24">Порядок</th>
                <th className="px-4 py-3 font-serif w-32">Статус</th>
                <th className="px-4 py-3 w-28"></th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Пока нет записей.</td></tr>
              )}
              {(data ?? []).map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="px-4 py-3">{c.question_ru}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.sort_order}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-sm text-xs ${c.is_published ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}`}>
                      {c.is_published ? "Опубликовано" : "Черновик"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <Link to="/admin/priest-faq/$id" params={{ id: c.id }} className="p-1.5 hover:bg-secondary rounded-sm" title="Редактировать">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(c.id, c.question_ru)} className="p-1.5 hover:bg-destructive/10 text-destructive rounded-sm" title="Удалить">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden space-y-3">
          {(data ?? []).length === 0 && (
            <p className="text-center text-muted-foreground py-8">Пока нет записей.</p>
          )}
          {(data ?? []).map((c) => (
            <div key={c.id} className="border border-border rounded-sm bg-card p-4">
              <div className="font-serif text-base">{c.question_ru}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-0.5 rounded-sm text-xs ${c.is_published ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}`}>
                  {c.is_published ? "Опубликовано" : "Черновик"}
                </span>
                <span className="text-xs text-muted-foreground">№ {c.sort_order}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <Link to="/admin/priest-faq/$id" params={{ id: c.id }} className="inline-flex items-center gap-1.5 px-3 py-2 border border-border rounded-sm text-sm font-serif">
                  <Pencil className="w-4 h-4" /> Редактировать
                </Link>
                <button onClick={() => handleDelete(c.id, c.question_ru)} className="inline-flex items-center gap-1.5 px-3 py-2 border border-destructive/40 text-destructive rounded-sm text-sm font-serif">
                  <Trash2 className="w-4 h-4" /> Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
        </>
      )}

      <details className="mt-10 border border-border rounded-sm bg-muted/30" open={!isLoading && (data ?? []).length === 0}>
        <summary className="cursor-pointer px-4 py-3 font-serif text-lg select-none">
          Импорт / экспорт JSON
        </summary>
        <div className="p-4 space-y-8">
          {/* Export */}
          <section>
            <h2 className="font-serif text-base mb-2">Экспорт</h2>
            <p className="text-xs text-muted-foreground mb-3">
              Структура экспорта совпадает со схемой импорта – файл можно отредактировать и загрузить обратно. Поля <code>id</code>, <code>created_at</code>, <code>updated_at</code> не включаются.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={exportId}
                onChange={(e) => setExportId(e.target.value)}
                className="px-3 py-2 border border-border rounded-sm bg-background text-sm min-w-[280px]"
              >
                <option value="">– выберите запись –</option>
                {(data ?? []).map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.question_ru.slice(0, 80)}{d.is_published ? "" : " · черновик"}
                  </option>
                ))}
              </select>
              <button type="button" onClick={() => runExportOne("download")} disabled={!exportId || exportBusy} className="px-4 py-2 border border-border rounded-sm font-serif text-sm disabled:opacity-50">
                {exportBusy ? "Экспорт…" : "Скачать JSON"}
              </button>
              <button type="button" onClick={() => runExportOne("insert")} disabled={!exportId || exportBusy} className="px-4 py-2 border border-border rounded-sm font-serif text-sm disabled:opacity-50">
                Вставить в поле ниже
              </button>
            </div>
            {exportError && <p className="mt-3 text-sm text-destructive">{exportError}</p>}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">
                Полный бэкап одним файлом: <code>{`{ "priest_faq": [...] }`}</code>, отсортирован по <code>sort_order</code>.
              </p>
              <button type="button" onClick={runExportAll} disabled={exportAllBusy} className="px-4 py-2 border border-border rounded-sm font-serif text-sm disabled:opacity-50">
                {exportAllBusy ? "Экспорт всех…" : "Экспортировать все Q&A"}
              </button>
              {exportAllError && <p className="mt-3 text-sm text-destructive">{exportAllError}</p>}
            </div>
          </section>

          {/* Single import */}
          <section>
            <h2 className="font-serif text-base mb-2">Одиночный импорт</h2>
            <p className="text-xs text-muted-foreground mb-3">
              Вставьте JSON одного Q&A. Совпадение ищется по <code>question_ru</code> (после trim): если запись найдена — обновляется, иначе создаётся новая. Если совпадений больше одного, импорт отклоняется. Длинные тире (—) запрещены и приведут к ошибке.
            </p>
            <div className="flex flex-wrap gap-3 mb-3">
              <button type="button" onClick={loadTemplate} className="px-4 py-2 border border-border rounded-sm font-serif text-sm">Вставить пустой шаблон</button>
              <button type="button" onClick={downloadTemplate} className="px-4 py-2 border border-border rounded-sm font-serif text-sm">Скачать пустой шаблон (.json)</button>
            </div>
            <form onSubmit={onSingleSubmit} className="space-y-3">
              <textarea
                className="w-full h-[320px] px-3 py-2 border border-border rounded-sm bg-background text-xs font-mono"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder='{ "question_ru": "...", "question_ro": "...", "answer_ru": "...", "answer_ro": "..." }'
                spellCheck={false}
              />
              {singleError && (
                <div className="p-3 border border-destructive/40 bg-destructive/5 rounded-sm">
                  <p className="text-sm text-destructive whitespace-pre-wrap">{singleError}</p>
                </div>
              )}
              {singleResult && (
                <div className="p-3 border border-green-300 bg-green-50 rounded-sm">
                  <p className="text-sm text-green-900">
                    {singleResult.action === "created" ? "Создана" : "Обновлена"} запись «{singleResult.question_ru.slice(0, 80)}».{" "}
                    <Link to="/admin/priest-faq/$id" params={{ id: singleResult.id }} className="underline">Открыть →</Link>
                  </p>
                </div>
              )}
              <button type="submit" disabled={singleBusy || !text.trim()} className="px-5 py-2 bg-accent text-primary-foreground rounded-sm font-serif disabled:opacity-50">
                {singleBusy ? "Импортируем…" : "Импортировать"}
              </button>
            </form>
          </section>

          {/* Bulk import */}
          <section>
            <h2 className="font-serif text-base mb-2">Массовый импорт</h2>
            <p className="text-xs text-muted-foreground mb-3">
              JSON-массив или объект вида <code>{`{ "priest_faq": [...] }`}</code> либо <code>{`{ "mode", "items" }`}</code>. Лимит – 200 за один батч. Совпадение по <code>question_ru</code> (после trim). Если совпадений больше одного, такая запись попадает в «Ошибки».
            </p>
            <div className="mb-3">
              <label className="block text-xs font-medium mb-1">Режим обработки совпадений</label>
              <select
                value={bulkMode}
                onChange={(e) => setBulkMode(e.target.value as typeof bulkMode)}
                className="px-3 py-2 border border-border rounded-sm bg-background text-sm w-full max-w-md"
              >
                <option value="skip">Пропустить существующие (по умолчанию)</option>
                <option value="upsert">Обновить существующие (upsert)</option>
                <option value="only_new">Только новые (отклонить батч при любом конфликте)</option>
              </select>
            </div>
            <form onSubmit={onBulkSubmit} className="space-y-3">
              <div className="flex flex-wrap gap-3 items-center">
                <label className="px-4 py-2 border border-border rounded-sm font-serif text-sm cursor-pointer">
                  Загрузить файл .json
                  <input type="file" accept="application/json,.json" onChange={onBulkFile} className="hidden" />
                </label>
                <button type="button" onClick={() => { setBulkText(""); setBulkError(null); setBulkResult(null); }} className="px-4 py-2 border border-border rounded-sm font-serif text-sm">
                  Очистить
                </button>
              </div>
              <textarea
                className="w-full h-[260px] px-3 py-2 border border-border rounded-sm bg-background text-xs font-mono"
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder='[ { "question_ru": "...", ... }, ... ]  или  { "priest_faq": [ ... ] }'
                spellCheck={false}
              />
              {bulkError && (
                <div className="p-3 border border-destructive/40 bg-destructive/5 rounded-sm">
                  <p className="text-sm text-destructive whitespace-pre-wrap">{bulkError}</p>
                </div>
              )}
              {bulkResult && (
                <div className="p-3 border border-border bg-card rounded-sm space-y-2">
                  <p className="text-sm">
                    Режим: <strong>{bulkResult.mode}</strong>. Создано: <strong>{bulkResult.summary.created}</strong>,
                    обновлено: <strong>{bulkResult.summary.updated}</strong>,
                    пропущено: <strong>{bulkResult.summary.skipped}</strong>,
                    ошибок: <strong>{bulkResult.summary.errors}</strong>.
                  </p>
                  {bulkResult.created.length > 0 && (
                    <details><summary className="text-xs cursor-pointer">Создано ({bulkResult.created.length})</summary>
                      <ul className="text-xs mt-1 space-y-0.5">{bulkResult.created.map((r) => <li key={r.id}>· {r.question_ru.slice(0, 100)}</li>)}</ul>
                    </details>
                  )}
                  {bulkResult.updated.length > 0 && (
                    <details><summary className="text-xs cursor-pointer">Обновлено ({bulkResult.updated.length})</summary>
                      <ul className="text-xs mt-1 space-y-0.5">{bulkResult.updated.map((r) => <li key={r.id}>· {r.question_ru.slice(0, 100)}</li>)}</ul>
                    </details>
                  )}
                  {bulkResult.skipped.length > 0 && (
                    <details><summary className="text-xs cursor-pointer">Пропущено ({bulkResult.skipped.length})</summary>
                      <ul className="text-xs mt-1 space-y-0.5">{bulkResult.skipped.map((r, i) => <li key={i}>· {r.question_ru.slice(0, 100)} – {r.reason}</li>)}</ul>
                    </details>
                  )}
                  {bulkResult.errors.length > 0 && (
                    <details open><summary className="text-xs cursor-pointer text-destructive">Ошибки ({bulkResult.errors.length})</summary>
                      <ul className="text-xs mt-1 space-y-0.5 text-destructive">{bulkResult.errors.map((r, i) => <li key={i}>· {r.question_ru.slice(0, 80)}: {r.error}</li>)}</ul>
                    </details>
                  )}
                </div>
              )}
              <button type="submit" disabled={bulkBusy || !bulkText.trim()} className="px-5 py-2 bg-accent text-primary-foreground rounded-sm font-serif disabled:opacity-50">
                {bulkBusy ? "Импортируем…" : "Импортировать массово"}
              </button>
            </form>
          </section>
        </div>
      </details>
    </div>
  );
}