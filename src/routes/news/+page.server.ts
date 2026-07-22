import { error } from "@sveltejs/kit";
import { pageCount, pageOffset, parsePage } from "$lib/pagination";
import {
  countPublishedNews,
  listPublishedNews,
  toPublicNews,
} from "$lib/server/news/repository";
import type { PageServerLoad } from "./$types";

const NEWS_PER_PAGE = 7;

export const load: PageServerLoad = async ({ platform, url }) => {
  const page = parsePage(url.searchParams.get("page"));
  if (page === null) error(404, "Страница новостей не найдена");

  const total = await countPublishedNews(platform!.env.DB);
  const pages = pageCount(total, NEWS_PER_PAGE);
  if (page > pages) error(404, "Страница новостей не найдена");

  const items = await listPublishedNews(platform!.env.DB, {
    limit: NEWS_PER_PAGE,
    offset: pageOffset(page, NEWS_PER_PAGE),
  });
  return {
    items: items.map(toPublicNews),
    page,
    pageCount: pages,
    total,
  };
};
