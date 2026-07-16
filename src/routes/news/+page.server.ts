import { listPublishedNews, toPublicNews } from "$lib/server/news";
import type { PageServerLoad } from "./$types";

const PAGE_SIZE = 10;

export const load: PageServerLoad = async ({ platform, url }) => {
  const rawPage = Number(url.searchParams.get("page"));
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const { items, hasMore } = await listPublishedNews(platform!.env.DB, {
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });
  return { items: items.map(toPublicNews), page, hasMore };
};
