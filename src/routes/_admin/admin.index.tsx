import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Calendar } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/")({
  component: Page,
});

function Page() {
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-serif text-3xl text-foreground mb-2">Добро пожаловать</h1>
      <p className="text-muted-foreground mb-8">Управление содержанием сайта.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <Link to="/admin/blog" className="block p-6 border border-border rounded-sm bg-card hover:border-accent transition-colors">
          <FileText className="w-6 h-6 text-accent mb-3" />
          <h2 className="font-serif text-xl mb-1">Статьи блога</h2>
          <p className="text-sm text-muted-foreground">Создавайте и редактируйте публикации.</p>
        </Link>
        <Link to="/admin/pilgrimages" className="block p-6 border border-border rounded-sm bg-card hover:border-accent transition-colors">
          <Calendar className="w-6 h-6 text-accent mb-3" />
          <h2 className="font-serif text-xl mb-1">Календарь паломничеств</h2>
          <p className="text-sm text-muted-foreground">Поездки, даты, места и цены.</p>
        </Link>
      </div>
    </div>
  );
}
