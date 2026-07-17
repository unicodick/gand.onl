import type { D1Database } from "@cloudflare/workers-types";
import { upsertPlayersByUsername } from "../players/repository";

export interface RosterStatusRow {
  last_seen_at: string;
  received_count: number;
  added_count: number;
}

export async function getRosterStatus(
  db: D1Database,
): Promise<RosterStatusRow | null> {
  return db
    .prepare(
      "SELECT last_seen_at, received_count, added_count FROM roster_status WHERE id = 1",
    )
    .first<RosterStatusRow>();
}

export async function syncRoster(
  db: D1Database,
  usernames: string[],
): Promise<RosterStatusRow> {
  const normalized = Array.from(
    new Map(
      usernames.map((username) => {
        const trimmed = username.trim();
        return [trimmed.toLocaleLowerCase("en-US"), trimmed];
      }),
    ).values(),
  );
  const lastSeenAt = new Date().toISOString();
  const addedCount = await upsertPlayersByUsername(db, normalized);

  await db
    .prepare(
      `INSERT INTO roster_status
         (id, last_seen_at, received_count, added_count)
       VALUES (1, ?, ?, ?)
       ON CONFLICT (id) DO UPDATE SET
         last_seen_at = excluded.last_seen_at,
         received_count = excluded.received_count,
         added_count = excluded.added_count`,
    )
    .bind(lastSeenAt, normalized.length, addedCount)
    .run();

  return {
    last_seen_at: lastSeenAt,
    received_count: normalized.length,
    added_count: addedCount,
  };
}
