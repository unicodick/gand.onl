import { redirect } from "@sveltejs/kit";
import { isAllowedAdmin } from "$lib/server/auth";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, platform }) => {
  if (!locals.user) redirect(303, "/admin/login");
  if (!isAllowedAdmin(platform!.env, locals.user.discordId)) {
    redirect(303, "/admin/login?error=forbidden");
  }
  return { user: locals.user };
};
