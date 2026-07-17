import { redirect } from "@sveltejs/kit";
import { isAllowedAdmin } from "$lib/server/auth/guards";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, platform, url }) => {
  if (!locals.user) {
    redirect(
      303,
      `/auth/discord/login?redirect_to=${encodeURIComponent(url.pathname)}`,
    );
  }

  return {
    user: locals.user,
    isAdmin: isAllowedAdmin(platform!.env, locals.user.discordId),
  };
};
