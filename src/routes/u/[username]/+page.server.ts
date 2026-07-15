import { error } from "@sveltejs/kit";
import { renderMarkdown } from "$lib/markdown";
import { getPlayerByUsername, getPlayerSocials } from "$lib/server/players";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, platform, locals }) => {
  const db = platform!.env.DB;
  const player = await getPlayerByUsername(db, params.username.toLowerCase());
  if (!player) error(404, "Игрок не найден");

  const socials = await getPlayerSocials(db, player.id);
  const isOwner = locals.user?.discordId === player.owner_discord_id;
  const showEditLink = isOwner || !locals.user;

  return {
    player,
    socials,
    showEditLink,
    bioHtml: player.bio ? renderMarkdown(player.bio) : null,
  };
};
