import { error, json } from "@sveltejs/kit";
import { isAllowedAdmin } from "$lib/server/auth";
import { uploadNewsCover } from "$lib/server/news-media";
import { newsCoverUrl, validateNewsCover } from "$lib/news";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, platform, locals }) => {
  if (!locals.user || !isAllowedAdmin(platform!.env, locals.user.discordId)) {
    error(403, "Недостаточно прав");
  }

  const form = await request.formData();
  const file = form.get("cover");
  if (!(file instanceof File)) error(400, "Выберите изображение");

  const validationError = validateNewsCover(file);
  if (validationError) error(400, validationError);

  const key = await uploadNewsCover(platform!.env.NEWS_MEDIA, file);
  return json({ key, url: newsCoverUrl(key) }, { status: 201 });
};
