import { error, json } from "@sveltejs/kit";
import { requireModAuthorization } from "$lib/server/auth/guards";
import { linkPlayerByUsername } from "$lib/server/players/linking";
import { isOwnerConflictError } from "$lib/server/players/repository";
import type { RequestHandler } from "./$types";

export const prerender = false;

export const POST: RequestHandler = async ({ request, platform }) => {
  requireModAuthorization(request, platform!.env.MOD_SECRET);

  const body = (await request.json()) as { username?: unknown; key?: unknown };
  const username =
    typeof body.username === "string" ? body.username.trim() : "";
  const key = typeof body.key === "string" ? body.key.trim() : "";
  if (!username || !key) {
    error(400, "Invalid username or key");
  }

  const db = platform!.env.DB;
  try {
    const result = await linkPlayerByUsername(db, username, key);
    if (result === "invalid_key") {
      error(400, "Invalid or expired key");
    }
    if (result === "player_owned") {
      error(409, "This player is already linked to another Discord account");
    }
  } catch (err) {
    if (isOwnerConflictError(err)) {
      error(409, "This Discord account is already linked to another player");
    }
    throw err;
  }

  return json({ ok: true, username });
};
