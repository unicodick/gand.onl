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
