import type { Handle } from "@sveltejs/kit";
import {
  getSessionUser,
  isAllowedAdmin,
  SESSION_COOKIE,
} from "$lib/server/auth";

const ADMIN_MUTATION_PREFIXES = ["/account/news", "/account/players"];

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get(SESSION_COOKIE);
  if (token && event.platform) {
    const user = await getSessionUser(event.platform.env.DB, token);
    if (user) event.locals.user = user;
  }

  if (
    event.request.method !== "GET" &&
    ADMIN_MUTATION_PREFIXES.some((prefix) =>
      event.url.pathname.startsWith(prefix),
    ) &&
    !(
      event.locals.user &&
      event.platform &&
      isAllowedAdmin(event.platform.env, event.locals.user.discordId)
    )
  ) {
    return new Response("Unauthorized", { status: 401 });
  }

  return resolve(event);
};
