import { createFileRoute, Link, useRouter, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { ArrowLeft, Phone, Mail, Trash2, MessageCircleQuestion } from "lucide-react";
import { adminGetLead, adminMarkLeadRead, adminDeleteLead } from "@/lib/admin.functions";
import { sourceLabel, formatLeadDate, telLink, viberLink, isMoldovaPhone, leadCategory, CATEGORY_LABELS } from "@/lib/leads-shared";

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
  const cat = leadCategory(lead.source);
  const isPilg = cat === "pilgrimage";
  const isPriest = cat === "priest";

  return (
    <div className="p-4 md:p-8 max-w-2xl">
      <Link to="/admin/leads" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> К списку заявок
      </Link>

      <header className="mb-6">
        {isPilg ? (
          <>
            <div className="mb-3 inline-flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase font-medium text-accent bg-accent/10 px-2 py-1 rounded-sm">
              Заявка · {CATEGORY_LABELS.pilgrimage}
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-accent font-medium mb-2">
              {sourceLabel(lead.source)}
            </h1>
            <div className="text-lg text-foreground mb-1">{lead.name}</div>
            <div className="text-sm text-muted-foreground">{formatLeadDate(lead.created_at)}</div>
          </>
        ) : (
          <>
            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-2">{lead.name}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>{formatLeadDate(lead.created_at)}</span>
              <span>·</span>
              <span className="px-2 py-0.5 bg-secondary rounded-sm">{sourceLabel(lead.source)}</span>
            </div>
          </>
        )}
      </header>

      <div className="space-y-3 mb-6">
        {/* Phone row */}
        {lead.phone && (
        <div className={`flex items-stretch bg-card border-y border-r border-border/40 rounded-sm overflow-hidden ${isPilg ? "border-l-2 border-l-accent" : "border-l-2 border-l-gold"}`}>
          <a href={telLink(lead.phone)} className={`flex items-center gap-3 flex-1 min-w-0 py-3 pl-4 pr-2 ${isPilg ? "hover:bg-accent/5" : "hover:bg-gold/5"}`}>
            <span className={`w-9 h-9 rounded-full inline-flex items-center justify-center shrink-0 ${isPilg ? "bg-accent/15" : "bg-gold/15"}`}>
              <Phone className="w-4 h-4 text-foreground" />
            </span>
            <span className="font-serif text-lg text-accent">{lead.phone}</span>
          </a>
          {(
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
            className={`flex items-center gap-3 bg-card border-y border-r border-border/40 rounded-sm py-3 pl-4 pr-4 ${isPilg ? "border-l-2 border-l-accent hover:bg-accent/5" : "border-l-2 border-l-gold hover:bg-gold/5"}`}
          >
            <span className={`w-9 h-9 rounded-full inline-flex items-center justify-center shrink-0 ${isPilg ? "bg-accent/15" : "bg-gold/15"}`}>
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
        {isPriest && (
          <Link
            to="/admin/priest-faq/new"
            search={{ question: lead.message ?? "", from_lead: lead.id }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-accent/40 text-accent rounded-sm hover:bg-accent/10"
          >
            <MessageCircleQuestion className="w-4 h-4" /> Опубликовать как вопрос-ответ
          </Link>
        )}
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