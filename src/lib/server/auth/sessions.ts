export const SESSION_COOKIE = "session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export interface SessionIdentity {
  id: string;
  username: string;
}

export interface SessionUser {
  discordId: string;
  username: string;
}

function base64UrlEncode(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (const byte of arr) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function randomToken(): string {
  return base64UrlEncode(crypto.getRandomValues(new Uint8Array(32)));
}

export async function hashToken(token: string): Promise<string> {
  const data = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(digest);
}

export async function createSession(
  db: D1Database,
  user: SessionIdentity,
): Promise<{ token: string; expiresAt: Date }> {
  const token = randomToken();
  const tokenHash = await hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);
  await db
    .prepare(
      "INSERT INTO sessions (token_hash, discord_id, discord_username, expires_at) VALUES (?, ?, ?, ?)",
    )
    .bind(tokenHash, user.id, user.username, expiresAt.toISOString())
    .run();
  return { token, expiresAt };
}

export async function getSessionUser(
  db: D1Database,
  token: string,
): Promise<SessionUser | null> {
  const tokenHash = await hashToken(token);
  const row = await db
    .prepare(
      "SELECT discord_id, discord_username, expires_at FROM sessions WHERE token_hash = ?",
    )
    .bind(tokenHash)
    .first<{
      discord_id: string;
      discord_username: string;
      expires_at: string;
    }>();
  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) {
    await db
      .prepare("DELETE FROM sessions WHERE token_hash = ?")
      .bind(tokenHash)
      .run();
    return null;
  }
  return { discordId: row.discord_id, username: row.discord_username };
}

export async function destroySession(
  db: D1Database,
  token: string,
): Promise<void> {
  const tokenHash = await hashToken(token);
  await db
    .prepare("DELETE FROM sessions WHERE token_hash = ?")
    .bind(tokenHash)
    .run();
}
