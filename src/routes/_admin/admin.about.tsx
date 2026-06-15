import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminGetAboutPage } from "@/lib/about.functions";
import { AboutPageForm } from "@/components/admin/AboutPageForm";
import { AboutGalleryManager } from "@/components/admin/AboutGalleryManager";
import { AboutTeamManager } from "@/components/admin/AboutTeamManager";

export const Route = createFileRoute("/_admin/admin/about")({
  component: Page,
});

function Page() {
  const getFn = useServerFn(adminGetAboutPage);
  const { data, isLoading } = useQuery({
    queryKey: ["admin-about-page"],
    queryFn: () => getFn(),
  });

  return (
    <div className="p-8 max-w-5xl space-y-12">
      <div>
        <h1 className="font-serif text-3xl mb-6">Страница «О нас»</h1>
        {isLoading ? (
          <p className="text-muted-foreground">Загрузка…</p>
        ) : (
          <AboutPageForm
            initial={{
              hero_photo_url: data?.hero_photo_url ?? null,
              hero_title_ru: data?.hero_title_ru ?? null,
              hero_title_ro: data?.hero_title_ro ?? null,
              hero_subtitle_ru: data?.hero_subtitle_ru ?? null,
              hero_subtitle_ro: data?.hero_subtitle_ro ?? null,
              intro_text_ru: data?.intro_text_ru ?? null,
              intro_text_ro: data?.intro_text_ro ?? null,
              video_url: data?.video_url ?? null,
            }}
          />
        )}
      </div>

      <section>
        <h2 className="font-serif text-2xl mb-4">Галерея «Из поездок»</h2>
        <AboutGalleryManager />
      </section>

      <section>
        <h2 className="font-serif text-2xl mb-4">Команда</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Не священники (Анна, Наталия и т.д.). Священники редактируются в разделе «Священники» и
          показываются на странице «О нас» отдельной группой после команды.
        </p>
        <AboutTeamManager />
      </section>
    </div>
  );
}