import { dev } from "$app/environment";
import { error, redirect } from "@sveltejs/kit";
import {
  createSession,
  exchangeCodeForToken,
  fetchDiscordUser,
  isAllowedAdmin,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  STATE_COOKIE,
} from "$lib/server/auth";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url, cookies, platform }) => {
  if (!platform) error(500, "platform unavailable");

  const savedState = cookies.get(STATE_COOKIE);
  cookies.delete(STATE_COOKIE, { path: "/" });

  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");

  if (!code || !state || !savedState || state !== savedState) {
    redirect(303, "/admin/login?error=state");
  }

  const accessToken = await exchangeCodeForToken(platform.env, code);
  const discordUser = await fetchDiscordUser(accessToken);

  if (!isAllowedAdmin(platform.env, discordUser.id)) {
    redirect(303, "/admin/login?error=forbidden");
  }

  const session = await createSession(platform.env.DB, discordUser);
  cookies.set(SESSION_COOKIE, session.token, {
    path: "/",
    httpOnly: true,
    secure: !dev,
    sameSite: "lax",
    maxAge: SESSION_TTL_SECONDS,
  });

  redirect(303, "/admin");
};
