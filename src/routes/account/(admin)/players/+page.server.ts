import { requireAdmin } from "$lib/server/auth/guards";
import { listAllPlayers } from "$lib/server/players/repository";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ platform, locals }) => {
  requireAdmin(platform!.env, locals.user);
  const players = await listAllPlayers(platform!.env.DB);
  return { players };
};
