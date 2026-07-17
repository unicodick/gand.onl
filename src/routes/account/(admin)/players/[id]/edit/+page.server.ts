import { error, fail, redirect } from "@sveltejs/kit";
import { parsePlayerProfileForm } from "$lib/player-profile-form";
import {
  deletePlayerAsAdmin,
  setPlayerBlocked,
  updatePlayerAsAdmin,
} from "$lib/server/admin";
import {
  getPlayerById,
  getPlayerSocials,
  isOwnerConflictError,
} from "$lib/server/players";
import { DISCORD_PLATFORM_ID } from "$lib/socials";
import type { Actions, PageServerLoad } from "./$types";

const DISCORD_ID_PATTERN = /^\d{17,20}$/;
const BLOCK_REASON_MAX_LENGTH = 500;

function parseId(raw: string): number {
  const id = Number(raw);
  if (!Number.isInteger(id)) error(404, "Игрок не найден");
  return id;
}

export const load: PageServerLoad = async ({ params, platform }) => {
  const db = platform!.env.DB;
  const player = await getPlayerById(db, parseId(params.id));
  if (!player) error(404, "Игрок не найден");
  const socials = await getPlayerSocials(db, player.id);
  return { player, socials };
};

export const actions: Actions = {
  save: async ({ request, params, platform, locals }) => {
    const db = platform!.env.DB;
    const player = await getPlayerById(db, parseId(params.id));
    if (!player) error(404, "Игрок не найден");
    const existingSocials = await getPlayerSocials(db, player.id);
    const form = await request.formData();
    const discordId = String(form.get("owner_discord_id") ?? "").trim();

    if (discordId && !DISCORD_ID_PATTERN.test(discordId)) {
      return fail(400, { errorMessage: "Некорректный Discord ID" });
    }
    const parsed = parsePlayerProfileForm(form);
    if (!parsed.ok) return fail(400, { errorMessage: parsed.errorMessage });

    const socials: { platform: string; url: string }[] = [];
    const existingDiscord = existingSocials.find(
      (social) => social.platform === DISCORD_PLATFORM_ID,
    );
    if (existingDiscord && form.get("keep_discord_profile") === "on") {
      socials.push({
        platform: existingDiscord.platform,
        url: existingDiscord.url,
      });
    }
    socials.push(...parsed.profile.socials);

    try {
      await updatePlayerAsAdmin(db, {
        player,
        existingSocials,
        actorDiscordId: locals.user!.discordId,
        ownerDiscordId: discordId || null,
        bio: parsed.profile.bio,
        skinUrl: parsed.profile.skinUrl,
        socials,
      });
    } catch (err) {
      if (isOwnerConflictError(err)) {
        return fail(400, {
          errorMessage: "Этот Discord-аккаунт уже привязан к другому игроку",
        });
      }
      throw err;
    }

    redirect(303, "/account/players");
  },

  block: async ({ request, params, platform, locals }) => {
    const player = await getPlayerById(platform!.env.DB, parseId(params.id));
    if (!player) error(404, "Игрок не найден");
    const form = await request.formData();
    const reason = String(form.get("block_reason") ?? "").trim();
    if (reason.length > BLOCK_REASON_MAX_LENGTH) {
      return fail(400, { errorMessage: "Слишком длинная причина блокировки" });
    }
    await setPlayerBlocked(platform!.env.DB, {
      player,
      actorDiscordId: locals.user!.discordId,
      blocked: true,
      reason,
    });
    redirect(303, `/account/players/${player.id}/edit`);
  },

  unblock: async ({ params, platform, locals }) => {
    const player = await getPlayerById(platform!.env.DB, parseId(params.id));
    if (!player) error(404, "Игрок не найден");
    await setPlayerBlocked(platform!.env.DB, {
      player,
      actorDiscordId: locals.user!.discordId,
      blocked: false,
    });
    redirect(303, `/account/players/${player.id}/edit`);
  },

  delete: async ({ request, params, platform, locals }) => {
    const player = await getPlayerById(platform!.env.DB, parseId(params.id));
    if (!player) error(404, "Игрок не найден");
    const form = await request.formData();
    if (String(form.get("confirm_username") ?? "") !== player.username) {
      return fail(400, {
        errorMessage: "Для удаления введите ник игрока без изменений",
      });
    }
    await deletePlayerAsAdmin(platform!.env.DB, {
      player,
      actorDiscordId: locals.user!.discordId,
    });
    redirect(303, "/account/players");
  },
};
