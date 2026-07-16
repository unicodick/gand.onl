import { error, fail, redirect } from "@sveltejs/kit";
import {
  deletePlayer,
  getPlayerById,
  isOwnerConflictError,
  setPlayerOwner,
} from "$lib/server/players";
import type { Actions, PageServerLoad } from "./$types";

const DISCORD_ID_PATTERN = /^\d{17,20}$/;

function parseId(raw: string): number {
  const id = Number(raw);
  if (!Number.isInteger(id)) error(404, "Игрок не найден");
  return id;
}

export const load: PageServerLoad = async ({ params, platform }) => {
  const player = await getPlayerById(platform!.env.DB, parseId(params.id));
  if (!player) error(404, "Игрок не найден");
  return { player };
};

export const actions: Actions = {
  setOwner: async ({ request, params, platform }) => {
    const form = await request.formData();
    const discordId = String(form.get("owner_discord_id") ?? "").trim();

    if (discordId && !DISCORD_ID_PATTERN.test(discordId)) {
      return fail(400, { errorMessage: "Некорректный Discord ID" });
    }

    try {
      await setPlayerOwner(
        platform!.env.DB,
        parseId(params.id),
        discordId || null,
      );
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

  delete: async ({ params, platform }) => {
    await deletePlayer(platform!.env.DB, parseId(params.id));
    redirect(303, "/account/players");
  },
};
