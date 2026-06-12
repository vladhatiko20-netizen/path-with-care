import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Search, Phone, Mail, CheckCheck } from "lucide-react";
import { adminListLeads, adminMarkAllLeadsRead } from "@/lib/admin.functions";
import { sourceLabel, formatLeadDate, telLink, viberLink, isMoldovaPhone, SOURCE_LABELS } from "@/lib/leads-shared";

export const Route = createFileRoute("/_admin/admin/leads/")({
  component: Page,
});

type Status = "all" | "new" | "read";
type Period = "all" | "week" | "month";

function Page() {
  const list = useServerFn(adminListLeads);
  const markAll = useServerFn(adminMarkAllLeadsRead);
  const router = useRouter();
  const qc = useQueryClient();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Status>("all");
  const [source, setSource] = useState<string>("");
  const [period, setPeriod] = useState<Period>("all");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-leads", { search, status, source, period }],
    queryFn: () => list({ data: { search, status, source: source || undefined, period } }),
  });

  const rows = data ?? [];

  const sourceOptions = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => r.source && set.add(r.source));
    return Array.from(set).sort();
  }, [rows]);

  async function handleMarkAll() {
    if (!confirm("Отметить все заявки прочитанными?")) return;
    await markAll({});
    await refetch();
    qc.invalidateQueries({ queryKey: ["admin-leads-unread-count"] });
    router.invalidate();
  }

  const hasUnread = rows.some((r) => !r.is_read);

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1 className="font-serif text-2xl md:text-3xl">Заявки</h1>
        {hasUnread && (
          <button
            onClick={handleMarkAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-border rounded-sm hover:bg-secondary"
          >
            <CheckCheck className="w-4 h-4" /> Отметить все
          </button>
        )}
      </div>

      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по имени, телефону, email…"
            className="w-full pl-9 pr-3 py-2 text-sm bg-card border border-border rounded-sm focus:outline-none focus:border-accent"
          />
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <Chips
            value={status}
            onChange={(v) => setStatus(v as Status)}
            options={[
              { v: "all", l: "Все" },
              { v: "new", l: "Новые" },
              { v: "read", l: "Прочитанные" },
            ]}
          />
          <Chips
            value={period}
            onChange={(v) => setPeriod(v as Period)}
            options={[
              { v: "all", l: "За всё время" },
              { v: "week", l: "Неделя" },
              { v: "month", l: "Месяц" },
            ]}
          />
          {sourceOptions.length > 1 && (
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="px-3 py-1.5 bg-card border border-border rounded-sm text-sm"
            >
              <option value="">Все источники</option>
              {sourceOptions.map((s) => (
                <option key={s} value={s}>{SOURCE_LABELS[s] ?? s}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Загрузка…</p>
      ) : rows.length === 0 ? (
        <div className="border border-border rounded-sm bg-card p-8 text-center text-muted-foreground">
          Пока нет заявок по этим условиям.
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => {
            const moldova = isMoldovaPhone(r.phone);
            const preview = (r.message ?? "").trim().slice(0, 90);
            return (
              <li
                key={r.id}
                className={`relative bg-card border rounded-sm transition-colors ${r.is_read ? "border-border" : "border-border border-l-2 border-l-gold"}`}
              >
                <Link
                  to="/admin/leads/$id"
                  params={{ id: r.id }}
                  className="block p-4 hover:bg-gold/5"
                >
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      {!r.is_read && (
                        <span className="inline-block w-2 h-2 rounded-full bg-gold shrink-0" aria-label="Непрочитано" />
                      )}
                      <h2 className={`font-serif text-lg truncate ${r.is_read ? "text-muted-foreground" : "text-foreground"}`}>
                        {r.name}
                      </h2>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{formatLeadDate(r.created_at)}</span>
                  </div>
                  {r.phone && <div className="text-sm text-accent font-medium">{r.phone}</div>}
                  {r.email && <div className="text-sm text-muted-foreground truncate">{r.email}</div>}
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-secondary text-muted-foreground rounded-sm">
                      {sourceLabel(r.source)}
                    </span>
                    {preview && (
                      <span className="text-muted-foreground truncate">«{preview}{(r.message ?? "").length > 90 ? "…" : ""}»</span>
                    )}
                  </div>
                </Link>
                {r.phone && (
                <div className="flex border-t border-border/60">
                  <a
                    href={telLink(r.phone)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-foreground hover:bg-gold/5"
                  >
                    <Phone className="w-3.5 h-3.5" /> Позвонить
                  </a>
                  {moldova && (
                    <a
                      href={viberLink(r.phone)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs border-l border-border/60 hover:opacity-80"
                      style={{ color: "#7360F2" }}
                    >
                      Viber
                    </a>
                  )}
                </div>
                )}
                  {r.email && (
                    <a
                      href={`mailto:${r.email}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-foreground hover:bg-gold/5 border-l border-border/60"
                    >
                      <Mail className="w-3.5 h-3.5" /> Email
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Chips({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ v: string; l: string }>;
}) {
  return (
    <div className="inline-flex border border-border rounded-sm overflow-hidden">
      {options.map((o) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className={`px-3 py-1.5 text-sm transition-colors ${value === o.v ? "bg-accent text-primary-foreground" : "bg-card text-foreground hover:bg-secondary"}`}
        >
          {o.l}
        </button>
      ))}
    </div>
  );
}