import { error, fail, redirect } from "@sveltejs/kit";
import { discordProfileUrl } from "$lib/discord/model";
import { parsePlayerProfileForm } from "$lib/players/profile-form";
import { getOrCreateLinkRequest } from "$lib/server/players/linking";
import {
  getPlayerByOwnerDiscordId,
  getPlayerSocials,
  toPublicPlayer,
  updatePlayerProfile,
} from "$lib/server/players/repository";
import { ensureDiscordProfile } from "$lib/server/discord/profiles";
import { DISCORD_PLATFORM_ID } from "$lib/players/socials";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ platform, locals, url }) => {
  const db = platform!.env.DB;
  const player = await getPlayerByOwnerDiscordId(db, locals.user!.discordId);
  if (player) {
    return {
      player: toPublicPlayer(player),
      socials: await getPlayerSocials(db, player.id),
      linkKey: null,
      linkExpiresAt: null,
      saved: url.searchParams.get("saved") === "1",
    };
  }

  const linkRequest = await getOrCreateLinkRequest(db, locals.user!.discordId);
  return {
    player: null,
    socials: [],
    linkKey: linkRequest.key,
    linkExpiresAt: linkRequest.expires_at,
    saved: false,
  };
};

export const actions: Actions = {
  default: async ({ request, platform, locals }) => {
    if (!locals.user) error(401, "Необходима авторизация");

    const db = platform!.env.DB;
    const player = await getPlayerByOwnerDiscordId(db, locals.user.discordId);
    if (!player) error(404, "Профиль не найден");
    if (player.blocked_at) error(403, "Профиль заблокирован");

    const form = await request.formData();
    const parsed = parsePlayerProfileForm(form);
    if (!parsed.ok) return fail(400, { errorMessage: parsed.errorMessage });

    const socials: { platform: string; url: string }[] = [];
    if (form.get("show_discord_profile") === "on") {
      await ensureDiscordProfile(
        db,
        locals.user.discordId,
        locals.user.username,
      );
      socials.push({
        platform: DISCORD_PLATFORM_ID,
        url: discordProfileUrl(locals.user.discordId),
      });
    }
    socials.push(...parsed.profile.socials);

    await updatePlayerProfile(db, {
      playerId: player.id,
      bio: parsed.profile.bio,
      skinUrl: parsed.profile.skinUrl,
      socials,
    });

    redirect(303, "/account?saved=1");
  },
};
