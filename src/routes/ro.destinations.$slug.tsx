import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { DestinationPage, loadDestination, buildDestinationHead } from "@/routes/destinations.$slug";

export const Route = createFileRoute("/ro/destinations/$slug")({
  loader: ({ params }) => loadDestination(params.slug),
  head: ({ loaderData, params }) => buildDestinationHead(loaderData, params.slug, "ro"),
  notFoundComponent: () => (
    <PageShell>
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="font-serif text-3xl mb-4">Pagina nu a fost găsită</h1>
        <Link to="/ro/destinations" className="text-accent hover:underline font-serif">Către destinații</Link>
      </div>
    </PageShell>
  ),
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <PageShell>
        <div className="max-w-3xl mx-auto px-6 py-20 text-center font-serif">
          <h1 className="text-3xl mb-3">Pagina nu a putut fi încărcată</h1>
          <p className="text-foreground/70 mb-6">{error.message}</p>
          <button
            onClick={() => { reset(); router.invalidate(); }}
            className="px-5 py-2 bg-accent text-primary-foreground rounded-sm"
          >
            Încercați din nou
          </button>
        </div>
      </PageShell>
    );
  },
  component: DestinationPage,
});