import { Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";
import { useLocalizedTo } from "@/lib/use-localized-to";
import { listBlogPosts, type BlogPostSummary } from "@/lib/blog.functions";
import { resolveBlogImage } from "@/lib/blog-images";
import heroImg from "@/assets/hero-blog.jpg";

export const blogListQueryOptions = () =>
  queryOptions({
    queryKey: ["blog-posts"],
    queryFn: () => listBlogPosts(),
  });

function formatDate(iso: string, lang: "ru" | "ro") {
  const d = new Date(iso);
  return d.toLocaleDateString(lang === "ru" ? "ru-RU" : "ro-RO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function Component() {
  const { t, lang } = useLang();
  const localize = useLocalizedTo();
  const { data: posts } = useSuspenseQuery(blogListQueryOptions());

  return (
    <PageShell>
      <section className="relative h-[46vh] md:h-[62vh] min-h-[370px] flex items-end overflow-hidden">
        <img src={heroImg} alt={t("Открытая молитвенная книга", "Carte de rugăciuni")} className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 to-black/75" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-10 md:pb-14 w-full">
          <p className="overline text-white/90 mb-3">{t("ИСТОРИИ И СОВЕТЫ", "POVEȘTI ȘI SFATURI")}</p>
          <h1 className="font-serif text-4xl md:text-6xl text-white font-light leading-tight drop-shadow-lg">
            {t("Православный блог", "Blog ortodox")}
          </h1>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10 md:py-10">
        {posts.length === 0 ? (
          <p className="text-center text-foreground/70 font-serif italic py-16">
            {t("Пока нет публикаций.", "Încă nu sunt publicații.")}
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p: BlogPostSummary) => {
              const title = lang === "ru" ? p.title_ru : p.title_ro;
              const excerpt = lang === "ru" ? p.excerpt_ru : p.excerpt_ro;
              const img = resolveBlogImage(p.cover_image);
              return (
                <Link key={p.slug} to={localize("/blog/$slug") as "/blog/$slug"} params={{ slug: p.slug }} className="block">
                  <article className="group bg-card border border-gold/30 rounded-sm overflow-hidden hover:border-gold hover:shadow-[0_12px_30px_-15px_rgba(61,40,23,0.4)] hover:-translate-y-0.5 transition-all duration-500 h-full">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img src={img} alt={title} loading="lazy" width={800} height={500} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-[1200ms]" />
                    </div>
                    <div className="p-5">
                      <p className="text-xs text-muted-foreground font-serif tracking-wider mb-2">{formatDate(p.published_at, lang)}</p>
                      <h2 className="font-serif text-xl text-foreground mb-2 leading-tight">{title}</h2>
                      {excerpt && <p className="text-sm text-foreground/70 leading-relaxed mb-4">{excerpt}</p>}
                      <span className="text-sm text-accent font-serif italic group-hover:underline">
                        {t("Читать →", "Citește →")}
                      </span>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </PageShell>
  );
}