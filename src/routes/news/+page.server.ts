import { error } from "@sveltejs/kit";
import { parsePage } from "$lib/pagination";
import { listPublishedNews, toPublicNews } from "$lib/server/news";
import type { PageServerLoad } from "./$types";

const PAGE_SIZE = 10;

export const load: PageServerLoad = async ({ platform, url }) => {
  const page = parsePage(url.searchParams.get("page"));
  if (page === null) error(404, "Страница не найдена");

  const { items, hasMore } = await listPublishedNews(platform!.env.DB, {
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });
  return { items: items.map(toPublicNews), page, hasMore };
};
