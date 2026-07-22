import { error } from "@sveltejs/kit";
import {
  discordAvatarUrl,
  discordProfileUrl,
  type PublicDiscordProfile,
} from "$lib/discord/model";
import { isAllowedAdmin } from "$lib/server/auth/guards";
import { getDiscordProfileWithSessionFallback } from "$lib/server/discord/profiles";
import {
  getPlayerByUsername,
  getPlayerSocials,
  toPublicPlayer,
} from "$lib/server/players/repository";
import { DISCORD_PLATFORM_ID } from "$lib/players/socials";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, platform }) => {
  const db = platform!.env.DB;
  const player = await getPlayerByUsername(db, params.username.toLowerCase());
  if (!player) error(404, "Игрок не найден");

  if (player.blocked_at) {
    return {
      player: toPublicPlayer(player),
      socials: [],
      discordProfile: null,
      isLinked: false,
      isAdmin: false,
    };
  }

  const allSocials = await getPlayerSocials(db, player.id);
  const showDiscord = allSocials.some(
    (social) => social.platform === DISCORD_PLATFORM_ID,
  );
  const socials = allSocials.filter(
    (social) => social.platform !== DISCORD_PLATFORM_ID,
  );
  const isLinked = Boolean(player.owner_discord_id);
  const isAdmin = Boolean(
    player.owner_discord_id &&
    isAllowedAdmin(platform!.env, player.owner_discord_id),
  );
  let discordProfile: PublicDiscordProfile | null = null;
  if (showDiscord && player.owner_discord_id) {
    const identity = await getDiscordProfileWithSessionFallback(
      db,
      player.owner_discord_id,
    );
    if (identity) {
      discordProfile = {
        id: identity.discord_id,
        username: identity.username,
        displayName: identity.global_name ?? identity.username,
        avatarUrl: discordAvatarUrl(identity.discord_id, identity.avatar_hash),
        profileUrl: discordProfileUrl(identity.discord_id),
      };
    }
  }

  return {
    player: toPublicPlayer(player),
    socials,
    discordProfile,
    isLinked,
    isAdmin,
  };
};
