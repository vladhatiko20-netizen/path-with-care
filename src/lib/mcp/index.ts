import { defineMcp } from "@lovable.dev/mcp-js";
import listPilgrimages from "./tools/list-pilgrimages";
import listDestinations from "./tools/list-destinations";
import getDestination from "./tools/get-destination";
import listBlogPosts from "./tools/list-blog-posts";
import getBlogPost from "./tools/get-blog-post";

export default defineMcp({
  name: "palomnik-mcp",
  title: "Паломник — Pilgrimage tours",
  version: "0.1.0",
  instructions:
    "Read-only access to the Palomnik pilgrimage-tours website: upcoming pilgrimages, destinations (with program, shrines, FAQ, inclusions), and bilingual blog articles. All text fields exist in both Russian (ru) and Romanian (ro). Use list_* tools first to discover slugs, then get_* tools for full details.",
  tools: [listPilgrimages, listDestinations, getDestination, listBlogPosts, getBlogPost],
});