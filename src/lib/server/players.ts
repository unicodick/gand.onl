import type { D1Database } from "@cloudflare/workers-types";

export interface PlayerRow {
  id: number;
  uuid: string;
  username: string;
  username_lower: string;
  owner_discord_id: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlayerSocialRow {
  id: number;
  player_id: number;
  platform: string;
  url: string;
  sort_order: number;
}

export function isUsernameConflictError(err: unknown): boolean {
  return (
    err instanceof Error &&
    err.message.includes("UNIQUE constraint failed") &&
    (err.message.includes("players.username_lower") ||
      err.message.includes("players.uuid"))
  );
}

export function isOwnerConflictError(err: unknown): boolean {
  return (
    err instanceof Error &&
    err.message.includes("UNIQUE constraint failed") &&
    err.message.includes("players.owner_discord_id")
  );
}

export async function listAllPlayers(db: D1Database): Promise<PlayerRow[]> {
  const { results } = await db
    .prepare("SELECT * FROM players ORDER BY username_lower ASC")
    .all<PlayerRow>();
  return results;
}

export async function getPlayerByUsername(
  db: D1Database,
  usernameLower: string,
): Promise<PlayerRow | null> {
  return db
    .prepare("SELECT * FROM players WHERE username_lower = ?")
    .bind(usernameLower)
    .first<PlayerRow>();
}

export async function getPlayerById(
  db: D1Database,
  id: number,
): Promise<PlayerRow | null> {
  return db
    .prepare("SELECT * FROM players WHERE id = ?")
    .bind(id)
    .first<PlayerRow>();
}

export async function getPlayerSocials(
  db: D1Database,
  playerId: number,
): Promise<PlayerSocialRow[]> {
  const { results } = await db
    .prepare(
      "SELECT * FROM player_socials WHERE player_id = ? ORDER BY sort_order ASC",
    )
    .bind(playerId)
    .all<PlayerSocialRow>();
  return results;
}

export async function createPlayer(
  db: D1Database,
  input: { uuid: string; username: string },
): Promise<number> {
  const now = new Date().toISOString();
  const result = await db
    .prepare(
      `INSERT INTO players (uuid, username, username_lower, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .bind(input.uuid, input.username, input.username.toLowerCase(), now, now)
    .run();
  return result.meta.last_row_id as number;
}

export async function setPlayerOwner(
  db: D1Database,
  id: number,
  discordId: string | null,
): Promise<void> {
  await db
    .prepare(
      "UPDATE players SET owner_discord_id = ?, updated_at = ? WHERE id = ?",
    )
    .bind(discordId, new Date().toISOString(), id)
    .run();
}

export async function updatePlayerBio(
  db: D1Database,
  id: number,
  bio: string,
): Promise<void> {
  await db
    .prepare("UPDATE players SET bio = ?, updated_at = ? WHERE id = ?")
    .bind(bio || null, new Date().toISOString(), id)
    .run();
}

export async function replacePlayerSocials(
  db: D1Database,
  playerId: number,
  socials: { platform: string; url: string }[],
): Promise<void> {
  await db.batch([
    db.prepare("DELETE FROM player_socials WHERE player_id = ?").bind(playerId),
    ...socials.map((social, index) =>
      db
        .prepare(
          "INSERT INTO player_socials (player_id, platform, url, sort_order) VALUES (?, ?, ?, ?)",
        )
        .bind(playerId, social.platform, social.url, index),
    ),
  ]);
}

export async function deletePlayer(db: D1Database, id: number): Promise<void> {
  await db.batch([
    db.prepare("DELETE FROM player_socials WHERE player_id = ?").bind(id),
    db.prepare("DELETE FROM players WHERE id = ?").bind(id),
  ]);
}
