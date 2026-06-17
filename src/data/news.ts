import { getEntry } from "astro:content";
import { parseFullMarkdown } from "../utils/markdown";

export const NEWS_PAGE_SIZE = 10;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export async function getNewsItems() {
  const entry = await getEntry("news", "news");

  if (!entry) {
    throw new Error("Missing news content: src/content/news.md");
  }

  return (entry.data.items as Record<string, any>[])
    .filter((item) => !item.draft)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .map((item, index) => {
      const datetime = String(item.date).slice(0, 10);
      return {
        id: `${datetime}-${index}`,
        ...item,
        contentHtml: parseFullMarkdown(item.content ?? ""),
        date: dateFormatter.format(new Date(`${datetime}T00:00:00Z`)),
        datetime,
        imageWidth: item.imageWidth ?? 60,
      };
    });
}

export async function getNewsPageData() {
  const entry = await getEntry("news", "news");

  if (!entry) {
    throw new Error("Missing news content: src/content/news.md");
  }

  return entry.data as Record<string, any>;
}
