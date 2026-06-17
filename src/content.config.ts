import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const pages = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/pages" }),
});

const news = defineCollection({
  loader: glob({ pattern: "news.md", base: "./src/content" }),
});

const site = defineCollection({
  loader: glob({ pattern: "site.md", base: "./src/content" }),
});

export const collections = { pages, news, site };
