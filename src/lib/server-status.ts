export type ServerStatus =
  | { state: "online"; players: number | null }
  | { state: "offline"; players: null }
  | { state: "unavailable"; players: null };

type Fetcher = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

const MCSRVSTAT_ENDPOINT = "https://api.mcsrvstat.us/3";
const MCSRVSTAT_USER_AGENT =
  "gand.onl server status (+https://gand.onl/contact)";

export function parseMcsrvstatResponse(data: unknown): ServerStatus {
  if (!data || typeof data !== "object" || !("online" in data)) {
    return { state: "unavailable", players: null };
  }

  if (data.online === false) {
    return { state: "offline", players: null };
  }

  if (data.online !== true) {
    return { state: "unavailable", players: null };
  }

  const playerData = "players" in data ? data.players : null;
  const onlinePlayers =
    playerData &&
    typeof playerData === "object" &&
    "online" in playerData &&
    typeof playerData.online === "number" &&
    Number.isInteger(playerData.online) &&
    playerData.online >= 0
      ? playerData.online
      : null;

  return { state: "online", players: onlinePlayers };
}

export async function fetchServerStatus(
  fetcher: Fetcher,
  address: string,
): Promise<ServerStatus> {
  try {
    const response = await fetcher(
      `${MCSRVSTAT_ENDPOINT}/${encodeURIComponent(address)}`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": MCSRVSTAT_USER_AGENT,
        },
        signal: AbortSignal.timeout(8_000),
      },
    );
    if (!response.ok) return { state: "unavailable", players: null };

    return parseMcsrvstatResponse(await response.json());
  } catch {
    return { state: "unavailable", players: null };
  }
}
