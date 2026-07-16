import { fail, redirect } from "@sveltejs/kit";
import { createPlayer, isUsernameConflictError } from "$lib/server/players";
import type { Actions } from "./$types";

export const actions: Actions = {
  default: async ({ request, platform }) => {
    const form = await request.formData();
    const username = String(form.get("username") ?? "").trim();
    if (!username) {
      return fail(400, { errorMessage: "Введите ник" });
    }

    try {
      await createPlayer(platform!.env.DB, username);
    } catch (err) {
      if (isUsernameConflictError(err)) {
        return fail(400, { errorMessage: "Этот игрок уже в пуле" });
      }
      throw err;
    }

    redirect(303, "/account/players");
  },
};
