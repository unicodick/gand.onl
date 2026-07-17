import { requireAdmin } from "$lib/server/auth/guards";
import { listAllNews } from "$lib/server/news/repository";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ platform, locals }) => {
  requireAdmin(platform!.env, locals.user);
  const news = await listAllNews(platform!.env.DB);
  return { news };
};
