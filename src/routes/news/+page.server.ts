import { listPublishedNews, toPublicNews } from "$lib/server/news/repository";
import type { PageServerLoad } from "./$types";

const NEWS_LIMIT = 3;

export const load: PageServerLoad = async ({ platform }) => {
  const items = await listPublishedNews(platform!.env.DB, {
    limit: NEWS_LIMIT,
  });
  return { items: items.map(toPublicNews) };
};
