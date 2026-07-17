import { error } from "@sveltejs/kit";
import { isNewsCoverKey } from "$lib/news/model";
import { isAllowedAdmin } from "$lib/server/auth";
import { deleteNewsCover } from "$lib/server/news-media";
import { isNewsCoverInUse } from "$lib/server/news";
import type { RequestHandler } from "./$types";

export const DELETE: RequestHandler = async ({ params, platform, locals }) => {
  if (!locals.user || !isAllowedAdmin(platform!.env, locals.user.discordId)) {
    error(403, "Недостаточно прав");
  }
  if (!isNewsCoverKey(params.key)) error(404, "Изображение не найдено");
  if (await isNewsCoverInUse(platform!.env.DB, params.key)) {
    error(409, "Изображение используется новостью");
  }

  await deleteNewsCover(platform!.env.NEWS_MEDIA, params.key);
  return new Response(null, { status: 204 });
};
