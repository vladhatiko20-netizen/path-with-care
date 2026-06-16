import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { PriestFaqForm } from "@/components/admin/PriestFaqForm";

const searchSchema = z.object({
  question: z.string().optional(),
  from_lead: z.string().uuid().optional(),
});

export const Route = createFileRoute("/_admin/admin/priest-faq/new")({
  validateSearch: (s) => searchSchema.parse(s),
  component: Page,
});

function Page() {
  const { question, from_lead } = Route.useSearch();
  return (
    <div className="p-8">
      <Link to="/admin/priest-faq" className="text-sm text-accent hover:underline">← К списку</Link>
      <h1 className="font-serif text-3xl mt-3 mb-2">Новый вопрос-ответ</h1>
      {from_lead && (
        <p className="text-sm text-muted-foreground mb-6">Вопрос из заявки. Заполните ответ и опубликуйте.</p>
      )}
      <PriestFaqForm initial={{
        question_ru: question ?? "",
        question_ro: "",
        answer_ru: "",
        answer_ro: "",
        author_name_ru: null, author_name_ro: null,
        author_title_ru: null, author_title_ro: null,
        sort_order: 0,
        is_published: false,
      }} />
    </div>
  );
}