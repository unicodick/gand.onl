import { isNewsCoverKey, parseNewsTags } from "../news/model";
import { slugify } from "../news/slug";
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

export interface NewsFormValues extends NewsFormInput {
  publishedAt: string | null;
}

export function readNewsFormValues(form: FormData): NewsFormValues {
  const publishedAt = String(form.get("published_at") ?? "").trim();
  return {
    title: String(form.get("title") ?? "").trim(),
    slug: String(form.get("slug") ?? "").trim(),
    body: String(form.get("body") ?? "").trim(),
    coverKey: String(form.get("cover_key") ?? "").trim(),
    tags: parseNewsTags(String(form.get("tags") ?? "[]")),
    published: form.get("published") === "on",
    publishedAt: publishedAt || null,
  };
}

export function parseNewsForm(
  form: FormData,
): { value: NewsFormInput; error: null } | { value: null; error: string } {
  const values = readNewsFormValues(form);

  if (!values.title || !values.body) {
    return { value: null, error: "Заполните заголовок и текст" };
  }

  const slug = slugify(values.slug || values.title);
  if (!slug) return { value: null, error: "Не удалось сформировать slug" };
  if (!isNewsCoverKey(values.coverKey)) {
    return { value: null, error: "Добавьте основное изображение" };
  }

  return {
    value: {
      title: values.title,
      slug,
      body: values.body,
      coverKey: values.coverKey,
      tags: values.tags,
      published: values.published,
    },
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
