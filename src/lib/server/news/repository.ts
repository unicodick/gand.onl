import { parseNewsTags, serializeNewsTags } from "../../news/model";

interface NewsDbRow {
  id: number;
  slug: string;
  title: string;
  body: string;
  cover_key: string | null;
  tags: string;
  published: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author_discord_id: string;
}

export interface NewsRow extends Omit<NewsDbRow, "tags"> {
  tags: string[];
}

export type PublicNewsRow = Omit<NewsRow, "author_discord_id">;

function fromDbNews(news: NewsDbRow): NewsRow {
  return { ...news, tags: parseNewsTags(news.tags) };
}

export function toPublicNews(news: NewsRow): PublicNewsRow {
  const { author_discord_id: _author_discord_id, ...publicNews } = news;
  return publicNews;
}

export function isSlugConflictError(err: unknown): boolean {
  return (
    err instanceof Error && err.message.includes("UNIQUE constraint failed")
  );
}

export async function listAllNews(db: D1Database): Promise<NewsRow[]> {
  const { results } = await db
    .prepare("SELECT * FROM news ORDER BY created_at DESC")
    .all<NewsDbRow>();
  return results.map(fromDbNews);
}

export async function listPublishedNews(
  db: D1Database,
  { limit, offset = 0 }: { limit: number; offset?: number },
): Promise<NewsRow[]> {
  const { results } = await db
    .prepare(
      "SELECT * FROM news WHERE published = 1 ORDER BY published_at DESC, id DESC LIMIT ? OFFSET ?",
    )
    .bind(limit, offset)
    .all<NewsDbRow>();
  return results.map(fromDbNews);
}

export async function countPublishedNews(db: D1Database): Promise<number> {
  const row = await db
    .prepare("SELECT COUNT(*) AS total FROM news WHERE published = 1")
    .first<{ total: number }>();
  return row?.total ?? 0;
}

export async function getPublishedNewsBySlug(
  db: D1Database,
  slug: string,
): Promise<NewsRow | null> {
  const news = await db
    .prepare("SELECT * FROM news WHERE slug = ? AND published = 1")
    .bind(slug)
    .first<NewsDbRow>();
  return news ? fromDbNews(news) : null;
}

export async function getNewsById(
  db: D1Database,
  id: number,
): Promise<NewsRow | null> {
  const news = await db
    .prepare("SELECT * FROM news WHERE id = ?")
    .bind(id)
    .first<NewsDbRow>();
  return news ? fromDbNews(news) : null;
}

export async function createNews(
  db: D1Database,
  input: {
    slug: string;
    title: string;
    body: string;
    coverKey: string | null;
    tags: string[];
    published: boolean;
    authorDiscordId: string;
  },
): Promise<number> {
  const now = new Date().toISOString();
  const result = await db
    .prepare(
      `INSERT INTO news (slug, title, body, cover_key, tags, published, published_at, created_at, updated_at, author_discord_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      input.slug,
      input.title,
      input.body,
      input.coverKey,
      serializeNewsTags(input.tags),
      input.published ? 1 : 0,
      input.published ? now : null,
      now,
      now,
      input.authorDiscordId,
    )
    .run();
  return result.meta.last_row_id as number;
}

export async function updateNews(
  db: D1Database,
  id: number,
  input: {
    slug: string;
    title: string;
    body: string;
    coverKey: string | null;
    tags: string[];
    published: boolean;
  },
): Promise<void> {
  const existing = await getNewsById(db, id);
  if (!existing) throw new Error("news not found");

  const now = new Date().toISOString();
  const publishedAt = input.published
    ? (existing.published_at ?? now)
    : existing.published_at;

  await db
    .prepare(
      `UPDATE news SET slug = ?, title = ?, body = ?, cover_key = ?, tags = ?, published = ?, published_at = ?, updated_at = ?
       WHERE id = ?`,
    )
    .bind(
      input.slug,
      input.title,
      input.body,
      input.coverKey,
      serializeNewsTags(input.tags),
      input.published ? 1 : 0,
      publishedAt,
      now,
      id,
    )
    .run();
}

export async function deleteNews(db: D1Database, id: number): Promise<void> {
  await db.prepare("DELETE FROM news WHERE id = ?").bind(id).run();
}

export async function isNewsCoverInUse(
  db: D1Database,
  coverKey: string,
): Promise<boolean> {
  const row = await db
    .prepare("SELECT 1 AS found FROM news WHERE cover_key = ? LIMIT 1")
    .bind(coverKey)
    .first<{ found: number }>();
  return Boolean(row);
}
