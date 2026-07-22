import {
  getAdminStats,
  listRecentAdminActions,
} from "$lib/server/admin/overview";
import { requireAdmin } from "$lib/server/auth/guards";
import { getRosterStatus } from "$lib/server/roster/repository";
import { fetchServerStatus } from "$lib/minecraft/server-status";
import type { PageServerLoad } from "./$types";

const SERVER_ADDRESS = "zlp.onl";

export const load: PageServerLoad = async ({ platform, fetch, locals }) => {
  requireAdmin(platform!.env, locals.user);
  const db = platform!.env.DB;
  const [stats, roster, activity, serverStatus] = await Promise.all([
    getAdminStats(db),
    getRosterStatus(db),
    listRecentAdminActions(db, 10),
    fetchServerStatus(fetch, SERVER_ADDRESS),
  ]);

  return { stats, roster, activity, serverStatus };
};
