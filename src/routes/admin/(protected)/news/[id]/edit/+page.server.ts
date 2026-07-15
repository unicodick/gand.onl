import { error, fail, redirect } from "@sveltejs/kit";
import { deleteNews, getNewsById, updateNews } from "$lib/server/news";
import { slugify } from "$lib/slug";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, platform }) => {
  const news = await getNewsById(platform!.env.DB, Number(params.id));
  if (!news) error(404, "Новость не найдена");
  return { news };
};

export const actions: Actions = {
  update: async ({ request, params, platform }) => {
    const form = await request.formData();
    const title = String(form.get("title") ?? "").trim();
    const slugInput = String(form.get("slug") ?? "").trim();
    const body = String(form.get("body") ?? "").trim();
    const published = form.get("published") === "on";

    if (!title || !body) {
      return fail(400, { errorMessage: "Заполните заголовок и текст" });
    }

    const slug = slugify(slugInput || title);
    if (!slug)
      return fail(400, { errorMessage: "Не удалось сформировать slug" });

    try {
      await updateNews(platform!.env.DB, Number(params.id), {
        slug,
        title,
        body,
        published,
      });
    } catch {
      return fail(400, { errorMessage: "Такой slug уже занят" });
    }

    redirect(303, "/admin");
  },

  delete: async ({ params, platform }) => {
    await deleteNews(platform!.env.DB, Number(params.id));
    redirect(303, "/admin");
  },
};
