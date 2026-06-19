import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Search, Phone, Mail, CheckCheck } from "lucide-react";
import { adminListLeads, adminMarkAllLeadsRead, adminCountUnreadLeads } from "@/lib/admin.functions";
import {
  sourceLabel,
  formatLeadDate,
  telLink,
  viberLink,
  isMoldovaPhone,
  leadCategory,
  CATEGORY_LABELS,
  type LeadCategory,
} from "@/lib/leads-shared";

export const Route = createFileRoute("/_admin/admin/leads/")({
  component: Page,
});

type Status = "all" | "new" | "read";
type Period = "all" | "week" | "month";

function Page() {
  const list = useServerFn(adminListLeads);
  const markAll = useServerFn(adminMarkAllLeadsRead);
  const countUnread = useServerFn(adminCountUnreadLeads);
  const router = useRouter();
  const qc = useQueryClient();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Status>("all");
  const [source, setSource] = useState<string>("");
  const [period, setPeriod] = useState<Period>("all");
  const [category, setCategory] = useState<LeadCategory>("pilgrimage");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-leads", { search, status, source, period, category }],
    queryFn: () => list({ data: { search, status, source: source || undefined, period, category } }),
  });

  const { data: unread } = useQuery({
    queryKey: ["admin-leads-unread-count"],
    queryFn: () => countUnread({}),
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

  const tabs: Array<{ v: LeadCategory; l: string; n: number }> = [
    { v: "pilgrimage", l: CATEGORY_LABELS.pilgrimage, n: unread?.pilgrimage ?? 0 },
    { v: "priest", l: CATEGORY_LABELS.priest, n: unread?.priest ?? 0 },
    { v: "other", l: CATEGORY_LABELS.other, n: unread?.other ?? 0 },
  ];

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1 className="font-serif text-2xl md:text-3xl flex items-center">
          Заявки
          <style>{`@keyframes colorShift { 0%, 100% { background-color: #ef4444; } 50% { background-color: #10b981; } }`}</style>
          <span
            className="inline-block w-8 h-8 rounded-full ml-3"
            style={{ animation: "colorShift 2s ease-in-out infinite" }}
            aria-hidden="true"
          />
        </h1>
        {hasUnread && (
          <button
            onClick={handleMarkAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-border rounded-sm hover:bg-secondary"
          >
            <CheckCheck className="w-4 h-4" /> Отметить все
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-1 mb-5 border-b border-border">
        {tabs.map((t) => {
          const active = category === t.v;
          const isPilg = t.v === "pilgrimage";
          return (
            <button
              key={t.v}
              onClick={() => setCategory(t.v)}
              className={`relative px-4 py-2 text-sm font-medium transition-colors -mb-px border-b-2 ${
                active
                  ? isPilg
                    ? "border-accent text-accent"
                    : "border-gold text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.l}
              {t.n > 0 && (
                <span
                  className={`ml-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-semibold rounded-full ${
                    isPilg ? "bg-accent text-primary-foreground" : "bg-gold/25 text-foreground"
                  }`}
                >
                  {t.n > 99 ? "99+" : t.n}
                </span>
              )}
            </button>
          );
        })}
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
                <option key={s} value={s}>{sourceLabel(s)}</option>
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
            const cat = leadCategory(r.source);
            const isPilg = cat === "pilgrimage";
            return (
              <li
                key={r.id}
                className={`relative bg-card border rounded-sm transition-colors ${
                  isPilg
                    ? `border-accent/40 border-l-4 border-l-accent ${r.is_read ? "" : "bg-accent/[0.04]"}`
                    : r.is_read
                      ? "border-border"
                      : "border-border border-l-2 border-l-gold"
                }`}
              >
                <Link
                  to="/admin/leads/$id"
                  params={{ id: r.id }}
                  className={`block p-4 ${isPilg ? "hover:bg-accent/5" : "hover:bg-gold/5"}`}
                >
                  {isPilg ? (
                    <>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {!r.is_read && (
                            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#ef4444] animate-pulse shrink-0" aria-label="Непрочитано" />
                          )}
                          <h2 className="font-serif text-xl md:text-2xl text-accent font-medium truncate">
                            {sourceLabel(r.source)}
                          </h2>
                        </div>
                        <span className="shrink-0 text-[10px] tracking-[0.18em] uppercase font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-sm">
                          Заявка
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="text-sm text-foreground/80 truncate">{r.name}</span>
                        <span className="text-xs text-muted-foreground shrink-0">{formatLeadDate(r.created_at)}</span>
                      </div>
                      {r.phone && <div className="text-sm text-accent font-medium">{r.phone}</div>}
                      {r.email && <div className="text-sm text-muted-foreground truncate">{r.email}</div>}
                      {preview && (
                        <div className="mt-2 text-xs text-muted-foreground truncate">
                          «{preview}{(r.message ?? "").length > 90 ? "…" : ""}»
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      {!r.is_read && (
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#ef4444] animate-pulse shrink-0" aria-label="Непрочитано" />
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
                    </>
                  )}
                </Link>
                {(r.phone || r.email) && (
                <div className="flex border-t border-border/60">
                  {r.phone && <a
                    href={telLink(r.phone)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-foreground ${isPilg ? "hover:bg-accent/5" : "hover:bg-gold/5"}`}
                  >
                    <Phone className="w-3.5 h-3.5" /> Позвонить
                  </a>}
                  {r.phone && moldova && (
                    <a
                      href={viberLink(r.phone)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs border-l border-border/60 hover:opacity-80"
                      style={{ color: "#7360F2" }}
                    >
                      Viber
                    </a>
                  )}
                  {r.email && (
                    <a
                      href={`mailto:${r.email}`}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-foreground border-l border-border/60 ${isPilg ? "hover:bg-accent/5" : "hover:bg-gold/5"}`}
                    >
                      <Mail className="w-3.5 h-3.5" /> Email
                    </a>
                  )}
                </div>
                )}
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