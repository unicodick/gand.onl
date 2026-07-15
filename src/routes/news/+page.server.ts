import { listPublishedNews } from "$lib/server/news";
import type { PageServerLoad } from "./$types";

const PAGE_SIZE = 10;

export const load: PageServerLoad = async ({ platform, url }) => {
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
  const { items, hasMore } = await listPublishedNews(platform!.env.DB, {
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });
  return { items, page, hasMore };
};
