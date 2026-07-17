export const MAX_NEWS_TAGS = 5;
export const MAX_NEWS_TAG_LENGTH = 24;

export function normalizeNewsTags(values: string[]): string[] {
  const tags: string[] = [];
  const seen = new Set<string>();

  for (const value of values) {
    const tag = value.replace(/\s+/g, " ").trim();
    const key = tag.toLocaleLowerCase("ru-RU");
    if (!tag || tag.length > MAX_NEWS_TAG_LENGTH || seen.has(key)) continue;

    seen.add(key);
    tags.push(tag);
    if (tags.length === MAX_NEWS_TAGS) break;
  }

  return tags;
}

export function parseNewsTags(raw: string): string[] {
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value)
      ? normalizeNewsTags(value.filter((tag): tag is string => typeof tag === "string"))
      : [];
  } catch {
    return [];
  }
}

export function serializeNewsTags(tags: string[]): string {
  return JSON.stringify(normalizeNewsTags(tags));
}
