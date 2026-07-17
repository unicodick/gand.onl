import { error, fail, redirect } from "@sveltejs/kit";
import { discordProfileUrl } from "$lib/discord";
import {
  getPlayerByUsername,
  getPlayerSocials,
  replacePlayerSocials,
  updatePlayerBio,
  updatePlayerSkin,
} from "$lib/server/players";
import { playerEditPath, playerProfilePath } from "$lib/player-paths";
import { ensureDiscordProfile } from "$lib/server/discord-profiles";
import {
  CUSTOM_LINK_LABEL_MAX_LENGTH,
  CUSTOM_LINKS_MAX,
  DISCORD_PLATFORM_ID,
  isValidSocialUrl,
  LINK_SOCIAL_PLATFORMS,
  SOCIAL_PLATFORMS,
} from "$lib/socials";
import type { Actions, PageServerLoad } from "./$types";

const BIO_MAX_LENGTH = 2000;

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

    for (const socialPlatform of LINK_SOCIAL_PLATFORMS) {
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

    const customLabels = form
      .getAll("custom_label")
      .map((v) => String(v).trim());
    const customUrls = form.getAll("custom_url").map((v) => String(v).trim());
    if (customLabels.length > CUSTOM_LINKS_MAX) {
      return fail(400, { errorMessage: "Слишком много своих ссылок" });
    }
    const reservedLabels = new Set(
      SOCIAL_PLATFORMS.flatMap((p) => [p.id, p.label]).map((v) =>
        v.toLowerCase(),
      ),
    );
    for (let i = 0; i < customLabels.length; i++) {
      const label = customLabels[i];
      const url = customUrls[i] ?? "";
      if (!label && !url) continue;
      if (!label || !url) {
        return fail(400, {
          errorMessage: "Укажите и название, и ссылку для своей ссылки",
        });
      }
      if (label.length > CUSTOM_LINK_LABEL_MAX_LENGTH) {
        return fail(400, { errorMessage: "Слишком длинное название ссылки" });
      }
      if (reservedLabels.has(label.toLowerCase())) {
        return fail(400, {
          errorMessage: `"${label}" уже есть среди стандартных соцсетей`,
        });
      }
      if (!isValidSocialUrl(url)) {
        return fail(400, {
          errorMessage: `Ссылка ${label} должна начинаться с http:// или https://`,
        });
      }
      socials.push({ platform: label, url });
    }

    await updatePlayerBio(db, player.id, bio);
    await updatePlayerSkin(db, player.id, skinUrl);
    await replacePlayerSocials(db, player.id, socials);

    redirect(303, playerProfilePath(player.username));
  },
};
