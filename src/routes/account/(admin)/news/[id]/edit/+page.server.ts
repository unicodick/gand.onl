import { error, fail, redirect } from "@sveltejs/kit";
import {
  deleteNews,
  getNewsById,
  isSlugConflictError,
  updateNews,
} from "$lib/server/news";
import {
  parseNewsForm,
  prepareNewsFormCover,
  readNewsFormValues,
} from "$lib/server/news-form";
import { deleteNewsCover } from "$lib/server/news-media";
import type { Actions, PageServerLoad } from "./$types";

function parseId(raw: string): number {
  const id = Number(raw);
  if (!Number.isInteger(id)) error(404, "Новость не найдена");
  return id;
}

export const load: PageServerLoad = async ({ params, platform }) => {
  const news = await getNewsById(platform!.env.DB, parseId(params.id));
  if (!news) error(404, "Новость не найдена");
  return { news };
};

export const actions: Actions = {
  update: async ({ request, params, platform }) => {
    const news = await getNewsById(platform!.env.DB, parseId(params.id));
    if (!news) error(404, "Новость не найдена");

    const form = await request.formData();
    const coverError = await prepareNewsFormCover(
      form,
      platform!.env.NEWS_MEDIA,
    );
    if (coverError) {
      return fail(400, {
        errorMessage: coverError,
        values: readNewsFormValues(form),
      });
    }

    const parsed = parseNewsForm(form);
    if (!parsed.value) {
      return fail(400, {
        errorMessage: parsed.error,
        values: readNewsFormValues(form),
      });
    }
    const input = parsed.value;

    try {
      await updateNews(platform!.env.DB, parseId(params.id), {
        ...input,
      });
    } catch (err) {
      if (isSlugConflictError(err)) {
        return fail(400, {
          errorMessage: "Такой slug уже занят",
          values: readNewsFormValues(form),
        });
      }
      throw err;
    }

    if (news.cover_key && news.cover_key !== input.coverKey) {
      await deleteNewsCover(platform!.env.NEWS_MEDIA, news.cover_key).catch(
        console.error,
      );
    }

    redirect(303, "/account/news");
  },

  delete: async ({ params, platform }) => {
    const news = await getNewsById(platform!.env.DB, parseId(params.id));
    if (!news) error(404, "Новость не найдена");
    await deleteNews(platform!.env.DB, news.id);
    await deleteNewsCover(platform!.env.NEWS_MEDIA, news.cover_key).catch(
      console.error,
    );
    redirect(303, "/account/news");
  },
};
