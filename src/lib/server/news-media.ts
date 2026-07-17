import type { R2Bucket } from "@cloudflare/workers-types";
import {
  isNewsCoverKey,
  NEWS_COVER_TYPES,
  validateNewsCover,
} from "../news/model";

const NEWS_COVER_PREFIX = "news/";

const EXTENSIONS: Record<(typeof NEWS_COVER_TYPES)[number], string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function uploadNewsCover(
  bucket: R2Bucket,
  file: File,
): Promise<string> {
  const validationError = validateNewsCover(file);
  if (validationError) throw new Error(validationError);

  const extension = EXTENSIONS[file.type as keyof typeof EXTENSIONS];
  const key = `${crypto.randomUUID()}.${extension}`;
  await bucket.put(`${NEWS_COVER_PREFIX}${key}`, await file.arrayBuffer(), {
    httpMetadata: {
      contentType: file.type,
      cacheControl: "public, max-age=31536000, immutable",
    },
  });
  return key;
}

export async function deleteNewsCover(
  bucket: R2Bucket,
  key: string | null,
): Promise<void> {
  if (key && isNewsCoverKey(key)) {
    await bucket.delete(`${NEWS_COVER_PREFIX}${key}`);
  }
}

export async function getNewsCover(bucket: R2Bucket, key: string) {
  if (!isNewsCoverKey(key)) return null;
  return bucket.get(`${NEWS_COVER_PREFIX}${key}`);
}

export async function hasNewsCover(
  bucket: R2Bucket,
  key: string,
): Promise<boolean> {
  if (!isNewsCoverKey(key)) return false;
  return Boolean(await bucket.head(`${NEWS_COVER_PREFIX}${key}`));
}
