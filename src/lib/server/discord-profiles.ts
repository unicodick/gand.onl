import type { D1Database } from "@cloudflare/workers-types";

export interface DiscordIdentity {
  id: string;
  username: string;
  global_name: string | null;
  avatar: string | null;
}

export interface DiscordProfileRow {
  discord_id: string;
  username: string;
  global_name: string | null;
  avatar_hash: string | null;
  updated_at: string;
}

export async function upsertDiscordProfile(
  db: D1Database,
  identity: DiscordIdentity,
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO discord_profiles
         (discord_id, username, global_name, avatar_hash, updated_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT (discord_id) DO UPDATE SET
         username = excluded.username,
         global_name = excluded.global_name,
         avatar_hash = excluded.avatar_hash,
         updated_at = excluded.updated_at`,
    )
    .bind(
      identity.id,
      identity.username,
      identity.global_name,
      identity.avatar,
      new Date().toISOString(),
    )
    .run();
}

export async function ensureDiscordProfile(
  db: D1Database,
  discordId: string,
  username: string,
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO discord_profiles (discord_id, username, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT (discord_id) DO NOTHING`,
    )
    .bind(discordId, username, new Date().toISOString())
    .run();
}

export async function getDiscordProfile(
  db: D1Database,
  discordId: string,
): Promise<DiscordProfileRow | null> {
  return db
    .prepare("SELECT * FROM discord_profiles WHERE discord_id = ?")
    .bind(discordId)
    .first<DiscordProfileRow>();
}
