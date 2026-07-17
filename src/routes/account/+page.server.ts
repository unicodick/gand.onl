import { getOrCreateLinkRequest } from "$lib/server/link-requests";
import { getPlayerByOwnerDiscordId, toPublicPlayer } from "$lib/server/players";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ platform, locals }) => {
  const db = platform!.env.DB;
  const player = await getPlayerByOwnerDiscordId(db, locals.user!.discordId);
  if (player) {
    return { player: toPublicPlayer(player) };
  }

  const linkRequest = await getOrCreateLinkRequest(db, locals.user!.discordId);
  return {
    linkKey: linkRequest.key,
    linkExpiresAt: linkRequest.expires_at,
  };
};
