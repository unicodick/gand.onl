import type { Handle } from "@sveltejs/kit";
import { isAllowedAdmin } from "$lib/server/auth/guards";
import { getSessionUser, SESSION_COOKIE } from "$lib/server/auth/sessions";

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

  const response = await resolve(event);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Frame-Options", "DENY");
  return response;
};
