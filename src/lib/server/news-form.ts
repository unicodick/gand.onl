import { isNewsCoverKey, parseNewsTags } from "../news";
import { slugify } from "../slug";
import type { R2Bucket } from "@cloudflare/workers-types";
import { hasNewsCover, uploadNewsCover } from "./news-media";

export interface NewsFormInput {
  title: string;
  slug: string;
  body: string;
  coverKey: string;
  tags: string[];
  published: boolean;
}

export function parseNewsForm(
  form: FormData,
): { value: NewsFormInput; error: null } | { value: null; error: string } {
  const title = String(form.get("title") ?? "").trim();
  const slugInput = String(form.get("slug") ?? "").trim();
  const body = String(form.get("body") ?? "").trim();
  const coverKey = String(form.get("cover_key") ?? "").trim();
  const tags = parseNewsTags(String(form.get("tags") ?? "[]"));
  const published = form.get("published") === "on";

  if (!title || !body) {
    return { value: null, error: "Заполните заголовок и текст" };
  }

  const slug = slugify(slugInput || title);
  if (!slug) return { value: null, error: "Не удалось сформировать slug" };
  if (!isNewsCoverKey(coverKey)) {
    return { value: null, error: "Добавьте основное изображение" };
  }

  return {
    value: { title, slug, body, coverKey, tags, published },
    error: null,
  };
}

export async function prepareNewsFormCover(
  form: FormData,
  bucket: R2Bucket,
): Promise<string | null> {
  const coverKey = String(form.get("cover_key") ?? "").trim();
  if (isNewsCoverKey(coverKey) && (await hasNewsCover(bucket, coverKey))) {
    return null;
  }

  const cover = form.get("cover");
  if (!(cover instanceof File) || cover.size === 0) {
    return coverKey
      ? "Загруженное изображение не найдено"
      : "Добавьте основное изображение";
  }

  try {
    form.set("cover_key", await uploadNewsCover(bucket, cover));
    return null;
  } catch (error) {
    return error instanceof Error
      ? error.message
      : "Не удалось загрузить изображение";
  }
}
