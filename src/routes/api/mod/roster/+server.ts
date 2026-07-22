import { error, json } from "@sveltejs/kit";
import { requireModAuthorization } from "$lib/server/auth/guards";
import { syncRoster } from "$lib/server/roster/repository";
import type { RequestHandler } from "./$types";

export const prerender = false;

const MAX_USERNAMES = 200;

export const POST: RequestHandler = async ({ request, platform }) => {
  requireModAuthorization(request, platform!.env.MOD_SECRET);

  const body = (await request.json()) as { usernames?: unknown };
  const usernames = body.usernames;
  if (
    !Array.isArray(usernames) ||
    usernames.length === 0 ||
    usernames.length > MAX_USERNAMES ||
    !usernames.every((u) => typeof u === "string" && u.trim())
  ) {
    error(400, "Invalid usernames");
  }

  const status = await syncRoster(
    platform!.env.DB,
    (usernames as string[]).map((u) => u.trim()),
  );

  return json({ ok: true, added: status.added_count });
};
