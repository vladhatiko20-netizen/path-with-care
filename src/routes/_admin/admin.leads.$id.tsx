import { createFileRoute, Link, useRouter, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { ArrowLeft, Phone, Mail, Trash2 } from "lucide-react";
import { adminGetLead, adminMarkLeadRead, adminDeleteLead } from "@/lib/admin.functions";
import { sourceLabel, formatLeadDate, telLink, viberLink, isMoldovaPhone } from "@/lib/leads-shared";

export const Route = createFileRoute("/_admin/admin/leads/$id")({
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  const get = useServerFn(adminGetLead);
  const markRead = useServerFn(adminMarkLeadRead);
  const del = useServerFn(adminDeleteLead);
  const router = useRouter();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: lead, isLoading } = useQuery({
    queryKey: ["admin-lead", id],
    queryFn: () => get({ data: { id } }),
  });

  // auto-mark as read on open
  useEffect(() => {
    if (lead && !lead.is_read) {
      markRead({ data: { id, is_read: true } }).then(() => {
        qc.invalidateQueries({ queryKey: ["admin-leads-unread-count"] });
        qc.invalidateQueries({ queryKey: ["admin-leads"] });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead?.id, lead?.is_read]);

  async function handleDelete() {
    if (!confirm("Удалить эту заявку? Это действие нельзя отменить.")) return;
    await del({ data: { id } });
    qc.invalidateQueries({ queryKey: ["admin-leads"] });
    qc.invalidateQueries({ queryKey: ["admin-leads-unread-count"] });
    router.invalidate();
    navigate({ to: "/admin/leads" });
  }

  async function toggleRead() {
    if (!lead) return;
    await markRead({ data: { id, is_read: !lead.is_read } });
    qc.invalidateQueries({ queryKey: ["admin-lead", id] });
    qc.invalidateQueries({ queryKey: ["admin-leads-unread-count"] });
    qc.invalidateQueries({ queryKey: ["admin-leads"] });
  }

  if (isLoading) {
    return <div className="p-8 text-muted-foreground">Загрузка…</div>;
  }

  if (!lead) {
    return (
      <div className="p-8 max-w-2xl">
        <Link to="/admin/leads" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> К списку заявок
        </Link>
        <p>Заявка не найдена.</p>
      </div>
    );
  }

  const moldova = isMoldovaPhone(lead.phone);

  return (
    <div className="p-4 md:p-8 max-w-2xl">
      <Link to="/admin/leads" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> К списку заявок
      </Link>

      <header className="mb-6">
        <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-2">{lead.name}</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{formatLeadDate(lead.created_at)}</span>
          <span>·</span>
          <span className="px-2 py-0.5 bg-secondary rounded-sm">{sourceLabel(lead.source)}</span>
        </div>
      </header>

      <div className="space-y-3 mb-6">
        {lead.phone && (
        {/* Phone row */}
        <div className="flex items-stretch bg-card border-l-2 border-l-gold border-y border-r border-border/40 rounded-sm overflow-hidden">
          <a href={telLink(lead.phone)} className="flex items-center gap-3 flex-1 min-w-0 py-3 pl-4 pr-2 hover:bg-gold/5">
            <span className="w-9 h-9 rounded-full bg-gold/15 inline-flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 text-foreground" />
            </span>
            <span className="font-serif text-lg text-accent">{lead.phone}</span>
          </a>
          {moldova && (
            <a
              href={viberLink(lead.phone)}
              className="shrink-0 self-center mr-3 ml-2 px-3 py-1 rounded-full text-xs font-medium hover:opacity-80"
              style={{ backgroundColor: "rgba(115,96,242,0.10)", color: "#7360F2" }}
            >
              Viber
            </a>
          )}
        </div>
        )}

        {/* Email row */}
        {lead.email && (
          <a
            href={`mailto:${lead.email}`}
            className="flex items-center gap-3 bg-card border-l-2 border-l-gold border-y border-r border-border/40 rounded-sm py-3 pl-4 pr-4 hover:bg-gold/5"
          >
            <span className="w-9 h-9 rounded-full bg-gold/15 inline-flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-foreground" />
            </span>
            <span className="text-foreground break-all">{lead.email}</span>
          </a>
        )}
      </div>

      {lead.message && (
        <div className="mb-8">
          <h2 className="font-serif text-sm text-muted-foreground mb-2">Сообщение</h2>
          <div className="bg-card border border-border rounded-sm p-4 whitespace-pre-wrap text-foreground leading-relaxed">
            {lead.message}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border">
        <button
          onClick={toggleRead}
          className="px-3 py-1.5 text-sm border border-border rounded-sm hover:bg-secondary"
        >
          {lead.is_read ? "Отметить непрочитанной" : "Отметить прочитанной"}
        </button>
        <button
          onClick={handleDelete}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-destructive border border-destructive/30 rounded-sm hover:bg-destructive/10 ml-auto"
        >
          <Trash2 className="w-4 h-4" /> Удалить
        </button>
      </div>
    </div>
  );
}