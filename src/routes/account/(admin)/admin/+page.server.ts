import { getAdminStats, listRecentAdminActions } from "$lib/server/admin";
import { getRosterStatus } from "$lib/server/roster";
import { fetchServerStatus } from "$lib/server-status";
import type { PageServerLoad } from "./$types";

const SERVER_ADDRESS = "zlp.onl";

export const load: PageServerLoad = async ({ platform, fetch }) => {
  const db = platform!.env.DB;
  const [stats, roster, activity, serverStatus] = await Promise.all([
    getAdminStats(db),
    getRosterStatus(db),
    listRecentAdminActions(db, 10),
    fetchServerStatus(fetch, SERVER_ADDRESS),
  ]);

  return { stats, roster, activity, serverStatus };
};
