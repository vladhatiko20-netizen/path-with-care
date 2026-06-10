import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { PostPage, loadPost, buildPostHead } from "@/routes/blog_.$slug";

export const Route = createFileRoute("/ro/blog_/$slug")({
  loader: ({ params, context }) => loadPost(params.slug, context.queryClient),
  head: ({ loaderData }) => buildPostHead(loaderData, "ro"),
  notFoundComponent: () => (
    <PageShell>
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="font-serif text-3xl mb-4">Articol nu a fost găsit</h1>
        <Link to="/ro/blog" className="text-accent font-serif italic hover:underline">
          ← Toate articolele
        </Link>
      </div>
    </PageShell>
  ),
  component: PostPage,
});