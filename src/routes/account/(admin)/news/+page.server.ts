import { listAllNews } from "$lib/server/news";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ platform }) => {
  const news = await listAllNews(platform!.env.DB);
  return { news };
};
