import { error, fail, redirect } from "@sveltejs/kit";
import {
  getPlayerByUsername,
  getPlayerSocials,
  replacePlayerSocials,
  updatePlayerBio,
  updatePlayerSkin,
} from "$lib/server/players";
import { isValidSocialUrl, SOCIAL_PLATFORMS } from "$lib/socials";
import type { Actions, PageServerLoad } from "./$types";

const BIO_MAX_LENGTH = 2000;

export const load: PageServerLoad = async ({ params, platform, locals }) => {
  const db = platform!.env.DB;
  const player = await getPlayerByUsername(db, params.username.toLowerCase());
  if (!player) error(404, "Игрок не найден");

  if (!locals.user) {
    redirect(
      303,
      `/auth/discord/login?redirect_to=${encodeURIComponent(`/u/${params.username}/edit`)}`,
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
    if (!locals.user || locals.user.discordId !== player.owner_discord_id) {
      error(403, "Это не твой профиль");
    }

    const form = await request.formData();
    const bio = String(form.get("bio") ?? "").trim();
    if (bio.length > BIO_MAX_LENGTH) {
      return fail(400, { errorMessage: "Слишком длинное описание" });
    }

    const skinUrl = String(form.get("skin_url") ?? "").trim();
    if (skinUrl && !isValidSocialUrl(skinUrl)) {
      return fail(400, {
        errorMessage: "Ссылка на скин должна начинаться с http:// или https://",
      });
    }

    const socials: { platform: string; url: string }[] = [];
    for (const socialPlatform of SOCIAL_PLATFORMS) {
      const value = String(
        form.get(`social_${socialPlatform.id}`) ?? "",
      ).trim();
      if (!value) continue;
      if (!isValidSocialUrl(value)) {
        return fail(400, {
          errorMessage: `Ссылка ${socialPlatform.label} должна начинаться с http:// или https://`,
        });
      }
      socials.push({ platform: socialPlatform.id, url: value });
    }

    await updatePlayerBio(db, player.id, bio);
    await updatePlayerSkin(db, player.id, skinUrl);
    await replacePlayerSocials(db, player.id, socials);

    redirect(303, `/u/${player.username}`);
  },
};
