import { dev } from "$app/environment";
import { error, redirect } from "@sveltejs/kit";
import {
  buildDiscordAuthorizeUrl,
  randomToken,
  REDIRECT_COOKIE,
  safeRedirectTarget,
  STATE_COOKIE,
  STATE_TTL_SECONDS,
} from "$lib/server/auth";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ cookies, platform, url }) => {
  if (!platform) error(500, "platform unavailable");

  const state = randomToken();
  cookies.set(STATE_COOKIE, state, {
    path: "/",
    httpOnly: true,
    secure: !dev,
    sameSite: "lax",
    maxAge: STATE_TTL_SECONDS,
  });

  const redirectTo = safeRedirectTarget(url.searchParams.get("redirect_to"));
  if (redirectTo) {
    cookies.set(REDIRECT_COOKIE, redirectTo, {
      path: "/",
      httpOnly: true,
      secure: !dev,
      sameSite: "lax",
      maxAge: STATE_TTL_SECONDS,
    });
  }

  redirect(302, buildDiscordAuthorizeUrl(platform.env, state));
};
