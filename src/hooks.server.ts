import type { Handle } from "@sveltejs/kit";
import { isAllowedAdmin } from "$lib/server/auth/guards";
import { getSessionUser, SESSION_COOKIE } from "$lib/server/auth/sessions";

const ADMIN_MUTATION_PREFIXES = ["/account/news", "/account/players"];
const PRIVATE_PATH_PREFIXES = ["/account", "/auth", "/api/me"];

function isPrivatePath(pathname: string): boolean {
  return PRIVATE_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get(SESSION_COOKIE);
  if (token && event.platform) {
    const user = await getSessionUser(event.platform.env.DB, token);
    if (user) event.locals.user = user;
  }

  let response: Response;
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
    response = new Response("Unauthorized", { status: 401 });
  } else {
    response = await resolve(event);
  }

  if (isPrivatePath(event.url.pathname)) {
    response.headers.set("Cache-Control", "private, no-store");
  }
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Frame-Options", "DENY");
  return response;
};
