import type { D1Database } from "@cloudflare/workers-types";

export interface NewsRow {
  id: number;
  slug: string;
  title: string;
  body: string;
  published: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author_discord_id: string;
}

export function isSlugConflictError(err: unknown): boolean {
  return (
    err instanceof Error && err.message.includes("UNIQUE constraint failed")
  );
}

export async function listAllNews(db: D1Database): Promise<NewsRow[]> {
  const { results } = await db
    .prepare("SELECT * FROM news ORDER BY created_at DESC")
    .all<NewsRow>();
  return results;
}

export async function listPublishedNews(
  db: D1Database,
  { limit, offset }: { limit: number; offset: number },
): Promise<{ items: NewsRow[]; hasMore: boolean }> {
  const { results } = await db
    .prepare(
      "SELECT * FROM news WHERE published = 1 ORDER BY published_at DESC LIMIT ? OFFSET ?",
    )
    .bind(limit + 1, offset)
    .all<NewsRow>();
  return { items: results.slice(0, limit), hasMore: results.length > limit };
}

export async function getPublishedNewsBySlug(
  db: D1Database,
  slug: string,
): Promise<NewsRow | null> {
  return db
    .prepare("SELECT * FROM news WHERE slug = ? AND published = 1")
    .bind(slug)
    .first<NewsRow>();
}

export async function getNewsById(
  db: D1Database,
  id: number,
): Promise<NewsRow | null> {
  return db
    .prepare("SELECT * FROM news WHERE id = ?")
    .bind(id)
    .first<NewsRow>();
}

export async function createNews(
  db: D1Database,
  input: {
    slug: string;
    title: string;
    body: string;
    published: boolean;
    authorDiscordId: string;
  },
): Promise<number> {
  const now = new Date().toISOString();
  const result = await db
    .prepare(
      `INSERT INTO news (slug, title, body, published, published_at, created_at, updated_at, author_discord_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      input.slug,
      input.title,
      input.body,
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
  input: { slug: string; title: string; body: string; published: boolean },
): Promise<void> {
  const existing = await getNewsById(db, id);
  if (!existing) throw new Error("news not found");

  const now = new Date().toISOString();
  const publishedAt = input.published
    ? (existing.published_at ?? now)
    : existing.published_at;

  await db
    .prepare(
      `UPDATE news SET slug = ?, title = ?, body = ?, published = ?, published_at = ?, updated_at = ?
       WHERE id = ?`,
    )
    .bind(
      input.slug,
      input.title,
      input.body,
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
