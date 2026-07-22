const KEY_PREFIX = "gand-";
const KEY_ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";
const KEY_SUFFIX_LENGTH = 6;
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
  let key = KEY_PREFIX;
  for (const byte of crypto.getRandomValues(
    new Uint8Array(KEY_SUFFIX_LENGTH),
  )) {
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

export type LinkPlayerResult = "linked" | "invalid_key" | "player_owned";

export async function linkPlayerByUsername(
  db: D1Database,
  username: string,
  key: string,
): Promise<LinkPlayerResult> {
  const usernameLower = username.toLowerCase();
  const now = new Date().toISOString();
  const results = await db.batch([
    db
      .prepare(
        `INSERT INTO players (username, username_lower, created_at, updated_at)
         SELECT ?, ?, ?, ?
         WHERE EXISTS (
           SELECT 1 FROM link_requests
           WHERE key = ? AND used_at IS NULL AND expires_at > ?
         )
         ON CONFLICT (username_lower) DO NOTHING`,
      )
      .bind(username, usernameLower, now, now, key, now),
    db
      .prepare(
        `UPDATE players
         SET owner_discord_id = (
           SELECT discord_id FROM link_requests
           WHERE key = ? AND used_at IS NULL AND expires_at > ?
         ), updated_at = ?
         WHERE username_lower = ?
           AND EXISTS (
             SELECT 1 FROM link_requests
             WHERE key = ? AND used_at IS NULL AND expires_at > ?
           )
           AND (
             owner_discord_id IS NULL OR owner_discord_id = (
               SELECT discord_id FROM link_requests
               WHERE key = ? AND used_at IS NULL AND expires_at > ?
             )
           )`,
      )
      .bind(key, now, now, usernameLower, key, now, key, now),
    db
      .prepare(
        `UPDATE link_requests SET used_at = ?
         WHERE key = ? AND used_at IS NULL AND expires_at > ?
           AND EXISTS (
             SELECT 1 FROM players
             WHERE username_lower = ?
               AND owner_discord_id = link_requests.discord_id
           )
         RETURNING discord_id`,
      )
      .bind(now, key, now, usernameLower),
  ]);

  if (results[2].results.length > 0) return "linked";

  const [requestResult, playerResult] = await db.batch([
    db
      .prepare(
        `SELECT discord_id FROM link_requests
         WHERE key = ? AND used_at IS NULL AND expires_at > ?`,
      )
      .bind(key, now),
    db
      .prepare("SELECT owner_discord_id FROM players WHERE username_lower = ?")
      .bind(usernameLower),
  ]);
  const request = requestResult.results[0] as
    { discord_id: string } | undefined;
  if (!request) return "invalid_key";

  const player = playerResult.results[0] as
    { owner_discord_id: string | null } | undefined;
  if (player?.owner_discord_id !== request.discord_id) return "player_owned";

  throw new Error("link transaction completed without consuming the key");
}
