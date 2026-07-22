import { redirect } from "@sveltejs/kit";
import { isAllowedAdmin } from "$lib/server/auth/guards";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, platform }) => {
  if (!isAllowedAdmin(platform!.env, locals.user!.discordId)) {
    redirect(303, "/account");
  }
};
