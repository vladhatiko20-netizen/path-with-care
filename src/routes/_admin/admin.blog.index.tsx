import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  adminListBlogPosts,
  adminDeleteBlogPost,
  adminExportBlogPost,
  adminExportAllBlogPosts,
  adminImportBlogPost,
  adminImportBlogPostsBulk,
} from "@/lib/admin.functions";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/blog/")({
  component: Page,
});

const EMPTY_TEMPLATE = {
  slug: "",
  published_at: new Date().toISOString().slice(0, 10),
  cover_image: null,
  title_ru: "",
  title_ro: "",
  excerpt_ru: null,
  excerpt_ro: null,
  body_ru: "",
  body_ro: "",
  seo_title_ru: null,
  seo_title_ro: null,
  seo_description_ru: null,
  seo_description_ro: null,
  is_published: false,
};

type SingleResult = { ok: true; action: "created" | "updated"; id: string; slug: string; warnings: string[] };
type BulkResult = {
  ok: true;
  mode: "skip" | "upsert" | "only_new";
  summary: { created: number; updated: number; skipped: number; errors: number };
  created: Array<{ slug: string; id: string }>;
  updated: Array<{ slug: string; id: string }>;
  skipped: Array<{ slug: string; reason: string }>;
  errors: Array<{ slug: string; error: string }>;
  warnings: string[];
};

