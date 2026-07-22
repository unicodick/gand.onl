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
  actor_name: string | null;
}

export interface AdminAuditRow extends Omit<AdminAuditDbRow, "details"> {
  details: Record<string, unknown>;
}

export interface AdminStats {
  playersTotal: number;
  playersLinked: number;
  playersUnlinked: number;
  playersBlocked: number;
  newsPublished: number;
  newsDrafts: number;
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

export async function listRecentAdminActions(
  db: D1Database,
  limit = 10,
): Promise<AdminAuditRow[]> {
  const { results } = await db
    .prepare(
      `SELECT audit.id, audit.actor_discord_id, audit.action, audit.player_id,
              audit.player_username, audit.details, audit.created_at,
              COALESCE(profile.global_name, profile.username) AS actor_name
       FROM admin_audit_log AS audit
       LEFT JOIN discord_profiles AS profile
         ON profile.discord_id = audit.actor_discord_id
       ORDER BY audit.created_at DESC, audit.id DESC
       LIMIT ?`,
    )
    .bind(limit)
    .all<AdminAuditDbRow>();
  return results.map(parseAuditRow);
}

export async function getAdminStats(db: D1Database): Promise<AdminStats> {
  return (await db
    .prepare(
      `SELECT
         (SELECT COUNT(*) FROM players) AS playersTotal,
         (SELECT COUNT(*) FROM players WHERE owner_discord_id IS NOT NULL) AS playersLinked,
         (SELECT COUNT(*) FROM players WHERE owner_discord_id IS NULL) AS playersUnlinked,
         (SELECT COUNT(*) FROM players WHERE blocked_at IS NOT NULL) AS playersBlocked,
         (SELECT COUNT(*) FROM news WHERE published = 1) AS newsPublished,
         (SELECT COUNT(*) FROM news WHERE published = 0) AS newsDrafts`,
    )
    .first<AdminStats>())!;
}
