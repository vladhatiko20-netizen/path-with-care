import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { FileText, Calendar, MapPin, Inbox, Info, Users } from "lucide-react";
import { adminCountUnreadLeads } from "@/lib/admin.functions";

export const Route = createFileRoute("/_admin/admin/")({
  component: Page,
});

function Page() {
  const countUnread = useServerFn(adminCountUnreadLeads);
  const { data: unread } = useQuery({
    queryKey: ["admin-leads-unread-count"],
    queryFn: () => countUnread(),
  });
  const unreadCount = unread?.count ?? 0;
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-serif text-3xl text-foreground mb-2">Добро пожаловать</h1>
      <p className="text-muted-foreground mb-8">Управление содержанием сайта.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <Link to="/admin/leads" className="block p-6 border border-border rounded-sm bg-card hover:border-accent transition-colors relative">
          <Inbox className="w-6 h-6 text-accent mb-3" />
          <h2 className="font-serif text-xl mb-1">
            Заявки
            {unreadCount > 0 && (
              <>
                <style>{`@keyframes colorShift { 0%, 100% { background-color: #ef4444; } 50% { background-color: #10b981; } }`}</style>
                <span
                  className="ml-2 inline-flex items-center justify-center min-w-8 h-8 px-2 rounded-full text-white text-sm font-semibold align-middle"
                  style={{ animation: "colorShift 2s ease-in-out infinite" }}
                  aria-label={`Непрочитанных заявок: ${unreadCount}`}
                >
                  {unreadCount}
                </span>
              </>
            )}
          </h2>
          <p className="text-sm text-muted-foreground">Заявки с форм сайта: имя, телефон, сообщение.</p>
        </Link>
        <Link to="/admin/blog" className="block p-6 border border-border rounded-sm bg-card hover:border-accent transition-colors">
          <FileText className="w-6 h-6 text-accent mb-3" />
          <h2 className="font-serif text-xl mb-1">Статьи блога</h2>
          <p className="text-sm text-muted-foreground">Создавайте и редактируйте публикации.</p>
        </Link>
        <Link to="/admin/pilgrimages" className="block p-6 border border-border rounded-sm bg-card hover:border-accent transition-colors">
          <Calendar className="w-6 h-6 text-accent mb-3" />
          <h2 className="font-serif text-xl mb-1">Календарь поездок</h2>
          <p className="text-sm text-muted-foreground">Поездки, даты, места и цены.</p>
        </Link>
        <Link to="/admin/destinations" className="block p-6 border border-border rounded-sm bg-card hover:border-accent transition-colors">
          <MapPin className="w-6 h-6 text-accent mb-3" />
          <h2 className="font-serif text-xl mb-1">Направления</h2>
          <p className="text-sm text-muted-foreground">Маршруты, программы и описания поездок.</p>
        </Link>
        <Link to="/admin/about" className="block p-6 border border-border rounded-sm bg-card hover:border-accent transition-colors">
          <Info className="w-6 h-6 text-accent mb-3" />
          <h2 className="font-serif text-xl mb-1">О нас</h2>
          <p className="text-sm text-muted-foreground">Hero, галерея и команда страницы «О нас».</p>
        </Link>
        <Link to="/admin/clergy" className="block p-6 border border-border rounded-sm bg-card hover:border-accent transition-colors">
          <Users className="w-6 h-6 text-accent mb-3" />
          <h2 className="font-serif text-xl mb-1">Священники</h2>
          <p className="text-sm text-muted-foreground">Профили священников, сопровождающих поездки.</p>
        </Link>
      </div>
    </div>
  );
}
