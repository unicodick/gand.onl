import type { D1Database } from "@cloudflare/workers-types";

const DISCORD_API = "https://discord.com/api/v10";

export const SESSION_COOKIE = "session";
export const STATE_COOKIE = "discord_oauth_state";
export const REDIRECT_COOKIE = "discord_oauth_redirect";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
export const STATE_TTL_SECONDS = 60 * 5;

export function safeRedirectTarget(
  raw: string | null,
  trustedOrigin: string,
): string | null {
  if (!raw || !raw.startsWith("/")) return null;

  try {
    const target = new URL(raw, trustedOrigin);
    if (target.origin !== trustedOrigin) return null;
    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return null;
  }
}

export interface DiscordUser {
  id: string;
  username: string;
  global_name: string | null;
  avatar: string | null;
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

export function buildDiscordAuthorizeUrl(
  env: App.Platform["env"],
  state: string,
): string {
  const url = new URL("https://discord.com/oauth2/authorize");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", env.DISCORD_CLIENT_ID);
  url.searchParams.set("scope", "identify");
  url.searchParams.set("state", state);
  url.searchParams.set("redirect_uri", env.DISCORD_REDIRECT_URI);
  return url.toString();
}

export async function exchangeCodeForToken(
  env: App.Platform["env"],
  code: string,
): Promise<string> {
  const res = await fetch(`${DISCORD_API}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.DISCORD_CLIENT_ID,
      client_secret: env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: env.DISCORD_REDIRECT_URI,
    }),
  });
  if (!res.ok) throw new Error(`discord token exchange failed: ${res.status}`);
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export async function fetchDiscordUser(
  accessToken: string,
): Promise<DiscordUser> {
  const res = await fetch(`${DISCORD_API}/users/@me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`discord user fetch failed: ${res.status}`);
  return res.json();
}

export function isAllowedAdmin(
  env: App.Platform["env"],
  discordId: string,
): boolean {
  return env.ADMIN_DISCORD_IDS.split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .includes(discordId);
}

export async function createSession(
  db: D1Database,
  user: DiscordUser,
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
