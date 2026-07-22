import type { PlayerRow, PlayerSocialRow } from "./repository";

function comparableSocials(
  socials: Pick<PlayerSocialRow, "platform" | "url">[],
): string {
  return JSON.stringify(
    socials.map(({ platform, url }) => ({ platform, url })),
  );
}

export async function setPlayerBlocked(
  db: D1Database,
  input: {
    player: PlayerRow;
    actorDiscordId: string;
    blocked: boolean;
    reason?: string;
  },
): Promise<void> {
  const now = new Date().toISOString();
  const reason = input.reason?.trim() || null;
  const action = input.blocked ? "player.blocked" : "player.unblocked";

  await db.batch([
    db
      .prepare(
        `UPDATE players SET
           blocked_at = ?,
           blocked_by_discord_id = ?,
           block_reason = ?,
           updated_at = ?
         WHERE id = ?`,
      )
      .bind(
        input.blocked ? now : null,
        input.blocked ? input.actorDiscordId : null,
        input.blocked ? reason : null,
        now,
        input.player.id,
      ),
    db
      .prepare(
        `INSERT INTO admin_audit_log
           (actor_discord_id, action, player_id, player_username, details, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        input.actorDiscordId,
        action,
        input.player.id,
        input.player.username,
        JSON.stringify(reason ? { reason } : {}),
        now,
      ),
  ]);
}

export async function updatePlayerAsAdmin(
  db: D1Database,
  input: {
    player: PlayerRow;
    existingSocials: PlayerSocialRow[];
    actorDiscordId: string;
    ownerDiscordId: string | null;
    bio: string;
    skinUrl: string;
    socials: { platform: string; url: string }[];
  },
): Promise<string[]> {
  const fields: string[] = [];
  if (input.player.owner_discord_id !== input.ownerDiscordId) {
    fields.push("owner");
  }
  if ((input.player.bio ?? "") !== input.bio) fields.push("bio");
  if ((input.player.skin_url ?? "") !== input.skinUrl) fields.push("skin");
  if (
    comparableSocials(input.existingSocials) !==
    comparableSocials(input.socials)
  ) {
    fields.push("socials");
  }
  if (fields.length === 0) return fields;

  const now = new Date().toISOString();
  await db.batch([
    db
      .prepare(
        `UPDATE players SET owner_discord_id = ?, bio = ?, skin_url = ?, updated_at = ?
         WHERE id = ?`,
      )
      .bind(
        input.ownerDiscordId,
        input.bio || null,
        input.skinUrl || null,
        now,
        input.player.id,
      ),
    db
      .prepare("DELETE FROM player_socials WHERE player_id = ?")
      .bind(input.player.id),
    ...input.socials.map((social, index) =>
      db
        .prepare(
          `INSERT INTO player_socials (player_id, platform, url, sort_order)
           VALUES (?, ?, ?, ?)`,
        )
        .bind(input.player.id, social.platform, social.url, index),
    ),
    db
      .prepare(
        `INSERT INTO admin_audit_log
           (actor_discord_id, action, player_id, player_username, details, created_at)
         VALUES (?, 'player.updated', ?, ?, ?, ?)`,
      )
      .bind(
        input.actorDiscordId,
        input.player.id,
        input.player.username,
        JSON.stringify({ fields }),
        now,
      ),
  ]);
  return fields;
}

export async function deletePlayerAsAdmin(
  db: D1Database,
  input: { player: PlayerRow; actorDiscordId: string },
): Promise<void> {
  const now = new Date().toISOString();
  await db.batch([
    db
      .prepare(
        `INSERT INTO admin_audit_log
           (actor_discord_id, action, player_id, player_username, details, created_at)
         VALUES (?, 'player.deleted', ?, ?, '{}', ?)`,
      )
      .bind(input.actorDiscordId, input.player.id, input.player.username, now),
    db
      .prepare("DELETE FROM player_socials WHERE player_id = ?")
      .bind(input.player.id),
    db.prepare("DELETE FROM players WHERE id = ?").bind(input.player.id),
  ]);
}
