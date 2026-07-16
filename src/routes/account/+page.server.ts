import { redirect } from "@sveltejs/kit";
import { getOrCreateLinkRequest } from "$lib/server/link-requests";
import { getPlayerByOwnerDiscordId } from "$lib/server/players";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ platform, locals }) => {
  if (!locals.user) {
    redirect(
      303,
      `/auth/discord/login?redirect_to=${encodeURIComponent("/account")}`,
    );
  }

  const db = platform!.env.DB;
  const player = await getPlayerByOwnerDiscordId(db, locals.user.discordId);
  if (player) {
    return { player };
  }

  const linkRequest = await getOrCreateLinkRequest(db, locals.user.discordId);
  return {
    linkKey: linkRequest.key,
    linkExpiresAt: linkRequest.expires_at,
  };
};
