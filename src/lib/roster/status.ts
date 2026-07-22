export const ROSTER_FRESH_FOR_MS = 30 * 60 * 1000;

export type RosterFreshness = "no_data" | "recent" | "stale";

export function getRosterFreshness(
  lastSeenAt: string | null | undefined,
  now = Date.now(),
): RosterFreshness {
  if (!lastSeenAt) return "no_data";
  const seenAt = new Date(lastSeenAt).getTime();
  if (!Number.isFinite(seenAt)) return "no_data";
  return now - seenAt <= ROSTER_FRESH_FOR_MS ? "recent" : "stale";
}
