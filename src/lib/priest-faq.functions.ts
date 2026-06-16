import { createServerFn } from "@tanstack/react-start";

export type PublicPriestFaq = {
  id: string;
  question_ru: string;
  question_ro: string;
  answer_ru: string;
  answer_ro: string;
  author_name_ru: string | null;
  author_name_ro: string | null;
  author_title_ru: string | null;
  author_title_ro: string | null;
  sort_order: number;
};

export const listPublishedPriestFaq = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicPriestFaq[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("priest_faq")
      .select("id,question_ru,question_ro,answer_ru,answer_ro,author_name_ru,author_name_ro,author_title_ru,author_title_ro,sort_order,created_at")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((r) => ({
      id: r.id,
      question_ru: r.question_ru,
      question_ro: r.question_ro,
      answer_ru: r.answer_ru,
      answer_ro: r.answer_ro,
      author_name_ru: r.author_name_ru,
      author_name_ro: r.author_name_ro,
      author_title_ru: r.author_title_ru,
      author_title_ro: r.author_title_ro,
      sort_order: r.sort_order,
    }));
  },
);