export interface MojangProfile {
  uuid: string;
  username: string;
}

export async function resolveMojangProfile(
  username: string,
): Promise<MojangProfile | null> {
  const res = await fetch(
    `https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(username)}`,
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`mojang lookup failed: ${res.status}`);
  const data = (await res.json()) as { id: string; name: string };
  return { uuid: data.id, username: data.name };
}
