export interface SearchablePlayer {
  username: string;
  username_lower?: string;
}

export function normalizePlayerQuery(query: string): string {
  return query.trim().toLocaleLowerCase("en-US");
}

export function filterPlayers<T extends SearchablePlayer>(
  players: T[],
  query: string,
): T[] {
  const normalizedQuery = normalizePlayerQuery(query);
  if (!normalizedQuery) return players;

  return players.filter((player) =>
    (
      player.username_lower ?? player.username.toLocaleLowerCase("en-US")
    ).includes(normalizedQuery),
  );
}

export type AdminPlayerFilter = "all" | "linked" | "unlinked" | "blocked";

export interface ManageablePlayer extends SearchablePlayer {
  owner_discord_id: string | null;
  blocked_at: string | null;
}

export function filterAdminPlayers<T extends ManageablePlayer>(
  players: T[],
  query: string,
  filter: AdminPlayerFilter,
): T[] {
  return filterPlayers(players, query).filter((player) => {
    if (filter === "linked") return Boolean(player.owner_discord_id);
    if (filter === "unlinked") return !player.owner_discord_id;
    if (filter === "blocked") return Boolean(player.blocked_at);
    return true;
  });
}
