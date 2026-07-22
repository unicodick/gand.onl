const DISCORD_API = "https://discord.com/api/v10";
const DISCORD_REQUEST_TIMEOUT_MS = 10_000;

export const STATE_COOKIE = "discord_oauth_state";
export const REDIRECT_COOKIE = "discord_oauth_redirect";
export const STATE_TTL_SECONDS = 60 * 5;

export interface DiscordUser {
  id: string;
  username: string;
  global_name: string | null;
  avatar: string | null;
}

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
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    DISCORD_REQUEST_TIMEOUT_MS,
  );

  try {
    const response = await fetch(`${DISCORD_API}/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: env.DISCORD_CLIENT_ID,
        client_secret: env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: env.DISCORD_REDIRECT_URI,
      }),
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`discord token exchange failed: ${response.status}`);
    }
    const data = (await response.json()) as { access_token: string };
    return data.access_token;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchDiscordUser(
  accessToken: string,
): Promise<DiscordUser> {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    DISCORD_REQUEST_TIMEOUT_MS,
  );

  try {
    const response = await fetch(`${DISCORD_API}/users/@me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`discord user fetch failed: ${response.status}`);
    }
    return response.json();
  } finally {
    clearTimeout(timeout);
  }
}
