import type { D1Database } from "@cloudflare/workers-types";
import type { PlayerRow } from "./players";

export type AdminAuditAction =
  "player.blocked" | "player.unblocked" | "player.updated" | "player.deleted";

interface AdminAuditDbRow {
  id: number;
  actor_discord_id: string;
  action: AdminAuditAction;
  player_id: number | null;
  player_username: string | null;
  details: string;
  created_at: string;
}

export interface AdminAuditRow extends Omit<AdminAuditDbRow, "details"> {
  details: Record<string, unknown>;
}

function serializeDetails(details: Record<string, unknown>): string {
  return JSON.stringify(details);
}

function parseAuditRow(row: AdminAuditDbRow): AdminAuditRow {
  let details: Record<string, unknown> = {};
  try {
    const parsed = JSON.parse(row.details);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      details = parsed as Record<string, unknown>;
    }
  } catch {
    // Keep malformed legacy details from breaking the admin overview.
  }
  return { ...row, details };
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
  const action: AdminAuditAction = input.blocked
    ? "player.blocked"
    : "player.unblocked";

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
        serializeDetails(reason ? { reason } : {}),
        now,
      ),
  ]);
}

export async function listRecentAdminActions(
  db: D1Database,
  limit = 10,
): Promise<AdminAuditRow[]> {
  const { results } = await db
    .prepare(
      `SELECT id, actor_discord_id, action, player_id, player_username,
              details, created_at
       FROM admin_audit_log
       ORDER BY created_at DESC, id DESC
       LIMIT ?`,
    )
    .bind(limit)
    .all<AdminAuditDbRow>();
  return results.map(parseAuditRow);
}
