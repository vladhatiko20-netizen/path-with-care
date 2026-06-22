import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import JSZip from "jszip";
import { Archive, Download } from "lucide-react";
import {
  adminExportAllDestinations,
  adminExportAllPriestFaq,
  adminExportAllBlogPosts,
  adminExportAllCatalogItems,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_admin/admin/backup")({
  component: BackupPage,
});

type BackupBlock = {
  key: string;
  label: string;
  filename: (date: string) => string;
  exportFn: () => Promise<unknown>;
  countOf: (res: any) => number;
  warningsOf?: (res: any) => string[];
};

function todayLocalISODate(): string {
  // Local date YYYY-MM-DD (Europe/Chisinau-friendly: uses runtime tz which on
  // server/dev is fine; this runs client-side in the admin).
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

type Result = {
  archiveName: string;
  blocks: Array<{ label: string; count: number }>;
  warnings: string[];
};

function BackupPage() {
  const exportDestinations = useServerFn(adminExportAllDestinations);
  const exportPriestFaq = useServerFn(adminExportAllPriestFaq);
  const exportBlog = useServerFn(adminExportAllBlogPosts);
  const exportCatalog = useServerFn(adminExportAllCatalogItems);

  const blocks: BackupBlock[] = [
    {
      key: "destinations",
      label: "Направления",
      filename: (d) => `destinations-${d}.json`,
      exportFn: () => exportDestinations(),
      countOf: (r) => (Array.isArray(r?.destinations) ? r.destinations.length : 0),
    },
    {
      key: "priest_faq",
      label: "Вопросы священнику",
      filename: (d) => `priest-faq-${d}.json`,
      exportFn: () => exportPriestFaq(),
      countOf: (r) => (Array.isArray(r?.priest_faq) ? r.priest_faq.length : 0),
    },
    {
      key: "blog",
      label: "Блог",
      filename: (d) => `blog-${d}.json`,
      exportFn: () => exportBlog(),
      countOf: (r) => (Array.isArray(r?.blog_posts) ? r.blog_posts.length : 0),
      warningsOf: (r) => (Array.isArray(r?.warnings) ? r.warnings : []),
    },
    {
      key: "catalog",
      label: "Каталог",
      filename: (d) => `catalog-${d}.json`,
      exportFn: () => exportCatalog(),
      countOf: (r) => (Array.isArray(r?.catalog_items) ? r.catalog_items.length : 0),
    },
  ];

  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  async function downloadBackup() {
    setBusy(true);
    setError(null);
    setStatus("Готовим архив…");
    try {
      const date = todayLocalISODate();
      const results = await Promise.all(
        blocks.map(async (b) => {
          try {
            const data = await b.exportFn();
            return { block: b, data };
          } catch (e) {
            throw new Error(`${b.label}: ${e instanceof Error ? e.message : String(e)}`);
          }
        }),
      );

      const zip = new JSZip();
      const blockSummary: Array<{ label: string; count: number }> = [];
      const warnings: string[] = [];
      for (const { block, data } of results) {
        zip.file(block.filename(date), JSON.stringify(data, null, 2));
        blockSummary.push({ label: block.label, count: block.countOf(data) });
        if (block.warningsOf) warnings.push(...block.warningsOf(data));
      }

      const blob = await zip.generateAsync({ type: "blob" });
      const archiveName = `backup-palomnik-${date}.zip`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = archiveName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      setResult({ archiveName, blocks: blockSummary, warnings });
      setStatus(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Archive className="w-6 h-6 text-foreground" />
        <h1 className="font-serif text-2xl text-foreground">Резервная копия</h1>
      </div>

      <p className="text-sm text-muted-foreground mb-2">
        Бэкап делается вручную: автоматических копий контента нет.
      </p>
      <p className="text-sm text-muted-foreground mb-2">
        Скачанный архив храните вне Lovable – в Project Knowledge или на диске.
      </p>
      <p className="text-sm text-muted-foreground mb-6">
        Код сайта версионируется отдельно через Git; содержимое базы сохраняется
        только этими ручными выгрузками.
      </p>

      <div className="border border-border rounded-sm p-5 bg-card">
        <h2 className="font-serif text-lg text-foreground mb-2">Полная резервная копия контента</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Один ZIP-архив со всеми блоками. В архиве по одному JSON на блок –
          в том же формате, что и кнопки «Скачать все» на страницах блоков
          (можно загрузить обратно через существующие bulk-импорты).
        </p>
        <ul className="text-sm text-muted-foreground mb-5 space-y-1">
          {blocks.map((b) => (
            <li key={b.key}>• {b.label} → <code className="text-xs">{b.filename("YYYY-MM-DD")}</code></li>
          ))}
        </ul>
        <button
          onClick={downloadBackup}
          disabled={busy}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-primary-foreground rounded-sm text-sm font-serif disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {busy ? "Готовим архив…" : "Скачать полную резервную копию"}
        </button>

        {status && <p className="mt-4 text-sm text-muted-foreground">{status}</p>}
        {error && (
          <p className="mt-4 text-sm text-red-600">
            Ошибка: {error}. Архив не сформирован.
          </p>
        )}
      </div>

      {result && (
        <div className="mt-6 border border-border rounded-sm p-5 bg-secondary/30">
          <h3 className="font-serif text-base text-foreground mb-2">Последний бэкап</h3>
          <p className="text-sm text-foreground">
            Скачан архив <strong>{result.archiveName}</strong>:{" "}
            {result.blocks.map((b, i) => (
              <span key={b.label}>
                {b.label} ({b.count})
                {i < result.blocks.length - 1 ? ", " : ""}
              </span>
            ))}
            .
          </p>
          {result.warnings.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-foreground mb-1">Предупреждения блога:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                {result.warnings.map((w, i) => (
                  <li key={i}>• {w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}