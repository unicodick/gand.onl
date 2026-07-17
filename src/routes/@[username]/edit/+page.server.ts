import { error, fail, redirect } from "@sveltejs/kit";
import { discordProfileUrl } from "$lib/discord/model";
import { parsePlayerProfileForm } from "$lib/players/profile-form";
import {
  getPlayerByUsername,
  getPlayerSocials,
  replacePlayerSocials,
  updatePlayerBio,
  updatePlayerSkin,
} from "$lib/server/players/repository";
import { playerEditPath, playerProfilePath } from "$lib/players/paths";
import { ensureDiscordProfile } from "$lib/server/discord/profiles";
import { DISCORD_PLATFORM_ID } from "$lib/players/socials";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, platform, locals }) => {
  const db = platform!.env.DB;
  const player = await getPlayerByUsername(db, params.username.toLowerCase());
  if (!player) error(404, "Игрок не найден");
  if (player.blocked_at) error(403, "Профиль заблокирован");

  if (!locals.user) {
    redirect(
      303,
      `/auth/discord/login?redirect_to=${encodeURIComponent(playerEditPath(params.username))}`,
    );
  }
  if (locals.user.discordId !== player.owner_discord_id) {
    error(403, "Это не твой профиль");
  }

  const socials = await getPlayerSocials(db, player.id);
  return { player, socials };
};

export const actions: Actions = {
  default: async ({ request, params, platform, locals }) => {
    const db = platform!.env.DB;
    const player = await getPlayerByUsername(db, params.username.toLowerCase());
    if (!player) error(404, "Игрок не найден");
    if (player.blocked_at) error(403, "Профиль заблокирован");
    if (!locals.user || locals.user.discordId !== player.owner_discord_id) {
      error(403, "Это не твой профиль");
    }

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

    await updatePlayerBio(db, player.id, parsed.profile.bio);
    await updatePlayerSkin(db, player.id, parsed.profile.skinUrl);
    await replacePlayerSocials(db, player.id, socials);

    redirect(303, playerProfilePath(player.username));
  },
};
