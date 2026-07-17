import { error } from "@sveltejs/kit";
import { renderMarkdown } from "$lib/news/markdown";
import {
  getPublishedNewsBySlug,
  toPublicNews,
} from "$lib/server/news/repository";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, platform }) => {
  const news = await getPublishedNewsBySlug(platform!.env.DB, params.slug);
  if (!news) error(404, "Новость не найдена");
  return { news: toPublicNews(news), html: renderMarkdown(news.body) };
};
