import { createFileRoute, Link, notFound, ErrorComponent, useRouter } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import DOMPurify from "isomorphic-dompurify";
import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";
import { getBlogPostBySlug, type BlogPostFull } from "@/lib/blog.functions";
import { resolveBlogImage } from "@/lib/blog-images";

const postQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["blog-post", slug],
    queryFn: () => getBlogPostBySlug({ data: { slug } }),
  });

export const Route = createFileRoute("/blog_/$slug")({
  loader: async ({ params, context }) => {
    const post = await context.queryClient.ensureQueryData(
      postQueryOptions(params.slug),
    );
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) {
      return { meta: [{ title: "Статья не найдена — Паломник" }] };
    }
    const cover = resolveBlogImage(post.cover_image);
    return {
      meta: [
        { title: `${post.title_ru} — Паломник` },
        { name: "description", content: post.excerpt_ru ?? post.title_ru },
        { name: "author", content: "Паломник" },
        { property: "og:title", content: post.title_ru },
        { property: "og:description", content: post.excerpt_ru ?? post.title_ru },
        { property: "og:image", content: cover },
        { name: "twitter:title", content: post.title_ru },
        { name: "twitter:description", content: post.excerpt_ru ?? post.title_ru },
        { name: "twitter:image", content: cover },
      ],
      links: [
        { rel: "canonical", href: `https://path-with-care.lovable.app/blog/${post.slug}` },
      ],
    };
  },
  errorComponent: ({ error }) => {
    const router = useRouter();
    return (
      <PageShell>
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <ErrorComponent error={error} />
          <button
            onClick={() => router.invalidate()}
            className="mt-6 inline-flex items-center px-6 py-3 bg-accent text-primary-foreground text-sm font-serif rounded-sm"
          >
            Повторить
          </button>
        </div>
      </PageShell>
    );
  },
  notFoundComponent: () => (
    <PageShell>
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="font-serif text-3xl mb-4">Статья не найдена</h1>
        <Link to="/blog" className="text-accent font-serif italic hover:underline">
          ← Все статьи
        </Link>
      </div>
    </PageShell>
  ),
  component: PostPage,
});

function PostPage() {
  const { t, lang } = useLang();
  const { slug } = Route.useParams();
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
        <Link to="/blog" className="text-sm text-accent font-serif italic hover:underline">
          {t("← Все статьи", "← Toate articolele")}
        </Link>

        <h1 className="font-serif text-4xl md:text-5xl text-foreground font-light leading-tight mt-8 mb-8">
          {title}
        </h1>

        <div className="prose-blog">
          {isHtml ? (
            <div
              className="prose prose-lg max-w-none text-foreground/85"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(body) }}
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