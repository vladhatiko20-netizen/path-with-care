import { createFileRoute } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";
import { Page } from "@/routes/blog";
import { buildHreflang } from "@/lib/locale";
import { listBlogPosts } from "@/lib/blog.functions";
import heroImg from "@/assets/hero-blog.jpg";

const blogListQueryOptions = () =>
  queryOptions({ queryKey: ["blog-posts"], queryFn: () => listBlogPosts() });

export const Route = createFileRoute("/ro/blog")({
  head: () => ({
    meta: [
      { title: "Blog ortodox — Pelerin" },
      { name: "description", content: "Povești ale pelerinilor, sfaturi practice, povestiri despre locuri sfinte." },
      { property: "og:title", content: "Blog ortodox — Pelerin" },
      { property: "og:description", content: "Povești ale pelerinilor și povestiri despre locuri sfinte." },
      { property: "og:image", content: heroImg },
    ],
    links: buildHreflang("/blog", "ro"),
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(blogListQueryOptions());
  },
  component: Page,
});