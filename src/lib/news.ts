export const MAX_NEWS_TAGS = 5;
export const MAX_NEWS_TAG_LENGTH = 24;
export const NEWS_COVER_MAX_BYTES = 5 * 1024 * 1024;
export const NEWS_COVER_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

const NEWS_COVER_KEY = /^[0-9a-f-]{36}\.(?:jpe?g|png|webp)$/;

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
      ? normalizeNewsTags(
          value.filter((tag): tag is string => typeof tag === "string"),
        )
      : [];
  } catch {
    return [];
  }
}

export function serializeNewsTags(tags: string[]): string {
  return JSON.stringify(normalizeNewsTags(tags));
}

export function isNewsCoverKey(value: string): boolean {
  return NEWS_COVER_KEY.test(value);
}

export function newsCoverUrl(key: string | null): string | null {
  return key && isNewsCoverKey(key) ? `/media/news/${key}` : null;
}

export function validateNewsCover(file: File): string | null {
  if (file.size === 0) return "Выберите изображение";
  if (file.size > NEWS_COVER_MAX_BYTES)
    return "Изображение должно быть не больше 5 МБ";
  if (
    !NEWS_COVER_TYPES.includes(file.type as (typeof NEWS_COVER_TYPES)[number])
  ) {
    return "Поддерживаются JPEG, PNG и WebP";
  }
  return null;
}
