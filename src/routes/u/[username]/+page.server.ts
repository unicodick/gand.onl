import { error } from "@sveltejs/kit";
import { isAllowedAdmin } from "$lib/server/auth";
import {
  getPlayerByUsername,
  getPlayerSocials,
  toPublicPlayer,
} from "$lib/server/players";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, platform, locals }) => {
  const db = platform!.env.DB;
  const player = await getPlayerByUsername(db, params.username.toLowerCase());
  if (!player) error(404, "Игрок не найден");

  const socials = await getPlayerSocials(db, player.id);
  const isOwner = locals.user?.discordId === player.owner_discord_id;
  const showEditLink = isOwner || !locals.user;
  const isLinked = Boolean(player.owner_discord_id);
  const isAdmin = Boolean(
    player.owner_discord_id &&
    isAllowedAdmin(platform!.env, player.owner_discord_id),
  );

  return {
    player: toPublicPlayer(player),
    socials,
    showEditLink,
    isLinked,
    isAdmin,
  };
};
