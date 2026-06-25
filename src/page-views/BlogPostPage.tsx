import { Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";
import { useLocalizedTo } from "@/lib/use-localized-to";
import { getBlogPostBySlug, type BlogPostFull } from "@/lib/blog.functions";

export const postQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["blog-post", slug],
    queryFn: () => getBlogPostBySlug({ data: { slug } }),
  });

export function Component({ slug }: { slug: string }) {
  const { t, lang } = useLang();
  const localize = useLocalizedTo();
  const { data } = useSuspenseQuery(postQueryOptions(slug));
  const post = data as BlogPostFull;

  const title = lang === "ru" ? post.title_ru : post.title_ro;
  const body = (lang === "ru" ? post.body_ru : post.body_ro) ?? "";
  const dateLabel = new Date(post.published_at).toLocaleDateString(
    lang === "ru" ? "ru-RU" : "ro-RO",
    { day: "numeric", month: "long", year: "numeric" },
  );
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(body);

  return (
    <PageShell>
      <article className="max-w-2xl mx-auto px-6 py-14 md:py-20">
        <Link to={localize("/blog") as "/blog"} className="text-sm text-accent font-serif italic hover:underline">
          {t("← Все статьи", "← Toate articolele")}
        </Link>

        <h1 className="font-serif text-4xl md:text-5xl text-foreground font-light leading-tight mt-8 mb-8">
          {title}
        </h1>

        <div className="prose-blog blog-body">
          {isHtml ? (
            <div
              className="text-foreground/85 [&_p]:text-lg [&_p]:leading-relaxed [&_p]:mb-5 [&_h2]:font-serif [&_h2]:text-2xl md:[&_h2]:text-[1.7rem] [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:leading-snug [&_blockquote]:italic [&_blockquote]:text-lg [&_blockquote]:leading-relaxed [&_blockquote]:mb-5 [&_blockquote]:border-l-2 [&_blockquote]:border-gold/50 [&_blockquote]:pl-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ul]:space-y-2 [&_ul]:text-lg [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_ol]:space-y-2 [&_ol]:text-lg [&_a]:text-accent [&_a]:underline hover:[&_a]:text-gold [&_strong]:font-semibold [&_em]:italic"
              dangerouslySetInnerHTML={{ __html: body }}
            />
          ) : (
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <h2 className="font-serif text-2xl md:text-[1.7rem] text-foreground font-semibold mt-10 mb-4 leading-snug">
                  {children}
                </h2>
              ),
              p: ({ children }) => (
                <p className="text-foreground/85 leading-relaxed mb-5 text-lg">
                  {children}
                </p>
              ),
              blockquote: ({ children }) => (
                <blockquote className="italic text-foreground/85 leading-relaxed mb-5 text-lg border-l-2 border-gold/50 pl-4">
                  {children}
                </blockquote>
              ),
              em: ({ children }) => <em className="italic">{children}</em>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              a: ({ href, children }) => (
                <a href={href} className="text-accent underline hover:text-gold">
                  {children}
                </a>
              ),
              ul: ({ children }) => <ul className="list-disc pl-6 mb-5 space-y-2 text-lg text-foreground/85">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-6 mb-5 space-y-2 text-lg text-foreground/85">{children}</ol>,
            }}
          >
            {body}
          </ReactMarkdown>
          )}
        </div>

        <p className="text-xs text-muted-foreground font-serif tracking-wider mt-12">
          {dateLabel}
        </p>
      </article>
    </PageShell>
  );
}