import { error } from "@sveltejs/kit";
import { getNewsCover } from "$lib/server/news/media";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params, platform, request }) => {
  const object = await getNewsCover(platform!.env.NEWS_MEDIA, params.key);
  if (!object) error(404, "Изображение не найдено");

  const headers = new Headers();
  if (object.httpMetadata?.contentType) {
    headers.set("content-type", object.httpMetadata.contentType);
  }
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");

  if (request.headers.get("if-none-match") === object.httpEtag) {
    return new Response(null, { status: 304, headers });
  }

  return new Response(object.body, { headers });
};