function Page() {
  const list = useServerFn(adminListBlogPosts);
  const del = useServerFn(adminDeleteBlogPost);
  const exportOne = useServerFn(adminExportBlogPost);
  const exportAll = useServerFn(adminExportAllBlogPosts);
  const importOne = useServerFn(adminImportBlogPost);
  const importBulk = useServerFn(adminImportBlogPostsBulk);
  const router = useRouter();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: () => list(),
  });

  const [text, setText] = useState("");
  const [singleBusy, setSingleBusy] = useState(false);
  const [singleError, setSingleError] = useState<string | null>(null);
  const [singleResult, setSingleResult] = useState<SingleResult | null>(null);
  const [exportId, setExportId] = useState<string>("");
  const [exportBusy, setExportBusy] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportWarnings, setExportWarnings] = useState<string[]>([]);
  const [exportAllBusy, setExportAllBusy] = useState(false);
  const [exportAllError, setExportAllError] = useState<string | null>(null);
  const [exportAllWarnings, setExportAllWarnings] = useState<string[]>([]);

  const [bulkText, setBulkText] = useState("");
  const [bulkMode, setBulkMode] = useState<"skip" | "upsert" | "only_new">("skip");
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [bulkResult, setBulkResult] = useState<BulkResult | null>(null);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Удалить статью "${title}"?`)) return;
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
    if (!exportId) { setExportError("Выберите статью."); return; }
    setExportError(null); setExportWarnings([]); setExportBusy(true);
    try {
      const res = await exportOne({ data: { id: exportId } });
      setExportWarnings(res.warnings ?? []);
      if (mode === "download") {
        const safe = (res.payload.slug || "post").slice(0, 60);
        downloadJson(`blog-${safe}.json`, res.payload);
      } else {
        setText(JSON.stringify(res.payload, null, 2));
        setSingleError(null); setSingleResult(null);
      }
    } catch (e: unknown) {
      setExportError(e instanceof Error ? e.message : "Ошибка экспорта");
    } finally { setExportBusy(false); }
  }

  async function runExportAll() {
    setExportAllError(null); setExportAllWarnings([]); setExportAllBusy(true);
    try {
      const res = await exportAll();
      setExportAllWarnings(res.warnings ?? []);
      const date = new Date().toISOString().slice(0, 10);
      downloadJson(`blog-all-${date}.json`, res);
    } catch (e: unknown) {
      setExportAllError(e instanceof Error ? e.message : "Ошибка экспорта");
    } finally { setExportAllBusy(false); }
  }

  function loadTemplate() {
    setText(JSON.stringify(EMPTY_TEMPLATE, null, 2));
    setSingleError(null); setSingleResult(null);
  }
  function downloadTemplate() {
    downloadJson("blog-template.json", EMPTY_TEMPLATE);
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
        "Режим «Обновить существующие»: для статей с совпадающим slug будут перезаписаны только те поля, которые присутствуют во входящем JSON. Отсутствующие ключи (например, cover_image или body_*) сохранят текущие значения в базе. Продолжить?",
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
        <h1 className="font-serif text-3xl">Статьи блога</h1>
        <Link to="/admin/blog/new" className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-primary-foreground rounded-sm font-serif text-sm">
          <Plus className="w-4 h-4" /> Новая статья
        </Link>
      </div>

      {isLoading ? <p className="text-muted-foreground">Загрузка…</p> : (
        <div className="border border-border rounded-sm bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-left">
              <tr>
                <th className="px-4 py-3 font-serif">Заголовок (RU)</th>
                <th className="px-4 py-3 font-serif">Дата</th>
                <th className="px-4 py-3 font-serif">Статус</th>
                <th className="px-4 py-3 w-32"></th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Пока нет статей.</td></tr>
              )}
              {(data ?? []).map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3">{p.title_ru}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.published_at}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-sm text-xs ${p.is_published ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}`}>
                      {p.is_published ? "Опубликовано" : "Черновик"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <Link to="/admin/blog/$id" params={{ id: p.id }} className="p-1.5 hover:bg-secondary rounded-sm" title="Редактировать">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(p.id, p.title_ru)} className="p-1.5 hover:bg-destructive/10 text-destructive rounded-sm" title="Удалить">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <details className="mt-10 border border-border rounded-sm bg-muted/30">
        <summary className="cursor-pointer px-4 py-3 font-serif text-lg select-none">
          Импорт / экспорт JSON
        </summary>
        <div className="p-4 space-y-8">
          <section>
            <h2 className="font-serif text-base mb-2">Экспорт</h2>
            <p className="text-xs text-muted-foreground mb-3">
              HTML-тело статьи (<code>body_ru</code>/<code>body_ro</code>) и URL-ы изображений (<code>cover_image</code>, <code>&lt;img&gt;</code> в теле) выгружаются <strong>как есть, 1:1</strong>. Поля <code>id</code>, <code>created_at</code>, <code>updated_at</code> не включаются.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={exportId}
                onChange={(e) => setExportId(e.target.value)}
                className="px-3 py-2 border border-border rounded-sm bg-background text-sm min-w-[280px]"
              >
                <option value="">– выберите статью –</option>
                {(data ?? []).map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title_ru.slice(0, 80)}{d.is_published ? "" : " · черновик"}
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
            {exportWarnings.length > 0 && (
              <ul className="mt-3 p-3 border border-amber-300 bg-amber-50 rounded-sm text-xs text-amber-900 space-y-0.5">
                {exportWarnings.map((w, i) => <li key={i}>· {w}</li>)}
              </ul>
            )}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">
                Полный бэкап одним файлом: <code>{`{ "blog_posts": [...], "warnings": [...] }`}</code>, отсортирован по дате публикации.
              </p>
              <button type="button" onClick={runExportAll} disabled={exportAllBusy} className="px-4 py-2 border border-border rounded-sm font-serif text-sm disabled:opacity-50">
                {exportAllBusy ? "Экспорт всех…" : "Экспортировать все статьи"}
              </button>
              {exportAllError && <p className="mt-3 text-sm text-destructive">{exportAllError}</p>}
              {exportAllWarnings.length > 0 && (
                <details className="mt-3" open>
                  <summary className="text-xs cursor-pointer text-amber-900">Предупреждения: длинные тире в {exportAllWarnings.length} статьях</summary>
                  <ul className="mt-2 p-3 border border-amber-300 bg-amber-50 rounded-sm text-xs text-amber-900 space-y-0.5">
                    {exportAllWarnings.map((w, i) => <li key={i}>· {w}</li>)}
                  </ul>
                </details>
              )}
            </div>
          </section>

          <section>
            <h2 className="font-serif text-base mb-2">Одиночный импорт</h2>
            <p className="text-xs text-muted-foreground mb-3">
              Вставьте JSON одной статьи. Совпадение ищется по <code>slug</code>: найдено — обновляется, нет — создаётся. При upsert <strong>отсутствующие ключи сохраняют текущее значение в БД</strong> (например, опустите <code>cover_image</code> и <code>body_*</code> — они не будут затронуты). Значение <code>null</code> или <code>""</code> = явный сброс. Длинные тире (—) в теле разрешены и показываются как предупреждение.
            </p>
            <div className="flex flex-wrap gap-3 mb-3">
              <button type="button" onClick={loadTemplate} className="px-4 py-2 border border-border rounded-sm font-serif text-sm">Вставить пустой шаблон</button>
              <button type="button" onClick={downloadTemplate} className="px-4 py-2 border border-border rounded-sm font-serif text-sm">Скачать пустой шаблон (.json)</button>
            </div>
            <form onSubmit={onSingleSubmit} className="space-y-3">
              <textarea
                className="w-full h-[360px] px-3 py-2 border border-border rounded-sm bg-background text-xs font-mono"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder='{ "slug": "...", "title_ru": "...", "title_ro": "...", "body_ru": "<p>...</p>", "body_ro": "<p>...</p>" }'
                spellCheck={false}
              />
              {singleError && (
                <div className="p-3 border border-destructive/40 bg-destructive/5 rounded-sm">
                  <p className="text-sm text-destructive whitespace-pre-wrap">{singleError}</p>
                </div>
              )}
              {singleResult && (
                <div className="p-3 border border-green-300 bg-green-50 rounded-sm space-y-2">
                  <p className="text-sm text-green-900">
                    {singleResult.action === "created" ? "Создана" : "Обновлена"} статья «{singleResult.slug}».{" "}
                    <Link to="/admin/blog/$id" params={{ id: singleResult.id }} className="underline">Открыть →</Link>
                  </p>
                  {singleResult.warnings.length > 0 && (
                    <ul className="text-xs text-amber-900 space-y-0.5">
                      {singleResult.warnings.map((w, i) => <li key={i}>⚠ {w}</li>)}
                    </ul>
                  )}
                </div>
              )}
              <button type="submit" disabled={singleBusy || !text.trim()} className="px-5 py-2 bg-accent text-primary-foreground rounded-sm font-serif disabled:opacity-50">
                {singleBusy ? "Импортируем…" : "Импортировать"}
              </button>
            </form>
          </section>

          <section>
            <h2 className="font-serif text-base mb-2">Массовый импорт</h2>
            <p className="text-xs text-muted-foreground mb-3">
              JSON-массив или объект <code>{`{ "blog_posts": [...] }`}</code> либо <code>{`{ "mode", "items" }`}</code>. Лимит – 50 статей за батч. Совпадение по <code>slug</code>. При upsert правило сохранения отсутствующих ключей действует и здесь.
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
                placeholder='[ { "slug": "...", "title_ru": "...", ... }, ... ]  или  { "blog_posts": [ ... ] }'
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
                      <ul className="text-xs mt-1 space-y-0.5">{bulkResult.created.map((r) => <li key={r.id}>· {r.slug}</li>)}</ul>
                    </details>
                  )}
                  {bulkResult.updated.length > 0 && (
                    <details><summary className="text-xs cursor-pointer">Обновлено ({bulkResult.updated.length})</summary>
                      <ul className="text-xs mt-1 space-y-0.5">{bulkResult.updated.map((r) => <li key={r.id}>· {r.slug}</li>)}</ul>
                    </details>
                  )}
                  {bulkResult.skipped.length > 0 && (
                    <details><summary className="text-xs cursor-pointer">Пропущено ({bulkResult.skipped.length})</summary>
                      <ul className="text-xs mt-1 space-y-0.5">{bulkResult.skipped.map((r, i) => <li key={i}>· {r.slug} – {r.reason}</li>)}</ul>
                    </details>
                  )}
                  {bulkResult.errors.length > 0 && (
                    <details open><summary className="text-xs cursor-pointer text-destructive">Ошибки ({bulkResult.errors.length})</summary>
                      <ul className="text-xs mt-1 space-y-0.5 text-destructive">{bulkResult.errors.map((r, i) => <li key={i}>· {r.slug}: {r.error}</li>)}</ul>
                    </details>
                  )}
                  {bulkResult.warnings.length > 0 && (
                    <details open><summary className="text-xs cursor-pointer text-amber-900">Предупреждения о длинных тире ({bulkResult.warnings.length})</summary>
                      <ul className="text-xs mt-1 space-y-0.5 text-amber-900">{bulkResult.warnings.map((w, i) => <li key={i}>· {w}</li>)}</ul>
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
