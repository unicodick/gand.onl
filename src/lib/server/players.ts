import type { D1Database } from "@cloudflare/workers-types";

export interface PlayerRow {
  id: number;
  username: string;
  username_lower: string;
  owner_discord_id: string | null;
  bio: string | null;
  skin_url: string | null;
  created_at: string;
  updated_at: string;
}

export type PublicPlayerRow = Omit<PlayerRow, "owner_discord_id">;

export function toPublicPlayer(player: PlayerRow): PublicPlayerRow {
  const { owner_discord_id: _owner_discord_id, ...publicPlayer } = player;
  return publicPlayer;
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
    err.message.includes("players.username_lower")
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

export async function getPlayerByOwnerDiscordId(
  db: D1Database,
  discordId: string,
): Promise<PlayerRow | null> {
  return db
    .prepare("SELECT * FROM players WHERE owner_discord_id = ?")
    .bind(discordId)
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
  username: string,
): Promise<number> {
  const now = new Date().toISOString();
  const result = await db
    .prepare(
      `INSERT INTO players (username, username_lower, created_at, updated_at)
       VALUES (?, ?, ?, ?)`,
    )
    .bind(username, username.toLowerCase(), now, now)
    .run();
  return result.meta.last_row_id as number;
}

export async function upsertPlayersByUsername(
  db: D1Database,
  usernames: string[],
): Promise<void> {
  const now = new Date().toISOString();
  await db.batch(
    usernames.map((username) =>
      db
        .prepare(
          `INSERT INTO players (username, username_lower, created_at, updated_at)
           VALUES (?, ?, ?, ?)
           ON CONFLICT (username_lower) DO NOTHING`,
        )
        .bind(username, username.toLowerCase(), now, now),
    ),
  );
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

export async function updatePlayerSkin(
  db: D1Database,
  id: number,
  skinUrl: string,
): Promise<void> {
  await db
    .prepare("UPDATE players SET skin_url = ?, updated_at = ? WHERE id = ?")
    .bind(skinUrl || null, new Date().toISOString(), id)
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
