import { error, json } from "@sveltejs/kit";
import { consumeLinkRequest } from "$lib/server/link-requests";
import {
  isOwnerConflictError,
  setPlayerOwner,
  upsertPlayerByUsername,
} from "$lib/server/players";
import type { RequestHandler } from "./$types";

export const prerender = false;

export const POST: RequestHandler = async ({ request, platform }) => {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${platform!.env.MOD_SECRET}`) {
    error(401, "Unauthorized");
  }

  const body = (await request.json()) as { username?: unknown; key?: unknown };
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const key = typeof body.key === "string" ? body.key.trim() : "";
  if (!username || !key) {
    error(400, "Invalid username or key");
  }

  const db = platform!.env.DB;
  const discordId = await consumeLinkRequest(db, key);
  if (!discordId) {
    error(400, "Invalid or expired key");
  }

  const playerId = await upsertPlayerByUsername(db, username);
  try {
    await setPlayerOwner(db, playerId, discordId);
  } catch (err) {
    if (isOwnerConflictError(err)) {
      error(409, "This Discord account is already linked to another player");
    }
    throw err;
  }

  return json({ ok: true, username });
};
