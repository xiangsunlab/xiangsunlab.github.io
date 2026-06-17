import { getEntry } from "astro:content";

export async function getPageData(id: string) {
  const entry = await getEntry("pages", id);

  if (!entry) {
    throw new Error(`Missing page content: src/content/pages/${id}.md`);
  }

  return entry.data as Record<string, any>;
}

export async function getSiteData() {
  const entry = await getEntry("site", "site");

  if (!entry) {
    throw new Error("Missing site content: src/content/site.md");
  }

  return entry.data as Record<string, any>;
}
