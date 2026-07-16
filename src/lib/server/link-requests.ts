import type { D1Database } from "@cloudflare/workers-types";

const KEY_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const KEY_LENGTH = 8;
const DEFAULT_TTL_MINUTES = 15;

export interface LinkRequestRow {
  id: number;
  discord_id: string;
  key: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
}

export function generateLinkKey(): string {
  let key = "";
  for (const byte of crypto.getRandomValues(new Uint8Array(KEY_LENGTH))) {
    key += KEY_ALPHABET[byte % KEY_ALPHABET.length];
  }
  return key;
}

export async function getActiveLinkRequest(
  db: D1Database,
  discordId: string,
): Promise<LinkRequestRow | null> {
  return db
    .prepare(
      `SELECT * FROM link_requests
       WHERE discord_id = ? AND used_at IS NULL AND expires_at > ?
       ORDER BY created_at DESC LIMIT 1`,
    )
    .bind(discordId, new Date().toISOString())
    .first<LinkRequestRow>();
}

export async function createLinkRequest(
  db: D1Database,
  discordId: string,
  ttlMinutes = DEFAULT_TTL_MINUTES,
): Promise<LinkRequestRow> {
  const expiresAt = new Date(Date.now() + ttlMinutes * 60_000).toISOString();

  for (let attempt = 0; attempt < 2; attempt++) {
    const key = generateLinkKey();
    try {
      await db
        .prepare(
          "INSERT INTO link_requests (discord_id, key, expires_at) VALUES (?, ?, ?)",
        )
        .bind(discordId, key, expiresAt)
        .run();
      return (await db
        .prepare("SELECT * FROM link_requests WHERE key = ?")
        .bind(key)
        .first<LinkRequestRow>())!;
    } catch (err) {
      if (
        !(err instanceof Error) ||
        !err.message.includes("UNIQUE constraint failed")
      ) {
        throw err;
      }
    }
  }
  throw new Error("failed to generate a unique link key");
}

export async function getOrCreateLinkRequest(
  db: D1Database,
  discordId: string,
): Promise<LinkRequestRow> {
  const active = await getActiveLinkRequest(db, discordId);
  if (active) return active;
  return createLinkRequest(db, discordId);
}

export async function consumeLinkRequest(
  db: D1Database,
  key: string,
): Promise<string | null> {
  const row = await db
    .prepare(
      `UPDATE link_requests SET used_at = ?
       WHERE key = ? AND used_at IS NULL AND expires_at > ?
       RETURNING discord_id`,
    )
    .bind(new Date().toISOString(), key, new Date().toISOString())
    .first<{ discord_id: string }>();
  return row?.discord_id ?? null;
}
