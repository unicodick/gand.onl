import type { Handle } from "@sveltejs/kit";
import { getSessionUser, SESSION_COOKIE } from "$lib/server/auth";

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get(SESSION_COOKIE);
  if (token && event.platform) {
    const user = await getSessionUser(event.platform.env.DB, token);
    if (user) event.locals.user = user;
  }

  if (
    event.request.method !== "GET" &&
    event.url.pathname.startsWith("/admin/") &&
    !event.locals.user
  ) {
    return new Response("Unauthorized", { status: 401 });
  }

  return resolve(event);
};
