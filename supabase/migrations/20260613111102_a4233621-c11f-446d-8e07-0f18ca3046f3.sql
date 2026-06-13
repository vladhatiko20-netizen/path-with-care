alter table public.pilgrimages
  add column destination_slug text
  references public.destinations(slug) on delete set null;

create index if not exists pilgrimages_destination_slug_idx
  on public.pilgrimages(destination_slug);